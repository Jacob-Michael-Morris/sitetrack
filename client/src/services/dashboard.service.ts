import type { DashboardData } from '../types/Dashboard.js'
import API_BASE_URL from '../config/api.js'

const API_URL = `${API_BASE_URL}/dashboard`

export async function getDashboard(): Promise<DashboardData> {
  const response = await fetch(API_URL, {
    credentials: 'include'
  })

  if (!response.ok) {
    throw new Error('Unable to retrieve dashboard data')
  }

  return response.json()
}