// Loading placeholders in the black & champagne-gold glass style.

export function Shimmer({ className = '' }) {
  // spans (display:block) so a shimmer can sit inside text elements like <p>
  return (
    <span className={`relative block overflow-hidden rounded-xl bg-gold-400/[0.07] ${className}`} aria-hidden>
      <span className="absolute inset-0 -translate-x-full animate-[skeleton_1.8s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-gold-300/15 to-transparent" />
    </span>
  )
}

export function WatchCardSkeleton() {
  return (
    <div className="glass flex flex-col overflow-hidden rounded-[28px]" aria-hidden>
      <div className="relative flex aspect-[4/5] items-center justify-center bg-gradient-to-b from-midnight-700/60 via-midnight-900 to-midnight-950">
        <div className="relative h-40 w-40 rounded-full border border-gold-400/15">
          <div className="absolute inset-3 rounded-full border border-gold-400/10" />
          <div className="absolute left-1/2 top-1/2 h-14 w-[2px] origin-bottom -translate-x-1/2 -translate-y-full animate-[spin_3s_linear_infinite] bg-gold-400/40" />
        </div>
      </div>
      <div className="space-y-3 p-5">
        <Shimmer className="h-2.5 w-20" />
        <Shimmer className="h-5 w-3/4" />
        <Shimmer className="h-3 w-1/2" />
        <div className="flex items-end justify-between pt-4">
          <Shimmer className="h-5 w-28" />
          <Shimmer className="h-10 w-10 !rounded-full" />
        </div>
      </div>
    </div>
  )
}

export function GridSkeleton({ count = 6, className = 'grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3' }) {
  return (
    <div className={className}>
      {Array.from({ length: count }, (_, i) => <WatchCardSkeleton key={i} />)}
    </div>
  )
}

export function PanelSkeleton({ rows = 3 }) {
  return (
    <div className="glass space-y-4 rounded-3xl p-6" aria-hidden>
      <Shimmer className="h-6 w-1/3" />
      {Array.from({ length: rows }, (_, i) => <Shimmer key={i} className="h-4 w-full" />)}
    </div>
  )
}

export function ProductSkeleton() {
  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-5 pt-16 md:px-8 lg:grid-cols-2" aria-hidden>
      <Shimmer className="aspect-square !rounded-[32px]" />
      <div className="space-y-5">
        <Shimmer className="h-3 w-24" />
        <Shimmer className="h-12 w-4/5" />
        <Shimmer className="h-4 w-1/2" />
        <Shimmer className="mt-8 h-12 w-48" />
        <Shimmer className="mt-8 h-14 w-full !rounded-full" />
        <Shimmer className="h-14 w-full !rounded-full" />
        <PanelSkeleton rows={5} />
      </div>
    </div>
  )
}
