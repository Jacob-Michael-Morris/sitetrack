import {
  Navigate,
  Outlet
} from 'react-router'

import { useAuth } from '../context/useAuth.js'

interface RequirePermissionProps {
  permission: string
}

function RequirePermission({
  permission
}: RequirePermissionProps) {
  const {
    user,
    hasPermission
  } = useAuth()

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    )
  }

  if (
    !hasPermission(permission)
  ) {
    return (
      <Navigate
        to="/forbidden"
        replace
      />
    )
  }

  return <Outlet />
}

export default RequirePermission