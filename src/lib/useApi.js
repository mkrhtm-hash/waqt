import { useCallback, useEffect, useState } from 'react'
import { api } from './api'

// Short-lived in-memory cache so moving between pages feels instant (public catalogue data only).
const cache = new Map()
const inflight = new Map()
const TTL = 60_000
const freshHit = (path) => {
  const hit = path ? cache.get(path) : null
  return hit && Date.now() - hit.at < TTL ? hit : null
}

export function invalidate(prefix = '') {
  for (const key of cache.keys()) if (key.startsWith(prefix)) cache.delete(key)
}

/**
 * useApi('/watches?brand=rolex') → { data, error, loading, reload }
 * Pass null to skip. Use { cache: false } for private (per-user) data.
 * While a new request is loading, the previous data is kept so lists don't flash.
 */
export function useApi(path, { cache: useCache = true } = {}) {
  const [nonce, setNonce] = useState(0)
  const [state, setState] = useState(() => {
    const hit = useCache ? freshHit(path) : null
    return { data: hit?.data ?? null, error: null, loading: Boolean(path) && !hit }
  })

  useEffect(() => {
    if (!path) { setState({ data: null, error: null, loading: false }); return }
    const hit = useCache && nonce === 0 ? freshHit(path) : null
    if (hit) { setState({ data: hit.data, error: null, loading: false }); return }
    let alive = true
    setState((s) => ({ data: s.data, error: null, loading: true }))
    // identical public requests made at the same time share one network call
    let request = useCache ? inflight.get(path) : null
    if (!request) {
      request = api(path).then((data) => {
        if (useCache) cache.set(path, { data, at: Date.now() })
        return data
      })
      if (useCache) {
        inflight.set(path, request)
        request.finally(() => inflight.delete(path)).catch(() => {})
      }
    }
    request
      .then((data) => alive && setState({ data, error: null, loading: false }))
      .catch((error) => alive && setState((s) => ({ data: s.data, error, loading: false })))
    return () => { alive = false }
  }, [path, nonce, useCache])

  const reload = useCallback(() => {
    if (path) cache.delete(path)
    setNonce((n) => n + 1)
  }, [path])

  return { ...state, reload }
}
