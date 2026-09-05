export interface Permission {
  permission_id: number
  permission_key: string
  category: string
  display_name: string
  description: string | null
  sort_order: number
}

export interface RolePermission
  extends Permission {
  enabled: boolean
}