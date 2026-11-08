// Small helpers that work the same on Vercel functions and the local Express dev server.
import { isConnectionError } from './db.js'

export class HttpError extends Error {
  constructor(status, code, message) {
    super(message || code)
    this.status = status
    this.code = code
  }
}

export function readBody(req) {
  const b = req.body
  if (!b) return {}
  if (typeof b === 'string') {
    try { return JSON.parse(b) } catch { return {} }
  }
  return b
}

export function parseCookies(req) {
  const header = req.headers?.cookie || ''
  const out = {}
  for (const part of header.split(';')) {
    const i = part.indexOf('=')
    if (i < 0) continue
    out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim())
  }
  return out
}

export function send(res, status, data) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.end(JSON.stringify(data))
}

/**
 * Wrap a route: dispatch by HTTP method, convert errors into friendly JSON.
 * handlers = { GET: async (req, res) => data, POST: ... }
 */
export function route(handlers) {
  return async function handler(req, res) {
    const fn = handlers[req.method]
    if (!fn) {
      res.setHeader('Allow', Object.keys(handlers).join(', '))
      return send(res, 405, { error: 'method_not_allowed' })
    }
    try {
      const data = await fn(req, res)
      if (!res.writableEnded) send(res, 200, data ?? { ok: true })
    } catch (err) {
      if (err instanceof HttpError) return send(res, err.status, { error: err.code, message: err.message })
      if (err.code === '42P01') {
        console.error('[api] tables missing — run "npm run db:setup":', err.message)
        return send(res, 503, { error: 'db_not_setup' })
      }
      if (isConnectionError(err)) {
        console.error('[api] database unreachable:', err.message)
        return send(res, 503, { error: err.code === 'db_not_configured' ? 'db_not_configured' : 'db_unreachable' })
      }
      console.error('[api] unexpected error:', err)
      return send(res, 500, { error: 'server_error' })
    }
  }
}

export const toInt = (v) => {
  const n = Number.parseInt(v, 10)
  return Number.isFinite(n) ? n : null
}
export const toNum = (v) => {
  const n = Number(v)
  return v !== undefined && v !== null && v !== '' && Number.isFinite(n) ? n : null
}
export const list = (v) => (v ? String(v).split(',').map((s) => s.trim()).filter(Boolean) : [])
