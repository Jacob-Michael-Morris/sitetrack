import type {
  Jobsite,
  JobsiteInput
} from '../types/Jobsite.js'

const API_URL = 'http://localhost:3000/api/jobsites'

export async function getJobsites(): Promise<Jobsite[]> {
  const response = await fetch(API_URL)

  if (!response.ok) {
    throw new Error('Unable to retrieve jobsites')
  }

  return response.json()
}

export async function getJobsite(id: string): Promise<Jobsite> {
  const response = await fetch(`${API_URL}/${id}`)

  if (!response.ok) {
    throw new Error('Unable to retrieve jobsite')
  }

  return response.json()
}

export async function createJobsite(
  jobsite: JobsiteInput
): Promise<Jobsite> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(jobsite)
  })

  if (!response.ok) {
    throw new Error('Unable to create jobsite')
  }

  return response.json()
}

export async function updateJobsite(
  id: string,
  jobsite: JobsiteInput
): Promise<Jobsite> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(jobsite)
  })

  if (!response.ok) {
    throw new Error('Unable to update jobsite')
  }

  return response.json()
}