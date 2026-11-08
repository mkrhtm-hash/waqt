// /api/watches — catalogue with filtering and sorting done in the database
// Query params: brand (slugs, comma), minPrice, maxPrice, size (small|medium|large, comma),
// material (comma), movement (comma), gender (Men|Women), q, ids (comma), featured=1,
// sort (featured|newest|price_asc|price_desc), limit
import { query } from '../_lib/db.js'
import { list, route, toInt, toNum } from '../_lib/http.js'
import { toWatch, WATCH_SELECT } from '../_lib/mappers.js'

const SIZE_SQL = {
  small: 'w.case_size_mm < 36',
  medium: '(w.case_size_mm >= 36 AND w.case_size_mm <= 40)',
  large: 'w.case_size_mm > 40',
}
const MATERIALS = ['Steel', 'Gold', 'Rose Gold', 'Platinum', 'Two-Tone']
const MOVEMENTS = ['Automatic', 'Manual', 'Quartz']
const SORTS = {
  featured: 'w.is_featured DESC, w.price_aed DESC',
  newest: 'w.created_at DESC, w.id DESC',
  price_asc: 'w.price_aed ASC',
  price_desc: 'w.price_aed DESC',
}

export default route({
  GET: async (req) => {
    const q = req.query || {}
    const where = []
    const params = []
    const p = (v) => { params.push(v); return `$${params.length}` }

    const ids = list(q.ids).map(toInt).filter(Boolean).slice(0, 50)
    if (ids.length) where.push(`w.id = ANY(${p(ids)}::int[])`)

    const brands = list(q.brand)
    if (brands.length) where.push(`b.slug = ANY(${p(brands)}::text[])`)

    const minPrice = toNum(q.minPrice)
    const maxPrice = toNum(q.maxPrice)
    if (minPrice !== null) where.push(`w.price_aed >= ${p(minPrice)}`)
    if (maxPrice !== null) where.push(`w.price_aed <= ${p(maxPrice)}`)

    const sizes = list(q.size).filter((s) => SIZE_SQL[s])
    if (sizes.length) where.push(`(${sizes.map((s) => SIZE_SQL[s]).join(' OR ')})`)

    const materials = list(q.material).filter((m) => MATERIALS.includes(m))
    if (materials.length) where.push(`w.material = ANY(${p(materials)}::text[])`)

    const movements = list(q.movement).filter((m) => MOVEMENTS.includes(m))
    if (movements.length) where.push(`w.movement = ANY(${p(movements)}::text[])`)

    // Unisex pieces appear for both men and women
    if (q.gender === 'Men' || q.gender === 'Women') where.push(`w.gender IN (${p(q.gender)}, 'Unisex')`)

    if (q.featured === '1' || q.featured === 'true') where.push('w.is_featured')

    const search = String(q.q || '').trim().slice(0, 80)
    if (search) {
      const like = p(`%${search}%`)
      where.push(`(w.model_name ILIKE ${like} OR w.reference_number ILIKE ${like} OR w.collection ILIKE ${like} OR b.name ILIKE ${like})`)
    }

    const order = SORTS[q.sort] || SORTS.featured
    const limit = Math.min(Math.max(toInt(q.limit) || 100, 1), 100)

    const rows = await query(
      `SELECT ${WATCH_SELECT}
       FROM watches w JOIN brands b ON b.id = w.brand_id
       ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
       ORDER BY ${order}, w.id
       LIMIT ${limit}`,
      params,
    )
    return { watches: rows.map(toWatch), count: rows.length }
  },
})
