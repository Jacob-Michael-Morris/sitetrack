import API_BASE_URL from '../config/api.js'
import { apiRequest } from '../utils/api-request.js'

import type { Role } from '../types/Role.js'

const API_URL =
  `${API_BASE_URL}/roles`

export async function getRoles():
Promise<Role[]> {
  return apiRequest<Role[]>(
    API_URL,
    {},
    'Unable to retrieve roles'
  )
}