import { useAuth } from '../auth/useAuth'
import HomePage from './HomePage'
import PortalPage from './PortalPage'

export default function IndexPage() {
  const { session, loading } = useAuth()
  if (loading) return null
  return session ? <PortalPage /> : <HomePage />
}

