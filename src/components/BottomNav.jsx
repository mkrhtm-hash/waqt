import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Home, Watch, Calendar, ShoppingBag, User } from 'lucide-react'
import { motion } from 'framer-motion'
import { useStore } from '../context/StoreContext'

export default function BottomNav() {
  const { t } = useTranslation()
  const { bagCount } = useStore()
  const items = [
    { to: '/', icon: Home, label: t('nav.home'), end: true },
    { to: '/shop', icon: Watch, label: t('nav.shop') },
    { to: '/appointments', icon: Calendar, label: t('nav.appointments') },
    { to: '/bag', icon: ShoppingBag, label: t('nav.bag'), badge: bagCount },
    { to: '/account', icon: User, label: t('nav.account') },
  ]
  return (
    <nav className="glass-strong pb-safe fixed inset-x-0 bottom-0 z-[65] md:hidden" style={{ borderWidth: '1px 0 0 0' }}>
      <ul className="grid grid-cols-5">
        {items.map(({ to, icon: Icon, label, end, badge }) => (
          <li key={to}>
            <NavLink to={to} end={end} className={({ isActive }) => `relative flex flex-col items-center gap-1 py-2.5 text-[10px] tracking-wide transition-colors ${isActive ? 'text-gold-400' : 'text-muted'}`}>
              {({ isActive }) => (
                <>
                  {isActive && <motion.span layoutId="bn-dot" className="absolute top-0 h-0.5 w-8 rounded-full bg-gold-400" />}
                  <span className="relative">
                    <Icon className="h-5 w-5" strokeWidth={isActive ? 1.8 : 1.4} />
                    {badge > 0 && <span className="absolute -end-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold-400 px-1 text-[9px] font-semibold text-midnight-950">{badge}</span>}
                  </span>
                  <span className="max-w-full truncate px-1">{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
