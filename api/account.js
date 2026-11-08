// /api/account — profile, VIP tier, orders, upcoming appointments, saved preferences (own data only)
import { query } from './_lib/db.js'
import { HttpError, readBody, route } from './_lib/http.js'
import { loadUser, requireUser } from './_lib/auth.js'
import { ORDER_LIST_SQL, toOrder } from './orders.js'
import { APPOINTMENT_SQL, toAppointment } from './appointments.js'

const CURRENCIES = ['AED', 'SAR', 'QAR', 'KWD', 'BHD', 'OMR', 'USD']
const COUNTRIES = ['UAE', 'KSA', 'Qatar', 'Kuwait', 'Bahrain', 'Oman']

export default route({
  GET: async (req) => {
    const userId = await requireUser(req)
    const [user, orders, appts, [spend]] = await Promise.all([
      loadUser(userId),
      query(ORDER_LIST_SQL, [userId]),
      query(`${APPOINTMENT_SQL} WHERE a.user_id = $1 AND a.appointment_time >= now() - interval '2 hours' AND a.status <> 'cancelled'
             ORDER BY a.appointment_time`, [userId]),
      query(`SELECT COALESCE(SUM(subtotal_aed), 0) AS total FROM orders WHERE user_id = $1 AND status <> 'cancelled'`, [userId]),
    ])
    if (!user) throw new HttpError(401, 'unauthorized')
    return {
      user,
      lifetimeSpend: Number(spend.total),
      orders: orders.map(toOrder),
      appointments: appts.map(toAppointment),
    }
  },

  PATCH: async (req) => {
    const userId = await requireUser(req)
    const b = readBody(req)
    const sets = []
    const params = [userId]
    const set = (col, val) => { params.push(val); sets.push(`${col} = $${params.length}`) }
    if (b.preferredCurrency !== undefined) {
      if (!CURRENCIES.includes(b.preferredCurrency)) throw new HttpError(400, 'invalid_currency')
      set('preferred_currency', b.preferredCurrency)
    }
    if (b.preferredLanguage !== undefined) {
      if (!['en', 'ar'].includes(b.preferredLanguage)) throw new HttpError(400, 'invalid_language')
      set('preferred_language', b.preferredLanguage)
    }
    if (b.fullName !== undefined) {
      const v = String(b.fullName).trim()
      if (!v || v.length > 120) throw new HttpError(400, 'invalid_name')
      set('full_name', v)
    }
    if (b.phone !== undefined) set('phone', String(b.phone).trim().slice(0, 40))
    if (b.country !== undefined) {
      if (!COUNTRIES.includes(b.country)) throw new HttpError(400, 'invalid_country')
      set('country', b.country)
    }
    if (sets.length) await query(`UPDATE users SET ${sets.join(', ')} WHERE id = $1`, params)
    return { user: await loadUser(userId) }
  },
})
