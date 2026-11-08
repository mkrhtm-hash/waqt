import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Page } from '../components/ui'
import WatchSVG from '../components/WatchSVG'

const melted = { shape: 'round', metal: 'yellow', dial: '#0e0f12', bezel: 'smooth', dialStyle: 'sunburst', strap: 'leather', strapColor: '#1b1b1f', hands: 'gold' }

export default function NotFound() {
  const { t } = useTranslation()
  return (
    <Page className="flex items-center px-5 py-16">
      <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-2">
        <div className="flex justify-center">
          <WatchSVG look={melted} brand="WAQT" className="h-80 w-auto animate-float [transform:skewY(-8deg)_rotate(-12deg)]" />
        </div>
        <div className="text-center md:text-start">
          <p className="font-display text-8xl font-light text-gold-gradient">404</p>
          <h1 className="mt-2 font-display text-4xl font-light md:text-5xl">{t('notFound.title')}</h1>
          <p className="mt-4 text-sm text-muted">{t('notFound.text')}</p>
          <Link to="/" className="btn-gold mt-8">{t('notFound.cta')}</Link>
        </div>
      </div>
    </Page>
  )
}
