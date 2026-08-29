import API_BASE_URL from '../config/api.js'
import { apiRequest } from '../utils/api-request.js'

import type { DashboardData } from '../types/Dashboard.js'

const API_URL =
  `${API_BASE_URL}/dashboard`

export async function getDashboard():
Promise<DashboardData> {
  return apiRequest<DashboardData>(
    API_URL,
    {},
    'Unable to retrieve dashboard data'
  )
}