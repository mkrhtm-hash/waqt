// Tiny fetch wrapper. All data comes from /api — the browser never sees the database.

export class ApiError extends Error {
  constructor(status, code, message) {
    super(message || code)
    this.status = status
    this.code = code
  }
  get isDbDown() {
    return ['db_unreachable', 'db_not_configured', 'db_not_setup', 'network'].includes(this.code)
  }
}

const listeners = new Set()
/** Subscribe to database/network availability changes (used by the status banner). */
export function onDbStatus(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}
const emit = (status) => listeners.forEach((fn) => fn(status))

export async function api(path, { method = 'GET', body, signal } = {}) {
  let res
  try {
    res = await fetch(`/api${path}`, {
      method,
      signal,
      credentials: 'same-origin',
      headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch (err) {
    if (err.name === 'AbortError') throw err
    emit({ ok: false, code: 'network' })
    throw new ApiError(0, 'network', 'Network error')
  }
  let data = null
  try { data = await res.json() } catch { /* empty body */ }
  if (!res.ok) {
    const err = new ApiError(res.status, data?.error || 'server_error', data?.message)
    if (err.isDbDown || res.status === 502 || res.status === 504) emit({ ok: false, code: err.isDbDown ? err.code : 'network' })
    throw err
  }
  // a logged-out /auth/me never touches the database, so it can't prove the database is back
  if (!path.startsWith('/auth/me')) emit({ ok: true })
  return data
}

export const qs = (params) => {
  const s = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === '' || (Array.isArray(v) && !v.length)) continue
    s.set(k, Array.isArray(v) ? v.join(',') : String(v))
  }
  const str = s.toString()
  return str ? `?${str}` : ''
}
