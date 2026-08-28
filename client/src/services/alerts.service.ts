import type { Alert } from '../types/Alert.js'
import API_BASE_URL from '../config/api.js'

const API_URL = `${API_BASE_URL}/alerts`

export async function getAlerts(): Promise<Alert[]> {
  const response = await fetch(API_URL, {
    credentials: 'include'
  })

  if (!response.ok) {
    throw new Error('Unable to retrieve alerts')
  }

  return response.json()
}

export async function markAlertRead(id: number): Promise<Alert> {
  const response = await fetch(`${API_URL}/${id}/read`, {
    method: 'PUT',
    credentials: 'include'
  })

  if (!response.ok) {
    throw new Error('Unable to mark alert as read')
  }

  return response.json()
}

export async function markAllAlertsRead() {
  const response = await fetch(`${API_URL}/read-all`, {
    method: 'PUT',
    credentials: 'include'
  })

  if (!response.ok) {
    throw new Error('Unable to mark alerts as read')
  }

  return response.json()
}