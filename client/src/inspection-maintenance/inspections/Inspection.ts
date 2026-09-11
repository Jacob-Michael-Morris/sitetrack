export interface Inspection {
  inspection_id: number
  tool_id: number
  inspection_date: string
  result: string
  condition: string
  notes: string | null
  next_inspection_date: string | null
  tool_name: string
  serial_number: string
}

export interface InspectionInput {
  tool_id: number
  result: string
  condition: string
  notes: string
  next_inspection_date: string
}