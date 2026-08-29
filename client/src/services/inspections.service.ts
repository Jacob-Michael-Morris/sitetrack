import type {
  Inspection,
  InspectionInput
} from '../types/Inspection.js'
import API_BASE_URL from '../config/api.js'
import { getResponseError } from '../utils/response-error.js'

const API_URL = `${API_BASE_URL}/inspections`

export async function getInspections(): Promise<Inspection[]> {
  const response = await fetch(API_URL, {
    credentials: 'include'
  })

  if (!response.ok) {
    throw new Error('Unable to retrieve inspections')
  }

  return response.json()
}

export async function createInspection(
  inspection: InspectionInput
): Promise<Inspection> {
  const response = await fetch(API_URL, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(inspection)
  })

  if (!response.ok) {
    throw new Error(
      await getResponseError(
        response,
        'Unable to create inspection'
      )
    )
  }

  return response.json()
}
