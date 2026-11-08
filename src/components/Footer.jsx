import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight, Instagram, Youtube, MessageCircle } from 'lucide-react'
import Logo from './Logo'
import { useStore } from '../context/StoreContext'
import { useApi } from '../lib/useApi'

export default function Footer() {
  const { t } = useTranslation()
  const { toast } = useStore()
  const [email, setEmail] = useState('')
  const brands = useApi('/brands').data?.brands || []
  const subscribe = (e) => {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email)) return toast(t('toast.invalidEmail'), 'error')
    toast(t('footer.subscribed'))
    setEmail('')
  }
  const col = 'text-sm text-muted transition-colors hover:text-gold-400'
  return (
    <footer className="tex-marble relative mt-24 border-t border-gold-400/20 pb-28 md:pb-0">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <Logo />
            <p className="mt-3 font-display text-xl italic text-gold-500 dark:text-gold-300">Time, Perfected.</p>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">{t('footer.about')}</p>
            <div className="mt-6 flex gap-3">
              {[Instagram, Youtube, MessageCircle].map((I, i) => (
                <a key={i} href="#" onClick={(e) => e.preventDefault()} className="flex h-10 w-10 items-center justify-center rounded-full border border-gold-400/30 transition hover:border-gold-400 hover:bg-gold-400/10" aria-label="social">
                  <I className="h-4 w-4 text-gold-400" strokeWidth={1.4} />
                </a>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 md:col-span-5 md:grid-cols-3">
            <div>
              <p className="eyebrow mb-5">{t('footer.shop')}</p>
              <ul className="space-y-3">
                {brands.map((b) => (
                  <li key={b.slug}><Link to={`/brands/${b.slug}`} className={col} dir="ltr">{b.name}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow mb-5">{t('footer.service')}</p>
              <ul className="space-y-3">
                {['authenticity', 'shipping', 'returns', 'care'].map((k) => (
                  <li key={k}><Link to="/appointments" className={col}>{t(`footer.links.${k}`)}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow mb-5">{t('footer.company')}</p>
              <ul className="space-y-3">
                {['story', 'press', 'careers', 'contact'].map((k) => (
                  <li key={k}><Link to="/" className={col}>{t(`footer.links.${k}`)}</Link></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="md:col-span-3">
            <p className="eyebrow mb-5">{t('footer.newsletter')}</p>
            <p className="mb-5 text-sm text-muted">{t('footer.newsletterText')}</p>
            <form onSubmit={subscribe} className="flex items-center border-b border-gold-400/40 focus-within:border-gold-400">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t('footer.email')} className="flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-muted" />
              <button className="p-2 text-gold-400" aria-label={t('footer.subscribe')}><ArrowRight className="h-4 w-4 rtl:rotate-180" /></button>
            </form>
          </div>
        </div>
        <div className="gold-line my-10" />
        <div className="flex flex-col gap-3 text-xs text-muted md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} <span className="text-gold-gradient font-medium tracking-[0.3em]">WAQT</span>. {t('footer.rights')}</p>
          <p className="max-w-2xl md:text-end">{t('footer.disclaimer')}</p>
        </div>
      </div>
    </footer>
  )
}
