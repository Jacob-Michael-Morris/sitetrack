import { useEffect, useState } from 'react'
import {
  Link,
  useParams
} from 'react-router'

import { getUser } from '../services/users.service.js'

import type { AdminUser } from '../types/AdminUser.js'

function UserDetails() {
  const { id } = useParams()

  const [user, setUser] = useState<AdminUser | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) {
      return
    }

    let cancelled = false

    getUser(id)
      .then((data) => {
        if (!cancelled) {
          setUser(data)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError('Unable to load user.')
        }
      })

    return () => {
      cancelled = true
    }
  }, [id])

  if (error) {
    return <p>{error}</p>
  }

  if (!user) {
    return <p>Loading user...</p>
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>{user.name}</h1>
          <p>User #{user.user_id}</p>
        </div>

        <Link
          className="button"
          to={`/users/${user.user_id}/edit`}
        >
          Edit User
        </Link>
      </div>

      <div className="details-card">
        <p>
          <strong>Email:</strong>{' '}
          {user.email}
        </p>

        <p>
          <strong>Role:</strong>{' '}
          {user.role_name}
        </p>

        <p>
          <strong>Status:</strong>{' '}
          {user.is_active
            ? 'Active'
            : 'Inactive'}
        </p>

        <p>
          <strong>Created:</strong>{' '}
          {new Date(
            user.created_at
          ).toLocaleString()}
        </p>
      </div>

      <Link to="/users">
        Back to Users
      </Link>
    </div>
  )
}

export default UserDetails