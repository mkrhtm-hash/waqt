// /api/watches/:id — full specs, stock, and related watches from the same maison
import { query } from '../_lib/db.js'
import { HttpError, route, toInt } from '../_lib/http.js'
import { toWatch, WATCH_SELECT } from '../_lib/mappers.js'

export default route({
  GET: async (req) => {
    const id = toInt(req.query.id)
    if (!id) throw new HttpError(404, 'not_found', 'Timepiece not found.')
    const [row] = await query(
      `SELECT ${WATCH_SELECT}, w.brand_id FROM watches w JOIN brands b ON b.id = w.brand_id WHERE w.id = $1`,
      [id],
    )
    if (!row) throw new HttpError(404, 'not_found', 'Timepiece not found.')
    const related = await query(
      `SELECT ${WATCH_SELECT} FROM watches w JOIN brands b ON b.id = w.brand_id
       WHERE w.brand_id = $1 AND w.id <> $2
       ORDER BY w.is_featured DESC, w.price_aed DESC LIMIT 4`,
      [row.brand_id, id],
    )
    return { watch: toWatch(row), related: related.map(toWatch) }
  },
})
