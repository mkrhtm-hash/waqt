import { memo, useEffect, useId, useState } from 'react'

// Stylised, original watch illustrations generated from a "look" spec.
const METALS = {
  steel: ['#fbfcfd', '#c9ced5', '#858b94', '#e9ecef', '#5f656e'],
  white: ['#ffffff', '#d8dbdf', '#979da5', '#f0f2f4', '#6c727b'],
  platinum: ['#f6f7f9', '#cfd4da', '#a0a7b0', '#e5e9ed', '#757c85'],
  yellow: ['#fff3c9', '#e6c274', '#a67e36', '#f5d996', '#6e5220'],
  rose: ['#ffe4d6', '#e3aa8e', '#a96d55', '#f3c6af', '#764836'],
}

function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16)
  const c = (v) => Math.max(0, Math.min(255, Math.round(v + (amt > 0 ? (255 - v) * amt : v * amt))))
  const r = c(n >> 16), g = c((n >> 8) & 255), b = c(n & 255)
  return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)
}
function luminance(hex) {
  const n = parseInt(hex.slice(1), 16)
  return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255
}

function useClock(live) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (!live) return
    const i = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(i)
  }, [live])
  return now
}

const HAND = { white: '#f4f4f2', gold: '#ecc97c', blue: '#1f3c94', dark: '#17181b' }
const CX = 120, CY = 170
const ROMAN = ['XII', 'I', 'II', 'III', 'IIII', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI']
const rad = (deg) => (deg * Math.PI) / 180
const polar = (r, deg) => [CX + r * Math.sin(rad(deg)), CY - r * Math.cos(rad(deg))]
const octagon = (r, cx = CX, cy = CY) =>
  Array.from({ length: 8 }, (_, i) => {
    const a = rad(22.5 + i * 45)
    return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`
  }).join(' ')

function WatchSVG({ look, brand = '', live = false, className = '', title }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const id = (n) => `${n}${uid}`
  const now = useClock(live)

  const {
    shape = 'round', metal = 'steel', dial = '#111', bezel = 'smooth', bezelColor = '#0b0b0d', dialStyle = 'plain',
    strap = 'bracelet', strapColor = '#151515', hands = 'white', lume, chrono, gmt, diamonds, smallSeconds, petite, noScrews, subdialColor,
  } = look

  const twoTone = metal.startsWith('twotone')
  const caseMetal = twoTone ? 'steel' : metal
  const accentMetal = metal === 'twotone-rose' ? 'rose' : metal === 'twotone' ? 'yellow' : metal
  const M = METALS[caseMetal] || METALS.steel
  const A = METALS[accentMetal] || METALS.steel
  const dark = luminance(dial) < 0.45
  const ink = dark ? '#f3efe6' : '#1d1d20'
  const handColor = HAND[hands] || HAND.white
  const cartier = shape === 'square' || shape === 'tank' || look.ballon
  const dateWindow = look.date ?? (lume && !chrono && shape !== 'porthole' ? true : shape === 'porthole' || (shape === 'octagon' && !chrono))

  // time → angles (monotonic so the hands never spin backwards)
  let secs
  if (live) {
    const d = new Date(now)
    secs = d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds()
  } else secs = 10 * 3600 + 9 * 60 + 36
  const secDeg = secs * 6
  const minDeg = secs * 0.1
  const hourDeg = secs / 120

  // geometry
  const scale = petite ? 0.9 : 1
  let dialR = 60
  let strapW = 64
  if (shape === 'round') dialR = bezel === 'smooth' || bezel === 'clous' ? 66 : 59
  if (shape === 'octagon') { dialR = 57; strapW = 92 }
  if (shape === 'porthole') { dialR = 60; strapW = 80 }
  if (shape === 'square') strapW = 74
  if (shape === 'tank') strapW = 60

  const metalGrad = (gid, c) => (
    <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor={c[3]} />
      <stop offset="0.28" stopColor={c[0]} />
      <stop offset="0.52" stopColor={c[1]} />
      <stop offset="0.78" stopColor={c[2]} />
      <stop offset="1" stopColor={c[4]} />
    </linearGradient>
  )

  /* ───────────── STRAP ───────────── */
  const strapX = CX - strapW / 2
  const renderStrap = () => {
    if (strap === 'bracelet') {
      const centerW = shape === 'octagon' ? strapW * 0.3 : strapW * 0.36
      const rows = []
      const step = shape === 'octagon' ? 12 : 17
      for (let y = 0; y < 340; y += step) rows.push(y)
      return (
        <g mask={`url(#${id('fade')})`}>
          <rect x={strapX} y="0" width={strapW} height="340" fill={`url(#${id('band')})`} />
          <rect x={CX - centerW / 2} y="0" width={centerW} height="340" fill={`url(#${id(twoTone ? 'bandA' : 'bandC')})`} />
          {rows.map((y) => (
            <g key={y}>
              <line x1={strapX} x2={strapX + strapW} y1={y} y2={y} stroke="#000" strokeOpacity="0.28" strokeWidth="0.8" />
              <line x1={strapX} x2={strapX + strapW} y1={y + 1} y2={y + 1} stroke="#fff" strokeOpacity="0.25" strokeWidth="0.5" />
            </g>
          ))}
          <line x1={CX - centerW / 2} x2={CX - centerW / 2} y1="0" y2="340" stroke="#000" strokeOpacity="0.3" strokeWidth="0.7" />
          <line x1={CX + centerW / 2} x2={CX + centerW / 2} y1="0" y2="340" stroke="#000" strokeOpacity="0.3" strokeWidth="0.7" />
        </g>
      )
    }
    const rubber = strap === 'rubber'
    return (
      <g mask={`url(#${id('fade')})`}>
        <rect x={strapX} y="0" width={strapW} height="340" rx="8" fill={strapColor} />
        <rect x={strapX} y="0" width={strapW} height="340" rx="8" fill={`url(#${id('strapShade')})`} />
        {rubber
          ? Array.from({ length: 30 }, (_, i) => (
              <rect key={i} x={strapX + 8} y={i * 12} width={strapW - 16} height="5" rx="2.5" fill="#000" fillOpacity="0.35" />
            ))
          : (
            <>
              <rect x={strapX + 4} y="0" width={strapW - 8} height="340" fill={`url(#${id('grain')})`} opacity="0.35" />
              <line x1={strapX + 5} x2={strapX + 5} y1="0" y2="340" stroke="#e9dcc3" strokeOpacity="0.45" strokeDasharray="3 3" strokeWidth="0.8" />
              <line x1={strapX + strapW - 5} x2={strapX + strapW - 5} y1="0" y2="340" stroke="#e9dcc3" strokeOpacity="0.45" strokeDasharray="3 3" strokeWidth="0.8" />
            </>
          )}
      </g>
    )
  }

  /* ───────────── CROWN ───────────── */
  const Crown = ({ x, y = CY, cab = false }) => (
    <g>
      <rect x={x} y={y - 5} width="6" height="10" fill={`url(#${id('metal')})`} />
      <rect x={x + 5} y={y - 9} width="9" height="18" rx="2.5" fill={`url(#${id('metal')})`} stroke="#000" strokeOpacity="0.25" strokeWidth="0.5" />
      {Array.from({ length: 6 }, (_, i) => (
        <line key={i} x1={x + 6} x2={x + 13} y1={y - 7 + i * 2.8} y2={y - 7 + i * 2.8} stroke="#000" strokeOpacity="0.22" strokeWidth="0.6" />
      ))}
      {cab && <circle cx={x + 15} cy={y} r="3.6" fill="url(#cab)" stroke={M[2]} strokeWidth="0.8" />}
    </g>
  )

  /* ───────────── DIAL TEXTURE ───────────── */
  const dialFill = () => {
    if (dialStyle === 'tapisserie') return `url(#${id('tap')})`
    if (dialStyle === 'horizontal') return `url(#${id('hz')})`
    if (dialStyle === 'checker') return `url(#${id('chk')})`
    if (dialStyle === 'waves') return `url(#${id('wave')})`
    if (dialStyle === 'teak') return `url(#${id('teak')})`
    if (dialStyle === 'pearl') return `url(#${id('pearl')})`
    return `url(#${id('dialG')})`
  }
  const sunburst = ['sunburst', 'roman', 'horizontal'].includes(dialStyle)

  /* ───────────── DIAL CONTENTS (indices, subdials, text) ───────────── */
  const RoundIndices = () => {
    const out = []
    for (let h = 0; h < 12; h++) {
      const a = h * 30
      if (chrono && (h === 3 || h === 6 || h === 9)) continue
      if (dateWindow && h === 3) continue
      if (smallSeconds && h === 6) continue
      if (cartier) {
        const [x, y] = polar(dialR - 13, a)
        out.push(<text key={h} x={x} y={y + 3.6} textAnchor="middle" fontSize="10" fontFamily="Cormorant Garamond, serif" fontWeight="600" fill={ink}>{ROMAN[h]}</text>)
        continue
      }
      if (diamonds) {
        const [x, y] = polar(dialR - 9, a)
        out.push(<circle key={h} cx={x} cy={y} r={h === 0 ? 3.4 : 2.6} fill={`url(#${id('gem')})`} stroke={A[2]} strokeWidth="0.6" />)
        continue
      }
      if (lume) {
        if (h === 0) {
          const [x1, y1] = polar(dialR - 3, -6), [x2, y2] = polar(dialR - 3, 6), [x3, y3] = polar(dialR - 15, 0)
          out.push(<polygon key={h} points={`${x1},${y1} ${x2},${y2} ${x3},${y3}`} fill="#f6f2e6" stroke={handColor === HAND.gold ? A[2] : '#c9ced5'} strokeWidth="1" />)
        } else if (h % 3 === 0) {
          out.push(<rect key={h} x={CX - 2.6} y={CY - dialR + 3} width="5.2" height="13" rx="0.8" fill="#f6f2e6" stroke="#c9ced5" strokeWidth="0.9" transform={`rotate(${a} ${CX} ${CY})`} />)
        } else {
          const [x, y] = polar(dialR - 8, a)
          out.push(<circle key={h} cx={x} cy={y} r="3.6" fill="#f6f2e6" stroke="#c9ced5" strokeWidth="0.9" />)
        }
        continue
      }
      out.push(
        <rect key={h} x={CX - (h === 0 ? 2.6 : 1.5)} y={CY - dialR + 4} width={h === 0 ? 5.2 : 3} height={h % 3 === 0 ? 12 : 9} rx="0.6"
          fill={hands === 'gold' ? `url(#${id('accent')})` : `url(#${id('metal')})`} stroke="#000" strokeOpacity="0.25" strokeWidth="0.3" transform={`rotate(${a} ${CX} ${CY})`} />,
      )
    }
    return <g>{out}</g>
  }

  const MinuteTrack = ({ r }) => (
    <g>
      {Array.from({ length: 60 }, (_, i) => (i % 5 === 0 ? null : (
        <line key={i} x1={CX} x2={CX} y1={CY - r} y2={CY - r + 2.4} stroke={ink} strokeOpacity="0.6" strokeWidth="0.55" transform={`rotate(${i * 6} ${CX} ${CY})`} />
      )))}
    </g>
  )

  const Subdial = ({ x, y, r, deg = 0 }) => (
    <g>
      <circle cx={x} cy={y} r={r} fill={subdialColor || shade(dial, dark ? 0.08 : -0.08)} stroke={dark ? '#cfd3d8' : '#2b2b2e'} strokeOpacity="0.7" strokeWidth="0.8" />
      <circle cx={x} cy={y} r={r - 2} fill={`url(#${id('snail')})`} opacity="0.5" />
      {Array.from({ length: 12 }, (_, i) => (
        <line key={i} x1={x} x2={x} y1={y - r + 1} y2={y - r + 3.2} stroke={luminance(subdialColor || dial) < 0.45 ? '#eee' : '#222'} strokeWidth="0.6" transform={`rotate(${i * 30} ${x} ${y})`} />
      ))}
      <line x1={x} y1={y + 2} x2={x} y2={y - r + 2.5} stroke={luminance(subdialColor || dial) < 0.45 ? '#f5f5f5' : '#111'} strokeWidth="1.1" strokeLinecap="round" transform={`rotate(${deg} ${x} ${y})`} />
      <circle cx={x} cy={y} r="1.3" fill={handColor} />
    </g>
  )

  const DateWin = () => (
    <g>
      <rect x={CX + dialR * 0.56} y={CY - 6} width="15" height="12" rx="1" fill="#fbfaf6" stroke={M[2]} strokeWidth="1" />
      <text x={CX + dialR * 0.56 + 7.5} y={CY + 3.4} textAnchor="middle" fontSize="8.5" fontFamily="Inter, sans-serif" fontWeight="600" fill="#111">{live ? new Date(now).getDate() : 24}</text>
    </g>
  )

  const BrandText = ({ y = CY - dialR * 0.48 } = {}) => (
    <g fill={ink}>
      <text x={CX} y={y} textAnchor="middle" fontSize={brand.length > 10 ? 5.2 : 6.6} letterSpacing="1.4" fontFamily="Cormorant Garamond, serif" fontWeight="700">{brand.toUpperCase()}</text>
      {!chrono && !cartier && (
        <text x={CX} y={CY + dialR * 0.55} textAnchor="middle" fontSize="3.4" letterSpacing="0.8" fontFamily="Inter, sans-serif" opacity="0.7">
          {look.movementLabel || 'AUTOMATIC'}
        </text>
      )}
    </g>
  )

  const RectIndices = ({ hw, hh }) => (
    <g>
      <rect x={CX - hw + 5} y={CY - hh + 5} width={(hw - 5) * 2} height={(hh - 5) * 2} fill="none" stroke={ink} strokeWidth="0.5" strokeOpacity="0.7" />
      <rect x={CX - hw + 8} y={CY - hh + 8} width={(hw - 8) * 2} height={(hh - 8) * 2} fill="none" stroke={ink} strokeWidth="0.5" strokeOpacity="0.7" />
      {ROMAN.map((n, h) => {
        const a = rad(h * 30)
        const sx = Math.sin(a), sy = -Math.cos(a)
        const k = Math.min(Math.abs(sx) > 1e-6 ? (hw - 18) / Math.abs(sx) : 1e9, Math.abs(sy) > 1e-6 ? (hh - 18) / Math.abs(sy) : 1e9)
        return (
          <text key={n} x={CX + sx * k} y={CY + sy * k + 4} textAnchor="middle" fontSize={hw < 40 ? 9.5 : 12} fontFamily="Cormorant Garamond, serif" fontWeight="600" fill={ink}>{n}</text>
        )
      })}
    </g>
  )

  /* ───────────── HANDS ───────────── */
  const handLen = shape === 'tank' ? { h: 34, m: 52 } : shape === 'square' ? { h: 30, m: 44 } : { h: dialR * 0.56, m: dialR * 0.86 }
  const secLen = shape === 'tank' ? 54 : shape === 'square' ? 46 : dialR * 0.94
  const handStroke = hands === 'gold' || hands === 'white' ? '#00000055' : 'none'

  const Hands = () => (
    <g>
      {gmt && (
        <g transform={`rotate(${hourDeg / 2 + 40} ${CX} ${CY})`}>
          <line x1={CX} y1={CY} x2={CX} y2={CY - dialR + 8} stroke="#c8202f" strokeWidth="1.3" />
          <polygon points={`${CX - 4},${CY - dialR + 12} ${CX + 4},${CY - dialR + 12} ${CX},${CY - dialR + 3}`} fill="#c8202f" />
        </g>
      )}
      <g style={{ transform: `rotate(${hourDeg}deg)`, transformOrigin: `${CX}px ${CY}px`, transition: live ? 'transform 1s linear' : 'none' }}>
        {cartier ? (
          <polygon points={`${CX - 2.4},${CY + 6} ${CX + 2.4},${CY + 6} ${CX + 1.6},${CY - handLen.h + 6} ${CX},${CY - handLen.h} ${CX - 1.6},${CY - handLen.h + 6}`} fill={handColor} />
        ) : (
          <>
            <polygon points={`${CX - 3.2},${CY + 8} ${CX + 3.2},${CY + 8} ${CX + 3.6},${CY - handLen.h + 8} ${CX},${CY - handLen.h} ${CX - 3.6},${CY - handLen.h + 8}`} fill={handColor} stroke={handStroke} strokeWidth="0.5" />
            {lume && <rect x={CX - 1.6} y={CY - handLen.h + 8} width="3.2" height={handLen.h - 16} rx="1" fill="#f8f5e8" opacity="0.92" />}
          </>
        )}
      </g>
      <g style={{ transform: `rotate(${minDeg}deg)`, transformOrigin: `${CX}px ${CY}px`, transition: live ? 'transform 1s linear' : 'none' }}>
        {cartier ? (
          <polygon points={`${CX - 2},${CY + 8} ${CX + 2},${CY + 8} ${CX + 1.2},${CY - handLen.m + 6} ${CX},${CY - handLen.m} ${CX - 1.2},${CY - handLen.m + 6}`} fill={handColor} />
        ) : (
          <>
            <polygon points={`${CX - 2.6},${CY + 10} ${CX + 2.6},${CY + 10} ${CX + 2.6},${CY - handLen.m + 6} ${CX},${CY - handLen.m} ${CX - 2.6},${CY - handLen.m + 6}`} fill={handColor} stroke={handStroke} strokeWidth="0.5" />
            {lume && <rect x={CX - 1.2} y={CY - handLen.m + 6} width="2.4" height={handLen.m - 18} rx="1" fill="#f8f5e8" opacity="0.92" />}
          </>
        )}
      </g>
      {!smallSeconds && (
        <g style={{ transform: `rotate(${secDeg}deg)`, transformOrigin: `${CX}px ${CY}px`, transition: live ? 'transform 0.35s cubic-bezier(.4,2.2,.55,1)' : 'none' }}>
          <line x1={CX} y1={CY + 14} x2={CX} y2={CY - secLen} stroke={chrono || gmt ? '#d23a2e' : hands === 'dark' ? '#17181b' : hands === 'blue' ? HAND.blue : hands === 'gold' ? HAND.gold : '#f4f4f2'} strokeWidth="0.9" strokeLinecap="round" />
          {lume && <circle cx={CX} cy={CY - secLen + 14} r="2.4" fill="#f8f5e8" stroke="#c9ced5" strokeWidth="0.6" />}
          <circle cx={CX} cy={CY + 12} r="2" fill={chrono || gmt ? '#d23a2e' : handColor} />
        </g>
      )}
      <circle cx={CX} cy={CY} r="3" fill={handColor} stroke="#00000044" strokeWidth="0.5" />
      <circle cx={CX} cy={CY} r="1.1" fill="#222" />
    </g>
  )

  /* ───────────── DIAL BLOCK (clipped) ───────────── */
  const dialClipShape = () => {
    if (shape === 'square') return <rect x={CX - 52 * scale} y={CY - 52 * scale} width={104 * scale} height={104 * scale} rx={12 * scale} />
    if (shape === 'tank') return <rect x={CX - 34} y={CY - 58} width="68" height="116" rx="3" />
    if (shape === 'porthole') return <polygon points={octagon(dialR - 4)} strokeLinejoin="round" stroke="#000" strokeWidth="14" />
    return <circle cx={CX} cy={CY} r={dialR} />
  }

  const DialBlock = () => (
    <g>
      <clipPath id={id('dialClip')}>{dialClipShape()}</clipPath>
      <g clipPath={`url(#${id('dialClip')})`}>
        <rect x="0" y="0" width="240" height="340" fill={dial} />
        <rect x="0" y="0" width="240" height="340" fill={dialFill()} />
        {sunburst && (
          <g opacity={dark ? 0.16 : 0.1}>
            {Array.from({ length: 90 }, (_, i) => (
              <line key={i} x1={CX} y1={CY} x2={CX} y2={CY - 140} stroke={dark ? '#fff' : '#000'} strokeWidth="0.5" transform={`rotate(${i * 4} ${CX} ${CY})`} />
            ))}
          </g>
        )}
        <rect x="0" y="0" width="240" height="340" fill={`url(#${id('vignette')})`} />
      </g>

      {shape === 'square' && (
        <g transform={`translate(${CX} ${CY}) scale(${scale}) translate(${-CX} ${-CY})`}>
          {RectIndices({ hw: 52, hh: 52 })}
        </g>
      )}
      {shape === 'tank' && RectIndices({ hw: 34, hh: 58 })}
      {(shape === 'round' || shape === 'octagon' || shape === 'porthole') && (
        <>
          {MinuteTrack({ r: dialR - 1 })}
          {RoundIndices({  })}
        </>
      )}

      {chrono && (shape === 'round' || shape === 'octagon') && (
        <>
          {Subdial({ x: CX - dialR * 0.46, y: CY, r: dialR * 0.22, deg: 210 })}
          {Subdial({ x: CX + dialR * 0.46, y: CY, r: dialR * 0.22, deg: 40 })}
          {look.moon ? (
            <g>
              <circle cx={CX} cy={CY + dialR * 0.46} r={dialR * 0.22} fill="#0b1630" stroke="#cfd3d8" strokeOpacity="0.7" strokeWidth="0.8" />
              <circle cx={CX + 2} cy={CY + dialR * 0.46 - 1} r={dialR * 0.1} fill="#f0d98a" />
              <circle cx={CX - 4} cy={CY + dialR * 0.38} r="0.7" fill="#fff" />
              <circle cx={CX + 7} cy={CY + dialR * 0.55} r="0.6" fill="#fff" />
            </g>
          ) : (
            Subdial({ x: CX, y: CY + dialR * 0.46, r: dialR * 0.22, deg: 130 })
          )}
        </>
      )}
      {smallSeconds && Subdial({ x: CX, y: CY + dialR * 0.5, r: dialR * 0.2, deg: secDeg % 360 })}
      {dateWindow && (shape === 'round' || shape === 'octagon' || shape === 'porthole') && DateWin({  })}
      {shape === 'tank' ? BrandText({ y: CY - 30 }) : shape === 'square' ? BrandText({ y: CY - 24 }) : BrandText({  })}
      {Hands({  })}
      {/* crystal reflection */}
      <g clipPath={`url(#${id('dialClip')})`} pointerEvents="none">
        <ellipse cx={CX - 30} cy={CY - 46} rx="70" ry="38" fill="url(#crystal)" transform={`rotate(-28 ${CX} ${CY})`} />
      </g>
    </g>
  )

  /* ───────────── CASES ───────────── */
  const RoundCase = () => {
    const caseR = 80
    const bezOut = caseR - 3
    const bezIn = bezel === 'smooth' || bezel === 'clous' ? caseR - 11 : caseR - 18
    return (
      <g>
        {[-1, 1].map((s) => (
          <g key={s}>
            <path d={`M${CX + s * 26} ${CY - 70} L${CX + s * 34} ${CY - 104} Q${CX + s * 38} ${CY - 108} ${CX + s * 44} ${CY - 102} L${CX + s * 52} ${CY - 58} Z`} fill={`url(#${id('metal')})`} />
            <path d={`M${CX + s * 26} ${CY + 70} L${CX + s * 34} ${CY + 104} Q${CX + s * 38} ${CY + 108} ${CX + s * 44} ${CY + 102} L${CX + s * 52} ${CY + 58} Z`} fill={`url(#${id('metal')})`} />
          </g>
        ))}
        {chrono && (
          <>
            <rect x={CX + 58} y={CY - 58} width="12" height="9" rx="2" fill={`url(#${id('metal')})`} transform={`rotate(-38 ${CX + 58} ${CY - 54})`} />
            <rect x={CX + 58} y={CY + 49} width="12" height="9" rx="2" fill={`url(#${id('metal')})`} transform={`rotate(38 ${CX + 58} ${CY + 54})`} />
          </>
        )}
        {Crown({ x: CX + caseR - 4, cab: look.ballon })}
        {look.ballon && <path d={`M${CX + caseR - 8} ${CY - 22} Q${CX + caseR + 22} ${CY} ${CX + caseR - 8} ${CY + 22}`} fill="none" stroke={`url(#${id('metal')})`} strokeWidth="5" />}
        <circle cx={CX} cy={CY} r={caseR} fill={`url(#${id('metal')})`} />
        <circle cx={CX} cy={CY} r={caseR - 0.5} fill="none" stroke="#000" strokeOpacity="0.25" strokeWidth="1" />
        {/* bezel */}
        {bezel === 'ceramic' && (
          <g>
            <circle cx={CX} cy={CY} r={(bezOut + bezIn) / 2} fill="none" stroke={bezelColor} strokeWidth={bezOut - bezIn} />
            <circle cx={CX} cy={CY} r={(bezOut + bezIn) / 2} fill="none" stroke={`url(#${id('bezelSheen')})`} strokeWidth={bezOut - bezIn} />
            {Array.from({ length: 12 }, (_, i) => {
              const [x, y] = polar((bezOut + bezIn) / 2, i * 30)
              if (i === 0) return <polygon key={i} points={`${x - 4.5},${y - 3.5} ${x + 4.5},${y - 3.5} ${x},${y + 4}`} fill={hands === 'gold' ? A[0] : '#f1efe8'} />
              if (i % 3 === 0) return <text key={i} x={x} y={y + 3} textAnchor="middle" fontSize="8" fontFamily="Inter, sans-serif" fontWeight="600" fill={A[3]} transform={`rotate(${i * 30} ${x} ${y})`}>{i * 5}</text>
              return <rect key={i} x={x - 1.2} y={y - 3.5} width="2.4" height="7" fill={A[3]} transform={`rotate(${i * 30} ${x} ${y})`} />
            })}
            {Array.from({ length: 15 }, (_, i) => i % 5 === 0 ? null : (
              <line key={`m${i}`} x1={CX} x2={CX} y1={CY - bezOut + 4} y2={CY - bezOut + 8} stroke={A[3]} strokeWidth="1" transform={`rotate(${i * 6} ${CX} ${CY})`} />
            ))}
          </g>
        )}
        {bezel === 'pepsi' && (
          <g>
            <path d={`M${CX - bezOut} ${CY} A${bezOut} ${bezOut} 0 0 1 ${CX + bezOut} ${CY} L${CX + bezIn} ${CY} A${bezIn} ${bezIn} 0 0 0 ${CX - bezIn} ${CY} Z`} fill="#a11f2c" />
            <path d={`M${CX - bezOut} ${CY} A${bezOut} ${bezOut} 0 0 0 ${CX + bezOut} ${CY} L${CX + bezIn} ${CY} A${bezIn} ${bezIn} 0 0 1 ${CX - bezIn} ${CY} Z`} fill="#1c3a86" />
            <circle cx={CX} cy={CY} r={(bezOut + bezIn) / 2} fill="none" stroke={`url(#${id('bezelSheen')})`} strokeWidth={bezOut - bezIn} />
            {Array.from({ length: 12 }, (_, i) => {
              const [x, y] = polar((bezOut + bezIn) / 2, i * 30)
              if (i === 0) return <polygon key={i} points={`${x - 4.5},${y - 3.5} ${x + 4.5},${y - 3.5} ${x},${y + 4}`} fill="#f1efe8" />
              if (i % 2 === 0) return <text key={i} x={x} y={y + 3} textAnchor="middle" fontSize="7.5" fontFamily="Inter, sans-serif" fontWeight="600" fill="#e9e6df" transform={`rotate(${i * 30} ${x} ${y})`}>{i * 2}</text>
              return <rect key={i} x={x - 1.1} y={y - 3} width="2.2" height="6" fill="#e9e6df" transform={`rotate(${i * 30} ${x} ${y})`} />
            })}
          </g>
        )}
        {bezel === 'tachy' && (
          <g>
            <circle cx={CX} cy={CY} r={(bezOut + bezIn) / 2} fill="none" stroke={bezelColor} strokeWidth={bezOut - bezIn} />
            <circle cx={CX} cy={CY} r={(bezOut + bezIn) / 2} fill="none" stroke={`url(#${id('bezelSheen')})`} strokeWidth={bezOut - bezIn} />
            {[500, 400, 300, 250, 200, 170, 150, 130, 120, 110, 100, 90, 80, 70].map((n, i) => {
              const a = -150 + i * 22
              const [x, y] = polar((bezOut + bezIn) / 2, a + 150 + 20)
              return <text key={n} x={x} y={y + 2.4} textAnchor="middle" fontSize="5.6" fontFamily="Inter, sans-serif" fontWeight="500" fill={metal === 'yellow' ? A[0] : '#e9e6df'} transform={`rotate(${a + 170} ${x} ${y})`}>{n}</text>
            })}
          </g>
        )}
        {bezel === 'fluted' && (
          <g>
            <circle cx={CX} cy={CY} r={(bezOut + bezIn) / 2} fill="none" stroke={`url(#${id('accent')})`} strokeWidth={bezOut - bezIn} />
            {Array.from({ length: 72 }, (_, i) => (
              <line key={i} x1={CX} x2={CX} y1={CY - bezOut} y2={CY - bezIn} stroke={i % 2 ? '#fff' : '#000'} strokeOpacity={i % 2 ? 0.55 : 0.32} strokeWidth="1.6" transform={`rotate(${i * 5} ${CX} ${CY})`} />
            ))}
          </g>
        )}
        {bezel === 'diamond' && (
          <g>
            <circle cx={CX} cy={CY} r={(bezOut + bezIn) / 2} fill="none" stroke={`url(#${id('metal')})`} strokeWidth={bezOut - bezIn} />
            {Array.from({ length: 40 }, (_, i) => {
              const [x, y] = polar((bezOut + bezIn) / 2, i * 9)
              return <circle key={i} cx={x} cy={y} r="3.6" fill={`url(#${id('gem')})`} stroke="#9aa1aa" strokeWidth="0.4" />
            })}
          </g>
        )}
        {bezel === 'clous' && (
          <g>
            <circle cx={CX} cy={CY} r={(bezOut + bezIn) / 2} fill="none" stroke={`url(#${id('metal')})`} strokeWidth={bezOut - bezIn} />
            {Array.from({ length: 96 }, (_, i) => {
              const [x, y] = polar((bezOut + bezIn) / 2 + (i % 2 ? 1.6 : -1.6), i * 3.75)
              return <circle key={i} cx={x} cy={y} r="1.3" fill="#fff" fillOpacity="0.7" stroke="#000" strokeOpacity="0.3" strokeWidth="0.3" />
            })}
          </g>
        )}
        {bezel === 'smooth' && <circle cx={CX} cy={CY} r={(bezOut + bezIn) / 2} fill="none" stroke={`url(#${id(twoTone ? 'accent' : 'metalR')})`} strokeWidth={bezOut - bezIn} />}
        {look.claws && [0, 90, 180, 270].map((a) => {
          const [x, y] = polar(bezOut - 2, a + 45)
          return <rect key={a} x={x - 5} y={y - 3} width="10" height="6" rx="3" fill={`url(#${id('accent')})`} transform={`rotate(${a + 45} ${x} ${y})`} />
        })}
        <circle cx={CX} cy={CY} r={bezIn} fill="#0b0b0d" />
        <circle cx={CX} cy={CY} r={bezIn - 0.5} fill="none" stroke={M[1]} strokeOpacity="0.6" strokeWidth="1" />
        {DialBlock({  })}
      </g>
    )
  }

  const OctagonCase = () => (
    <g>
      {Crown({ x: CX + 82, cab: false })}
      <path d={`M${CX - 46} ${CY - 92} L${CX + 46} ${CY - 92} Q${CX + 88} ${CY - 84} ${CX + 88} ${CY - 30} L${CX + 88} ${CY + 30} Q${CX + 88} ${CY + 84} ${CX + 46} ${CY + 92} L${CX - 46} ${CY + 92} Q${CX - 88} ${CY + 84} ${CX - 88} ${CY + 30} L${CX - 88} ${CY - 30} Q${CX - 88} ${CY - 84} ${CX - 46} ${CY - 92} Z`} fill={`url(#${id('metal')})`} stroke="#000" strokeOpacity="0.25" />
      {chrono && !look.moon && (
        <>
          <rect x={CX + 84} y={CY - 52} width="12" height="14" rx="3" fill="#1b1c1f" />
          <rect x={CX + 84} y={CY + 38} width="12" height="14" rx="3" fill="#1b1c1f" />
        </>
      )}
      <polygon points={octagon(86)} fill="#111214" strokeLinejoin="round" stroke="#111214" strokeWidth="6" />
      <polygon points={octagon(82)} fill={`url(#${id('octBezel')})`} strokeLinejoin="round" stroke={`url(#${id('metalR')})`} strokeWidth="5" />
      {look.diamonds && Array.from({ length: 32 }, (_, i) => {
        const [x, y] = polar(70, i * 11.25)
        return <circle key={i} cx={x} cy={y} r="3.2" fill={`url(#${id('gem')})`} stroke={A[2]} strokeWidth="0.4" />
      })}
      {!look.diamonds && Array.from({ length: 8 }, (_, i) => {
        const a = rad(22.5 + i * 45)
        const x = CX + 71 * Math.cos(a), y = CY + 71 * Math.sin(a)
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="5.2" fill={`url(#${id('metal')})`} stroke="#000" strokeOpacity="0.35" strokeWidth="0.6" />
            <polygon points={Array.from({ length: 6 }, (_, k) => `${x + 3 * Math.cos(rad(k * 60 + i * 13))},${y + 3 * Math.sin(rad(k * 60 + i * 13))}`).join(' ')} fill="none" stroke="#000" strokeOpacity="0.45" strokeWidth="0.6" />
          </g>
        )
      })}
      <circle cx={CX} cy={CY} r={dialR + 3} fill="#0d0d0f" />
      {DialBlock({  })}
    </g>
  )

  const PortholeCase = () => (
    <g>
      {[-1, 1].map((s) => (
        <rect key={s} x={s < 0 ? CX - 100 : CX + 80} y={CY - 26} width="20" height="52" rx="9" fill={`url(#${id('metal')})`} stroke="#000" strokeOpacity="0.25" />
      ))}
      {Crown({ x: CX + 96 })}
      <polygon points={octagon(76)} fill={`url(#${id('metal')})`} strokeLinejoin="round" stroke={`url(#${id('metal')})`} strokeWidth="26" />
      <polygon points={octagon(70)} fill={`url(#${id('hzMetal')})`} strokeLinejoin="round" stroke={`url(#${id('hzMetal')})`} strokeWidth="14" />
      <polygon points={octagon(dialR - 4)} fill="#0d0d0f" strokeLinejoin="round" stroke="#0d0d0f" strokeWidth="18" />
      {DialBlock({  })}
    </g>
  )

  const SquareCase = () => {
    const s = scale
    const half = 74 * s
    return (
      <g>
        {Crown({ x: CX + half - 4, cab: true })}
        {!noScrews && <polygon points={`${CX + half - 2},${CY - 15} ${CX + half + 12},${CY - 9} ${CX + half + 12},${CY + 9} ${CX + half - 2},${CY + 15}`} fill={`url(#${id('metal')})`} />}
        <rect x={CX - half} y={CY - half} width={half * 2} height={half * 2} rx={30 * s} fill={`url(#${id('metal')})`} stroke="#000" strokeOpacity="0.25" />
        <rect x={CX - half + 9 * s} y={CY - half + 9 * s} width={(half - 9 * s) * 2} height={(half - 9 * s) * 2} rx={22 * s} fill={`url(#${id('metalR')})`} />
        {!noScrews && [[-1, -1], [0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0]].map(([dx, dy], i) => {
          const off = (half - 16 * s) * (dx && dy ? 0.86 : 1)
          const x = CX + dx * off, y = CY + dy * off
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={4.4 * s} fill={`url(#${id('metal')})`} stroke="#000" strokeOpacity="0.4" strokeWidth="0.5" />
              <line x1={x - 2.6 * s} x2={x + 2.6 * s} y1={y} y2={y} stroke="#000" strokeOpacity="0.5" strokeWidth="0.8" transform={`rotate(${i * 37} ${x} ${y})`} />
            </g>
          )
        })}
        <rect x={CX - 54 * s} y={CY - 54 * s} width={108 * s} height={108 * s} rx={13 * s} fill="#0d0d0f" />
        {DialBlock({  })}
      </g>
    )
  }

  const TankCase = () => (
    <g>
      {[-1, 1].map((s) => (
        <rect key={s} x={s < 0 ? CX - 54 : CX + 40} y={CY - 98} width="14" height="196" rx="6" fill={`url(#${id('metal')})`} stroke="#000" strokeOpacity="0.25" />
      ))}
      <rect x={CX - 44} y={CY - 76} width="88" height="152" rx="6" fill={`url(#${id('metalR')})`} />
      <g>
        <rect x={CX + 52} y={CY - 4} width="5" height="8" fill={`url(#${id('metal')})`} />
        <circle cx={CX + 61} cy={CY} r="5.5" fill={`url(#${id('metal')})`} stroke="#000" strokeOpacity="0.3" strokeWidth="0.5" />
        <circle cx={CX + 61} cy={CY} r="3" fill="url(#cab)" />
      </g>
      <rect x={CX - 36} y={CY - 60} width="72" height="120" rx="4" fill="#0d0d0f" />
      {DialBlock({  })}
    </g>
  )

  return (
    <svg viewBox="0 0 240 340" className={className} role="img" aria-label={title || `${brand} watch illustration`}>
      <defs>
        {metalGrad(id('metal'), M)}
        {metalGrad(id('accent'), A)}
        <radialGradient id={id('metalR')} cx="0.35" cy="0.3" r="0.9">
          <stop offset="0" stopColor={(twoTone ? A : M)[0]} />
          <stop offset="0.5" stopColor={(twoTone ? A : M)[1]} />
          <stop offset="1" stopColor={(twoTone ? A : M)[2]} />
        </radialGradient>
        <linearGradient id={id('octBezel')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={M[0]} /><stop offset="0.45" stopColor={M[1]} /><stop offset="0.55" stopColor={M[3]} /><stop offset="1" stopColor={M[2]} />
        </linearGradient>
        <linearGradient id={id('hzMetal')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={M[3]} /><stop offset="0.5" stopColor={M[1]} /><stop offset="1" stopColor={M[2]} />
        </linearGradient>
        <linearGradient id={id('band')} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={M[4]} /><stop offset="0.18" stopColor={M[1]} /><stop offset="0.5" stopColor={M[0]} /><stop offset="0.82" stopColor={M[1]} /><stop offset="1" stopColor={M[4]} />
        </linearGradient>
        <linearGradient id={id('bandC')} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={M[2]} /><stop offset="0.5" stopColor={M[0]} /><stop offset="1" stopColor={M[2]} />
        </linearGradient>
        <linearGradient id={id('bandA')} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={A[2]} /><stop offset="0.5" stopColor={A[0]} /><stop offset="1" stopColor={A[2]} />
        </linearGradient>
        <linearGradient id={id('strapShade')} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0.55" /><stop offset="0.25" stopColor="#fff" stopOpacity="0.08" /><stop offset="0.6" stopColor="#fff" stopOpacity="0.04" /><stop offset="1" stopColor="#000" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id={id('fadeG')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" /><stop offset="0.16" stopColor="#fff" /><stop offset="0.84" stopColor="#fff" /><stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id={id('fade')} maskUnits="userSpaceOnUse" x="0" y="0" width="240" height="340">
          <rect x="0" y="0" width="240" height="340" fill={`url(#${id('fadeG')})`} />
        </mask>
        <pattern id={id('grain')} width="4" height="4" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.5" fill="#000" /><circle cx="3" cy="3" r="0.4" fill="#fff" fillOpacity="0.4" />
        </pattern>
        <radialGradient id={id('dialG')} cx="0.45" cy="0.4" r="0.75">
          <stop offset="0" stopColor={shade(dial, dark ? 0.22 : 0.25)} />
          <stop offset="0.65" stopColor={dial} />
          <stop offset="1" stopColor={shade(dial, -0.35)} />
        </radialGradient>
        <radialGradient id={id('vignette')} cx={CX} cy={CY} r="90" gradientUnits="userSpaceOnUse">
          <stop offset="0.55" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity={dark ? 0.55 : 0.18} />
        </radialGradient>
        <pattern id={id('tap')} width="5.4" height="5.4" patternUnits="userSpaceOnUse">
          <rect width="5.4" height="5.4" fill={shade(dial, -0.35)} />
          <rect x="0.7" y="0.7" width="4" height="4" rx="0.4" fill={shade(dial, 0.12)} />
          <rect x="0.7" y="0.7" width="4" height="1.4" rx="0.4" fill={shade(dial, 0.3)} opacity="0.6" />
        </pattern>
        <pattern id={id('hz')} width="6" height="3.2" patternUnits="userSpaceOnUse">
          <rect width="6" height="3.2" fill={dial} />
          <rect y="0" width="6" height="1.4" fill={shade(dial, 0.2)} />
        </pattern>
        <pattern id={id('chk')} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="6" height="6" fill={shade(dial, -0.3)} />
          <rect x="0.8" y="0.8" width="4.4" height="4.4" rx="1.6" fill={shade(dial, 0.12)} />
        </pattern>
        <pattern id={id('wave')} width="20" height="7" patternUnits="userSpaceOnUse">
          <rect width="20" height="7" fill={dial} />
          <path d="M0 3.5 Q5 0 10 3.5 T20 3.5" fill="none" stroke={shade(dial, 0.28)} strokeWidth="1.4" />
        </pattern>
        <pattern id={id('teak')} width="5" height="10" patternUnits="userSpaceOnUse">
          <rect width="5" height="10" fill={dial} />
          <rect width="2" height="10" fill={shade(dial, 0.18)} />
        </pattern>
        <radialGradient id={id('pearl')} cx="0.4" cy="0.35" r="0.8">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.3" stopColor="#f6e9ef" />
          <stop offset="0.55" stopColor="#e7eef4" />
          <stop offset="0.8" stopColor="#f2e8dc" />
          <stop offset="1" stopColor={shade(dial, -0.15)} />
        </radialGradient>
        <radialGradient id={id('snail')} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff" stopOpacity="0" /><stop offset="0.6" stopColor="#fff" stopOpacity="0.15" /><stop offset="1" stopColor="#000" stopOpacity="0.2" />
        </radialGradient>
        <radialGradient id={id('gem')} cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#ffffff" /><stop offset="0.5" stopColor="#e3ecf5" /><stop offset="1" stopColor="#8f9cab" />
        </radialGradient>
        <linearGradient id={id('bezelSheen')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.28" /><stop offset="0.4" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity="0.25" />
        </linearGradient>
        <radialGradient id="crystal" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff" stopOpacity="0.16" /><stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="cab" cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#7aa2ff" /><stop offset="0.6" stopColor="#1d3fa8" /><stop offset="1" stopColor="#0b1a52" />
        </radialGradient>
        <filter id={id('shadow')} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="10" stdDeviation="9" floodColor="#000" floodOpacity="0.45" />
        </filter>
      </defs>
      {renderStrap()}
      <g filter={`url(#${id('shadow')})`}>
        {shape === 'round' && RoundCase({  })}
        {shape === 'octagon' && OctagonCase({  })}
        {shape === 'porthole' && PortholeCase({  })}
        {shape === 'square' && SquareCase({  })}
        {shape === 'tank' && TankCase({  })}
      </g>
    </svg>
  )
}

export default memo(WatchSVG)
