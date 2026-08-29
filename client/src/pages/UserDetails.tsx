import { useEffect, useState } from 'react'

import {
  Link,
  useParams
} from 'react-router'

import StatusBadge from '../components/StatusBadge.js'
import { getUser } from '../services/users.service.js'

import type { AdminUser } from '../types/AdminUser.js'

function UserDetails() {
  const { id } = useParams()

  const [user, setUser] =
    useState<AdminUser | null>(null)

  const [error, setError] =
    useState('')

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
          setError(
            'Unable to load user.'
          )
        }
      })

    return () => {
      cancelled = true
    }
  }, [id])

  if (!id) {
    return (
      <p role="alert">
        Invalid user ID.
      </p>
    )
  }

  if (error) {
    return (
      <p role="alert">
        {error}
      </p>
    )
  }

  if (!user) {
    return <p>Loading user...</p>
  }

  return (
    <div className="detail-page">
      <div className="page-header">
        <div>
          <h1>{user.name}</h1>

          <p>
            User #{user.user_id}
          </p>
        </div>

        <Link
          className="button"
          to={`/users/${user.user_id}/edit`}
        >
          Edit User
        </Link>
      </div>

      <div className="details-card">
        <div className="details-list">
          <div className="details-row">
            <span className="details-label">
              Email
            </span>

            <span className="details-value">
              {user.email}
            </span>
          </div>

          <div className="details-row">
            <span className="details-label">
              Role
            </span>

            <span className="details-value">
              {user.role_name}
            </span>
          </div>

          <div className="details-row">
            <span className="details-label">
              Status
            </span>

            <span className="details-value">
              <StatusBadge
                value={
                  user.is_active
                    ? 'Active'
                    : 'Inactive'
                }
              />
            </span>
          </div>

          <div className="details-row">
            <span className="details-label">
              Created
            </span>

            <span className="details-value">
              {new Date(
                user.created_at
              ).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <Link
        className="back-link"
        to="/users"
      >
        ← Back to Users
      </Link>
    </div>
  )
}

export default UserDetails