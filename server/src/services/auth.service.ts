import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import pool from '../database/pool.js'

export interface AuthenticatedUser {
  user_id: number
  name: string
  email: string
  role: string
}

interface AuthUserRecord {
  user_id: number
  name: string
  email: string
  password_hash?: string
  is_active: boolean
  role_id: number
  role_name: string
}

export class AuthDomainError extends Error {
  statusCode: number

  constructor(
    message: string,
    statusCode: number
  ) {
    super(message)

    this.name = 'AuthDomainError'
    this.statusCode = statusCode
  }
}

export class AuthService {
  async authenticate(
    email: unknown,
    password: unknown
  ) {
    const cleanEmail = String(
      email ?? ''
    )
      .trim()
      .toLowerCase()

    const cleanPassword = String(
      password ?? ''
    )

    if (!cleanEmail || !cleanPassword) {
      throw new AuthDomainError(
        'Email and password are required',
        400
      )
    }

    const user =
      await this.getUserByEmail(
        cleanEmail
      )

    if (
      !user ||
      !user.is_active ||
      !user.password_hash
    ) {
      throw new AuthDomainError(
        'Invalid email or password',
        401
      )
    }

    const passwordMatches =
      await bcrypt.compare(
        cleanPassword,
        user.password_hash
      )

    if (!passwordMatches) {
      throw new AuthDomainError(
        'Invalid email or password',
        401
      )
    }

    const token =
      this.createToken(user)

    return {
      token,
      user: this.toAuthenticatedUser(
        user
      )
    }
  }

  async getCurrentUser(
    userId: number
  ) {
    if (
      !Number.isInteger(userId) ||
      userId <= 0
    ) {
      throw new AuthDomainError(
        'User account not available',
        401
      )
    }

    const user =
      await this.getUserById(userId)

    if (!user || !user.is_active) {
      throw new AuthDomainError(
        'User account not available',
        401
      )
    }

    return this.toAuthenticatedUser(
      user
    )
  }

  async getUserByEmail(
    email: string
  ) {
    const result = await pool.query(
      `SELECT
         u.user_id,
         u.name,
         u.email,
         u.password_hash,
         u.is_active,
         r.role_id,
         r.name AS role_name
       FROM users u
       JOIN roles r
         ON u.role_id = r.role_id
       WHERE LOWER(u.email) = LOWER($1)`,
      [email]
    )

    return result.rows[0] as
      | AuthUserRecord
      | undefined
  }

  async getUserById(
    id: number
  ) {
    const result = await pool.query(
      `SELECT
         u.user_id,
         u.name,
         u.email,
         u.is_active,
         r.role_id,
         r.name AS role_name
       FROM users u
       JOIN roles r
         ON u.role_id = r.role_id
       WHERE u.user_id = $1`,
      [id]
    )

    return result.rows[0] as
      | AuthUserRecord
      | undefined
  }

  private createToken(
    user: AuthUserRecord
  ) {
    const secret =
      process.env.JWT_SECRET

    if (!secret) {
      throw new Error(
        'JWT_SECRET is not configured'
      )
    }

    return jwt.sign(
      {
        role: user.role_name
      },
      secret,
      {
        subject: String(
          user.user_id
        ),
        expiresIn: '8h'
      }
    )
  }

  private toAuthenticatedUser(
    user: AuthUserRecord
  ): AuthenticatedUser {
    return {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role_name
    }
  }
}

export const authService =
  new AuthService()

export async function getUserByEmail(
  email: string
) {
  return authService.getUserByEmail(
    email
  )
}

export async function getUserById(
  id: number
) {
  return authService.getUserById(id)
}