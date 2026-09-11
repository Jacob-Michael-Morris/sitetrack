import { createContext } from 'react'

import type { User } from '../auth/User.js'

export interface AuthContextType {
  user: User | null
  loading: boolean

  login: (
    email: string,
    password: string
  ) => Promise<void>

  logout: () => Promise<void>

  hasPermission: (
    permissionKey: string
  ) => boolean
}

export const AuthContext =
  createContext<
    AuthContextType | undefined
  >(undefined)