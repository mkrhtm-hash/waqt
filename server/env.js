// Loads .env for local development and makes sure the required variables exist.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import crypto from 'node:crypto'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const envFile = path.join(root, '.env')

export function loadEnv() {
  if (!fs.existsSync(envFile)) fs.writeFileSync(envFile, 'DATABASE_URL=\nJWT_SECRET=\n')
  process.loadEnvFile(envFile)

  // Generate a strong JWT secret automatically if it is missing.
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    const secret = crypto.randomBytes(48).toString('base64url')
    let text = fs.readFileSync(envFile, 'utf8')
    text = /^JWT_SECRET=.*$/m.test(text) ? text.replace(/^JWT_SECRET=.*$/m, `JWT_SECRET=${secret}`) : text.trimEnd() + `\nJWT_SECRET=${secret}\n`
    fs.writeFileSync(envFile, text)
    process.env.JWT_SECRET = secret
    console.log('🔐 Generated a new JWT_SECRET and saved it to .env')
  }
  return { hasDatabase: Boolean(process.env.DATABASE_URL) }
}

export const NEON_HELP = `
┌──────────────────────────────────────────────────────────────────────────┐
│  DATABASE_URL is missing from your .env file.                            │
│                                                                          │
│  1. Go to https://console.neon.tech and sign in (the free plan is fine). │
│  2. Create a project (any name, e.g. "waqt"; pick a region near you).    │
│  3. On the project dashboard, click the "Connect" button.                │
│  4. Keep the defaults (branch: main, database: neondb, role: owner),     │
│     tick "Connection pooling" ON, and copy the connection string.        │
│     It looks like:                                                       │
│     postgresql://neondb_owner:xxxx@ep-xxxx-pooler.region.aws.neon.tech/  │
│     neondb?sslmode=require                                               │
│  5. Paste it into .env after DATABASE_URL=  (no quotes needed)           │
│  6. Run:  npm run db:setup   then   npm run dev                          │
└──────────────────────────────────────────────────────────────────────────┘`
