import { MessageCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useCompareTrayVisible } from './CompareTray'

export default function WhatsAppButton() {
  const { t } = useTranslation()
  const trayVisible = useCompareTrayVisible()
  const href = `https://wa.me/97140000000?text=${encodeURIComponent(t('wa.message'))}`
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={t('wa.label')}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.4, type: 'spring', stiffness: 200, damping: 16 }}
      className={`group fixed end-4 z-[70] flex items-center gap-3 transition-[bottom] duration-500 md:bottom-8 md:end-8 ${trayVisible ? 'bottom-[160px]' : 'bottom-24'}`}
    >
      <span className="glass-strong pointer-events-none hidden rounded-full px-4 py-2 text-xs opacity-0 transition-all duration-500 group-hover:opacity-100 md:block">
        {t('wa.label')}
      </span>
      <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#1f9d55] text-white shadow-[0_10px_30px_-8px_rgba(31,157,85,0.7)] ring-1 ring-gold-300/60">
        <span className="absolute inset-0 animate-pulseRing rounded-full bg-[#1f9d55]" />
        <MessageCircle className="relative h-6 w-6" strokeWidth={1.6} />
      </span>
    </motion.a>
  )
}
