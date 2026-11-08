// /api/auth/signup · /api/auth/login · /api/auth/logout · /api/auth/me
import bcrypt from 'bcryptjs'
import { query } from '../_lib/db.js'
import { HttpError, readBody, route, send } from '../_lib/http.js'
import { createSession, clearSession, getUserId, loadUser, toUser, USER_COLUMNS } from '../_lib/auth.js'

const COUNTRIES = ['UAE', 'KSA', 'Qatar', 'Kuwait', 'Bahrain', 'Oman']
const CURRENCIES = ['AED', 'SAR', 'QAR', 'KWD', 'BHD', 'OMR', 'USD']
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
let DUMMY_HASH
const dummyHash = async () => (DUMMY_HASH ??= await bcrypt.hash('not-a-real-password', 10))

async function signup(req, res) {
  const b = readBody(req)
  const email = String(b.email || '').trim().toLowerCase()
  const password = String(b.password || '')
  const fullName = String(b.fullName || '').trim()
  const phone = String(b.phone || '').trim()
  const country = COUNTRIES.includes(b.country) ? b.country : null
  const currency = CURRENCIES.includes(b.preferredCurrency) ? b.preferredCurrency : 'AED'
  const language = b.preferredLanguage === 'ar' ? 'ar' : 'en'

  if (!fullName || fullName.length > 120) throw new HttpError(400, 'invalid_name')
  if (!EMAIL_RE.test(email) || email.length > 200) throw new HttpError(400, 'invalid_email')
  if (password.length < 8 || password.length > 200) throw new HttpError(400, 'weak_password')
  if (!phone || phone.length > 40) throw new HttpError(400, 'invalid_phone')
  if (!country) throw new HttpError(400, 'invalid_country')

  const hash = await bcrypt.hash(password, 10)
  const rows = await query(
    `INSERT INTO users (email, password_hash, full_name, phone, country, preferred_currency, preferred_language)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (email) DO NOTHING
     RETURNING ${USER_COLUMNS}`,
    [email, hash, fullName, phone, country, currency, language],
  )
  if (!rows.length) throw new HttpError(409, 'email_taken', 'An account with this email already exists.')
  await createSession(res, rows[0].id)
  return { user: toUser(rows[0]) }
}

async function login(req, res) {
  const b = readBody(req)
  const email = String(b.email || '').trim().toLowerCase()
  const password = String(b.password || '')
  const [row] = await query(`SELECT ${USER_COLUMNS}, password_hash FROM users WHERE email = $1`, [email])
  // compare against a dummy hash when the user doesn't exist, to keep timing similar
  const ok = await bcrypt.compare(password, row?.password_hash || (await dummyHash()))
  if (!row || !ok) throw new HttpError(401, 'invalid_credentials', 'Email or password is incorrect.')
  await createSession(res, row.id)
  return { user: toUser(row) }
}

async function me(req) {
  const id = await getUserId(req)
  if (!id) return { user: null }
  return { user: await loadUser(id) }
}

const actions = {
  signup: { POST: signup },
  login: { POST: login },
  logout: { POST: async (req, res) => { clearSession(res); return { ok: true } } },
  me: { GET: me },
}

export default async function handler(req, res) {
  const action = actions[req.query?.action]
  if (!action) return send(res, 404, { error: 'not_found' })
  return route(action)(req, res)
}
