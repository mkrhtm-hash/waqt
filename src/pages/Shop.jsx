import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { SlidersHorizontal, X, Search, Watch } from 'lucide-react'
import WatchCard from '../components/WatchCard'
import { Page, EmptyState } from '../components/ui'
import { GridSkeleton } from '../components/Skeleton'
import { PRICE_MIN, PRICE_MAX } from '../config/currency'
import { usePrice, useStore } from '../context/StoreContext'
import { useApi } from '../lib/useApi'
import { qs } from '../lib/api'

const MATERIALS = ['Steel', 'Gold', 'Rose Gold', 'Platinum', 'Two-Tone']
const MOVEMENTS = ['Automatic', 'Manual', 'Quartz']
const SORT_PARAM = { featured: 'featured', new: 'newest', low: 'price_asc', high: 'price_desc' }

function useDebounced(value, ms) {
  const [v, setV] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setV(value), ms)
    return () => clearTimeout(id)
  }, [value, ms])
  return v
}

function Chips({ options, value, onChange, labels }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = value.includes(o)
        return (
          <button key={o} onClick={() => onChange(active ? value.filter((v) => v !== o) : [...value, o])} className={`chip ${active ? 'chip-active' : 'hover:border-gold-400/60'}`} aria-pressed={active}>
            {labels ? labels(o) : o}
          </button>
        )
      })}
    </div>
  )
}

function FilterGroup({ title, children }) {
  return (
    <div className="border-b border-gold-400/15 py-5">
      <p className="mb-3 text-[11px] uppercase tracking-wide2 text-muted">{title}</p>
      {children}
    </div>
  )
}

export default function Shop() {
  const { t } = useTranslation()
  const price = usePrice()
  const { errorText } = useStore()
  const brands = useApi('/brands').data?.brands || []
  const [params, setParams] = useSearchParams()
  const [brandF, setBrandF] = useState(() => (params.get('brand') ? [params.get('brand')] : []))
  const [maxPrice, setMaxPrice] = useState(PRICE_MAX)
  const [sizes, setSizes] = useState([])
  const [materials, setMaterials] = useState([])
  const [movements, setMovements] = useState([])
  const [gender, setGender] = useState('all')
  const [sort, setSort] = useState('featured')
  const [q, setQ] = useState(params.get('q') || '')
  const [drawer, setDrawer] = useState(false)

  useEffect(() => {
    const b = params.get('brand')
    if (b) setBrandF([b])
    const qq = params.get('q')
    if (qq !== null) setQ(qq)
  }, [params])

  useEffect(() => {
    document.body.style.overflow = drawer ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawer])

  // all filtering + sorting happens in the database (/api/watches)
  const debouncedPrice = useDebounced(maxPrice, 300)
  const debouncedQ = useDebounced(q.trim(), 300)
  const path = '/watches' + qs({
    brand: [...brandF].sort(),
    maxPrice: debouncedPrice < PRICE_MAX ? debouncedPrice : undefined,
    size: [...sizes].sort(),
    material: [...materials].sort(),
    movement: [...movements].sort(),
    gender: gender === 'all' ? undefined : gender,
    q: debouncedQ,
    sort: SORT_PARAM[sort],
  })
  const { data, loading, error, reload } = useApi(path)
  const filtered = data?.watches || []
  const firstLoad = loading && !data

  const activeCount = brandF.length + sizes.length + materials.length + movements.length + (gender !== 'all') + (maxPrice < PRICE_MAX) + (q ? 1 : 0)
  const clearAll = () => {
    setBrandF([]); setMaxPrice(PRICE_MAX); setSizes([]); setMaterials([]); setMovements([]); setGender('all'); setQ('')
    setParams({})
  }

  const filters = (
    <div>
      <div className="relative mb-2">
        <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('nav.search')} className="input-luxe ps-10" />
      </div>
      <FilterGroup title={t('shop.brand')}>
        <Chips options={brands.map((b) => b.slug)} value={brandF} onChange={setBrandF} labels={(s) => <span dir="ltr">{brands.find((b) => b.slug === s)?.name}</span>} />
      </FilterGroup>
      <FilterGroup title={t('shop.price')}>
        <input type="range" min={PRICE_MIN} max={PRICE_MAX} step={5000} value={maxPrice} onChange={(e) => setMaxPrice(+e.target.value)} className="w-full" aria-label={t('shop.price')} />
        <div className="mt-2 flex justify-between text-xs text-muted">
          <span>{price(PRICE_MIN)}</span>
          <span className="text-gold-500 dark:text-gold-300">{t('shop.upTo')} {price(maxPrice)}</span>
        </div>
      </FilterGroup>
      <FilterGroup title={t('shop.size')}>
        <Chips options={['small', 'medium', 'large']} value={sizes} onChange={setSizes} labels={(s) => t(`sizes.${s}`)} />
      </FilterGroup>
      <FilterGroup title={t('shop.material')}>
        <Chips options={MATERIALS} value={materials} onChange={setMaterials} labels={(s) => t(`materials.${s}`)} />
      </FilterGroup>
      <FilterGroup title={t('shop.movement')}>
        <Chips options={MOVEMENTS} value={movements} onChange={setMovements} labels={(s) => t(`movements.${s}`)} />
      </FilterGroup>
      <FilterGroup title={t('shop.gender')}>
        <div className="flex gap-2">
          {['all', 'Men', 'Women'].map((g) => (
            <button key={g} onClick={() => setGender(g)} className={`chip ${gender === g ? 'chip-active' : ''}`}>{g === 'all' ? t('shop.all') : t(`genders.${g}`)}</button>
          ))}
        </div>
      </FilterGroup>
      {activeCount > 0 && <button onClick={clearAll} className="mt-5 text-xs uppercase tracking-wide2 text-gold-500 underline-offset-4 hover:underline">{t('shop.clear')}</button>}
    </div>
  )

  return (
    <Page>
      <section className="relative overflow-hidden">
        <div className="tex-marble absolute inset-0 -z-10 opacity-70" />
        <div className="mx-auto max-w-7xl px-5 pb-10 pt-14 md:px-8 md:pt-20">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="eyebrow mb-4">{t('shop.eyebrow')}</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} className="font-display text-5xl font-light leading-none md:text-7xl">{t('shop.title')}</motion.h1>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="sticky top-[104px] z-30 -mx-5 mb-6 flex items-center justify-between gap-3 px-5 py-3 backdrop-blur-xl md:top-20 md:mx-0 md:rounded-2xl md:px-0 md:backdrop-blur-none">
          <button onClick={() => setDrawer(true)} className="chip !py-2.5 lg:hidden">
            <SlidersHorizontal className="h-3.5 w-3.5" /> {t('shop.filters')}
            {activeCount > 0 && <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-gold-400 px-1 text-[9px] text-midnight-950">{activeCount}</span>}
          </button>
          <p className="hidden text-sm text-muted lg:block">{t('shop.results', { count: filtered.length })}</p>
          <label className="flex items-center gap-2 text-xs">
            <span className="hidden text-muted sm:inline">{t('shop.sort')}</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="cursor-pointer rounded-full border border-gold-400/30 bg-transparent px-4 py-2.5 text-xs outline-none focus:border-gold-400">
              <option className="bg-midnight-900 text-ivory-100" value="featured">{t('shop.sortFeatured')}</option>
              <option className="bg-midnight-900 text-ivory-100" value="new">{t('shop.sortNew')}</option>
              <option className="bg-midnight-900 text-ivory-100" value="low">{t('shop.sortLow')}</option>
              <option className="bg-midnight-900 text-ivory-100" value="high">{t('shop.sortHigh')}</option>
            </select>
          </label>
        </div>

        <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
          <aside className="hidden lg:block">
            <div className="glass no-scrollbar sticky top-40 max-h-[calc(100vh-11rem)] overflow-y-auto rounded-3xl p-6">{filters}</div>
          </aside>
          <div>
            <p className="mb-4 text-sm text-muted lg:hidden">{t('shop.results', { count: filtered.length })}</p>
            {firstLoad ? (
              <GridSkeleton count={6} />
            ) : error && !data ? (
              <div className="glass mx-auto max-w-lg rounded-3xl p-10 text-center">
                <p className="font-display text-2xl">{t('errors.generic')}</p>
                <p className="mt-3 text-sm text-muted">{errorText(error)}</p>
                <button onClick={reload} className="btn-gold mt-6">{t('dbBanner.retry')}</button>
              </div>
            ) : filtered.length === 0 ? (
              <EmptyState icon={Watch} title={t('shop.emptyTitle')} text={t('shop.emptyText')} />
            ) : (
              <motion.div layout className={`grid grid-cols-1 gap-5 transition-opacity duration-500 sm:grid-cols-2 xl:grid-cols-3 ${loading ? 'opacity-50' : ''}`} aria-busy={loading}>
                <AnimatePresence mode="popLayout">
                  {filtered.map((w, i) => <WatchCard key={w.id} watch={w} index={i} />)}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* mobile drawer */}
      <AnimatePresence>
        {drawer && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDrawer(false)} className="fixed inset-0 z-[85] bg-black/60 backdrop-blur-sm lg:hidden" />
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="glass-strong fixed inset-x-0 bottom-0 z-[86] max-h-[88vh] overflow-y-auto rounded-t-[32px] p-6 pb-10 lg:hidden">
              <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-gold-400/40" />
              <div className="mb-2 flex items-center justify-between">
                <p className="font-display text-3xl">{t('shop.filters')}</p>
                <button onClick={() => setDrawer(false)} aria-label={t('common.close')}><X className="h-5 w-5" /></button>
              </div>
              {filters}
              <button onClick={() => setDrawer(false)} className="btn-gold mt-6 w-full">{t('shop.apply')} ({filtered.length})</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </Page>
  )
}
