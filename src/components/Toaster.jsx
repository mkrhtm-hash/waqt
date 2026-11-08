import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react'
import { useStore } from '../context/StoreContext'

const icons = { success: CheckCircle2, info: Info, error: AlertCircle }

export default function Toaster() {
  const { toasts, dismissToast } = useStore()
  return (
    <div className="pointer-events-none fixed inset-x-0 top-20 z-[80] flex flex-col items-center gap-2 px-4 md:top-28 md:items-end md:pe-8">
      <AnimatePresence>
        {toasts.map((t) => {
          const Icon = icons[t.type] || CheckCircle2
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: -16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.96 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="glass-strong pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-2xl px-4 py-3.5 shadow-gold"
              role="status"
            >
              <Icon className={`h-5 w-5 shrink-0 ${t.type === 'error' ? 'text-red-400' : 'text-gold-400'}`} strokeWidth={1.5} />
              <p className="flex-1 text-sm">{t.message}</p>
              <button onClick={() => dismissToast(t.id)} className="text-muted hover:text-fg" aria-label="Dismiss">
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
