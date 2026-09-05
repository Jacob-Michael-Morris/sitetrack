import API_BASE_URL from '../config/api.js'
import { apiRequest } from '../utils/api-request.js'

import type { Role } from '../types/Role.js'

import type {
  Permission,
  RolePermission
} from '../types/Permission.js'

const API_URL =
  `${API_BASE_URL}/roles`

interface RolePermissionsResponse {
  role: Role
  permissions: RolePermission[]
}

interface UpdateRolePermissionsResponse {
  message: string
  permissions: RolePermission[]
}

export async function getRoles():
Promise<Role[]> {
  return apiRequest<Role[]>(
    API_URL,
    {},
    'Unable to retrieve roles'
  )
}

export async function getPermissions():
Promise<Permission[]> {
  return apiRequest<Permission[]>(
    `${API_URL}/permissions`,
    {},
    'Unable to retrieve permissions'
  )
}

export async function getRolePermissions(
  roleId: number
): Promise<RolePermissionsResponse> {
  return apiRequest<RolePermissionsResponse>(
    `${API_URL}/${roleId}/permissions`,
    {},
    'Unable to retrieve role permissions'
  )
}

export async function updateRolePermissions(
  roleId: number,
  permissionKeys: string[]
): Promise<UpdateRolePermissionsResponse> {
  return apiRequest<UpdateRolePermissionsResponse>(
    `${API_URL}/${roleId}/permissions`,
    {
      method: 'PUT',
      body: JSON.stringify({
        permission_keys:
          permissionKeys
      })
    },
    'Unable to update role permissions'
  )
}