import type { DashboardData } from '../types/Dashboard.js'

const API_URL = 'http://localhost:3000/api/dashboard'

export async function getDashboard(): Promise<DashboardData> {
  const response = await fetch(API_URL, {
    credentials: 'include'
  })

  if (!response.ok) {
    throw new Error('Unable to retrieve dashboard data')
  }

  return response.json()
}