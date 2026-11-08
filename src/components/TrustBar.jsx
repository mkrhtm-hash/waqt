import { Truck, ShieldCheck, Gem, Crown } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function TrustBar() {
  const { t } = useTranslation()
  const items = [
    [Truck, t('trust.delivery')],
    [ShieldCheck, t('trust.authentic')],
    [Gem, t('trust.warranty')],
    [Crown, t('trust.concierge')],
  ]
  const row = [...items, ...items, ...items, ...items]
  return (
    <div className="relative z-50 overflow-hidden border-b border-gold-400/20 bg-midnight-950 text-gold-200" dir="ltr">
      <div className="flex w-max animate-marquee gap-12 py-2 hover:[animation-play-state:paused]">
        {row.map(([Icon, label], i) => (
          <span key={i} className="flex items-center gap-2 whitespace-nowrap text-[11px] uppercase tracking-wide2" dir="auto">
            <Icon className="h-3.5 w-3.5 text-gold-400" strokeWidth={1.5} />
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}
