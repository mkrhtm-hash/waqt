// Database access — server-side only. DATABASE_URL never reaches the browser.
import { neon, neonConfig, Pool } from '@neondatabase/serverless'
import ws from 'ws'

if (typeof globalThis.WebSocket === 'undefined') neonConfig.webSocketConstructor = ws

export class DbNotConfiguredError extends Error {
  constructor() {
    super('DATABASE_URL is not set')
    this.code = 'db_not_configured'
  }
}

let _sql
/** HTTP query function: await query('SELECT ... $1', [value]) → rows */
export function query(text, params = []) {
  if (!process.env.DATABASE_URL) throw new DbNotConfiguredError()
  if (!_sql) _sql = neon(process.env.DATABASE_URL)
  return _sql.query(text, params)
}

/** Interactive transaction over a WebSocket connection (used for checkout). */
export async function transaction(fn) {
  if (!process.env.DATABASE_URL) throw new DbNotConfiguredError()
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const result = await fn(client)
    await client.query('COMMIT')
    return result
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {})
    throw err
  } finally {
    client.release()
    await pool.end()
  }
}

/** True when an error means we could not reach / authenticate with the database. */
export function isConnectionError(err) {
  if (!err) return false
  if (err.code === 'db_not_configured') return true
  const msg = String(err.message || '') + ' ' + String(err.cause?.message || '')
  return /fetch failed|ENOTFOUND|ECONNREFUSED|ETIMEDOUT|ECONNRESET|password authentication failed|getaddrinfo|WebSocket|Connection terminated|endpoint .*(could not be found|is disabled)|invalid connection string/i.test(msg)
    || err.code === '28P01' || err.code === '3D000'
}
