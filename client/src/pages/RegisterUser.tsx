import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import { getRoles } from '../services/roles.service.js'
import { createUser } from '../services/users.service.js'

import type { Role } from '../types/Role.js'

function RegisterUser() {
  const navigate = useNavigate()

  const [roles, setRoles] = useState<Role[]>([])

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [roleId, setRoleId] = useState('')

  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    getRoles()
      .then((data) => {
        if (!cancelled) {
          setRoles(data)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError('Unable to load roles.')
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    try {
      const user = await createUser({
        name,
        email,
        password,
        role_id: Number(roleId)
      })

      navigate(`/users/${user.user_id}`)
    } catch {
      setError('Unable to create user.')
    }
  }

  return (
    <div>
      <h1>Create User</h1>

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
          Temporary Password
          <input
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
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

        <button type="submit">
          Create User
        </button>
      </form>
    </div>
  )
}

export default RegisterUser