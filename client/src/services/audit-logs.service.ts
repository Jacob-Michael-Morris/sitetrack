import type { AuditLog } from '../types/AuditLog.js'
import API_BASE_URL from '../config/api.js'

const API_URL = `${API_BASE_URL}/audit-logs`

export async function getAuditLogs(): Promise<AuditLog[]> {
  const response = await fetch(API_URL, {
    credentials: 'include'
  })

  if (!response.ok) {
    throw new Error('Unable to retrieve audit logs')
  }

  return response.json()
}