import { useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ArrowRight, MapPin, Calendar, Crown } from 'lucide-react'
import WatchVisual from '../components/WatchVisual'
import WatchCard from '../components/WatchCard'
import { GridSkeleton, Shimmer } from '../components/Skeleton'
import { Page, Reveal, SectionHeading, EmptyState, GoldDivider } from '../components/ui'
import { useLocalized, useStore } from '../context/StoreContext'
import { useApi } from '../lib/useApi'
import { getBrandStyle } from '../config/looks'

export default function Brand() {
  const { slug } = useParams()
  const { t } = useTranslation()
  const L = useLocalized()
  const { errorText } = useStore()
  const { data, error, loading } = useApi(`/brands/${slug}`)
  const allBrands = useApi('/brands').data?.brands || []
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, 140])
  const yText = useTransform(scrollYProgress, [0, 1], [0, -60])

  if (error) {
    return (
      <Page className="px-5 py-24">
        <EmptyState icon={Crown} title={error.status === 404 ? t('notFound.title') : t('errors.generic')} text={error.status === 404 ? t('notFound.text') : errorText(error)} cta={t('nav.shop')} />
      </Page>
    )
  }

  const brand = data?.brand
  const list = data?.watches || []
  const hero = list[0]
  const style = getBrandStyle(slug)
  const others = allBrands.filter((b) => b.slug !== slug)
  const signature = [...new Set(list.map((w) => w.collection))]

  return (
    <Page>
      <section ref={ref} className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 tex-marble" />
        <div className="absolute inset-0 -z-10" style={{ background: `radial-gradient(ellipse at 75% 40%, ${style.accent}66, transparent 60%)` }} />
        <div className="mx-auto grid min-h-[78vh] max-w-7xl items-center gap-10 px-5 py-16 md:grid-cols-2 md:px-8">
          <motion.div style={{ y: yText }}>
            {!brand ? (
              <div className="space-y-5">
                <Shimmer className="h-3 w-28" />
                <Shimmer className="h-20 w-4/5" />
                <Shimmer className="h-6 w-2/3" />
              </div>
            ) : (
              <>
                <p className="eyebrow mb-5 flex items-center gap-3"><span className="h-px w-8 bg-gold-400" />{t('mega.since')} {brand.founded}</p>
                <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} className="font-display text-6xl font-light leading-[0.95] md:text-8xl" dir="ltr">
                  {brand.name}
                </motion.h1>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }} className="mt-5 font-display text-2xl italic text-gold-gradient">
                  “{L(style.tagline)}”
                </motion.p>
                <p className="mt-4 flex items-center gap-2 text-xs uppercase tracking-wide2 text-muted">
                  <MapPin className="h-3.5 w-3.5 text-gold-400" />{style.origin ? L(style.origin) : t(`countries.${brand.country}`)}
                </p>
                <div className="mt-10 flex flex-wrap gap-3">
                  <Link to={`/shop?brand=${brand.slug}`} className="btn-gold">{t('hero.cta')} <ArrowRight className="h-4 w-4 rtl:rotate-180" /></Link>
                  <Link to="/appointments" className="btn-ghost"><Calendar className="h-4 w-4" strokeWidth={1.4} />{t('hero.cta2')}</Link>
                </div>
              </>
            )}
          </motion.div>
          <motion.div style={{ y }} className="relative flex justify-center">
            <div className="absolute left-1/2 top-1/2 h-2/3 w-2/3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-400/20 blur-[80px]" />
            {hero && (
              <motion.div initial={{ opacity: 0, scale: 0.9, rotate: -8 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}>
                <WatchVisual watch={hero} live className="relative h-[52vh] w-auto animate-float md:h-[64vh]" />
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {brand && (
        <section className="mx-auto max-w-5xl px-5 py-20 text-center md:px-8 md:py-28">
          <Reveal>
            <p className="eyebrow mb-6">{t('mega.heritage')}</p>
            <p className="font-display text-2xl font-light leading-relaxed md:text-4xl md:leading-snug">{L(brand.story, brand.storyAr)}</p>
          </Reveal>
          <GoldDivider className="mx-auto mt-14 max-w-xs" />
        </section>
      )}

      <section className="mx-auto max-w-7xl px-5 md:px-8">
        {signature.length > 0 && (
          <Reveal>
            <div className="mb-16 flex flex-wrap justify-center gap-3">
              {signature.map((s) => (
                <span key={s} className="glass rounded-full px-5 py-2.5 font-display text-lg" dir="ltr">{s}</span>
              ))}
            </div>
          </Reveal>
        )}
        {brand && <SectionHeading eyebrow={t('mega.featured')} title={<span dir="ltr">{brand.name}</span>} subtitle={t('shop.results', { count: list.length })} />}
        {loading && !list.length ? (
          <GridSkeleton count={5} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5" />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {list.map((w, i) => <WatchCard key={w.id} watch={w} index={i} />)}
          </div>
        )}
      </section>

      {others.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 pt-24 md:px-8">
          <p className="eyebrow mb-6 text-center">{t('mega.title')}</p>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {others.map((b) => (
              <Link key={b.slug} to={`/brands/${b.slug}`} className="glass group rounded-2xl px-5 py-6 text-center transition-all duration-500 hover:border-gold-400/60">
                <span className="font-display text-2xl transition-colors group-hover:text-gold-400" dir="ltr">{b.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </Page>
  )
}
