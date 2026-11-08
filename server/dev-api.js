// Local stand-in for Vercel Functions: serves every file in /api with Vercel's file-based routing.
//   api/stats.js            → /api/stats
//   api/watches/index.js    → /api/watches
//   api/watches/[id].js     → /api/watches/:id   (req.query.id)
//   files/folders starting with "_" are private helpers (same as Vercel)
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import express from 'express'
import { loadEnv, NEON_HELP } from './env.js'

const { hasDatabase } = loadEnv()
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const apiDir = path.join(root, 'api')
const PORT = Number(process.env.API_PORT) || 3180

function collect(dir, prefix = '') {
  const out = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('_') || entry.name.startsWith('.')) continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) out.push(...collect(full, `${prefix}/${entry.name}`))
    else if (/\.(m?js)$/.test(entry.name)) {
      const base = entry.name.replace(/\.(m?js)$/, '')
      const urlPath = (base === 'index' ? prefix : `${prefix}/${base}`) || '/'
      out.push({ file: full, url: '/api' + urlPath.replace(/\[(\w+)\]/g, ':$1') })
    }
  }
  // static routes before dynamic ones, like Vercel
  return out.sort((a, b) => (a.url.includes(':') ? 1 : 0) - (b.url.includes(':') ? 1 : 0))
}

const app = express()
app.disable('x-powered-by')
app.use(express.json({ limit: '100kb' }))

const routes = collect(apiDir)
for (const r of routes) {
  const mod = await import(pathToFileURL(r.file).href)
  const handler = mod.default
  if (typeof handler !== 'function') continue
  app.all(r.url, async (req, res) => {
    // Vercel puts URL query params + dynamic segments together in req.query
    const merged = { ...Object.fromEntries(new URL(req.originalUrl, 'http://x').searchParams), ...req.params }
    Object.defineProperty(req, 'query', { value: merged, writable: true, configurable: true })
    try {
      await handler(req, res)
    } catch (err) {
      console.error(`[api] ${req.method} ${req.originalUrl} crashed:`, err)
      if (!res.headersSent) res.status(500).json({ error: 'server_error' })
    }
  })
}
app.use('/api', (req, res) => res.status(404).json({ error: 'not_found' }))

app.listen(PORT, '127.0.0.1', () => {
  console.log(`✅ API ready on http://localhost:${PORT} — ${routes.length} routes from /api`)
  for (const r of routes) console.log('   ' + r.url)
  if (!hasDatabase) console.log(NEON_HELP)
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use by another program. Close it, or set API_PORT in .env (and update vite.config.js).`)
    process.exit(1)
  }
  throw err
})
