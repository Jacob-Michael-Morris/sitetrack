import type { User } from '../types/User.js'

const API_URL = 'http://localhost:3000/api/auth'

export async function login(
  email: string,
  password: string
): Promise<User> {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      password
    })
  })

  if (!response.ok) {
    throw new Error('Invalid email or password')
  }

  return response.json()
}

export async function logout() {
  const response = await fetch(`${API_URL}/logout`, {
    method: 'POST',
    credentials: 'include'
  })

  if (!response.ok) {
    throw new Error('Unable to log out')
  }
}

export async function getCurrentUser(): Promise<User> {
  const response = await fetch(`${API_URL}/me`, {
    credentials: 'include'
  })

  if (!response.ok) {
    throw new Error('Not authenticated')
  }

  return response.json()
}