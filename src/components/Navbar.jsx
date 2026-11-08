import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ShoppingBag, Heart, User, Sun, Moon, Search, ChevronDown, Languages, ArrowRight, X, LogOut, Crown } from 'lucide-react'
import Logo from './Logo'
import WatchVisual from './WatchVisual'
import { Shimmer } from './Skeleton'
import { useStore, useLocalized } from '../context/StoreContext'
import { currencies } from '../config/currency'
import { getBrandStyle } from '../config/looks'
import { useApi } from '../lib/useApi'

export const TIER_STYLE = {
  Silver: 'from-zinc-300 via-zinc-100 to-zinc-400 text-midnight-950',
  Gold: 'from-[#f4e3b5] via-[#d4ad62] to-[#8a5a2b] text-midnight-950',
  Black: 'from-midnight-950 via-midnight-700 to-black text-gold-300 ring-1 ring-gold-400/50',
}

export function TierBadge({ tier, className = '' }) {
  const { t } = useTranslation()
  return (
    <span className={`inline-flex items-center gap-1 rounded-full bg-gradient-to-r px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${TIER_STYLE[tier] || TIER_STYLE.Silver} ${className}`}>
      <Crown className="h-2.5 w-2.5" strokeWidth={2} />{t(`account.tiers.${String(tier).toLowerCase()}`)}
    </span>
  )
}

function UserMenu() {
  const { t } = useTranslation()
  const { user, authReady, logout } = useStore()
  if (!authReady) return <Shimmer className="hidden h-8 w-24 !rounded-full md:block" />
  if (!user) {
    return (
      <Link to="/login" className="hidden items-center gap-1.5 rounded-full border border-gold-400/40 px-3.5 py-1.5 text-[11px] uppercase tracking-wider text-gold-500 transition hover:border-gold-400 hover:bg-gold-400/10 dark:text-gold-300 md:inline-flex">
        <User className="h-3.5 w-3.5" strokeWidth={1.6} />{t('nav.signIn')}
      </Link>
    )
  }
  return (
    <div className="hidden items-center gap-1 md:flex">
      <Link to="/account" className="group flex items-center gap-2 rounded-full py-1 pe-2 ps-1 transition hover:bg-gold-400/10" aria-label={t('nav.account')}>
        <span className="flex h-7 w-7 items-center justify-center rounded-full border border-gold-400/50 font-display text-sm text-gold-400">{user.fullName.charAt(0)}</span>
        <span className="flex flex-col items-start leading-none">
          <span className="max-w-[110px] truncate text-xs">{user.fullName.split(' ')[0]}</span>
          <TierBadge tier={user.vipTier} className="mt-1 !px-1.5 !text-[8px]" />
        </span>
      </Link>
      <button onClick={logout} className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition hover:bg-gold-400/10 hover:text-gold-400" aria-label={t('nav.signOut')} title={t('nav.signOut')}>
        <LogOut className="h-4 w-4 rtl:rotate-180" strokeWidth={1.5} />
      </button>
    </div>
  )
}

function CurrencySelect({ compact = false }) {
  const { currency, setCurrency } = useStore()
  const { t } = useTranslation()
  return (
    <label className="relative flex items-center">
      <span className="sr-only">{t('common.currency')}</span>
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        className={`cursor-pointer appearance-none rounded-full border border-gold-400/30 bg-transparent py-1.5 pe-7 ps-3 text-xs font-medium tracking-wider text-fg outline-none transition hover:border-gold-400 ${compact ? 'py-1' : ''}`}
      >
        {Object.keys(currencies).map((c) => (
          <option key={c} value={c} className="bg-midnight-900 text-ivory-100">{c}</option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute end-2 h-3 w-3 text-gold-400" />
    </label>
  )
}

function LangToggle() {
  const { i18n } = useTranslation()
  const isAr = i18n.language === 'ar'
  return (
    <button
      onClick={() => i18n.changeLanguage(isAr ? 'en' : 'ar')}
      className="flex items-center gap-1.5 rounded-full border border-gold-400/30 px-3 py-1.5 text-xs transition hover:border-gold-400"
      aria-label="Toggle language"
    >
      <Languages className="h-3.5 w-3.5 text-gold-400" strokeWidth={1.5} />
      <span className={isAr ? 'font-sans' : 'font-arabic'}>{isAr ? 'EN' : 'عربي'}</span>
    </button>
  )
}

function ThemeToggle() {
  const { theme, setTheme } = useStore()
  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="relative flex h-8 w-8 items-center justify-center rounded-full border border-gold-400/30 transition hover:border-gold-400"
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={theme} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.3 }}>
          {theme === 'dark' ? <Sun className="h-3.5 w-3.5 text-gold-400" /> : <Moon className="h-3.5 w-3.5 text-gold-600" />}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}

function SearchOverlay({ open, onClose }) {
  const { t } = useTranslation()
  const [q, setQ] = useState('')
  const navigate = useNavigate()
  const ref = useRef(null)
  useEffect(() => {
    if (open) setTimeout(() => ref.current?.focus(), 100)
  }, [open])
  const submit = (e) => {
    e.preventDefault()
    navigate(`/shop?q=${encodeURIComponent(q)}`)
    onClose()
    setQ('')
  }
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[90] bg-midnight-950/80 backdrop-blur-xl" onClick={onClose}>
          <motion.form
            onSubmit={submit}
            onClick={(e) => e.stopPropagation()}
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-28 flex max-w-2xl items-center gap-4 border-b border-gold-400/40 px-6 pb-4"
          >
            <Search className="h-6 w-6 text-gold-400" strokeWidth={1.2} />
            <input ref={ref} value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('nav.search')} className="flex-1 bg-transparent font-display text-3xl font-light text-ivory-100 outline-none placeholder:text-ivory-100/30 md:text-4xl" />
            <button type="button" onClick={onClose} className="text-ivory-100/60 hover:text-gold-300" aria-label={t('common.close')}>
              <X className="h-6 w-6" />
            </button>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function Navbar() {
  const { t } = useTranslation()
  const L = useLocalized()
  const { bagCount, wishlist, user } = useStore()
  const { data: brandData } = useApi('/brands')
  const brands = brandData?.brands || []
  const [mega, setMega] = useState(false)
  const [hoverSlug, setHoverBrand] = useState(null)
  const hoverBrand = hoverSlug || brands[0]?.slug
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const location = useLocation()
  const timer = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => setMega(false), [location.pathname])

  const openMega = () => { clearTimeout(timer.current); setMega(true) }
  const closeMega = () => { timer.current = setTimeout(() => setMega(false), 180) }

  const hb = brands.find((b) => b.slug === hoverBrand)
  const featuredWatch = hb?.hero

  const linkCls = ({ isActive }) =>
    `relative py-2 text-[12px] uppercase tracking-wide2 transition-colors duration-300 hover:text-gold-400 ${isActive ? 'text-gold-400' : 'text-fg/80'}`

  return (
    <>
      <header className={`sticky top-0 z-[60] transition-all duration-700 ${scrolled || mega ? 'glass-strong shadow-[0_10px_40px_-20px_rgba(0,0,0,0.6)]' : 'bg-transparent'}`} style={scrolled || mega ? { borderWidth: '0 0 1px 0' } : undefined}>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:h-20 md:px-8">
          <Logo />

          {/* desktop links */}
          <nav className="hidden items-center gap-6 lg:flex xl:gap-9">
            <NavLink to="/" end className={linkCls}>{t('nav.home')}</NavLink>
            <div onMouseEnter={openMega} onMouseLeave={closeMega} className="relative">
              <button onClick={() => setMega((m) => !m)} className={`flex items-center gap-1 py-2 text-[12px] uppercase tracking-wide2 transition-colors hover:text-gold-400 ${mega || location.pathname.startsWith('/brands') ? 'text-gold-400' : 'text-fg/80'}`} aria-expanded={mega}>
                {t('nav.brands')} <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-500 ${mega ? 'rotate-180' : ''}`} />
              </button>
            </div>
            <NavLink to="/shop" className={linkCls}>{t('nav.shop')}</NavLink>
            <NavLink to="/compare" className={linkCls}>{t('nav.compare')}</NavLink>
            <NavLink to="/appointments" className={linkCls}>{t('nav.appointments')}</NavLink>
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            <div className="hidden items-center gap-2 md:flex">
              <CurrencySelect />
              <LangToggle />
              <ThemeToggle />
            </div>
            <button onClick={() => setSearchOpen(true)} className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-gold-400/10" aria-label={t('nav.search')}>
              <Search className="h-[18px] w-[18px]" strokeWidth={1.4} />
            </button>
            <Link to="/account?tab=wishlist" className="relative hidden h-9 w-9 items-center justify-center rounded-full transition hover:bg-gold-400/10 md:flex" aria-label={t('nav.wishlist')}>
              <Heart className="h-[18px] w-[18px]" strokeWidth={1.4} />
              {wishlist.length > 0 && <span className="absolute -end-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold-400 px-1 text-[9px] font-semibold text-midnight-950">{wishlist.length}</span>}
            </Link>
            <UserMenu />
            <Link to="/bag" className="relative flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-gold-400/10" aria-label={t('nav.bag')}>
              <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.4} />
              <AnimatePresence>
                {bagCount > 0 && (
                  <motion.span key="bag-badge" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="absolute -end-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold-400 px-1 text-[9px] font-semibold text-midnight-950">
                    <motion.span key={bagCount} initial={{ scale: 1.8 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 15 }}>{bagCount}</motion.span>
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </div>
        </div>

        {/* mobile settings row */}
        <div className="flex items-center justify-end gap-2 px-4 pb-2 md:hidden">
          {user ? (
            <Link to="/account" className="me-auto flex items-center gap-1.5 text-xs">
              <span className="max-w-[90px] truncate">{user.fullName.split(' ')[0]}</span>
              <TierBadge tier={user.vipTier} />
            </Link>
          ) : (
            <Link to="/login" className="me-auto text-[11px] uppercase tracking-wider text-gold-500 dark:text-gold-300">{t('nav.signIn')}</Link>
          )}
          <CurrencySelect compact />
          <LangToggle />
          <ThemeToggle />
        </div>

        {/* mega menu */}
        <AnimatePresence>
          {mega && (
            <motion.div
              onMouseEnter={openMega}
              onMouseLeave={closeMega}
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-0 top-full hidden lg:block"
            >
              <div className="glass-strong tex-velvet border-t-0 !bg-[rgb(var(--bg)/0.97)]">
                <div className="mx-auto grid max-w-7xl grid-cols-12 gap-10 px-8 py-10">
                  <div className="col-span-3">
                    <p className="eyebrow mb-2">{t('mega.title')}</p>
                    <p className="mb-6 text-sm text-muted">{t('mega.subtitle')}</p>
                    <Link to="/shop" className="group inline-flex items-center gap-2 text-xs uppercase tracking-wide2 text-gold-400">
                      {t('mega.viewAll')} <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                    </Link>
                  </div>
                  <ul className="col-span-5 space-y-1">
                    {!brands.length && Array.from({ length: 5 }, (_, i) => <li key={i} className="py-3"><Shimmer className="h-8 w-2/3" /></li>)}
                    {brands.map((b) => (
                      <li key={b.slug}>
                        <Link
                          to={`/brands/${b.slug}`}
                          onMouseEnter={() => setHoverBrand(b.slug)}
                          className={`group flex items-baseline justify-between border-b border-gold-400/10 py-3 transition-all duration-500 ${hoverBrand === b.slug ? 'ps-3 text-gold-400' : ''}`}
                        >
                          <span className="font-display text-3xl font-light" dir="ltr">{b.name}</span>
                          <span className="text-[10px] uppercase tracking-wide2 text-muted">{t('mega.since')} {b.founded}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div className="col-span-4">
                    <AnimatePresence mode="wait">
                      {featuredWatch && hb && <motion.div key={hoverBrand} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4 }} className="glass flex h-full items-center gap-5 rounded-3xl p-5">
                        <WatchVisual watch={featuredWatch} className="h-44 w-auto shrink-0" />
                        <div>
                          <p className="eyebrow mb-2">{t('mega.featured')}</p>
                          <p className="font-display text-2xl leading-tight" dir="ltr">{featuredWatch.model}</p>
                          <p className="mt-2 text-xs italic text-muted">“{L(getBrandStyle(hb.slug).tagline)}”</p>
                          <Link to={`/watch/${featuredWatch.id}`} className="mt-4 inline-flex items-center gap-1 text-xs uppercase tracking-wide2 text-gold-400 hover:underline">
                            {t('home.discover')} <ArrowRight className="h-3 w-3 rtl:rotate-180" />
                          </Link>
                        </div>
                      </motion.div>}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
