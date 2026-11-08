import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Gem, Crown, ArrowRight } from 'lucide-react'

function Crescent() {
  return (
    <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="cres" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f4e3b5" /><stop offset="1" stopColor="#a67a39" />
        </linearGradient>
      </defs>
      <path d="M78 14a46 46 0 1 0 28 82A40 40 0 1 1 78 14z" fill="url(#cres)" />
      <g fill="#f4e3b5">
        <circle cx="92" cy="34" r="2" /><circle cx="100" cy="52" r="1.3" /><circle cx="84" cy="22" r="1" />
      </g>
      <g stroke="url(#cres)" strokeWidth="1.2" fill="none">
        <path d="M30 0v26" /><path d="M24 26h12l-2 10h-8z" fill="url(#cres)" />
      </g>
    </svg>
  )
}

function Flag() {
  return (
    <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="fl" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f4e3b5" /><stop offset="1" stopColor="#a67a39" />
        </linearGradient>
      </defs>
      <circle cx="60" cy="60" r="50" fill="none" stroke="url(#fl)" strokeWidth="1.5" />
      <circle cx="60" cy="60" r="40" fill="none" stroke="#1f7a4a" strokeWidth="6" strokeDasharray="4 6" />
      {Array.from({ length: 12 }, (_, i) => (
        <path key={i} d="M60 22l2.5 6h-5z" fill="url(#fl)" transform={`rotate(${i * 30} 60 60)`} />
      ))}
      <text x="60" y="68" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="22" fill="url(#fl)">2026</text>
    </svg>
  )
}

export default function SeasonalBanner() {
  const { t } = useTranslation()
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setI((x) => (x + 1) % 2), 7000)
    return () => clearInterval(id)
  }, [])
  const slides = [
    { k: 'national', Icon: Crown, Art: Flag, tone: 'from-emerald-950/80 via-midnight-900 to-midnight-950' },
    { k: 'ramadan', Icon: Gem, Art: Crescent, tone: 'from-[#2a0f18] via-midnight-900 to-midnight-950' },
  ]
  const s = slides[i]
  return (
    <div className="relative overflow-hidden rounded-[32px] border border-gold-400/25 text-ivory-100">
      <AnimatePresence mode="wait">
        <motion.div key={s.k} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }}
          className={`tex-velvet relative grid items-center gap-6 bg-gradient-to-br ${s.tone} p-8 md:grid-cols-[1fr_auto] md:p-14`}>
          <div>
            <p className="eyebrow mb-4 flex items-center gap-2"><s.Icon className="h-3.5 w-3.5" strokeWidth={1.5} />{t(`seasonal.${s.k}Eyebrow`)}</p>
            <h3 className="font-display text-4xl font-light leading-tight md:text-5xl">{t(`seasonal.${s.k}Title`)}</h3>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-ivory-100/70">{t(`seasonal.${s.k}Text`)}</p>
            <Link to="/shop" className="btn-gold mt-8">{t('seasonal.cta')} <ArrowRight className="h-4 w-4 rtl:rotate-180" /></Link>
          </div>
          <motion.div initial={{ scale: 0.8, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} className="mx-auto h-40 w-40 animate-float md:h-56 md:w-56">
            <s.Art />
          </motion.div>
        </motion.div>
      </AnimatePresence>
      <div className="absolute bottom-5 end-6 flex gap-2">
        {slides.map((x, n) => (
          <button key={x.k} onClick={() => setI(n)} className={`h-1 rounded-full transition-all duration-500 ${n === i ? 'w-8 bg-gold-400' : 'w-3 bg-ivory-100/30'}`} aria-label={`slide ${n + 1}`} />
        ))}
      </div>
    </div>
  )
}
