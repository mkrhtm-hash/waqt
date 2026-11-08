// /api/stats — live counts for the landing page counters
import { query } from './_lib/db.js'
import { route } from './_lib/http.js'

export default route({
  GET: async () => {
    const [r] = await query(`
      SELECT
        (SELECT COALESCE(SUM(stock_qty), 0) FROM watches)::int AS timepieces,
        (SELECT COUNT(*) FROM users)::int                       AS clients,
        (SELECT COUNT(*) FROM boutiques)::int                   AS boutiques`)
    return r
  },
})
