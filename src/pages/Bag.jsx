import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Minus, Plus, Trash2, ShoppingBag, Lock, Truck, ArrowRight } from 'lucide-react'
import WatchVisual from '../components/WatchVisual'
import { StockBadge } from '../components/WatchCard'
import { Page, EmptyState } from '../components/ui'
import { useStore, usePrice } from '../context/StoreContext'

export function OrderSummary({ children, compact = false }) {
  const { t } = useTranslation()
  const price = usePrice()
  const { cart, bagTotal } = useStore()
  const vat = bagTotal - bagTotal / 1.05
  return (
    <div className="glass rounded-3xl p-6 md:p-8">
      <h2 className="font-display text-2xl">{t('checkout.summary')}</h2>
      {compact && (
        <ul className="mt-5 space-y-3">
          {cart.map(({ watchId, quantity, watch }) => (
            <li key={watchId} className="flex items-center gap-3">
              <div className="relative h-16 w-12 shrink-0 rounded-xl bg-midnight-900">
                <WatchVisual watch={watch} className="h-full w-full" />
                <span className="absolute -end-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gold-400 text-[10px] font-semibold text-midnight-950">{quantity}</span>
              </div>
              <p className="flex-1 text-sm leading-tight" dir="ltr">{watch.model}</p>
              <p className="text-sm">{price(watch.price * quantity)}</p>
            </li>
          ))}
        </ul>
      )}
      <dl className="mt-6 space-y-3 border-t border-gold-400/15 pt-5 text-sm">
        <div className="flex justify-between"><dt className="text-muted">{t('bag.subtotal')}</dt><dd>{price(bagTotal)}</dd></div>
        <div className="flex justify-between"><dt className="flex items-center gap-1.5 text-muted"><Truck className="h-3.5 w-3.5 text-gold-400" />{t('bag.delivery')}</dt><dd className="text-emerald-600 dark:text-emerald-400">{t('bag.free')}</dd></div>
        <div className="flex justify-between"><dt className="text-muted">{t('bag.vat')}</dt><dd className="text-muted">{price(vat)}</dd></div>
        <div className="flex items-baseline justify-between border-t border-gold-400/15 pt-4">
          <dt className="text-xs uppercase tracking-wide2">{t('bag.total')}</dt>
          <dd className="font-display text-3xl text-gold-gradient">{price(bagTotal)}</dd>
        </div>
      </dl>
      {children}
      <p className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-muted"><Lock className="h-3 w-3" />{t('bag.secure')}</p>
    </div>
  )
}

export default function Bag() {
  const { t } = useTranslation()
  const price = usePrice()
  const { cart, updateQty, removeFromBag } = useStore()
  const blocked = cart.some((x) => x.quantity > x.watch.stock)

  return (
    <Page>
      <div className="mx-auto max-w-7xl px-5 pt-14 md:px-8 md:pt-20">
        <h1 className="mb-10 font-display text-5xl font-light md:text-7xl">{t('bag.title')}</h1>
        {cart.length === 0 ? (
          <EmptyState icon={ShoppingBag} title={t('bag.empty')} text={t('bag.emptyText')} cta={t('hero.cta')} />
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
            <ul className="space-y-4">
              <AnimatePresence initial={false}>
                {cart.map(({ watchId, quantity, watch }) => (
                  <motion.li key={watchId} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -60 }} transition={{ duration: 0.5 }} className="glass flex gap-4 rounded-3xl p-4 md:gap-6 md:p-5">
                    <Link to={`/watch/${watchId}`} className="flex h-32 w-24 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-b from-midnight-700 to-midnight-950 md:h-40 md:w-32">
                      <WatchVisual watch={watch} className="h-[92%] w-auto" />
                    </Link>
                    <div className="flex flex-1 flex-col">
                      <p className="text-[10px] uppercase tracking-luxe text-gold-400" dir="ltr">{watch.brand.name}</p>
                      <Link to={`/watch/${watchId}`} className="font-display text-xl leading-tight hover:text-gold-400 md:text-2xl" dir="ltr">{watch.model}</Link>
                      <p className="text-xs text-muted">{t('card.ref')} <span dir="ltr">{watch.ref}</span></p>
                      <StockBadge stock={watch.stock} className="mt-2 self-start" />
                      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
                        <div className="flex items-center rounded-full border border-gold-400/30">
                          <button onClick={() => updateQty(watchId, quantity - 1)} className="p-2.5 hover:text-gold-400" aria-label="−"><Minus className="h-3.5 w-3.5" /></button>
                          <span className="w-6 text-center text-sm">{quantity}</span>
                          <button onClick={() => updateQty(watchId, quantity + 1)} disabled={quantity >= Math.min(watch.stock, 5)} className="p-2.5 hover:text-gold-400 disabled:opacity-30" aria-label="+"><Plus className="h-3.5 w-3.5" /></button>
                        </div>
                        <p className="font-medium">{price(watch.price * quantity)}</p>
                      </div>
                    </div>
                    <button onClick={() => removeFromBag(watchId)} className="self-start p-1 text-muted transition hover:text-red-400" aria-label={t('bag.remove')}><Trash2 className="h-4 w-4" strokeWidth={1.4} /></button>
                  </motion.li>
                ))}
              </AnimatePresence>
              <Link to="/shop" className="inline-flex items-center gap-2 pt-2 text-xs uppercase tracking-wide2 text-gold-500 hover:underline">{t('bag.continue')}</Link>
            </ul>
            <div className="lg:sticky lg:top-28 lg:self-start">
              <OrderSummary>
                {blocked && <p className="mt-5 rounded-2xl border border-red-400/30 bg-red-500/10 p-3 text-xs text-red-300">{t('errors.not_enough_stock')}</p>}
                <Link to="/checkout" aria-disabled={blocked} onClick={(e) => blocked && e.preventDefault()} className={`btn-gold mt-6 w-full !py-4 ${blocked ? 'pointer-events-none opacity-50' : ''}`}>{t('bag.checkout')} <ArrowRight className="h-4 w-4 rtl:rotate-180" /></Link>
                <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-muted">
                  {['VISA', 'Mastercard', 'Apple Pay', 'tabby', 'tamara'].map((p) => (
                    <span key={p} className="rounded-md border border-gold-400/20 px-2 py-1" dir="ltr">{p}</span>
                  ))}
                </div>
              </OrderSummary>
            </div>
          </div>
        )}
      </div>
    </Page>
  )
}
