import type {
  DamageReport,
  DamageReportInput
} from '../types/DamageReport.js'
import API_BASE_URL from '../config/api.js'

const API_URL = `${API_BASE_URL}/damage-reports`

export async function getDamageReports(): Promise<DamageReport[]> {
  const response = await fetch(API_URL, {
    credentials: 'include'
  })

  if (!response.ok) {
    throw new Error('Unable to retrieve damage reports')
  }

  return response.json()
}

export async function createDamageReport(
  report: DamageReportInput
): Promise<DamageReport> {
  const response = await fetch(API_URL, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(report)
  })

  if (!response.ok) {
    throw new Error('Unable to create damage report')
  }

  return response.json()
}