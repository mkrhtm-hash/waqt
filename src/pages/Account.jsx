import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Heart, Package, Crown, Calendar, UserRound, Check, Gem, MapPin, LogOut, Loader2 } from 'lucide-react'
import WatchCard from '../components/WatchCard'
import WatchVisual from '../components/WatchVisual'
import { Page, EmptyState } from '../components/ui'
import { PanelSkeleton } from '../components/Skeleton'
import { useStore, usePrice, useLocalized } from '../context/StoreContext'
import { useApi } from '../lib/useApi'
import { api } from '../lib/api'
import { currencies } from '../config/currency'

const TIERS = [
  { id: 'Silver', min: 0, grad: 'from-zinc-300 via-zinc-100 to-zinc-400', text: 'text-midnight-950' },
  { id: 'Gold', min: 100000, grad: 'from-[#f4e3b5] via-[#d4ad62] to-[#8a5a2b]', text: 'text-midnight-950' },
  { id: 'Black', min: 500000, grad: 'from-midnight-950 via-midnight-700 to-black', text: 'text-gold-300' },
]
const COUNTRIES = ['UAE', 'KSA', 'Qatar', 'Kuwait', 'Bahrain', 'Oman']

function VipCard({ tier, name }) {
  return (
    <div className={`relative aspect-[1.6/1] w-full max-w-md overflow-hidden rounded-3xl bg-gradient-to-br ${tier.grad} p-6 shadow-gold ${tier.text}`} dir="ltr">
      <div className="absolute -end-10 -top-10 h-48 w-48 rounded-full border border-current opacity-20" />
      <div className="absolute -end-4 -top-4 h-36 w-36 rounded-full border border-current opacity-20" />
      <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/25 to-transparent" style={{ width: '40%' }} />
      <div className="relative flex h-full flex-col justify-between">
        <div className="flex items-center justify-between">
          <span style={{ fontFamily: '"Cormorant Garamond", serif', letterSpacing: '0.42em' }} className="text-2xl">WAQT</span>
          <Crown className="h-6 w-6" strokeWidth={1.2} />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-luxe opacity-70">Private Client</p>
          <p className="mt-1 font-display text-2xl">{name}</p>
          <p className="mt-2 text-xs uppercase tracking-luxe">{tier.id} tier</p>
        </div>
      </div>
    </div>
  )
}

function Profile({ user }) {
  const { t, i18n } = useTranslation()
  const { setUser, toast, toastError, setCurrency, currency, logout } = useStore()
  const [form, setForm] = useState({ fullName: user.fullName, phone: user.phone || '', country: user.country })
  const [saving, setSaving] = useState(false)
  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const { user: u } = await api('/account', { method: 'PATCH', body: form })
      setUser(u)
      toast(t('toast.saved'))
    } catch (err) {
      toastError(err)
    } finally {
      setSaving(false)
    }
  }
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form onSubmit={save} className="glass space-y-4 rounded-3xl p-6 md:p-8">
        <p className="eyebrow">{t('account.profile')}</p>
        <label className="block"><span className="mb-1.5 block text-[11px] uppercase tracking-wider text-muted">{t('auth.fullName')}</span>
          <input className="input-luxe" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} /></label>
        <label className="block"><span className="mb-1.5 block text-[11px] uppercase tracking-wider text-muted">{t('auth.email')}</span>
          <input className="input-luxe opacity-60" value={user.email} disabled dir="ltr" /></label>
        <label className="block"><span className="mb-1.5 block text-[11px] uppercase tracking-wider text-muted">{t('auth.phone')}</span>
          <input className="input-luxe" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} dir="ltr" /></label>
        <label className="block"><span className="mb-1.5 block text-[11px] uppercase tracking-wider text-muted">{t('auth.country')}</span>
          <select className="input-luxe" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })}>
            {COUNTRIES.map((c) => <option key={c} value={c} className="bg-midnight-900 text-ivory-100">{t(`countries.${c}`)}</option>)}
          </select></label>
        <button disabled={saving} className="btn-gold w-full">{saving && <Loader2 className="h-4 w-4 animate-spin" />}{t('account.save')}</button>
        <p className="text-center text-xs text-muted">{t('account.memberSince')} <span dir="ltr">{new Date(user.createdAt).toLocaleDateString(i18n.language === 'ar' ? 'ar-AE' : 'en-GB', { month: 'long', year: 'numeric' })}</span></p>
      </form>
      <div className="space-y-6">
        <div className="glass space-y-5 rounded-3xl p-6 md:p-8">
          <p className="eyebrow">{t('account.preferences')}</p>
          <div>
            <p className="mb-2 text-[11px] uppercase tracking-wider text-muted">{t('common.currency')}</p>
            <div className="flex flex-wrap gap-2">
              {Object.keys(currencies).map((c) => (
                <button key={c} type="button" onClick={() => { setCurrency(c); toast(t('toast.prefsSaved')) }} className={`chip ${currency === c ? 'chip-active' : ''}`}>{c}</button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-[11px] uppercase tracking-wider text-muted">{t('common.language')}</p>
            <div className="flex gap-2">
              {[['en', 'English'], ['ar', 'العربية']].map(([code, label]) => (
                <button key={code} type="button" onClick={() => { i18n.changeLanguage(code); toast(t('toast.prefsSaved')) }} className={`chip ${i18n.language === code ? 'chip-active' : ''}`}>{label}</button>
              ))}
            </div>
          </div>
        </div>
        <button onClick={logout} className="btn-ghost w-full"><LogOut className="h-4 w-4 rtl:rotate-180" strokeWidth={1.5} />{t('nav.signOut')}</button>
      </div>
    </div>
  )
}

export default function Account() {
  const { t, i18n } = useTranslation()
  const price = usePrice()
  const L = useLocalized()
  const [params, setParams] = useSearchParams()
  const { wishlist, user: sessionUser, setUser } = useStore()
  const tab = params.get('tab') || 'wishlist'
  const { data, loading, error, reload } = useApi('/account', { cache: false })
  const user = data?.user || sessionUser

  // keep the navbar badge in sync if the tier changed (e.g. after an order)
  useEffect(() => {
    if (data?.user && sessionUser && data.user.vipTier !== sessionUser.vipTier) setUser(data.user)
  }, [data, sessionUser, setUser])

  const orders = data?.orders || []
  const appts = data?.appointments || []
  const spent = data?.lifetimeSpend ?? 0
  const tierIdx = Math.max(0, TIERS.findIndex((x) => x.id === user?.vipTier))
  const tier = TIERS[tierIdx]
  const next = TIERS[tierIdx + 1]
  const progress = next ? Math.max(0, Math.min(100, ((spent - tier.min) / (next.min - tier.min)) * 100)) : 100
  const dateFmt = (d) => new Date(d).toLocaleDateString(i18n.language === 'ar' ? 'ar-AE' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

  const tabs = [
    ['wishlist', Heart, wishlist.length],
    ['orders', Package, orders.length],
    ['appointments', Calendar, appts.length],
    ['vip', Crown],
    ['profile', UserRound],
  ]

  return (
    <Page>
      <section className="relative overflow-hidden">
        <div className="tex-marble absolute inset-0 -z-10 opacity-70" />
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 pb-10 pt-14 md:flex-row md:items-end md:justify-between md:px-8 md:pt-20">
          <div>
            <p className="eyebrow mb-4">{t('account.eyebrow')}</p>
            <h1 className="font-display text-5xl font-light leading-none md:text-7xl">{t('account.greeting', { name: user?.fullName.split(' ')[0] })}</h1>
          </div>
          <span className={`inline-flex items-center gap-2 self-start rounded-full bg-gradient-to-r ${tier.grad} px-4 py-2 text-xs uppercase tracking-wide2 ${tier.text}`}>
            <Gem className="h-3.5 w-3.5" /> {t(`account.tiers.${tier.id.toLowerCase()}`)}
          </span>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="no-scrollbar -mx-5 mb-8 flex gap-2 overflow-x-auto px-5 md:mx-0 md:px-0">
          {tabs.map(([id, Icon, count]) => (
            <button key={id} onClick={() => setParams({ tab: id })} className={`relative flex shrink-0 items-center gap-2 rounded-full border px-5 py-2.5 text-xs uppercase tracking-wider transition-all duration-300 ${tab === id ? 'border-gold-400 text-gold-500 dark:text-gold-300' : 'border-gold-400/20 text-muted hover:border-gold-400/60'}`}>
              {tab === id && <motion.span layoutId="acc-tab" className="absolute inset-0 -z-10 rounded-full bg-gold-400/10" />}
              <Icon className="h-4 w-4" strokeWidth={1.4} />{t(`account.tabs.${id}`)}
              {count > 0 && <span className="text-[10px] opacity-70">({count})</span>}
            </button>
          ))}
        </div>

        {error && !data && (
          <div className="glass mb-6 rounded-3xl p-6 text-center">
            <p className="text-sm text-muted">{t(`errors.${error.code}`, t('errors.generic'))}</p>
            <button onClick={reload} className="btn-gold mt-4">{t('dbBanner.retry')}</button>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }}>
            {tab === 'wishlist' && (wishlist.length === 0 ? (
              <EmptyState icon={Heart} title={t('account.emptyWish')} text={t('account.emptyWishText')} cta={t('hero.cta')} />
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <AnimatePresence mode="popLayout">
                  {wishlist.map((w, i) => <WatchCard key={w.id} watch={w} index={i} />)}
                </AnimatePresence>
              </div>
            ))}

            {tab === 'orders' && (loading && !data ? <PanelSkeleton rows={4} /> : orders.length === 0 ? (
              <EmptyState icon={Package} title={t('account.emptyOrders')} text={t('account.emptyOrdersText')} cta={t('hero.cta')} />
            ) : (
              <ul className="space-y-4">
                {orders.map((o) => (
                  <li key={o.id} className="glass rounded-3xl p-5 md:p-6">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gold-400/10 pb-4">
                      <div>
                        <p className="font-display text-2xl tracking-wider" dir="ltr">{o.orderNumber}</p>
                        <p className="text-xs text-muted">
                          {t('account.placed')} {dateFmt(o.createdAt)} · {t('account.items', { n: o.items.reduce((s, x) => s + x.quantity, 0) })} · {t('account.paidWith')} <span dir="ltr">{o.paymentMethod}</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-wider ${o.status === 'delivered' ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : o.status === 'cancelled' ? 'bg-red-500/15 text-red-400' : 'bg-gold-400/15 text-gold-600 dark:text-gold-300'}`}>{t(`account.status.${o.status}`)}</span>
                        <p className="font-medium">{price(o.subtotal)}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-4">
                      {o.items.map((it) => {
                        const w = { id: it.watchId, ref: it.ref, model: it.model, imageUrl: it.imageUrl, brand: { name: it.brandName, slug: it.brandSlug } }
                        return (
                          <Link key={it.watchId} to={`/watch/${it.watchId}`} className="flex items-center gap-3 hover:text-gold-400">
                            <div className="h-16 w-12 rounded-xl bg-midnight-900"><WatchVisual watch={w} className="h-full w-full" /></div>
                            <div>
                              <p className="text-[10px] uppercase tracking-wider text-gold-400" dir="ltr">{it.brandName}</p>
                              <p className="text-sm" dir="ltr">{it.model}{it.quantity > 1 ? ` × ${it.quantity}` : ''}</p>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                    <p className="mt-4 flex items-center gap-1.5 text-xs text-muted"><MapPin className="h-3 w-3 text-gold-400" />{o.shippingCity} · {o.shippingAddress}</p>
                  </li>
                ))}
              </ul>
            ))}

            {tab === 'appointments' && (loading && !data ? <PanelSkeleton rows={3} /> : appts.length === 0 ? (
              <EmptyState icon={Calendar} title={t('account.noAppointments')} text={t('account.noAppointmentsText')} cta={t('hero.cta2')} to="/appointments" />
            ) : (
              <ul className="grid gap-4 md:grid-cols-2">
                {appts.map((a) => (
                  <li key={a.id} className="glass flex gap-5 rounded-3xl p-6">
                    <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-2xl border border-gold-400/40 bg-gold-400/5">
                      <span className="font-display text-3xl leading-none text-gold-400" dir="ltr">{a.date.slice(8)}</span>
                      <span className="mt-1 text-[10px] uppercase text-muted">{new Date(a.date + 'T12:00:00').toLocaleDateString(i18n.language === 'ar' ? 'ar-AE' : 'en-GB', { month: 'short' })}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-display text-2xl">{L(a.boutique.city, a.boutique.cityAr)}</p>
                        <span className="rounded-full bg-gold-400/15 px-2.5 py-1 text-[10px] uppercase tracking-wider text-gold-600 dark:text-gold-300">{t(`account.apptStatus.${a.status}`)}</span>
                      </div>
                      <p className="text-xs text-muted">{L(a.boutique.address, a.boutique.addressAr)}</p>
                      <p className="mt-2 text-sm" dir="ltr">{a.date} · {a.localTime}</p>
                      {a.watch && <Link to={`/watch/${a.watch.id}`} className="mt-1 block truncate text-xs text-gold-500 hover:underline dark:text-gold-300" dir="ltr">{a.watch.brandName} — {a.watch.model}</Link>}
                    </div>
                  </li>
                ))}
              </ul>
            ))}

            {tab === 'vip' && user && (
              <div className="grid gap-8 lg:grid-cols-2">
                <div className="flex flex-col gap-6">
                  <VipCard tier={tier} name={user.fullName} />
                  <div className="glass max-w-md rounded-3xl p-6">
                    <div className="flex justify-between text-sm"><span className="text-muted">{t('account.spent')}</span><span className="font-medium">{price(spent)}</span></div>
                    <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-gold-400/15">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }} className="h-full rounded-full bg-gradient-to-r from-gold-200 via-gold-400 to-gold-700" />
                    </div>
                    <p className="mt-3 text-xs text-muted">{next ? t('account.next', { amount: price(Math.max(0, next.min - spent)), tier: t(`account.tiers.${next.id.toLowerCase()}`) }) : t('account.maxTier')}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {TIERS.map((tr, i) => {
                    const perks = t(`account.perks.${tr.id.toLowerCase()}`, { returnObjects: true })
                    const unlocked = i <= tierIdx
                    return (
                      <div key={tr.id} className={`glass rounded-3xl p-6 transition ${i === tierIdx ? '!border-gold-400 shadow-glow' : ''} ${unlocked ? '' : 'opacity-60'}`}>
                        <div className="mb-3 flex items-center justify-between">
                          <span className={`rounded-full bg-gradient-to-r ${tr.grad} px-3 py-1 text-[10px] uppercase tracking-wide2 ${tr.text}`}>{t(`account.tiers.${tr.id.toLowerCase()}`)}</span>
                          <span className="text-xs text-muted">{price(tr.min)}+</span>
                        </div>
                        <ul className="space-y-2">
                          {(Array.isArray(perks) ? perks : []).map((p) => (
                            <li key={p} className="flex items-center gap-2 text-sm"><Check className={`h-4 w-4 ${unlocked ? 'text-gold-400' : 'text-muted'}`} />{p}</li>
                          ))}
                        </ul>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {tab === 'profile' && user && <Profile user={user} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </Page>
  )
}
