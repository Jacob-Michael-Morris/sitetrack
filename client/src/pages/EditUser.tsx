import { useEffect, useState } from 'react'
import {
  useNavigate,
  useParams
} from 'react-router'

import { getRoles } from '../services/roles.service.js'

import {
  getUser,
  updateUser
} from '../services/users.service.js'

import type { Role } from '../types/Role.js'

function EditUser() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [roles, setRoles] = useState<Role[]>([])

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [roleId, setRoleId] = useState('')
  const [isActive, setIsActive] = useState(true)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) {
      return
    }

    let cancelled = false

    Promise.all([
      getUser(id),
      getRoles()
    ])
      .then(([user, roleData]) => {
        if (cancelled) {
          return
        }

        setName(user.name)
        setEmail(user.email)
        setRoleId(String(user.role_id))
        setIsActive(user.is_active)
        setRoles(roleData)
      })
      .catch(() => {
        if (!cancelled) {
          setError('Unable to load user.')
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [id])

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    if (!id) {
      return
    }

    try {
      await updateUser(id, {
        name,
        email,
        role_id: Number(roleId),
        is_active: isActive
      })

      navigate(`/users/${id}`)
    } catch {
      setError('Unable to update user.')
    }
  }

  if (loading) {
    return <p>Loading user...</p>
  }

  return (
    <div>
      <h1>Edit User</h1>

      {error && <p>{error}</p>}

      <form
        className="tool-form"
        onSubmit={handleSubmit}
      >
        <label>
          Name
          <input
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            required
          />
        </label>

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            required
          />
        </label>

        <label>
          Role
          <select
            value={roleId}
            onChange={(event) =>
              setRoleId(event.target.value)
            }
            required
          >
            <option value="">
              Select Role
            </option>

            {roles.map((role) => (
              <option
                key={role.role_id}
                value={role.role_id}
              >
                {role.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Account Status
          <select
            value={
              isActive
                ? 'Active'
                : 'Inactive'
            }
            onChange={(event) =>
              setIsActive(
                event.target.value === 'Active'
              )
            }
          >
            <option value="Active">
              Active
            </option>

            <option value="Inactive">
              Inactive
            </option>
          </select>
        </label>

        <button type="submit">
          Save Changes
        </button>
      </form>
    </div>
  )
}

export default EditUser