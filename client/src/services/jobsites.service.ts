import API_BASE_URL from '../config/api.js'
import { apiRequest } from '../utils/api-request.js'

import type {
  Jobsite,
  JobsiteInput
} from '../types/Jobsite.js'

const API_URL =
  `${API_BASE_URL}/jobsites`

export async function getJobsites():
Promise<Jobsite[]> {
  return apiRequest<Jobsite[]>(
    API_URL,
    {},
    'Unable to retrieve jobsites'
  )
}

export async function getJobsite(
  id: string
): Promise<Jobsite> {
  return apiRequest<Jobsite>(
    `${API_URL}/${id}`,
    {},
    'Unable to retrieve jobsite'
  )
}

export async function createJobsite(
  jobsite: JobsiteInput
): Promise<Jobsite> {
  return apiRequest<Jobsite>(
    API_URL,
    {
      method: 'POST',
      body: JSON.stringify(jobsite)
    },
    'Unable to create jobsite'
  )
}

export async function updateJobsite(
  id: string,
  jobsite: JobsiteInput
): Promise<Jobsite> {
  return apiRequest<Jobsite>(
    `${API_URL}/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(jobsite)
    },
    'Unable to update jobsite'
  )
}