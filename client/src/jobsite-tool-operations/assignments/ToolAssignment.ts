export interface ToolAssignment {
  assignment_id: number
  tool_id: number
  jobsite_id: number
  tool_name: string
  serial_number: string
  jobsite_name: string
  assigned_at: string
  released_at: string | null
  status: string
  notes: string | null
}

export interface AssignmentInput {
  tool_id: number
  jobsite_id: number
  notes: string
}