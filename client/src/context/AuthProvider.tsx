import {
  useEffect,
  useState
} from 'react'

import {
  getCurrentUser,
  login as loginRequest,
  logout as logoutRequest
} from '../services/auth.service.js'

import { AuthContext } from './auth-context.js'

import type { ReactNode } from 'react'
import type { User } from '../types/User.js'

interface AuthProviderProps {
  children: ReactNode
}

function AuthProvider({
  children
}: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    getCurrentUser()
      .then((currentUser) => {
        if (!cancelled) {
          setUser(currentUser)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setUser(null)
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  async function login(
    email: string,
    password: string
  ) {
    const loggedInUser = await loginRequest(
      email,
      password
    )

    setUser(loggedInUser)
  }

  async function logout() {
    await logoutRequest()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider