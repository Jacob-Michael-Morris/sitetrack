import type {
  NextFunction,
  Request,
  Response
} from 'express'

import jwt from 'jsonwebtoken'

import {
  AuthDomainError,
  authService
} from './auth.service.js'

import {
  roleService
} from '../roles/roles.service.js'

interface AuthPayload {
  userId: number
  role: string
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token =
    req.cookies?.sitetrack_token

  if (!token) {
    res.status(401).json({
      message:
        'Authentication required'
    })
    return
  }

  const secret =
    process.env.JWT_SECRET

  if (!secret) {
    console.error(
      'JWT_SECRET is not configured'
    )

    res.status(500).json({
      message:
        'Authentication service unavailable'
    })
    return
  }

  let decoded

  try {
    decoded =
      jwt.verify(token, secret)
  } catch {
    res.status(401).json({
      message:
        'Invalid or expired authentication'
    })
    return
  }

  if (
    typeof decoded === 'string' ||
    !decoded.sub
  ) {
    res.status(401).json({
      message:
        'Invalid or expired authentication'
    })
    return
  }

  const userId =
    Number(decoded.sub)

  if (
    !Number.isInteger(userId) ||
    userId <= 0
  ) {
    res.status(401).json({
      message:
        'Invalid or expired authentication'
    })
    return
  }

  try {
    const user =
      await authService.getCurrentUser(
        userId
      )

    res.locals.auth = {
      userId: user.user_id,
      role: user.role
    } satisfies AuthPayload

    next()
  } catch (error) {
    if (
      error instanceof
      AuthDomainError
    ) {
      res.status(401).json({
        message:
          'Invalid or expired authentication'
      })
      return
    }

    console.error(error)

    res.status(500).json({
      message:
        'Authentication service unavailable'
    })
  }
}

export function requirePermission(
  permissionKey: string
) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const auth =
      res.locals.auth as
        | AuthPayload
        | undefined

    if (!auth) {
      res.status(401).json({
        message:
          'Authentication required'
      })
      return
    }

    try {
      const allowed =
        await roleService.hasPermission(
          auth.role,
          permissionKey
        )

      if (!allowed) {
        res.status(403).json({
          message:
            'You do not have permission to perform this action'
        })
        return
      }

      next()
    } catch (error) {
      console.error(error)

      res.status(500).json({
        message:
          'Unable to verify permissions'
      })
    }
  }
}
