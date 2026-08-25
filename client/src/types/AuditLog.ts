export interface AuditLog {
  audit_log_id: number
  user_id: number | null
  action: string
  entity_type: string
  entity_id: number | null
  description: string
  created_at: string
}