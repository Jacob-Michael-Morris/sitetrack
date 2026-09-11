import { Navigate, Outlet } from 'react-router'

import { useAuth } from '../context/useAuth.js'

function RequireAuth() {
  const { user, loading } = useAuth()

  if (loading) {
    return <p>Loading SiteTrack...</p>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default RequireAuth