import { useAuth } from '../../context/AuthContext'
import ResponsiveLayout from '../layout/ResponsiveLayout'
import GuestLayout from '../layout/GuestLayout'

/**
 * Route wrapper that renders the full layout for authenticated users
 * and a minimal guest layout for unauthenticated users.
 * This allows the same URL paths to work for both.
 */
export function PublicAccessRoute() {
  const { isLoggedIn, loading } = useAuth()

  if (loading) {
    return null
  }

  // Authenticated users get sidebar, bottom nav, etc.
  if (isLoggedIn) {
    return <ResponsiveLayout />
  }

  // Guests get a minimal top-bar layout
  return <GuestLayout />
}