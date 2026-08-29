import API_BASE_URL from '../config/api.js'
import { apiRequest } from '../utils/api-request.js'

import type { User } from '../types/User.js'

const API_URL =
  `${API_BASE_URL}/auth`

export async function login(
  email: string,
  password: string
): Promise<User> {
  return apiRequest<User>(
    `${API_URL}/login`,
    {
      method: 'POST',
      body: JSON.stringify({
        email,
        password
      })
    },
    'Invalid email or password'
  )
}

export async function logout():
Promise<void> {
  await apiRequest(
    `${API_URL}/logout`,
    {
      method: 'POST'
    },
    'Unable to log out'
  )
}

export async function getCurrentUser():
Promise<User> {
  return apiRequest<User>(
    `${API_URL}/me`,
    {},
    'Not authenticated'
  )
}