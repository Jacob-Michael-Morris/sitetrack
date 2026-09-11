import {
  useEffect,
  useState
} from 'react'

import {
  getRolePermissions,
  getRoles,
  updateRolePermissions
} from './roles.service.js'

import type { Role } from './Role.js'

import type {
  RolePermission
} from './Permission.js'

function ManageRoles() {
  const [roles, setRoles] =
    useState<Role[]>([])

  const [
    selectedRoleId,
    setSelectedRoleId
  ] = useState<number | null>(
    null
  )

  const [
    permissions,
    setPermissions
  ] = useState<RolePermission[]>(
    []
  )

  const [
    enabledPermissionKeys,
    setEnabledPermissionKeys
  ] = useState<string[]>([])

  const [loading, setLoading] =
    useState(true)

  const [saving, setSaving] =
    useState(false)

  const [error, setError] =
    useState('')

  const [message, setMessage] =
    useState('')

  useEffect(() => {
    let cancelled = false

    getRoles()
      .then((data) => {
        if (cancelled) {
          return
        }

        setRoles(data)

        if (data.length > 0) {
          setSelectedRoleId(
            data[0].role_id
          )
        }

        setLoading(false)
      })
      .catch(() => {
        if (!cancelled) {
          setError(
            'Unable to load roles.'
          )

          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (selectedRoleId === null) {
      return
    }

    let cancelled = false

    getRolePermissions(
      selectedRoleId
    )
      .then((data) => {
        if (cancelled) {
          return
        }

        setPermissions(
          data.permissions
        )

        setEnabledPermissionKeys(
          data.permissions
            .filter(
              (permission) =>
                permission.enabled
            )
            .map(
              (permission) =>
                permission.permission_key
            )
        )
      })
      .catch(() => {
        if (!cancelled) {
          setError(
            'Unable to load role permissions.'
          )
        }
      })

    return () => {
      cancelled = true
    }
  }, [selectedRoleId])

  const selectedRole =
    roles.find(
      (role) =>
        role.role_id ===
        selectedRoleId
    )

  const categories =
    Array.from(
      new Set(
        permissions.map(
          (permission) =>
            permission.category
        )
      )
    )

  function handleRoleChange(
    roleId: number
  ) {
    setError('')
    setMessage('')
    setPermissions([])
    setEnabledPermissionKeys([])
    setSelectedRoleId(roleId)
  }

  function handleToggle(
    permissionKey: string
  ) {
    setMessage('')

    setEnabledPermissionKeys(
      (current) => {
        if (
          current.includes(
            permissionKey
          )
        ) {
          return current.filter(
            (key) =>
              key !== permissionKey
          )
        }

        return [
          ...current,
          permissionKey
        ]
      }
    )
  }

  async function handleSave() {
    if (selectedRoleId === null) {
      return
    }

    setSaving(true)
    setError('')
    setMessage('')

    try {
      const result =
        await updateRolePermissions(
          selectedRoleId,
          enabledPermissionKeys
        )

      setPermissions(
        result.permissions
      )

      setEnabledPermissionKeys(
        result.permissions
          .filter(
            (permission) =>
              permission.enabled
          )
          .map(
            (permission) =>
              permission.permission_key
          )
      )

      setMessage(
        'Role permissions updated successfully.'
      )
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : 'Unable to update role permissions.'
      )
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <p>
        Loading role permissions...
      </p>
    )
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Manage Roles</h1>

          <p>
            Configure what each
            SiteTrack role is allowed
            to do.
          </p>
        </div>
      </div>

      {error && (
        <p role="alert">
          {error}
        </p>
      )}

      {message && (
        <p>
          {message}
        </p>
      )}

      <div className="toolbar">
        <label>
          Role

          <select
            value={
              selectedRoleId ?? ''
            }
            onChange={(event) =>
              handleRoleChange(
                Number(
                  event.target.value
                )
              )
            }
          >
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
      </div>

      {selectedRole && (
        <div>
          <h2>
            {selectedRole.name}
          </h2>

          {selectedRole.description && (
            <p>
              {
                selectedRole.description
              }
            </p>
          )}
        </div>
      )}

      {categories.map(
        (category) => {
          const categoryPermissions =
            permissions.filter(
              (permission) =>
                permission.category ===
                category
            )

          return (
            <section
              key={category}
            >
              <h2>
                {category}
              </h2>

              <div className="responsive-table-view">
                <table>
                  <thead>
                    <tr>
                      <th>
                        Allowed
                      </th>

                      <th>
                        Permission
                      </th>

                      <th>
                        Description
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {categoryPermissions.map(
                      (permission) => {
                        const checked =
                          enabledPermissionKeys
                            .includes(
                              permission
                                .permission_key
                            )

                        const protectedPermission =
                          selectedRole
                            ?.name ===
                            'Administrator' &&
                          permission
                            .permission_key ===
                            'roles.manage'

                        return (
                          <tr
                            key={
                              permission
                                .permission_id
                            }
                          >
                            <td>
                              <input
                                type="checkbox"
                                checked={
                                  checked
                                }
                                disabled={
                                  protectedPermission
                                }
                                onChange={() =>
                                  handleToggle(
                                    permission
                                      .permission_key
                                  )
                                }
                                aria-label={
                                  permission
                                    .display_name
                                }
                              />
                            </td>

                            <td>
                              {
                                permission
                                  .display_name
                              }
                            </td>

                            <td>
                              {
                                permission
                                  .description ??
                                ''
                              }
                            </td>
                          </tr>
                        )
                      }
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )
        }
      )}

      <button
        type="button"
        className="button"
        disabled={
          saving ||
          selectedRoleId === null
        }
        onClick={handleSave}
      >
        {saving
          ? 'Saving...'
          : 'Save Permissions'}
      </button>
    </div>
  )
}

export default ManageRoles