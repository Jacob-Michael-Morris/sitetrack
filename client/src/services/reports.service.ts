import API_BASE_URL from '../config/api.js'
import { apiRequest } from '../utils/api-request.js'

import type {
  AssignmentReport,
  DamageReport,
  InspectionReport,
  MaintenanceReport,
  ToolInventoryReport
} from '../types/Report.js'

const API_URL =
  `${API_BASE_URL}/reports`

function getReport<T>(
  endpoint: string
): Promise<T[]> {
  return apiRequest<T[]>(
    `${API_URL}/${endpoint}`,
    {},
    'Unable to retrieve report'
  )
}

export function getToolInventoryReport() {
  return getReport<ToolInventoryReport>(
    'tool-inventory'
  )
}

export function getCurrentAssignmentsReport() {
  return getReport<AssignmentReport>(
    'current-assignments'
  )
}

export function getMaintenanceHistoryReport() {
  return getReport<MaintenanceReport>(
    'maintenance-history'
  )
}

export function getInspectionStatusReport() {
  return getReport<InspectionReport>(
    'inspection-status'
  )
}

export function getDamageHistoryReport() {
  return getReport<DamageReport>(
    'damage-history'
  )
}