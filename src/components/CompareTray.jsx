import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { X, Scale } from 'lucide-react'
import WatchVisual from './WatchVisual'
import { useStore } from '../context/StoreContext'
import { useApi } from '../lib/useApi'

/** True when the floating compare tray is on screen (the WhatsApp button moves out of its way on phones). */
export function useCompareTrayVisible() {
  const { compare } = useStore()
  const { pathname } = useLocation()
  return compare.length > 0 && pathname !== '/compare' && !pathname.startsWith('/checkout') && pathname !== '/bag'
}

export default function CompareTray() {
  const { t } = useTranslation()
  const { compare, toggleCompare, setCompare } = useStore()
  const show = useCompareTrayVisible()
  const { data } = useApi(show ? `/watches?ids=${[...compare].sort((a, b) => a - b).join(',')}` : null)
  const byId = Object.fromEntries((data?.watches || []).map((w) => [w.id, w]))

  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{ y: 120, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 120, opacity: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-3 bottom-[76px] z-[64] md:inset-x-auto md:bottom-8 md:end-28">
          <div className="glass-strong flex items-center gap-3 rounded-2xl p-2.5 pe-3 shadow-gold">
            <div className="flex -space-x-2 rtl:space-x-reverse">
              {compare.map((id) => (
                <div key={id} className="group relative h-12 w-12 overflow-hidden rounded-xl border border-gold-400/30 bg-midnight-900">
                  {byId[id] ? <WatchVisual watch={byId[id]} className="h-full w-full scale-150" /> : <div className="h-full w-full animate-pulse bg-gold-400/10" />}
                  <button onClick={() => toggleCompare(id)} className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition group-hover:opacity-100" aria-label={t('compare.remove')}>
                    <X className="h-4 w-4 text-white" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex-1 ps-1 text-xs">
              <p className="font-medium">{t('compare.tray', { n: compare.length })}</p>
              <button onClick={() => setCompare([])} className="text-muted hover:text-gold-400">{t('compare.clear')}</button>
            </div>
            <Link to="/compare" className="btn-gold !px-4 !py-2.5 !text-[11px]"><Scale className="h-3.5 w-3.5" />{t('compare.view')}</Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
