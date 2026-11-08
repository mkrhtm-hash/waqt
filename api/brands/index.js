// /api/brands — all maisons, each with a "hero" watch for menus and tiles
import { query } from '../_lib/db.js'
import { route } from '../_lib/http.js'
import { toBrand, toWatch, WATCH_SELECT } from '../_lib/mappers.js'

export default route({
  GET: async () => {
    const brands = await query(`
      SELECT b.*, (SELECT COUNT(*) FROM watches x WHERE x.brand_id = b.id)::int AS watch_count
      FROM brands b ORDER BY b.id`)
    const heroes = await query(`
      SELECT DISTINCT ON (b.id) ${WATCH_SELECT}
      FROM watches w JOIN brands b ON b.id = w.brand_id
      ORDER BY b.id, w.is_featured DESC, w.price_aed DESC`)
    const heroBySlug = Object.fromEntries(heroes.map((r) => [r.brand_slug, toWatch(r)]))
    return {
      brands: brands.map((r) => ({ ...toBrand(r), watchCount: r.watch_count, hero: heroBySlug[r.slug] || null })),
    }
  },
})
