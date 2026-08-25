import type { Role } from '../types/Role.js'

const API_URL = 'http://localhost:3000/api/roles'

export async function getRoles(): Promise<Role[]> {
  const response = await fetch(API_URL, {
    credentials: 'include'
  })

  if (!response.ok) {
    throw new Error('Unable to retrieve roles')
  }

  return response.json()
}