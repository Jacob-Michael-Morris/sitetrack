import type {
  Tool,
  ToolInput
} from '../types/Tool.js'

const API_URL =
  'http://localhost:3000/api/tools'

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

export async function getTools(): Promise<Tool[]> {
  const response = await fetch(API_URL, {
    credentials: 'include'
  })

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        'Unable to retrieve tools'
      )
    )
  }

  return response.json()
}

export async function getTool(
  id: string
): Promise<Tool> {
  const response = await fetch(
    `${API_URL}/${id}`,
    {
      credentials: 'include'
    }
  )

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        'Unable to retrieve tool'
      )
    )
  }

  return response.json()
}

export async function createTool(
  tool: ToolInput
): Promise<Tool> {
  const response = await fetch(API_URL, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(tool)
  })

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        'Unable to create tool'
      )
    )
  }

  return response.json()
}

export async function updateTool(
  id: string,
  tool: ToolInput
): Promise<Tool> {
  const response = await fetch(
    `${API_URL}/${id}`,
    {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(tool)
    }
  )

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        'Unable to update tool'
      )
    )
  }

  return response.json()
}