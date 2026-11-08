// /api/orders — mock checkout (no real charge) and the signed-in user's order history
import { query, transaction } from './_lib/db.js'
import { HttpError, readBody, route } from './_lib/http.js'
import { requireUser } from './_lib/auth.js'

const METHODS = ['Card', 'Apple Pay', 'Tabby', 'Tamara']
const CURRENCIES = ['AED', 'SAR', 'QAR', 'KWD', 'BHD', 'OMR', 'USD']
const TIERS = [['Black', 500000], ['Gold', 100000], ['Silver', 0]]

export const ORDER_LIST_SQL = `
  SELECT o.id, o.order_number, o.status, o.subtotal_aed, o.currency, o.payment_method,
         o.shipping_city, o.shipping_address, o.created_at,
         COALESCE(json_agg(json_build_object(
           'watchId', w.id, 'model', w.model_name, 'ref', w.reference_number,
           'brandName', b.name, 'brandSlug', b.slug, 'imageUrl', w.image_url,
           'quantity', oi.quantity, 'unitPrice', oi.unit_price_aed
         ) ORDER BY oi.id) FILTER (WHERE oi.id IS NOT NULL), '[]') AS items
  FROM orders o
  LEFT JOIN order_items oi ON oi.order_id = o.id
  LEFT JOIN watches w ON w.id = oi.watch_id
  LEFT JOIN brands b ON b.id = w.brand_id
  WHERE o.user_id = $1
  GROUP BY o.id
  ORDER BY o.created_at DESC`

export function toOrder(r) {
  return {
    id: r.id,
    orderNumber: r.order_number,
    status: r.status,
    subtotal: Number(r.subtotal_aed),
    currency: r.currency,
    paymentMethod: r.payment_method,
    shippingCity: r.shipping_city,
    shippingAddress: r.shipping_address,
    createdAt: r.created_at,
    items: (r.items || []).map((i) => ({ ...i, unitPrice: Number(i.unitPrice) })),
  }
}

export default route({
  GET: async (req) => {
    const userId = await requireUser(req)
    const rows = await query(ORDER_LIST_SQL, [userId])
    return { orders: rows.map(toOrder) }
  },

  POST: async (req) => {
    const userId = await requireUser(req)
    const b = readBody(req)
    const paymentMethod = METHODS.includes(b.paymentMethod) ? b.paymentMethod : null
    const currency = CURRENCIES.includes(b.currency) ? b.currency : 'AED'
    const city = String(b.shippingCity || '').trim().slice(0, 100)
    const address = String(b.shippingAddress || '').trim().slice(0, 400)
    if (!paymentMethod) throw new HttpError(400, 'invalid_payment_method')
    if (!city || !address) throw new HttpError(400, 'missing_address', 'Please enter your delivery address.')

    // Everything below happens in ONE transaction: if any step fails, nothing is saved.
    return transaction(async (db) => {
      // lock the watch rows so two checkouts can't sell the same last piece
      const { rows: items } = await db.query(
        `SELECT c.watch_id, c.quantity, w.stock_qty, w.price_aed, w.model_name
         FROM cart_items c JOIN watches w ON w.id = c.watch_id
         WHERE c.user_id = $1
         ORDER BY w.id
         FOR UPDATE OF w`,
        [userId],
      )
      if (!items.length) throw new HttpError(400, 'cart_empty', 'Your bag is empty.')

      const short = items.filter((i) => i.quantity > i.stock_qty)
      if (short.length) {
        const err = new HttpError(409, 'out_of_stock', short.map((i) => `${i.model_name} (${i.stock_qty} left)`).join(', '))
        throw err
      }

      const subtotal = items.reduce((s, i) => s + Number(i.price_aed) * i.quantity, 0)

      let order
      for (let attempt = 0; attempt < 5 && !order; attempt++) {
        const orderNumber = 'WQ-' + String(Math.floor(100000 + Math.random() * 900000))
        const { rows } = await db.query(
          `INSERT INTO orders (user_id, order_number, status, subtotal_aed, currency, payment_method, shipping_city, shipping_address)
           VALUES ($1, $2, 'confirmed', $3, $4, $5, $6, $7)
           ON CONFLICT (order_number) DO NOTHING
           RETURNING id, order_number, subtotal_aed, created_at`,
          [userId, orderNumber, subtotal, currency, paymentMethod, city, address],
        )
        order = rows[0]
      }
      if (!order) throw new Error('could not allocate order number')

      await db.query(
        `INSERT INTO order_items (order_id, watch_id, quantity, unit_price_aed)
         SELECT $1, w.id, c.quantity, w.price_aed
         FROM cart_items c JOIN watches w ON w.id = c.watch_id
         WHERE c.user_id = $2`,
        [order.id, userId],
      )
      await db.query(
        `UPDATE watches w SET stock_qty = w.stock_qty - c.quantity
         FROM cart_items c WHERE c.watch_id = w.id AND c.user_id = $1`,
        [userId],
      )
      await db.query('DELETE FROM cart_items WHERE user_id = $1', [userId])

      // VIP tier follows lifetime spend (never downgrades)
      const { rows: [spend] } = await db.query(
        `SELECT COALESCE(SUM(subtotal_aed), 0) AS total FROM orders WHERE user_id = $1 AND status <> 'cancelled'`,
        [userId],
      )
      const earned = TIERS.find(([, min]) => Number(spend.total) >= min)[0]
      await db.query(
        `UPDATE users SET vip_tier = $2
         WHERE id = $1 AND array_position(ARRAY['Silver','Gold','Black'], vip_tier) < array_position(ARRAY['Silver','Gold','Black'], $2::text)`,
        [userId, earned],
      )

      return { orderNumber: order.order_number, subtotal: Number(order.subtotal_aed), createdAt: order.created_at }
    })
  },
})
