// /api/appointments — the signed-in user's private viewings
// GET                         → your appointments
// GET ?boutiqueId=&date=      → times already taken at that boutique on that date (no personal data)
// POST { boutiqueId, date: 'YYYY-MM-DD', time: 'HH:MM', watchId?, notes? }
import { query } from './_lib/db.js'
import { HttpError, readBody, route, toInt } from './_lib/http.js'
import { requireUser } from './_lib/auth.js'

export const TIMES = ['10:00', '11:30', '13:00', '15:00', '16:30', '18:00', '19:30', '21:00']

// each boutique books in its own local time zone
export const TZ_SQL = `CASE bq.country
  WHEN 'KSA' THEN 'Asia/Riyadh' WHEN 'Qatar' THEN 'Asia/Qatar' WHEN 'Kuwait' THEN 'Asia/Kuwait'
  WHEN 'Bahrain' THEN 'Asia/Bahrain' WHEN 'Oman' THEN 'Asia/Muscat' ELSE 'Asia/Dubai' END`

export const APPOINTMENT_SQL = `
  SELECT a.id, a.status, a.notes, a.appointment_time, a.created_at,
         to_char(a.appointment_time AT TIME ZONE ${TZ_SQL}, 'YYYY-MM-DD') AS local_date,
         to_char(a.appointment_time AT TIME ZONE ${TZ_SQL}, 'HH24:MI')    AS local_time,
         bq.id AS boutique_id, bq.name AS boutique_name, bq.city, bq.city_ar, bq.address, bq.address_ar,
         w.id AS watch_id, w.model_name, w.reference_number, b.name AS brand_name
  FROM appointments a
  JOIN boutiques bq ON bq.id = a.boutique_id
  LEFT JOIN watches w ON w.id = a.watch_id
  LEFT JOIN brands b ON b.id = w.brand_id`

export function toAppointment(r) {
  return {
    id: r.id,
    status: r.status,
    notes: r.notes,
    time: r.appointment_time,
    date: r.local_date,
    localTime: r.local_time,
    boutique: { id: r.boutique_id, name: r.boutique_name, city: r.city, cityAr: r.city_ar, address: r.address, addressAr: r.address_ar },
    watch: r.watch_id ? { id: r.watch_id, model: r.model_name, ref: r.reference_number, brandName: r.brand_name } : null,
  }
}

export default route({
  GET: async (req) => {
    const userId = await requireUser(req)
    const boutiqueId = toInt(req.query.boutiqueId)
    const date = String(req.query.date || '')
    if (boutiqueId && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
      const rows = await query(
        `SELECT to_char(a.appointment_time AT TIME ZONE ${TZ_SQL}, 'HH24:MI') AS t
         FROM appointments a JOIN boutiques bq ON bq.id = a.boutique_id
         WHERE a.boutique_id = $1 AND a.status <> 'cancelled'
           AND to_char(a.appointment_time AT TIME ZONE ${TZ_SQL}, 'YYYY-MM-DD') = $2`,
        [boutiqueId, date],
      )
      return { taken: rows.map((r) => r.t) }
    }
    const rows = await query(`${APPOINTMENT_SQL} WHERE a.user_id = $1 ORDER BY a.appointment_time`, [userId])
    return { appointments: rows.map(toAppointment) }
  },

  POST: async (req) => {
    const userId = await requireUser(req)
    const b = readBody(req)
    const boutiqueId = toInt(b.boutiqueId)
    const watchId = b.watchId ? toInt(b.watchId) : null
    const date = String(b.date || '')
    const time = String(b.time || '')
    const notes = String(b.notes || '').trim().slice(0, 1000) || null
    if (!boutiqueId || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !TIMES.includes(time)) {
      throw new HttpError(400, 'invalid_slot', 'Please choose a boutique, date and time.')
    }

    const [bq] = await query(`SELECT id, (${TZ_SQL}) AS tz FROM boutiques bq WHERE id = $1`, [boutiqueId])
    if (!bq) throw new HttpError(404, 'not_found', 'Boutique not found.')

    // convert the boutique's local date+time into an absolute timestamp, and require it to be in the future
    const [slot] = await query(
      `SELECT ($1::text || ' ' || $2::text)::timestamp AT TIME ZONE $3 AS at,
              (($1::text || ' ' || $2::text)::timestamp AT TIME ZONE $3) > now() AS future`,
      [date, time, bq.tz],
    )
    if (!slot.future) throw new HttpError(400, 'past_slot', 'Please choose a time in the future.')

    const rows = await query(
      `INSERT INTO appointments (user_id, boutique_id, watch_id, appointment_time, notes)
       SELECT $1, $2, $3, $4, $5
       WHERE NOT EXISTS (
         SELECT 1 FROM appointments WHERE boutique_id = $2 AND appointment_time = $4 AND status <> 'cancelled'
       )
       RETURNING id`,
      [userId, boutiqueId, watchId, slot.at, notes],
    )
    if (!rows.length) throw new HttpError(409, 'slot_taken', 'That time has just been booked. Please choose another.')

    const [created] = await query(`${APPOINTMENT_SQL} WHERE a.id = $1 AND a.user_id = $2`, [rows[0].id, userId])
    return { appointment: toAppointment(created) }
  },
})
