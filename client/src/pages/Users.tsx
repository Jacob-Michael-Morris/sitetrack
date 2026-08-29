import { useEffect, useState } from 'react'
import { Link } from 'react-router'

import StatusBadge from '../components/StatusBadge.js'
import { getUsers } from '../services/users.service.js'

import type { AdminUser } from '../types/AdminUser.js'

function Users() {
  const [users, setUsers] =
    useState<AdminUser[]>([])

  const [search, setSearch] =
    useState('')

  const [statusFilter, setStatusFilter] =
    useState('All')

  const [error, setError] =
    useState('')

  useEffect(() => {
    let cancelled = false

    getUsers()
      .then((data) => {
        if (!cancelled) {
          setUsers(data)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(
            'Unable to load users.'
          )
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  const filteredUsers =
    users.filter((user) => {
      const searchValue =
        search.toLowerCase()

      const matchesSearch =
        user.name
          .toLowerCase()
          .includes(searchValue) ||
        user.email
          .toLowerCase()
          .includes(searchValue) ||
        user.role_name
          .toLowerCase()
          .includes(searchValue)

      const matchesStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Active' &&
          user.is_active) ||
        (statusFilter === 'Inactive' &&
          !user.is_active)

      return (
        matchesSearch &&
        matchesStatus
      )
    })

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Users</h1>

          <p>
            Manage SiteTrack user
            accounts and roles.
          </p>
        </div>

        <Link
          className="button"
          to="/users/new"
        >
          Create User
        </Link>
      </div>

      {error && (
        <p role="alert">
          {error}
        </p>
      )}

      <div className="toolbar">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value
            )
          }
        />

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target.value
            )
          }
        >
          <option value="All">
            All Accounts
          </option>

          <option value="Active">
            Active
          </option>

          <option value="Inactive">
            Inactive
          </option>
        </select>
      </div>

      <div className="responsive-table-view">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map(
              (user) => (
                <tr
                  key={user.user_id}
                >
                  <td>
                    {user.name}
                  </td>

                  <td>
                    {user.email}
                  </td>

                  <td>
                    {user.role_name}
                  </td>

                  <td>
                    <StatusBadge
                      value={
                        user.is_active
                          ? 'Active'
                          : 'Inactive'
                      }
                    />
                  </td>

                  <td>
                    <Link
                      to={`/users/${user.user_id}`}
                    >
                      Select User
                    </Link>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      <div className="mobile-card-list">
        {filteredUsers.map(
          (user) => (
            <article
              className="mobile-data-card"
              key={user.user_id}
            >
              <div className="mobile-data-card-header">
                <h2>
                  {user.name}
                </h2>

                <StatusBadge
                  value={
                    user.is_active
                      ? 'Active'
                      : 'Inactive'
                  }
                />
              </div>

              <div className="mobile-data-card-body">
                <div className="mobile-data-row">
                  <span className="mobile-data-label">
                    Email
                  </span>

                  <span>
                    {user.email}
                  </span>
                </div>

                <div className="mobile-data-row">
                  <span className="mobile-data-label">
                    Role
                  </span>

                  <span>
                    {user.role_name}
                  </span>
                </div>

                <div className="mobile-data-row">
                  <span className="mobile-data-label">
                    Status
                  </span>

                  <StatusBadge
                    value={
                      user.is_active
                        ? 'Active'
                        : 'Inactive'
                    }
                  />
                </div>
              </div>

              <Link
                className="mobile-card-action"
                to={`/users/${user.user_id}`}
              >
                Select User
              </Link>
            </article>
          )
        )}
      </div>

      {filteredUsers.length === 0 &&
        !error && (
          <p>No users found.</p>
        )}
    </div>
  )
}

export default Users