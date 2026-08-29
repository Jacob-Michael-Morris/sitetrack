import API_BASE_URL from '../config/api.js'
import { apiRequest } from '../utils/api-request.js'

import type {
  AdminUser,
  CreateUserInput,
  UpdateUserInput
} from '../types/AdminUser.js'

const API_URL =
  `${API_BASE_URL}/users`

export async function getUsers():
Promise<AdminUser[]> {
  return apiRequest<AdminUser[]>(
    API_URL,
    {},
    'Unable to retrieve users'
  )
}

export async function getUser(
  id: string
): Promise<AdminUser> {
  return apiRequest<AdminUser>(
    `${API_URL}/${id}`,
    {},
    'Unable to retrieve user'
  )
}

export async function createUser(
  user: CreateUserInput
): Promise<AdminUser> {
  return apiRequest<AdminUser>(
    API_URL,
    {
      method: 'POST',
      body: JSON.stringify(user)
    },
    'Unable to create user'
  )
}

export async function updateUser(
  id: string,
  user: UpdateUserInput
): Promise<AdminUser> {
  return apiRequest<AdminUser>(
    `${API_URL}/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(user)
    },
    'Unable to update user'
  )
}