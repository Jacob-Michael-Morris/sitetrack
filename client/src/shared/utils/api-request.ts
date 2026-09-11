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

export async function apiRequest<T>(
  url: string,
  options: RequestInit = {},
  errorMessage = 'Request failed'
): Promise<T> {
  const headers =
    new Headers(options.headers)

  if (
    options.body &&
    !headers.has('Content-Type')
  ) {
    headers.set(
      'Content-Type',
      'application/json'
    )
  }

  const response = await fetch(
    url,
    {
      ...options,
      credentials: 'include',
      headers
    }
  )

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        errorMessage
      )
    )
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}