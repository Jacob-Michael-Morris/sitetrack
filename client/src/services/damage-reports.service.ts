import API_BASE_URL from '../config/api.js'
import { apiRequest } from '../utils/api-request.js'

import type {
  DamageReport,
  DamageReportInput
} from '../types/DamageReport.js'

const API_URL =
  `${API_BASE_URL}/damage-reports`

export async function getDamageReports():
Promise<DamageReport[]> {
  return apiRequest<DamageReport[]>(
    API_URL,
    {},
    'Unable to retrieve damage reports'
  )
}

export async function createDamageReport(
  report: DamageReportInput
): Promise<DamageReport> {
  return apiRequest<DamageReport>(
    API_URL,
    {
      method: 'POST',
      body: JSON.stringify(report)
    },
    'Unable to create damage report'
  )
}