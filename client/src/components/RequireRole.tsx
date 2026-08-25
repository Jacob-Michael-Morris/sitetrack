import {
  Navigate,
  Outlet
} from 'react-router'

import { useAuth } from '../context/useAuth.js'

interface RequireRoleProps {
  allowedRoles: string[]
}

function RequireRole({
  allowedRoles
}: RequireRoleProps) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/forbidden" replace />
  }

  return <Outlet />
}

export default RequireRole