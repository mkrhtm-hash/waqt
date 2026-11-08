import WatchSVG from './WatchSVG'
import { getLook } from '../config/looks'

/**
 * Shows the watch's photo when the database has an image_url,
 * otherwise the stylised SVG illustration (no official brand artwork).
 */
export default function WatchVisual({ watch, className = '', live = false, title }) {
  if (!watch) return null
  if (watch.imageUrl) {
    return <img src={watch.imageUrl} alt={title || watch.model} className={`object-contain ${className}`} loading="lazy" />
  }
  return <WatchSVG look={getLook(watch)} brand={watch.brand?.name || watch.brandName || ''} live={live} className={className} title={title || watch.model} />
}
