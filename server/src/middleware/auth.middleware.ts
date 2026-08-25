import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

interface AuthPayload {
  userId: number
  role: string
}

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies?.sitetrack_token

  if (!token) {
    res.status(401).json({
      message: 'Authentication required'
    })
    return
  }

  try {
    const secret = process.env.JWT_SECRET

    if (!secret) {
      throw new Error('JWT_SECRET is not configured')
    }

    const decoded = jwt.verify(token, secret)

    if (
      typeof decoded === 'string' ||
      !decoded.sub ||
      !decoded.role
    ) {
      throw new Error('Invalid authentication token')
    }

    res.locals.auth = {
      userId: Number(decoded.sub),
      role: String(decoded.role)
    } satisfies AuthPayload

    next()
  } catch {
    res.status(401).json({
      message: 'Invalid or expired authentication'
    })
  }
}

export function requireRole(...allowedRoles: string[]) {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const auth = res.locals.auth as AuthPayload | undefined

    if (!auth) {
      res.status(401).json({
        message: 'Authentication required'
      })
      return
    }

    if (!allowedRoles.includes(auth.role)) {
      res.status(403).json({
        message: 'You do not have permission to perform this action'
      })
      return
    }

    next()
  }
}