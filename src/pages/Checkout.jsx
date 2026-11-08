import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { CreditCard, Smartphone, CalendarClock, Wallet, Loader2, ShieldCheck, Gift } from 'lucide-react'
import { Page } from '../components/ui'
import { PanelSkeleton } from '../components/Skeleton'
import { OrderSummary } from './Bag'
import { useStore, usePrice } from '../context/StoreContext'

const COUNTRIES = ['UAE', 'KSA', 'Qatar', 'Kuwait', 'Bahrain', 'Oman']
const METHOD_NAME = { card: 'Card', apple: 'Apple Pay', tabby: 'Tabby', tamara: 'Tamara' }

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] uppercase tracking-wider text-muted">{label}</span>
      {children}
    </label>
  )
}

export default function Checkout() {
  const { t } = useTranslation()
  const price = usePrice()
  const navigate = useNavigate()
  const { cart, cartReady, bagTotal, placeOrder, toast, toastError, refreshCart, user } = useStore()
  const [form, setForm] = useState({ name: user?.fullName || '', email: user?.email || '', phone: user?.phone || '', street: '', city: '', country: user?.country || COUNTRIES[0], card: '', exp: '', cvc: '' })
  const [method, setMethod] = useState('card')
  const [gift, setGift] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  if (!cartReady) return <Page className="mx-auto max-w-3xl px-5 pt-20"><PanelSkeleton rows={6} /></Page>
  if (cart.length === 0 && !loading) return <Navigate to="/bag" replace />

  const set = (k) => (e) => {
    let v = e.target.value
    if (k === 'card') v = v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
    if (k === 'exp') v = v.replace(/\D/g, '').slice(0, 4).replace(/^(\d{2})(\d)/, '$1 / $2')
    if (k === 'cvc') v = v.replace(/\D/g, '').slice(0, 4)
    setForm((f) => ({ ...f, [k]: v }))
    setErrors((er) => ({ ...er, [k]: false }))
  }

  const submit = async (e) => {
    e.preventDefault()
    const req = ['name', 'email', 'phone', 'street', 'city']
    if (method === 'card') req.push('card', 'exp', 'cvc')
    const errs = {}
    req.forEach((k) => { if (!form[k].trim()) errs[k] = true })
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) errs.email = true
    if (method === 'card' && form.card && form.card.replace(/\s/g, '').length < 15) errs.card = true
    setErrors(errs)
    if (Object.keys(errs).length) return toast(t('checkout.required'), 'error')
    setLoading(true)
    try {
      // mock payment: a short pause for the "securing" animation, no real charge is made
      await new Promise((r) => setTimeout(r, 900))
      const order = await placeOrder({
        paymentMethod: METHOD_NAME[method],
        shippingCity: form.city.trim(),
        shippingAddress: `${form.street.trim()}, ${t(`countries.${form.country}`)}`,
      })
      navigate(`/success/${order.orderNumber}`, { replace: true, state: { fresh: true } })
    } catch (err) {
      setLoading(false)
      if (err.code === 'out_of_stock') {
        toast(t('errors.checkout_stock', { items: err.message }), 'error')
        refreshCart().catch(() => {})
      } else {
        toastError(err)
      }
    }
  }

  const methods = [
    { id: 'card', icon: CreditCard, label: t('checkout.card') },
    { id: 'apple', icon: Smartphone, label: t('checkout.apple') },
    { id: 'tabby', icon: CalendarClock, label: t('checkout.tabby'), sub: price(Math.round(bagTotal / 4)) + ' × 4' },
    { id: 'tamara', icon: Wallet, label: t('checkout.tamara'), sub: price(Math.round(bagTotal / 3)) + ' × 3' },
  ]
  const inp = (k) => `input-luxe ${errors[k] ? '!border-red-400' : ''}`

  return (
    <Page>
      <div className="mx-auto max-w-7xl px-5 pt-14 md:px-8 md:pt-20">
        <h1 className="mb-10 font-display text-5xl font-light md:text-7xl">{t('checkout.title')}</h1>
        <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[1fr_420px]" noValidate>
          <div className="space-y-6">
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-3xl p-6 md:p-8">
              <h2 className="eyebrow mb-5">01 · {t('checkout.contact')}</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2"><Field label={t('checkout.name')}><input className={inp('name')} value={form.name} onChange={set('name')} autoComplete="name" /></Field></div>
                <Field label={t('checkout.email')}><input type="email" className={inp('email')} value={form.email} onChange={set('email')} autoComplete="email" /></Field>
                <Field label={t('checkout.phone')}><input type="tel" className={inp('phone')} value={form.phone} onChange={set('phone')} placeholder="+971 50 000 0000" dir="ltr" autoComplete="tel" /></Field>
              </div>
            </motion.section>

            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-3xl p-6 md:p-8">
              <h2 className="eyebrow mb-5">02 · {t('checkout.address')}</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2"><Field label={t('checkout.street')}><input className={inp('street')} value={form.street} onChange={set('street')} /></Field></div>
                <Field label={t('checkout.city')}><input className={inp('city')} value={form.city} onChange={set('city')} /></Field>
                <Field label={t('checkout.country')}>
                  <select className="input-luxe" value={form.country} onChange={set('country')}>
                    {COUNTRIES.map((c) => <option key={c} value={c} className="bg-midnight-900 text-ivory-100">{t(`countries.${c}`)}</option>)}
                  </select>
                </Field>
              </div>
              <p className="mt-4 flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400"><ShieldCheck className="h-4 w-4" />{t('checkout.insured')}</p>
              <label className="mt-4 flex cursor-pointer items-center gap-3 text-sm">
                <input type="checkbox" checked={gift} onChange={(e) => setGift(e.target.checked)} className="h-4 w-4 accent-[#d4ad62]" />
                <Gift className="h-4 w-4 text-gold-400" strokeWidth={1.4} /> {t('checkout.gift')}
              </label>
            </motion.section>

            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-3xl p-6 md:p-8">
              <h2 className="eyebrow mb-5">03 · {t('checkout.payment')}</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {methods.map(({ id, icon: Icon, label, sub }) => (
                  <button type="button" key={id} onClick={() => setMethod(id)} className={`flex items-center gap-3 rounded-2xl border p-4 text-start transition-all duration-300 ${method === id ? 'border-gold-400 bg-gold-400/10 shadow-glow' : 'border-gold-400/20 hover:border-gold-400/50'}`} aria-pressed={method === id}>
                    <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${method === id ? 'border-gold-400' : 'border-gold-400/40'}`}>
                      {method === id && <span className="h-2.5 w-2.5 rounded-full bg-gold-400" />}
                    </span>
                    <Icon className="h-5 w-5 shrink-0 text-gold-400" strokeWidth={1.3} />
                    <span className="text-sm leading-tight">
                      {label}
                      {sub && <span className="mt-0.5 block text-[11px] text-muted">{sub}</span>}
                    </span>
                  </button>
                ))}
              </div>
              {method === 'card' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-5 grid grid-cols-2 gap-4" dir="ltr">
                  <div className="col-span-2"><input className={inp('card')} placeholder={t('checkout.cardNumber')} value={form.card} onChange={set('card')} inputMode="numeric" autoComplete="cc-number" /></div>
                  <input className={inp('exp')} placeholder={t('checkout.expiry')} value={form.exp} onChange={set('exp')} inputMode="numeric" autoComplete="cc-exp" />
                  <input className={inp('cvc')} placeholder={t('checkout.cvc')} value={form.cvc} onChange={set('cvc')} inputMode="numeric" autoComplete="cc-csc" />
                </motion.div>
              )}
              {method === 'apple' && <p className="mt-5 rounded-2xl bg-black px-4 py-3 text-center text-sm font-medium text-white" dir="ltr">Apple Pay</p>}
            </motion.section>
          </div>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <OrderSummary compact>
              <button type="submit" disabled={loading} className="btn-gold mt-6 w-full !py-4">
                {loading ? <><Loader2 className="h-4 w-4 animate-spin" />{t('checkout.placing')}</> : <>{t('checkout.place')} · {price(bagTotal)}</>}
              </button>
            </OrderSummary>
          </div>
        </form>
      </div>
    </Page>
  )
}
