import type { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import {
  getUserByEmail,
  getUserById
} from '../services/auth.service.js'

export async function login(
  req: Request,
  res: Response
) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      res.status(400).json({
        message: 'Email and password are required'
      })
      return
    }

    const user = await getUserByEmail(email)

    if (!user || !user.is_active) {
      res.status(401).json({
        message: 'Invalid email or password'
      })
      return
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password_hash
    )

    if (!passwordMatches) {
      res.status(401).json({
        message: 'Invalid email or password'
      })
      return
    }

    const secret = process.env.JWT_SECRET

    if (!secret) {
      throw new Error('JWT_SECRET is not configured')
    }

    const token = jwt.sign(
      {
        role: user.role_name
      },
      secret,
      {
        subject: String(user.user_id),
        expiresIn: '8h'
      }
    )

    res.cookie('sitetrack_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 8 * 60 * 60 * 1000
    })

    res.json({
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role_name
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Unable to log in'
    })
  }
}

export function logout(
  req: Request,
  res: Response
) {
  res.clearCookie('sitetrack_token', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  })

  res.json({
    message: 'Logged out successfully'
  })
}

export async function getCurrentUser(
  req: Request,
  res: Response
) {
  try {
    const userId = Number(res.locals.auth.userId)

    const user = await getUserById(userId)

    if (!user || !user.is_active) {
      res.status(401).json({
        message: 'User account not available'
      })
      return
    }

    res.json({
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role_name
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Unable to retrieve user'
    })
  }
}