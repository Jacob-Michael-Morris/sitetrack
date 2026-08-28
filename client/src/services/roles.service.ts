import type { Role } from '../types/Role.js'
import API_BASE_URL from '../config/api.js'

const API_URL = `${API_BASE_URL}/roles`

export async function getRoles(): Promise<Role[]> {
  const response = await fetch(API_URL, {
    credentials: 'include'
  })

  if (!response.ok) {
    throw new Error('Unable to retrieve roles')
  }

  return response.json()
}