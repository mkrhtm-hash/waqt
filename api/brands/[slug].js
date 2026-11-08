// /api/brands/:slug — heritage story + that maison's watches
import { query } from '../_lib/db.js'
import { HttpError, route } from '../_lib/http.js'
import { toBrand, toWatch, WATCH_SELECT } from '../_lib/mappers.js'

export default route({
  GET: async (req) => {
    const slug = String(req.query.slug || '')
    const [brand] = await query('SELECT * FROM brands WHERE slug = $1', [slug])
    if (!brand) throw new HttpError(404, 'not_found', 'Maison not found.')
    const watches = await query(
      `SELECT ${WATCH_SELECT} FROM watches w JOIN brands b ON b.id = w.brand_id
       WHERE w.brand_id = $1 ORDER BY w.is_featured DESC, w.price_aed DESC`,
      [brand.id],
    )
    return { brand: toBrand(brand), watches: watches.map(toWatch) }
  },
})
