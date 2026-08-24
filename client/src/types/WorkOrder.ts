export interface WorkOrder {
  work_order_id: number
  tool_id: number
  damage_report_id: number | null
  description: string
  priority: string
  status: string
  assigned_to: string | null
  opened_at: string
  completed_at: string | null
  notes: string | null
  tool_name: string
  serial_number: string
}

export interface WorkOrderInput {
  tool_id: number
  damage_report_id: number | null
  description: string
  priority: string
  assigned_to: string
  notes: string
}