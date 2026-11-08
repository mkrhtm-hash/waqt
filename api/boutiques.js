// /api/boutiques — the six salons
import { query } from './_lib/db.js'
import { route } from './_lib/http.js'
import { toBoutique } from './_lib/mappers.js'

export default route({
  GET: async () => {
    const rows = await query('SELECT * FROM boutiques ORDER BY id')
    return { boutiques: rows.map(toBoutique) }
  },
})
