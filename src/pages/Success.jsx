import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import confetti from 'canvas-confetti'
import { Check, MessageCircle } from 'lucide-react'
import { Page, GoldDivider } from '../components/ui'

const GOLD = ['#f4e3b5', '#e6c274', '#d4ad62', '#b8874a', '#8a5a2b', '#ffffff']

export default function Success() {
  const { orderId } = useParams()
  const { t } = useTranslation()

  useEffect(() => {
    const end = Date.now() + 2600
    let raf
    const frame = () => {
      confetti({ particleCount: 4, angle: 60, spread: 60, origin: { x: 0, y: 0.7 }, colors: GOLD, shapes: ['square', 'circle'], scalar: 1.1 })
      confetti({ particleCount: 4, angle: 120, spread: 60, origin: { x: 1, y: 0.7 }, colors: GOLD, shapes: ['square', 'circle'], scalar: 1.1 })
      if (Date.now() < end) raf = requestAnimationFrame(frame)
    }
    const burst = setTimeout(() => {
      confetti({ particleCount: 160, spread: 100, startVelocity: 45, origin: { y: 0.45 }, colors: GOLD, scalar: 1.2, ticks: 260 })
      frame()
    }, 400)
    return () => { clearTimeout(burst); cancelAnimationFrame(raf); confetti.reset() }
  }, [])

  return (
    <Page className="flex items-center justify-center px-5 py-20">
      <div className="mx-auto max-w-xl text-center">
        <motion.div initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 160, damping: 14, delay: 0.2 }}
          className="relative mx-auto mb-10 flex h-28 w-28 items-center justify-center rounded-full border border-gold-400/50 bg-gold-400/10 shadow-glow">
          <span className="absolute inset-0 animate-pulseRing rounded-full border border-gold-400/50" />
          <Check className="h-12 w-12 text-gold-400" strokeWidth={1.2} />
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 1 }} className="font-display text-6xl font-light text-gold-gradient text-gold-animated md:text-7xl">{t('success.title')}</motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-4 font-display text-2xl italic">{t('success.subtitle')}</motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="glass mx-auto mt-10 rounded-3xl p-8">
          <p className="text-[11px] uppercase tracking-luxe text-muted">{t('success.order')}</p>
          <p className="mt-2 font-display text-4xl tracking-[0.15em]" dir="ltr">{orderId}</p>
          <GoldDivider className="my-6" />
          <p className="flex items-start gap-3 text-start text-sm leading-relaxed text-muted"><MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-gold-400" strokeWidth={1.4} />{t('success.text')}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }} className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/account?tab=orders" className="btn-gold">{t('success.track')}</Link>
          <Link to="/shop" className="btn-ghost">{t('success.continue')}</Link>
        </motion.div>
      </div>
    </Page>
  )
}
