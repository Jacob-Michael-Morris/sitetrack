export interface Tool {
  tool_id: number
  name: string
  serial_number: string
  category: string | null
  status: string
  condition: string
  purchase_date: string | null
  created_at: string
  updated_at: string
}