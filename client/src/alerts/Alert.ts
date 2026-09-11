export interface Alert {
  alert_id: number
  tool_id: number | null
  jobsite_id: number | null
  alert_type: string
  message: string
  severity: string
  is_read: boolean
  created_at: string
  resolved_at: string | null
  tool_name: string | null
  jobsite_name: string | null
}