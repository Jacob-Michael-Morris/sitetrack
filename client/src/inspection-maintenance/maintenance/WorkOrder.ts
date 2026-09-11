export interface WorkOrder {
  work_order_id: number
  tool_id: number
  damage_report_id: number | null
  description: string
  priority: string
  status: string
  assigned_to: string | null
  completed_by: number | null
  completed_by_name: string | null
  return_requested_by: number | null
  return_requested_by_name: string | null
  return_requested_at: string | null
  opened_at: string
  completed_at: string | null
  notes: string | null
  tool_name: string
  serial_number: string
  decision_id: number | null
  decision: 'Approved' | 'Denied' | null
  decision_reason: string | null
  decided_at: string | null
  approver_user_id: number | null
  approver_name: string | null
  block_disposition: string | null
}

export interface WorkOrderInput {
  tool_id: number
  damage_report_id: number | null
  description: string
  priority: string
  assigned_to: string
  notes: string
}

export type ReturnServiceDecision =
  'Approved' | 'Denied'
