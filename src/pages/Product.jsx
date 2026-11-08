import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Heart, ShoppingBag, Calendar, ShieldCheck, Package, Award, Truck, Scale, X, ZoomIn, Watch } from 'lucide-react'
import WatchVisual from '../components/WatchVisual'
import WatchCard, { StockBadge } from '../components/WatchCard'
import { ProductSkeleton } from '../components/Skeleton'
import { Page, Reveal, EmptyState, SectionHeading } from '../components/ui'
import { useStore, usePrice, useLocalized } from '../context/StoreContext'
import { useApi } from '../lib/useApi'

const VIEWS = ['front', 'detail', 'profile', 'velvet']

function ViewRender({ view, watch, className = '' }) {
  if (view === 'detail') {
    return (
      <div className={`flex h-full w-full items-center justify-center overflow-hidden ${className}`}>
        <WatchVisual watch={watch} live className="h-full w-auto scale-[2.3]" />
      </div>
    )
  }
  if (view === 'profile') {
    return (
      <div className={`flex h-full w-full items-center justify-center [perspective:900px] ${className}`}>
        <WatchVisual watch={watch} className="h-[90%] w-auto [transform:rotateY(38deg)_rotateZ(-4deg)]" />
      </div>
    )
  }
  return (
    <div className={`flex h-full w-full items-center justify-center ${className}`}>
      <WatchVisual watch={watch} live={view === 'front'} className={`w-auto ${view === 'velvet' ? 'h-[78%] rotate-[-18deg]' : 'h-[92%]'}`} />
    </div>
  )
}

function Gallery({ watch }) {
  const { t } = useTranslation()
  const [view, setView] = useState('front')
  const [zoom, setZoom] = useState(null)
  const [full, setFull] = useState(false)
  const bg = view === 'velvet'
    ? 'tex-velvet bg-gradient-to-br from-[#3a0f1c] via-[#22080f] to-[#0d0306]'
    : 'bg-gradient-to-b from-midnight-700 via-midnight-900 to-midnight-950'

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 })
  }

  return (
    <div className="lg:sticky lg:top-28">
      <div
        onMouseMove={onMove}
        onMouseLeave={() => setZoom(null)}
        onClick={() => setFull(true)}
        className={`relative aspect-square cursor-zoom-in overflow-hidden rounded-[32px] border border-gold-400/25 ${bg}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(212,173,98,0.2),transparent_60%)]" />
        <AnimatePresence mode="wait">
          <motion.div key={view} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}
            className="absolute inset-0">
            {/* zoom lives on a plain div: Framer Motion owns the outer element's transform */}
            <div
              data-zoom-layer
              className="h-full w-full transition-transform duration-300 ease-out"
              style={{ transform: zoom ? 'scale(2)' : 'scale(1)', transformOrigin: zoom ? `${zoom.x}% ${zoom.y}%` : '50% 50%' }}
            >
              <ViewRender view={view} watch={watch} />
            </div>
          </motion.div>
        </AnimatePresence>
        <span className="pointer-events-none absolute bottom-4 start-1/2 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-black/40 px-3 py-1.5 text-[10px] uppercase tracking-wider text-ivory-100/80 backdrop-blur-md rtl:translate-x-1/2">
          <ZoomIn className="h-3 w-3" /> {t('product.zoomHint')}
        </span>
      </div>
      <div className="mt-4 grid grid-cols-4 gap-3">
        {VIEWS.map((v) => (
          <button key={v} onClick={() => setView(v)} className={`group relative aspect-square overflow-hidden rounded-2xl border transition-all duration-500 ${view === v ? 'border-gold-400 shadow-glow' : 'border-gold-400/20 hover:border-gold-400/60'} ${v === 'velvet' ? 'bg-[#22080f]' : 'bg-midnight-900'}`} aria-label={t(`product.views.${v}`)}>
            <div className="pointer-events-none absolute inset-0"><ViewRender view={v === 'front' ? 'still' : v} watch={watch} /></div>
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-1 pb-1.5 pt-4 text-[9px] uppercase tracking-wider text-ivory-100/90">{t(`product.views.${v}`)}</span>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {full && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setFull(false)} className="fixed inset-0 z-[95] flex items-center justify-center bg-midnight-950/95 p-6 backdrop-blur-xl">
            <button className="absolute end-6 top-6 text-ivory-100/70 hover:text-gold-300" aria-label={t('common.close')}><X className="h-7 w-7" /></button>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="h-[85vh] w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
              <ViewRender view={view} watch={watch} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Product() {
  const { id } = useParams()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const price = usePrice()
  const L = useLocalized()
  const { addToBag, wishIds, toggleWish, compare, toggleCompare, gate } = useStore()
  const { data, error, loading } = useApi(`/watches/${id}`, { cache: false })
  const watch = data?.watch

  if (loading && !watch) return <Page><ProductSkeleton /></Page>
  if (error || !watch) {
    return (
      <Page className="px-5 py-24">
        <EmptyState icon={Watch} title={t('product.notFound')} text={t('product.notFoundText')} cta={t('hero.cta')} />
      </Page>
    )
  }
  const brand = watch.brand
  const wished = wishIds.has(watch.id)
  const comparing = compare.includes(watch.id)
  const related = data.related || []
  const soldOut = watch.stock <= 0
  const book = () => {
    const next = `/appointments?watch=${watch.id}`
    if (gate(null, next)) navigate(next)
  }

  const specs = [
    [t('product.reference'), <span dir="ltr">{watch.ref}</span>],
    [t('product.caseSize'), <span dir="ltr">{watch.caseSize} mm</span>],
    [t('product.material'), <span dir="ltr">{watch.materialDetail || t(`materials.${watch.material}`)}</span>],
    [t('product.movement'), t(`movements.${watch.movement}`)],
    [t('product.calibre'), <span dir="ltr">{watch.calibre || '—'}</span>],
    [t('product.water'), <span dir="ltr">{watch.waterResistance} m</span>],
    [t('product.power'), watch.powerReserve ? t('product.hours', { n: watch.powerReserve }) : t('product.na')],
    [t('product.dial'), <span dir="ltr">{watch.dial || '—'}</span>],
    [t('product.gender'), t(`genders.${watch.gender}`)],
  ]

  const assurances = [
    [Package, t('product.boxPapers'), t('product.boxPapersD')],
    [ShieldCheck, t('product.warranty', { n: 5 }), t('product.warrantyD')],
    [Award, t('product.certificate'), t('product.certificateD')],
    [Truck, t('product.delivery'), t('product.deliveryD')],
  ]

  return (
    <Page>
      <div className="mx-auto max-w-7xl px-5 pt-8 md:px-8">
        <button onClick={() => navigate(-1)} className="mb-6 inline-flex items-center gap-2 text-xs uppercase tracking-wide2 text-muted transition hover:text-gold-400">
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" /> {t('product.back')}
        </button>
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <Gallery watch={watch} />

          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
              <Link to={`/brands/${brand.slug}`} className="text-[11px] uppercase tracking-luxe text-gold-500 hover:underline dark:text-gold-400" dir="ltr">{brand.name}</Link>
              <h1 className="mt-3 font-display text-4xl font-light leading-[1.05] md:text-6xl" dir="ltr">{watch.model}</h1>
              <p className="mt-3 text-sm text-muted">{t('card.ref')} <span dir="ltr">{watch.ref}</span> · <span dir="ltr">{watch.caseSize} mm</span> · <span dir="ltr">{watch.materialDetail || t(`materials.${watch.material}`)}</span></p>
              <div className="mt-5 flex flex-wrap items-center gap-2">
              <StockBadge stock={watch.stock} className="!py-1.5" />
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-[11px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="h-3.5 w-3.5" /> {t('card.authentic')}
              </div>
              </div>
              <p className="mt-8 font-display text-5xl font-light text-gold-gradient">{price(watch.price)}</p>
              <p className="mt-2 text-xs text-muted">{t('product.instalments', { amount: price(Math.round(watch.price / 4)) })}</p>

              <div className="mt-8 flex flex-col gap-3">
                <button onClick={() => addToBag(watch)} disabled={soldOut} className="btn-gold w-full !py-4"><ShoppingBag className="h-4 w-4" strokeWidth={1.5} />{soldOut ? t('stock.out') : t('product.addBag')}</button>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => toggleWish(watch)} className={`btn-ghost !px-3 ${wished ? '!border-gold-400 !bg-gold-400/15 !text-gold-500 dark:!text-gold-300' : ''}`}>
                    <Heart className="h-4 w-4" fill={wished ? 'currentColor' : 'none'} strokeWidth={1.5} /> <span className="truncate">{wished ? t('product.inWish') : t('product.addWish')}</span>
                  </button>
                  <button onClick={() => toggleCompare(watch.id)} className={`btn-ghost !px-3 ${comparing ? '!border-gold-400 !bg-gold-400/15' : ''}`}>
                    <Scale className="h-4 w-4" strokeWidth={1.5} /> <span className="truncate">{comparing ? t('product.inCompare') : t('product.compare')}</span>
                  </button>
                </div>
                <button onClick={book} className="btn-ghost w-full"><Calendar className="h-4 w-4" strokeWidth={1.5} />{t('product.book')}</button>
              </div>
            </motion.div>

            {(watch.description || watch.descriptionAr) && (
              <Reveal className="mt-12">
                <h2 className="eyebrow mb-4">{t('product.story')}</h2>
                <p className="font-display text-xl font-light leading-relaxed md:text-2xl">{L(watch.description, watch.descriptionAr)}</p>
              </Reveal>
            )}

            <Reveal className="mt-12">
              <h2 className="eyebrow mb-4">{t('product.specs')}</h2>
              <dl className="glass overflow-hidden rounded-3xl">
                {specs.map(([k, v], i) => (
                  <div key={i} className={`flex items-center justify-between gap-4 px-6 py-4 text-sm ${i ? 'border-t border-gold-400/10' : ''}`}>
                    <dt className="text-muted">{k}</dt>
                    <dd className="text-end font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal className="mt-8 grid gap-3 sm:grid-cols-2">
              {assurances.map(([Icon, title, d], i) => (
                <div key={i} className="glass flex gap-4 rounded-2xl p-5">
                  <Icon className="h-6 w-6 shrink-0 text-gold-400" strokeWidth={1.2} />
                  <div>
                    <p className="text-sm font-medium">{title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted">{d}</p>
                  </div>
                </div>
              ))}
            </Reveal>
          </div>
        </div>

        {related.length > 0 && (
          <section className="pt-24">
            <SectionHeading eyebrow={brand.name} title={t('product.related')} />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((w, i) => <WatchCard key={w.id} watch={w} index={i} />)}
            </div>
          </section>
        )}
      </div>
    </Page>
  )
}
