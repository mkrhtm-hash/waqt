import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Heart, ShieldCheck, Scale, ShoppingBag } from 'lucide-react'
import WatchVisual from './WatchVisual'
import { useStore, usePrice } from '../context/StoreContext'

export function StockBadge({ stock, className = '' }) {
  const { t } = useTranslation()
  if (stock > 2) return null
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] uppercase tracking-wider ${stock <= 0 ? 'bg-red-500/15 text-red-400' : 'bg-gold-400/15 text-gold-600 dark:text-gold-300'} ${className}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${stock <= 0 ? 'bg-red-400' : 'animate-pulse bg-gold-400'}`} />
      {stock <= 0 ? t('stock.out') : t('stock.only', { n: stock })}
    </span>
  )
}

const WatchCard = forwardRef(function WatchCard({ watch, index = 0 }, ref) {
  const { t } = useTranslation()
  const price = usePrice()
  const { wishIds, toggleWish, compare, toggleCompare, addToBag } = useStore()
  const wished = wishIds.has(watch.id)
  const comparing = compare.includes(watch.id)
  const isNew = new Date(watch.createdAt).getFullYear() >= 2025
  const soldOut = watch.stock <= 0

  return (
    <motion.article
      ref={ref}
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.7, delay: Math.min(index, 8) * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="glass group relative flex flex-col overflow-hidden rounded-[28px] transition-all duration-700 hover:-translate-y-1 hover:border-gold-400/50 hover:shadow-glow"
    >
      <div className="absolute end-3 top-3 z-10 flex flex-col gap-2">
        <motion.button whileTap={{ scale: 0.8 }} onClick={() => toggleWish(watch)} className={`flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md transition-all duration-300 ${wished ? 'bg-gold-400 text-midnight-950' : 'bg-black/30 text-ivory-100 hover:bg-gold-400/80 hover:text-midnight-950'}`} aria-label={t('product.addWish')} aria-pressed={wished}>
          <motion.span key={String(wished)} initial={{ scale: 0.4 }} animate={{ scale: [0.4, 1.35, 1] }} transition={{ duration: 0.45 }} className="flex">
            <Heart className="h-4 w-4" fill={wished ? 'currentColor' : 'none'} strokeWidth={1.6} />
          </motion.span>
        </motion.button>
        <button onClick={() => toggleCompare(watch.id)} className={`flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md transition-all duration-300 ${comparing ? 'bg-gold-400 text-midnight-950' : 'bg-black/30 text-ivory-100 hover:bg-gold-400/80 hover:text-midnight-950'}`} aria-label={t('card.compare')} aria-pressed={comparing}>
          <Scale className="h-4 w-4" strokeWidth={1.6} />
        </button>
      </div>
      {isNew && <span className="absolute start-4 top-4 z-10 rounded-full border border-gold-400/50 bg-black/30 px-2.5 py-1 text-[9px] uppercase tracking-wide2 text-gold-300 backdrop-blur-md">{t('card.new')}</span>}

      <Link to={`/watch/${watch.id}`} className="relative block overflow-hidden">
        <div className="relative flex aspect-[4/5] items-center justify-center bg-gradient-to-b from-midnight-700/80 via-midnight-900 to-midnight-950">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(212,173,98,0.18),transparent_60%)] opacity-70 transition-opacity duration-700 group-hover:opacity-100" />
          <div className="absolute bottom-6 h-6 w-1/2 rounded-[50%] bg-black/60 blur-xl" />
          <WatchVisual watch={watch} className={`relative h-[86%] w-auto transition-transform duration-[1200ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.08] group-hover:-rotate-2 ${soldOut ? 'opacity-60 grayscale-[40%]' : ''}`} />
          <StockBadge stock={watch.stock} className="absolute bottom-3 start-3 backdrop-blur-md" />
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-1 p-5">
        <p className="text-[10px] uppercase tracking-luxe text-gold-500 dark:text-gold-400" dir="ltr">{watch.brand.name}</p>
        <Link to={`/watch/${watch.id}`} className="font-display text-[22px] leading-tight transition-colors hover:text-gold-400" dir="ltr">{watch.model}</Link>
        <p className="text-xs text-muted">{t('card.ref')} <span dir="ltr">{watch.ref}</span></p>
        <div className="mt-3 flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-emerald-500 dark:text-emerald-400">
          <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.6} /> {t('card.authentic')}
        </div>
        <div className="mt-auto flex items-end justify-between pt-4">
          <p className="text-lg font-medium tracking-wide">{price(watch.price)}</p>
          <button onClick={() => addToBag(watch)} disabled={soldOut} className="flex h-10 w-10 items-center justify-center rounded-full border border-gold-400/40 text-gold-400 transition-all duration-500 hover:bg-gold-400 hover:text-midnight-950 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gold-400" aria-label={t('card.addBag')}>
            <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </motion.article>
  )
})

export default WatchCard
