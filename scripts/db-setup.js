// npm run db:setup — creates the tables (db/schema.sql) then loads sample data (db/seed.sql).
// Safe to run again: schema uses IF NOT EXISTS, seed uses upserts.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { neonConfig, Pool } from '@neondatabase/serverless'
import ws from 'ws'
import { loadEnv, NEON_HELP } from '../server/env.js'

if (typeof globalThis.WebSocket === 'undefined') neonConfig.webSocketConstructor = ws

const { hasDatabase } = loadEnv()
if (!hasDatabase) {
  console.log(NEON_HELP)
  process.exit(1)
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const pool = new Pool({ connectionString: process.env.DATABASE_URL })

try {
  const client = await pool.connect()
  try {
    for (const file of ['schema.sql', 'seed.sql']) {
      const sql = fs.readFileSync(path.join(root, 'db', file), 'utf8')
      process.stdout.write(`▸ Running db/${file} … `)
      await client.query('BEGIN')
      await client.query(sql)
      await client.query('COMMIT')
      console.log('done')
    }
    const { rows } = await client.query(`
      SELECT 'brands' AS table, COUNT(*)::int AS rows FROM brands
      UNION ALL SELECT 'watches', COUNT(*)::int FROM watches
      UNION ALL SELECT 'boutiques', COUNT(*)::int FROM boutiques
      UNION ALL SELECT 'featured watches', COUNT(*)::int FROM watches WHERE is_featured
      UNION ALL SELECT 'low-stock watches (≤2)', COUNT(*)::int FROM watches WHERE stock_qty <= 2
      UNION ALL SELECT 'users', COUNT(*)::int FROM users`)
    console.log('\nRow counts:')
    console.table(rows)
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {})
    throw err
  } finally {
    client.release()
  }
} catch (err) {
  console.error('\n❌ Database setup failed:', err.message)
  if (/password authentication|ENOTFOUND|getaddrinfo|fetch failed|WebSocket/i.test(err.message)) {
    console.error('   Check that DATABASE_URL in .env is the full connection string copied from Neon.')
  }
  process.exitCode = 1
} finally {
  await pool.end()
}
