// /api/wishlist — the signed-in user's saved watches only
import { query } from './_lib/db.js'
import { HttpError, readBody, route, toInt } from './_lib/http.js'
import { requireUser } from './_lib/auth.js'
import { toWatch, WATCH_SELECT } from './_lib/mappers.js'

async function list(userId) {
  const rows = await query(
    `SELECT ${WATCH_SELECT} FROM wishlist_items i
     JOIN watches w ON w.id = i.watch_id JOIN brands b ON b.id = w.brand_id
     WHERE i.user_id = $1 ORDER BY i.created_at DESC`,
    [userId],
  )
  return { watches: rows.map(toWatch) }
}

export default route({
  GET: async (req) => list(await requireUser(req)),
  POST: async (req) => {
    const userId = await requireUser(req)
    const watchId = toInt(readBody(req).watchId)
    if (!watchId) throw new HttpError(400, 'invalid_watch')
    const [exists] = await query('SELECT 1 FROM watches WHERE id = $1', [watchId])
    if (!exists) throw new HttpError(404, 'not_found')
    await query(
      'INSERT INTO wishlist_items (user_id, watch_id) VALUES ($1, $2) ON CONFLICT (user_id, watch_id) DO NOTHING',
      [userId, watchId],
    )
    return list(userId)
  },
  DELETE: async (req) => {
    const userId = await requireUser(req)
    const watchId = toInt(req.query.watchId)
    if (!watchId) throw new HttpError(400, 'invalid_watch')
    await query('DELETE FROM wishlist_items WHERE user_id = $1 AND watch_id = $2', [userId, watchId])
    return list(userId)
  },
})
