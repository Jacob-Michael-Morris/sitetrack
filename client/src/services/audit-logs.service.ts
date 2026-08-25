import type { AuditLog } from '../types/AuditLog.js'

const API_URL = 'http://localhost:3000/api/audit-logs'

export async function getAuditLogs(): Promise<AuditLog[]> {
  const response = await fetch(API_URL)

  if (!response.ok) {
    throw new Error('Unable to retrieve audit logs')
  }

  return response.json()
}