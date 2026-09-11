export interface DamageReport {
  damage_report_id: number
  tool_id: number
  inspection_id: number | null
  description: string
  severity: string
  status: string
  reported_at: string
  resolved_at: string | null
  notes: string | null
  tool_name: string
  serial_number: string
}

export interface DamageReportInput {
  tool_id: number
  inspection_id: number | null
  description: string
  severity: string
  notes: string
}