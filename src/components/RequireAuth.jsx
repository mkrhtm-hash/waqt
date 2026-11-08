import { Navigate, useLocation } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { Page } from './ui'
import { PanelSkeleton } from './Skeleton'

/** Pages that need a signed-in client. Logged-out visitors go to sign-in and come straight back. */
export default function RequireAuth({ children }) {
  const { user, authReady } = useStore()
  const location = useLocation()
  if (!authReady) {
    return (
      <Page className="mx-auto max-w-3xl px-5 pt-20">
        <PanelSkeleton rows={4} />
      </Page>
    )
  }
  if (!user) return <Navigate to={`/login?next=${encodeURIComponent(location.pathname + location.search)}`} replace />
  return children
}
