// /api/cart — the signed-in user's bag only
import { query } from './_lib/db.js'
import { HttpError, readBody, route, toInt } from './_lib/http.js'
import { requireUser } from './_lib/auth.js'
import { toWatch, WATCH_SELECT } from './_lib/mappers.js'

const MAX_QTY = 5

async function list(userId) {
  const rows = await query(
    `SELECT c.quantity, ${WATCH_SELECT} FROM cart_items c
     JOIN watches w ON w.id = c.watch_id JOIN brands b ON b.id = w.brand_id
     WHERE c.user_id = $1 ORDER BY c.created_at`,
    [userId],
  )
  return { items: rows.map((r) => ({ watchId: r.id, quantity: r.quantity, watch: toWatch(r) })) }
}

async function stockOf(watchId) {
  const [w] = await query('SELECT stock_qty FROM watches WHERE id = $1', [watchId])
  if (!w) throw new HttpError(404, 'not_found', 'Timepiece not found.')
  return w.stock_qty
}

export default route({
  GET: async (req) => list(await requireUser(req)),

  // add one (or n) of a watch
  POST: async (req) => {
    const userId = await requireUser(req)
    const b = readBody(req)
    const watchId = toInt(b.watchId)
    const qty = Math.max(1, toInt(b.quantity) || 1)
    if (!watchId) throw new HttpError(400, 'invalid_watch')
    const stock = await stockOf(watchId)
    if (stock <= 0) throw new HttpError(409, 'out_of_stock', 'This timepiece is currently out of stock.')
    const cap = Math.min(stock, MAX_QTY)
    await query(
      `INSERT INTO cart_items (user_id, watch_id, quantity) VALUES ($1, $2, LEAST($3::int, $4::int))
       ON CONFLICT (user_id, watch_id) DO UPDATE SET quantity = LEAST(cart_items.quantity + $3::int, $4::int)`,
      [userId, watchId, qty, cap],
    )
    return list(userId)
  },

  // set an exact quantity (0 removes)
  PATCH: async (req) => {
    const userId = await requireUser(req)
    const b = readBody(req)
    const watchId = toInt(b.watchId)
    const qty = toInt(b.quantity)
    if (!watchId || qty === null) throw new HttpError(400, 'invalid_request')
    if (qty <= 0) {
      await query('DELETE FROM cart_items WHERE user_id = $1 AND watch_id = $2', [userId, watchId])
      return list(userId)
    }
    const stock = await stockOf(watchId)
    if (qty > stock) throw new HttpError(409, 'not_enough_stock', `Only ${stock} available.`)
    await query('UPDATE cart_items SET quantity = $3 WHERE user_id = $1 AND watch_id = $2', [userId, watchId, Math.min(qty, MAX_QTY)])
    return list(userId)
  },

  DELETE: async (req) => {
    const userId = await requireUser(req)
    const watchId = toInt(req.query.watchId)
    if (!watchId) throw new HttpError(400, 'invalid_watch')
    await query('DELETE FROM cart_items WHERE user_id = $1 AND watch_id = $2', [userId, watchId])
    return list(userId)
  },
})
