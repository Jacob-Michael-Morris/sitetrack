import API_BASE_URL from '../config/api.js'
import { apiRequest } from '../utils/api-request.js'

import type { Alert } from '../types/Alert.js'

const API_URL =
  `${API_BASE_URL}/alerts`

export async function getAlerts():
Promise<Alert[]> {
  return apiRequest<Alert[]>(
    API_URL,
    {},
    'Unable to retrieve alerts'
  )
}

export async function markAlertRead(
  id: number
): Promise<Alert> {
  return apiRequest<Alert>(
    `${API_URL}/${id}/read`,
    {
      method: 'PUT'
    },
    'Unable to mark alert as read'
  )
}

export async function markAllAlertsRead() {
  return apiRequest(
    `${API_URL}/read-all`,
    {
      method: 'PUT'
    },
    'Unable to mark alerts as read'
  )
}