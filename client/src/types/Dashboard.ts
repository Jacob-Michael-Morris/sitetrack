export interface DashboardSummary {
  total_tools: number
  available_tools: number
  checked_out_tools: number
  maintenance_tools: number
  out_of_service_tools: number
  active_jobsites: number
  open_damage_reports: number
  open_work_orders: number
  overdue_inspections: number
  unread_alerts: number
}

export interface DashboardAlert {
  alert_id: number
  tool_id: number | null
  jobsite_id: number | null
  alert_type: string
  message: string
  severity: string
  is_read: boolean
  created_at: string
  tool_name: string | null
  jobsite_name: string | null
}

export interface DashboardData {
  summary: DashboardSummary
  recent_alerts: DashboardAlert[]
}