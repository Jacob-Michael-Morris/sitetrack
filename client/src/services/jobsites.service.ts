import type {
  Jobsite,
  JobsiteInput
} from '../types/Jobsite.js'
import API_BASE_URL from '../config/api.js'

const API_URL = `${API_BASE_URL}/jobsites`

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

export async function getJobsites(): Promise<Jobsite[]> {
  const response = await fetch(API_URL, {
    credentials: 'include'
  })

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        'Unable to retrieve jobsites'
      )
    )
  }

  return response.json()
}

export async function getJobsite(
  id: string
): Promise<Jobsite> {
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
        'Unable to retrieve jobsite'
      )
    )
  }

  return response.json()
}

export async function createJobsite(
  jobsite: JobsiteInput
): Promise<Jobsite> {
  const response = await fetch(API_URL, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(jobsite)
  })

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        'Unable to create jobsite'
      )
    )
  }

  return response.json()
}

export async function updateJobsite(
  id: string,
  jobsite: JobsiteInput
): Promise<Jobsite> {
  const response = await fetch(
    `${API_URL}/${id}`,
    {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(jobsite)
    }
  )

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        'Unable to update jobsite'
      )
    )
  }

  return response.json()
}