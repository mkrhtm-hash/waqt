import { motion, useInView, animate } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

export function Page({ children, className = '' }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`min-h-[70vh] pb-28 md:pb-0 ${className}`}
    >
      {children}
    </motion.main>
  )
}

export function Reveal({ children, delay = 0, className = '', y = 28 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function SectionHeading({ eyebrow, title, subtitle, center = false, action }) {
  return (
    <div className={`mb-10 flex flex-col gap-4 md:mb-14 ${center ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between'}`}>
      <Reveal className={center ? 'flex flex-col items-center' : ''}>
        {eyebrow && (
          <p className="eyebrow mb-3 flex items-center gap-3">
            <span className="h-px w-8 bg-gold-400/70" />
            {eyebrow}
          </p>
        )}
        <h2 className="font-display text-4xl font-light leading-[1.05] md:text-6xl">{title}</h2>
        {subtitle && <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted md:text-base">{subtitle}</p>}
      </Reveal>
      {action}
    </div>
  )
}

export function Counter({ to, suffix = '', duration = 2.4 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!inView) return
    const c = animate(0, to, { duration, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setVal(Math.round(v)) })
    return () => c.stop()
  }, [inView, to, duration])
  return (
    <span ref={ref} dir="ltr">
      {val.toLocaleString('en-US')}
      {suffix}
    </span>
  )
}

export function EmptyState({ icon: Icon, title, text, cta, to = '/shop' }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="glass mx-auto flex max-w-lg flex-col items-center rounded-3xl px-8 py-14 text-center"
    >
      <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-gold-400/40">
        <span className="absolute inset-0 animate-pulseRing rounded-full border border-gold-400/40" />
        {Icon && <Icon className="h-8 w-8 text-gold-400" strokeWidth={1.2} />}
      </div>
      <h3 className="font-display text-3xl font-light">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted">{text}</p>
      {cta && (
        <Link to={to} className="btn-gold mt-8">
          {cta}
        </Link>
      )}
    </motion.div>
  )
}

export function GoldDivider({ className = '' }) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <span className="gold-line flex-1" />
      <span className="h-1.5 w-1.5 rotate-45 bg-gold-400" />
      <span className="gold-line flex-1" />
    </div>
  )
}
