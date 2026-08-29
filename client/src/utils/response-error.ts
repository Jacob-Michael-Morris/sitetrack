export async function getResponseError(
  response: Response,
  fallbackMessage: string
) {
  try {
    const body = await response.json() as {
      message?: unknown
    }

    if (
      typeof body.message === 'string' &&
      body.message.trim() !== ''
    ) {
      return body.message
    }
  } catch {
    // Fall back when the response is not JSON.
  }

  return fallbackMessage
}
