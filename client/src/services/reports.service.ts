import type {
  AssignmentReport,
  DamageReport,
  InspectionReport,
  MaintenanceReport,
  ToolInventoryReport
} from '../types/Report.js'
import API_BASE_URL from '../config/api.js'

const API_URL = `${API_BASE_URL}/reports`

async function getReport<T>(
  endpoint: string
): Promise<T[]> {
  const response = await fetch(
    `${API_URL}/${endpoint}`,
    {
      credentials: 'include'
    }
  )

  if (!response.ok) {
    throw new Error('Unable to retrieve report')
  }

  return response.json()
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