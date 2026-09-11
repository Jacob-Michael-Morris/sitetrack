export interface AuditLog {
  audit_log_id: number
  user_id: number | null
  user_name: string | null
  user_email: string | null
  role_name: string | null
  action: string
  entity_type: string
  entity_id: number | null
  description: string
  created_at: string
}