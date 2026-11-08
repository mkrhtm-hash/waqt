// Session handling: signed JWT (HS256) stored in an httpOnly cookie.
import { SignJWT, jwtVerify } from 'jose'
import { HttpError, parseCookies } from './http.js'
import { query } from './db.js'

export const COOKIE = 'waqt_session'
const MAX_AGE = 60 * 60 * 24 * 30 // 30 days

function secret() {
  const s = process.env.JWT_SECRET
  if (!s || s.length < 32) throw new Error('JWT_SECRET is missing or too short')
  return new TextEncoder().encode(s)
}

export async function createSession(res, userId) {
  const token = await new SignJWT({})
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(String(userId))
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret())
  const secure = process.env.NODE_ENV === 'production' || process.env.VERCEL ? '; Secure' : ''
  res.setHeader('Set-Cookie', `${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${MAX_AGE}${secure}`)
}

export function clearSession(res) {
  res.setHeader('Set-Cookie', `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`)
}

/** Returns the user id from the session cookie, or null. */
export async function getUserId(req) {
  const token = parseCookies(req)[COOKIE]
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, secret(), { algorithms: ['HS256'] })
    const id = Number.parseInt(payload.sub, 10)
    return Number.isFinite(id) ? id : null
  } catch {
    return null
  }
}

/** Throws 401 unless logged in. Every user-data route goes through this. */
export async function requireUser(req) {
  const id = await getUserId(req)
  if (!id) throw new HttpError(401, 'unauthorized', 'Please sign in to continue.')
  return id
}

export const USER_COLUMNS = 'id, email, full_name, phone, country, preferred_currency, preferred_language, vip_tier, created_at'

export function toUser(r) {
  return {
    id: r.id,
    email: r.email,
    fullName: r.full_name,
    phone: r.phone,
    country: r.country,
    preferredCurrency: r.preferred_currency,
    preferredLanguage: r.preferred_language,
    vipTier: r.vip_tier,
    createdAt: r.created_at,
  }
}

export async function loadUser(id) {
  const [row] = await query(`SELECT ${USER_COLUMNS} FROM users WHERE id = $1`, [id])
  return row ? toUser(row) : null
}
