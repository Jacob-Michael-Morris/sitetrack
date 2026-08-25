export interface AdminUser {
  user_id: number
  role_id: number
  role_name: string
  name: string
  email: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CreateUserInput {
  name: string
  email: string
  password: string
  role_id: number
}

export interface UpdateUserInput {
  name: string
  email: string
  role_id: number
  is_active: boolean
}