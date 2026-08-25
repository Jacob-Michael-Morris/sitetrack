export interface ToolInventoryReport {
  tool_id: number
  name: string
  serial_number: string
  category: string
  status: string
  condition: string
  purchase_date: string | null
  current_jobsite: string | null
}

export interface AssignmentReport {
  assignment_id: number
  tool_id: number
  tool_name: string
  serial_number: string
  jobsite_id: number
  jobsite_name: string
  assigned_at: string
  status: string
  notes: string | null
}

export interface MaintenanceReport {
  work_order_id: number
  tool_id: number
  tool_name: string
  serial_number: string
  damage_report_id: number | null
  description: string
  priority: string
  status: string
  assigned_to: string | null
  opened_at: string
  completed_at: string | null
  notes: string | null
}

export interface InspectionReport {
  tool_id: number
  tool_name: string
  serial_number: string
  inspection_id: number | null
  inspection_date: string | null
  result: string | null
  condition: string | null
  next_inspection_date: string | null
  inspection_status: string
}

export interface DamageReport {
  damage_report_id: number
  tool_id: number
  tool_name: string
  serial_number: string
  inspection_id: number | null
  description: string
  severity: string
  status: string
  reported_at: string
  resolved_at: string | null
  notes: string | null
}

export type ReportType =
  | 'tool-inventory'
  | 'current-assignments'
  | 'maintenance-history'
  | 'inspection-status'
  | 'damage-history'