import type {
  Request,
  Response
} from 'express'

import {
  AuthDomainError,
  authService
} from '../services/auth.service.js'

export class AuthController {
  async login(
    req: Request,
    res: Response
  ) {
    try {
      const {
        email,
        password
      } = req.body

      const result =
        await authService.authenticate(
          email,
          password
        )

      res.cookie(
        'sitetrack_token',
        result.token,
        {
          httpOnly: true,
          sameSite: 'lax',
          secure:
            process.env.NODE_ENV ===
            'production',
          maxAge:
            8 * 60 * 60 * 1000
        }
      )

      res.json(result.user)
    } catch (error) {
      console.error(error)

      if (
        error instanceof
        AuthDomainError
      ) {
        res
          .status(error.statusCode)
          .json({
            message: error.message
          })

        return
      }

      res.status(500).json({
        message: 'Unable to log in'
      })
    }
  }

  logout(
    req: Request,
    res: Response
  ) {
    res.clearCookie(
      'sitetrack_token',
      {
        httpOnly: true,
        sameSite: 'lax',
        secure:
          process.env.NODE_ENV ===
          'production'
      }
    )

    res.json({
      message:
        'Logged out successfully'
    })
  }

  async getCurrentUser(
    req: Request,
    res: Response
  ) {
    try {
      const userId = Number(
        res.locals.auth.userId
      )

      const user =
        await authService
          .getCurrentUser(userId)

      res.json(user)
    } catch (error) {
      console.error(error)

      if (
        error instanceof
        AuthDomainError
      ) {
        res
          .status(error.statusCode)
          .json({
            message: error.message
          })

        return
      }

      res.status(500).json({
        message:
          'Unable to retrieve user'
      })
    }
  }
}

export const authController =
  new AuthController()