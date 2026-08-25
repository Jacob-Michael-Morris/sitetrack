import type {
  AdminUser,
  CreateUserInput,
  UpdateUserInput
} from '../types/AdminUser.js'

const API_URL = 'http://localhost:3000/api/users'

async function getErrorMessage(
  response: Response,
  fallback: string
) {
  try {
    const data = await response.json()

    if (
      typeof data.message === 'string' &&
      data.message.length > 0
    ) {
      return data.message
    }
  } catch {
    return fallback
  }

  return fallback
}

export async function getUsers(): Promise<AdminUser[]> {
  const response = await fetch(API_URL, {
    credentials: 'include'
  })

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        'Unable to retrieve users'
      )
    )
  }

  return response.json()
}

export async function getUser(
  id: string
): Promise<AdminUser> {
  const response = await fetch(`${API_URL}/${id}`, {
    credentials: 'include'
  })

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        'Unable to retrieve user'
      )
    )
  }

  return response.json()
}

export async function createUser(
  user: CreateUserInput
): Promise<AdminUser> {
  const response = await fetch(API_URL, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  })

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        'Unable to create user'
      )
    )
  }

  return response.json()
}

export async function updateUser(
  id: string,
  user: UpdateUserInput
): Promise<AdminUser> {
  const response = await fetch(
    `${API_URL}/${id}`,
    {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    }
  )

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        'Unable to update user'
      )
    )
  }

  return response.json()
}