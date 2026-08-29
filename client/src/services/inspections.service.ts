import API_BASE_URL from '../config/api.js'
import { apiRequest } from '../utils/api-request.js'

import type {
  Inspection,
  InspectionInput
} from '../types/Inspection.js'

const API_URL =
  `${API_BASE_URL}/inspections`

export async function getInspections():
Promise<Inspection[]> {
  return apiRequest<Inspection[]>(
    API_URL,
    {},
    'Unable to retrieve inspections'
  )
}

export async function createInspection(
  inspection: InspectionInput
): Promise<Inspection> {
  return apiRequest<Inspection>(
    API_URL,
    {
      method: 'POST',
      body: JSON.stringify(
        inspection
      )
    },
    'Unable to create inspection'
  )
}