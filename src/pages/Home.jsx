import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ArrowRight, Calendar, ShieldCheck, Truck, MessageCircle, Crown, ChevronDown, Watch, Gem } from 'lucide-react'
import WatchSVG from '../components/WatchSVG'
import WatchVisual from '../components/WatchVisual'
import WatchCard from '../components/WatchCard'
import { GridSkeleton, Shimmer } from '../components/Skeleton'
import SeasonalBanner from '../components/SeasonalBanner'
import { Page, Reveal, SectionHeading, Counter, GoldDivider } from '../components/ui'
import { useLocalized } from '../context/StoreContext'
import { useApi } from '../lib/useApi'
import { looksByRef, getBrandStyle } from '../config/looks'

// decorative illustrations (design, not catalogue data)
const HERO_LOOK = looksByRef['228238']
const VIEWING_LOOK = looksByRef['5811/1G-001']

function Hero() {
  const { t } = useTranslation()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const yWatch = useTransform(scrollYProgress, [0, 1], [0, 160])
  const yText = useTransform(scrollYProgress, [0, 1], [0, -80])
  const yBg = useTransform(scrollYProgress, [0, 1], [0, 220])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const rotate = useTransform(scrollYProgress, [0, 1], [0, -12])

  const words = t('hero.title').split(' ')

  return (
    <section ref={ref} className="relative -mt-16 flex min-h-[100svh] items-center overflow-hidden pt-24 md:-mt-20 md:pt-20">
      {/* backdrop */}
      <motion.div style={{ y: yBg }} className="tex-marble absolute inset-0 -z-10" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_70%_40%,rgba(212,173,98,0.22),transparent_55%)]" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-canvas to-transparent" />
      {/* orbit rings */}
      <div className="pointer-events-none absolute end-[-20%] top-1/2 -z-10 h-[140vw] w-[140vw] -translate-y-1/2 md:end-[-8%] md:h-[78vw] md:w-[78vw] lg:h-[60vw] lg:w-[60vw]">
        <div className="absolute inset-0 animate-[spin_120s_linear_infinite] rounded-full border border-gold-400/10" />
        <div className="absolute inset-[8%] animate-[spin_90s_linear_infinite_reverse] rounded-full border border-dashed border-gold-400/15" />
        <div className="absolute inset-[18%] rounded-full border border-gold-400/10" />
      </div>

      <div className="mx-auto grid w-full max-w-7xl items-center gap-6 px-5 md:grid-cols-2 md:px-8">
        <motion.div style={{ y: yText, opacity }} className="relative z-10 order-2 text-center md:order-1 md:text-start">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 1 }} className="eyebrow mb-6 flex items-center justify-center gap-3 md:justify-start">
            <span className="h-px w-10 bg-gold-400" /> {t('hero.eyebrow')}
          </motion.p>
          <h1 className="font-display text-[19vw] font-light leading-[0.88] md:text-[8.5vw] lg:text-[124px]">
            <span className="sr-only">WAQT — </span>
            {words.map((w, i) => (
              <motion.span key={i} initial={{ opacity: 0, y: 60, filter: 'blur(12px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ delay: 0.5 + i * 0.25, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                className={`block ${i === words.length - 1 ? 'text-gold-gradient text-gold-animated italic' : ''}`}>
                {w}
              </motion.span>
            ))}
          </h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3, duration: 1.2 }} className="mx-auto mt-8 max-w-md text-sm leading-relaxed text-muted md:mx-0 md:text-base">
            {t('hero.subtitle')}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6, duration: 1 }} className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center md:justify-start">
            <Link to="/shop" className="btn-gold w-full sm:w-auto">
              {t('hero.cta')} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Link>
            <Link to="/appointments" className="btn-ghost w-full sm:w-auto">
              <Calendar className="h-4 w-4" strokeWidth={1.4} /> {t('hero.cta2')}
            </Link>
          </motion.div>
        </motion.div>

        <motion.div style={{ y: yWatch, rotate }} className="relative order-1 flex justify-center md:order-2">
          <motion.div initial={{ opacity: 0, scale: 0.85, rotate: 8 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }} className="relative">
            <div className="absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-400/25 blur-[90px]" />
            <div className="animate-float">
              <WatchSVG look={HERO_LOOK} brand="WAQT" live className="relative h-[46vh] w-auto drop-shadow-[0_40px_60px_rgba(0,0,0,0.6)] md:h-[72vh]" title="WAQT live timepiece" />
            </div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div style={{ opacity }} className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] uppercase tracking-luxe text-muted md:flex">
        {t('hero.scroll')}
        <ChevronDown className="h-4 w-4 animate-bounce text-gold-400" />
      </motion.div>
    </section>
  )
}

function Stats() {
  const { t } = useTranslation()
  const { data } = useApi('/stats', { cache: false })
  const stats = [
    { n: data?.timepieces, s: '', label: t('stats.timepieces'), Icon: Watch },
    { n: data?.clients, s: '', label: t('stats.clients'), Icon: Crown },
    { n: data?.boutiques, s: '', label: t('stats.boutiques'), Icon: Gem },
    { n: 27, s: '', label: t('stats.years'), Icon: ShieldCheck },
  ]
  return (
    <section className="relative mx-auto -mt-10 max-w-7xl px-5 md:px-8">
      <div className="glass grid grid-cols-2 divide-gold-400/15 overflow-hidden rounded-[28px] md:grid-cols-4 md:divide-x rtl:md:divide-x-reverse">
        {stats.map(({ n, s, label, Icon }, i) => (
          <Reveal key={i} delay={i * 0.1} className="flex flex-col items-center gap-2 px-4 py-8 text-center md:py-10">
            <Icon className="h-5 w-5 text-gold-400" strokeWidth={1.2} />
            <p className="font-display text-4xl font-light text-gold-gradient md:text-5xl">{n === undefined ? <Shimmer className="mx-auto h-10 w-20" /> : <Counter key={n} to={n} suffix={s} />}</p>
            <p className="text-[10px] uppercase tracking-wide2 text-muted md:text-[11px]">{label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function BrandStrip() {
  const brands = useApi('/brands').data?.brands || []
  if (!brands.length) return <section className="h-[106px] border-y border-gold-400/15 md:h-[130px]" />
  return (
    <section className="relative overflow-hidden border-y border-gold-400/15 py-8 md:py-10" dir="ltr">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-canvas to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-canvas to-transparent" />
      <div className="flex w-max animate-marquee items-center gap-16 md:gap-24">
        {[...brands, ...brands, ...brands, ...brands].map((b, i) => (
          <Link key={i} to={`/brands/${b.slug}`} className="group flex items-center gap-16 md:gap-24">
            <span className="whitespace-nowrap font-display text-3xl font-light tracking-[0.08em] text-fg/50 transition-all duration-700 group-hover:text-gold-400 md:text-5xl">{b.name}</span>
            <span className="h-1.5 w-1.5 rotate-45 bg-gold-400/50" />
          </Link>
        ))}
      </div>
    </section>
  )
}

function Maisons() {
  const { t } = useTranslation()
  const L = useLocalized()
  const { data, loading } = useApi('/brands')
  const brands = data?.brands || []
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
      <SectionHeading eyebrow={t('home.maisons')} title={t('home.maisonsTitle')} />
      <div className="grid gap-4 md:grid-cols-6">
        {loading && !brands.length && Array.from({ length: 5 }, (_, i) => <Shimmer key={i} className={`min-h-[300px] !rounded-[28px] md:min-h-[380px] ${i < 2 ? 'md:col-span-3' : 'md:col-span-2'}`} />)}
        {brands.map((b, i) => {
          const w = b.hero
          const style = getBrandStyle(b.slug)
          const big = i < 2
          return (
            <Reveal key={b.slug} delay={i * 0.08} className={big ? 'md:col-span-3' : 'md:col-span-2'}>
              <Link to={`/brands/${b.slug}`} className="glass group relative flex h-full min-h-[300px] overflow-hidden rounded-[28px] p-7 transition-all duration-700 hover:border-gold-400/50 md:min-h-[380px]">
                <div className="absolute inset-0 opacity-60 transition-opacity duration-700 group-hover:opacity-100" style={{ background: `radial-gradient(circle at 80% 60%, ${style.accent}55, transparent 60%)` }} />
                {w && <WatchVisual watch={w} className="absolute -bottom-10 end-[-30px] h-[90%] w-auto opacity-90 transition-all duration-[1400ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:-translate-y-3 group-hover:scale-105 group-hover:-rotate-6" />}
                <div className="relative z-10 flex max-w-[60%] flex-col">
                  <span className="text-[10px] uppercase tracking-luxe text-gold-400">{t('mega.since')} {b.founded}</span>
                  <h3 className="mt-3 font-display text-4xl font-light leading-none md:text-5xl" dir="ltr">{b.name}</h3>
                  <p className="mt-3 text-sm italic text-muted">“{L(style.tagline)}”</p>
                  <span className="mt-auto inline-flex items-center gap-2 pt-10 text-[11px] uppercase tracking-wide2 text-gold-400">
                    {t('home.discover')} <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1.5 rtl:rotate-180 rtl:group-hover:-translate-x-1.5" />
                  </span>
                </div>
              </Link>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}

function Featured() {
  const { t } = useTranslation()
  const { data, loading } = useApi('/watches?featured=1&sort=featured')
  const top = data?.watches || []
  return (
    <section className="mx-auto max-w-7xl px-5 pb-24 md:px-8">
      <SectionHeading eyebrow={t('home.featured')} title={t('home.featuredTitle')}
        action={<Link to="/shop" className="btn-ghost self-start md:self-auto">{t('common.viewAll')} <ArrowRight className="h-4 w-4 rtl:rotate-180" /></Link>} />
      {loading && !top.length ? (
        <GridSkeleton count={6} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {top.map((w, i) => <WatchCard key={w.id} watch={w} index={i} />)}
        </div>
      )}
    </section>
  )
}

function Promise() {
  const { t } = useTranslation()
  const items = [
    [ShieldCheck, 'why1'], [Truck, 'why2'], [MessageCircle, 'why3'], [Crown, 'why4'],
  ]
  return (
    <section className="tex-velvet relative overflow-hidden py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading center eyebrow={t('home.whyEyebrow')} title={t('home.whyTitle')} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(([Icon, k], i) => (
            <Reveal key={k} delay={i * 0.12}>
              <div className="glass group h-full rounded-[28px] p-8 transition-all duration-700 hover:-translate-y-1 hover:border-gold-400/50">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-gold-400/40 transition-all duration-700 group-hover:bg-gold-400/10 group-hover:shadow-glow">
                  <Icon className="h-6 w-6 text-gold-400" strokeWidth={1.2} />
                </div>
                <h3 className="font-display text-2xl">{t(`home.${k}`)}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{t(`home.${k}d`)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function AppointmentCTA() {
  const { t } = useTranslation()
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 md:px-8">
      <div className="glass relative grid items-center gap-10 overflow-hidden rounded-[36px] p-8 md:grid-cols-2 md:p-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_50%,rgba(212,173,98,0.2),transparent_55%)]" />
        <Reveal className="relative">
          <p className="eyebrow mb-4">{t('home.apptEyebrow')}</p>
          <h2 className="font-display text-4xl font-light leading-tight md:text-6xl">{t('home.apptTitle')}</h2>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-muted">{t('home.apptText')}</p>
          <Link to="/appointments" className="btn-gold mt-8"><Calendar className="h-4 w-4" strokeWidth={1.5} /> {t('hero.cta2')}</Link>
        </Reveal>
        <div className="relative flex justify-center">
          <WatchSVG look={VIEWING_LOOK} brand="Patek Philippe" className="h-80 w-auto animate-float md:h-[420px]" />
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <Page className="!pb-0">
      <Hero />
      <Stats />
      <div className="h-16 md:h-24" />
      <BrandStrip />
      <Maisons />
      <Featured />
      <section className="mx-auto max-w-7xl px-5 pb-8 md:px-8"><SeasonalBanner /></section>
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8"><GoldDivider /></div>
      <Promise />
      <AppointmentCTA />
    </Page>
  )
}
