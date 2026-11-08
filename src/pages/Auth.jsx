import { useState } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Loader2, Mail, Lock, UserRound, Phone, Globe2, Coins, ArrowRight } from 'lucide-react'
import WatchSVG from '../components/WatchSVG'
import { Page } from '../components/ui'
import { useStore } from '../context/StoreContext'
import { currencies } from '../config/currency'
import { looksByRef } from '../config/looks'

const COUNTRIES = ['UAE', 'KSA', 'Qatar', 'Kuwait', 'Bahrain', 'Oman']
const DEFAULT_CURRENCY = { UAE: 'AED', KSA: 'SAR', Qatar: 'QAR', Kuwait: 'KWD', Bahrain: 'BHD', Oman: 'OMR' }

function Field({ icon: Icon, label, error, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] uppercase tracking-wider text-muted">{label}</span>
      <span className="relative block">
        <Icon className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gold-400/80" strokeWidth={1.4} />
        {children}
      </span>
      {error && <span className="mt-1.5 block text-xs text-red-400">{error}</span>}
    </label>
  )
}

/** Only allow returning to pages inside this site. */
const safeNext = (n) => (n && n.startsWith('/') && !n.startsWith('//') ? n : '/account')

export default function Auth({ mode }) {
  const isSignup = mode === 'signup'
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const next = safeNext(params.get('next'))
  const { user, authReady, login, signup, currency, errorText } = useStore()
  const [form, setForm] = useState({ fullName: '', email: '', password: '', phone: '', country: 'UAE', preferredCurrency: currency || 'AED' })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null) // { field?, message }

  if (authReady && user && !busy) return <Navigate to={next} replace />

  const set = (k) => (e) => {
    const v = e.target.value
    setForm((f) => ({ ...f, [k]: v, ...(k === 'country' ? { preferredCurrency: DEFAULT_CURRENCY[v] || f.preferredCurrency } : {}) }))
    setError(null)
  }

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    setBusy(true)
    try {
      if (isSignup) await signup(form)
      else await login(form.email, form.password)
      navigate(next, { replace: true })
    } catch (err) {
      const fieldMap = { invalid_email: 'email', email_taken: 'email', weak_password: 'password', invalid_name: 'fullName', invalid_phone: 'phone', invalid_country: 'country', invalid_credentials: 'password' }
      const key = `auth.errors.${err.code}`
      setError({ field: fieldMap[err.code], message: t(key, { defaultValue: errorText(err) }) })
      setBusy(false)
    }
  }

  const inp = (k) => `input-luxe ps-10 ${error?.field === k ? '!border-red-400' : ''}`
  const fieldErr = (k) => (error?.field === k ? error.message : null)

  return (
    <Page className="relative overflow-hidden">
      <div className="tex-marble absolute inset-0 -z-10 opacity-80" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_80%_30%,rgba(212,173,98,0.16),transparent_55%)]" />
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-12 md:px-8 md:py-20 lg:grid-cols-[1fr_480px]">
        <div className="hidden lg:block">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="eyebrow mb-5 flex items-center gap-3"><span className="h-px w-8 bg-gold-400" />{t(isSignup ? 'auth.signupEyebrow' : 'auth.loginEyebrow')}</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} className="font-display text-7xl font-light leading-[0.95]">
            {t(isSignup ? 'auth.signupTitle' : 'auth.loginTitle')}
          </motion.h1>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-muted">{t(isSignup ? 'auth.signupSubtitle' : 'auth.loginSubtitle')}</p>
          <motion.div initial={{ opacity: 0, scale: 0.9, rotate: -10 }} animate={{ opacity: 1, scale: 1, rotate: -6 }} transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }} className="mt-10">
            <WatchSVG look={looksByRef['15510ST.OO.1320ST.06']} brand="WAQT" live className="h-72 w-auto animate-float drop-shadow-[0_30px_50px_rgba(0,0,0,0.5)]" />
          </motion.div>
        </div>

        <motion.form onSubmit={submit} noValidate initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} className="glass rounded-[32px] p-7 md:p-10">
          <div className="mb-8 lg:hidden">
            <p className="eyebrow mb-3">{t(isSignup ? 'auth.signupEyebrow' : 'auth.loginEyebrow')}</p>
            <h1 className="font-display text-5xl font-light leading-none">{t(isSignup ? 'auth.signupTitle' : 'auth.loginTitle')}</h1>
          </div>
          <p className="mb-6 hidden font-display text-3xl lg:block">{t(isSignup ? 'nav.join' : 'nav.signIn')}</p>

          <div className="space-y-4">
            {isSignup && (
              <Field icon={UserRound} label={t('auth.fullName')} error={fieldErr('fullName')}>
                <input className={inp('fullName')} value={form.fullName} onChange={set('fullName')} autoComplete="name" required />
              </Field>
            )}
            <Field icon={Mail} label={t('auth.email')} error={fieldErr('email')}>
              <input type="email" className={inp('email')} value={form.email} onChange={set('email')} autoComplete="email" dir="ltr" required />
            </Field>
            <Field icon={Lock} label={t('auth.password')} error={fieldErr('password')}>
              <input type="password" className={inp('password')} value={form.password} onChange={set('password')} autoComplete={isSignup ? 'new-password' : 'current-password'} dir="ltr" required />
            </Field>
            {isSignup && <p className="-mt-2 text-[11px] text-muted">{t('auth.passwordHint')}</p>}
            {isSignup && (
              <>
                <Field icon={Phone} label={t('auth.phone')} error={fieldErr('phone')}>
                  <input type="tel" className={inp('phone')} value={form.phone} onChange={set('phone')} placeholder="+971 50 000 0000" autoComplete="tel" dir="ltr" required />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field icon={Globe2} label={t('auth.country')} error={fieldErr('country')}>
                    <select className={inp('country')} value={form.country} onChange={set('country')}>
                      {COUNTRIES.map((c) => <option key={c} value={c} className="bg-midnight-900 text-ivory-100">{t(`countries.${c}`)}</option>)}
                    </select>
                  </Field>
                  <Field icon={Coins} label={t('auth.currency')}>
                    <select className="input-luxe ps-10" value={form.preferredCurrency} onChange={set('preferredCurrency')}>
                      {Object.keys(currencies).map((c) => <option key={c} value={c} className="bg-midnight-900 text-ivory-100">{c}</option>)}
                    </select>
                  </Field>
                </div>
              </>
            )}
          </div>

          {error && !error.field && <p className="mt-4 rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-300" role="alert">{error.message}</p>}

          <button type="submit" disabled={busy} className="btn-gold mt-8 w-full !py-4">
            {busy ? <><Loader2 className="h-4 w-4 animate-spin" />{t('auth.working')}</> : <>{t(isSignup ? 'auth.submitSignup' : 'auth.submitLogin')} <ArrowRight className="h-4 w-4 rtl:rotate-180" /></>}
          </button>

          <p className="mt-6 text-center text-sm text-muted">
            {t(isSignup ? 'auth.haveAccount' : 'auth.noAccount')}{' '}
            <Link to={`/${isSignup ? 'login' : 'signup'}${params.get('next') ? `?next=${encodeURIComponent(next)}` : ''}`} className="text-gold-500 underline-offset-4 hover:underline dark:text-gold-300">
              {t(isSignup ? 'auth.signInHere' : 'auth.createOne')}
            </Link>
          </p>
        </motion.form>
      </div>
    </Page>
  )
}
