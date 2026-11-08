import { Link } from 'react-router-dom'

export function DialMark({ className = 'h-7 w-7' }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <defs>
        <linearGradient id="lg-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f4e3b5" />
          <stop offset="0.5" stopColor="#d4ad62" />
          <stop offset="1" stopColor="#8a5a2b" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="28" fill="none" stroke="url(#lg-mark)" strokeWidth="2.4" />
      {[0, 90, 180, 270].map((a) => (
        <line key={a} x1="32" y1="8" x2="32" y2="12.5" stroke="url(#lg-mark)" strokeWidth="2.4" strokeLinecap="round" transform={`rotate(${a} 32 32)`} />
      ))}
      <line x1="32" y1="32" x2="32" y2="17" stroke="url(#lg-mark)" strokeWidth="3" strokeLinecap="round" />
      <g style={{ transformOrigin: '32px 32px', animation: 'spin 60s linear infinite' }}>
        <line x1="32" y1="32" x2="43" y2="38" stroke="url(#lg-mark)" strokeWidth="2.4" strokeLinecap="round" />
      </g>
      <circle cx="32" cy="32" r="2.4" fill="#f4e3b5" />
    </svg>
  )
}

export default function Logo({ size = 'md', withMark = true, to = '/' }) {
  const text = size === 'lg' ? 'text-5xl md:text-6xl' : size === 'sm' ? 'text-xl' : 'text-2xl md:text-[28px]'
  return (
    <Link to={to} className="group inline-flex items-center gap-2.5" aria-label="WAQT home" dir="ltr">
      {withMark && (
        <DialMark className={size === 'lg' ? 'h-12 w-12' : 'h-7 w-7 transition-transform duration-700 group-hover:rotate-[30deg]'} />
      )}
      <span
        className={`${text} font-medium leading-none text-gold-gradient text-gold-animated`}
        style={{ fontFamily: '"Cormorant Garamond", serif', letterSpacing: '0.42em', marginRight: '-0.42em' }}
      >
        WAQT
      </span>
    </Link>
  )
}
