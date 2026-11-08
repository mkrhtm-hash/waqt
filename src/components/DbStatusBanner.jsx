import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { DatabaseZap, RotateCw } from 'lucide-react'
import { onDbStatus } from '../lib/api'

/** A slim banner that appears whenever the API reports the database can't be reached. */
export default function DbStatusBanner() {
  const { t } = useTranslation()
  const [down, setDown] = useState(null)
  useEffect(() => onDbStatus((s) => setDown(s.ok ? null : s.code)), [])
  return (
    <AnimatePresence>
      {down && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="relative z-[61] overflow-hidden" role="alert">
          <div className="flex flex-wrap items-center justify-center gap-3 border-b border-red-400/30 bg-[#2a0d10] px-4 py-2.5 text-center text-xs text-red-100">
            <DatabaseZap className="h-4 w-4 shrink-0 text-red-300" strokeWidth={1.5} />
            <span className="font-medium">{t('dbBanner.title')}</span>
            <span className="text-red-100/80">{t(`errors.${down}`)}</span>
            <button onClick={() => window.location.reload()} className="inline-flex items-center gap-1 rounded-full border border-red-300/40 px-3 py-1 hover:bg-red-300/10">
              <RotateCw className="h-3 w-3" /> {t('dbBanner.retry')}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
