import API_BASE_URL from '../config/api.js'
import { apiRequest } from '../utils/api-request.js'

import type { AuditLog } from '../types/AuditLog.js'

const API_URL =
  `${API_BASE_URL}/audit-logs`

export async function getAuditLogs():
Promise<AuditLog[]> {
  return apiRequest<AuditLog[]>(
    API_URL,
    {},
    'Unable to retrieve audit logs'
  )
}