import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Plus, X, Scale, ShoppingBag } from 'lucide-react'
import WatchVisual from '../components/WatchVisual'
import { Page, EmptyState } from '../components/ui'
import { Shimmer } from '../components/Skeleton'
import { useStore, usePrice } from '../context/StoreContext'
import { useApi } from '../lib/useApi'

export default function Compare() {
  const { t } = useTranslation()
  const price = usePrice()
  const { compare, toggleCompare, addToBag } = useStore()
  const [picker, setPicker] = useState(false)
  const { data, loading } = useApi(compare.length ? `/watches?ids=${[...compare].sort((a, b) => a - b).join(',')}` : null)
  const byId = Object.fromEntries((data?.watches || []).map((w) => [w.id, w]))
  const items = compare.map((id) => byId[id]).filter(Boolean)
  const catalogue = useApi(picker ? '/watches?sort=featured' : null).data?.watches || []
  const brands = useApi('/brands').data?.brands || []

  const rows = [
    [t('compare.price'), (w) => <span className="font-medium text-gold-500 dark:text-gold-300">{price(w.price)}</span>],
    [t('product.reference'), (w) => <span dir="ltr">{w.ref}</span>],
    [t('product.caseSize'), (w) => <span dir="ltr">{w.caseSize} mm</span>],
    [t('product.material'), (w) => <span dir="ltr">{w.materialDetail || t(`materials.${w.material}`)}</span>],
    [t('product.movement'), (w) => t(`movements.${w.movement}`)],
    [t('product.calibre'), (w) => <span dir="ltr">{w.calibre || '—'}</span>],
    [t('product.water'), (w) => <span dir="ltr">{w.waterResistance} m</span>],
    [t('product.power'), (w) => (w.powerReserve ? t('product.hours', { n: w.powerReserve }) : '—')],
    [t('product.dial'), (w) => <span dir="ltr">{w.dial || '—'}</span>],
    [t('product.gender'), (w) => t(`genders.${w.gender}`)],
  ]

  const best = (key, fn = Math.max) => {
    const vals = items.map((w) => w[key] || 0)
    return items.length > 1 ? fn(...vals) : null
  }
  const bestWater = best('waterResistance')
  const bestPower = best('powerReserve')

  return (
    <Page>
      <div className="mx-auto max-w-7xl px-5 pt-14 md:px-8 md:pt-20">
        <p className="eyebrow mb-4">{t('compare.eyebrow')}</p>
        <h1 className="font-display text-5xl font-light md:text-7xl">{t('compare.title')}</h1>
        <p className="mt-4 text-sm text-muted">{t('compare.subtitle')}</p>

        {compare.length > 0 && loading && !items.length ? (
          <div className="mt-12 grid gap-4 md:grid-cols-3">{compare.map((id) => <Shimmer key={id} className="h-[380px] !rounded-3xl" />)}</div>
        ) : items.length === 0 ? (
          <div className="py-16">
            <EmptyState icon={Scale} title={t('compare.empty')} text={t('compare.emptyText')} cta={t('hero.cta')} />
          </div>
        ) : (
          <div className="no-scrollbar -mx-5 mt-12 overflow-x-auto px-5 md:mx-0 md:px-0">
            <div className="grid min-w-[720px] gap-4" style={{ gridTemplateColumns: `180px repeat(3, minmax(0,1fr))` }}>
              <div />
              {[0, 1, 2].map((i) => {
                const w = items[i]
                return (
                  <AnimatePresence key={i} mode="wait">
                    {w ? (
                      <motion.div key={w.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="glass relative flex flex-col items-center rounded-3xl p-5 text-center">
                        <button onClick={() => toggleCompare(w.id)} className="absolute end-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-gold-400/30 hover:border-gold-400" aria-label={t('compare.remove')}><X className="h-3.5 w-3.5" /></button>
                        <Link to={`/watch/${w.id}`}><WatchVisual watch={w} className="h-52 w-auto transition-transform duration-700 hover:scale-105" /></Link>
                        <p className="mt-3 text-[10px] uppercase tracking-luxe text-gold-400" dir="ltr">{w.brand.name}</p>
                        <p className="font-display text-xl leading-tight" dir="ltr">{w.model}</p>
                        <button onClick={() => addToBag(w)} disabled={w.stock <= 0} className="btn-gold mt-4 !px-4 !py-2.5 !text-[11px]"><ShoppingBag className="h-3.5 w-3.5" />{t('card.addBag')}</button>
                      </motion.div>
                    ) : (
                      <motion.button key={`empty-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setPicker(true)} className="flex min-h-[340px] flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-gold-400/30 text-muted transition hover:border-gold-400 hover:text-gold-400">
                        <Plus className="h-8 w-8" strokeWidth={1} />
                        <span className="text-xs uppercase tracking-wide2">{t('compare.add')}</span>
                      </motion.button>
                    )}
                  </AnimatePresence>
                )
              })}
              {rows.map(([label, render], r) => (
                <div key={r} className="contents">
                  <div className="flex items-center border-t border-gold-400/15 py-4 text-xs uppercase tracking-wider text-muted">{label}</div>
                  {[0, 1, 2].map((i) => {
                    const w = items[i]
                    const highlight = w && ((r === 6 && w.waterResistance === bestWater) || (r === 7 && w.powerReserve === bestPower))
                    return (
                      <div key={i} className={`flex items-center justify-center border-t border-gold-400/15 px-2 py-4 text-center text-sm ${highlight ? 'text-gold-500 dark:text-gold-300' : ''}`}>
                        {w ? render(w) : <span className="text-muted/50">—</span>}
                        {highlight && <span className="ms-1.5 text-[10px]">★</span>}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {picker && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPicker(false)} className="fixed inset-0 z-[90] flex items-end justify-center bg-black/70 backdrop-blur-sm md:items-center">
            <motion.div onClick={(e) => e.stopPropagation()} initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="glass-strong max-h-[80vh] w-full max-w-3xl overflow-y-auto rounded-t-[32px] p-6 md:rounded-[32px]">
              <div className="mb-4 flex items-center justify-between">
                <p className="font-display text-3xl">{t('compare.add')}</p>
                <button onClick={() => setPicker(false)} aria-label={t('common.close')}><X className="h-5 w-5" /></button>
              </div>
              {brands.map((b) => (
                <div key={b.slug} className="mb-5">
                  <p className="eyebrow mb-2" dir="ltr">{b.name}</p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {!catalogue.length && <Shimmer className="col-span-full h-16" />}
                    {catalogue.filter((w) => w.brand.slug === b.slug).map((w) => {
                      const sel = compare.includes(w.id)
                      return (
                        <button key={w.id} disabled={sel} onClick={() => { toggleCompare(w.id); setPicker(false) }} className={`flex items-center gap-2 rounded-xl border p-2 text-start text-xs transition ${sel ? 'border-gold-400 opacity-50' : 'border-gold-400/20 hover:border-gold-400'}`}>
                          <WatchVisual watch={w} className="h-12 w-9 shrink-0" />
                          <span className="line-clamp-2" dir="ltr">{w.model}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Page>
  )
}
