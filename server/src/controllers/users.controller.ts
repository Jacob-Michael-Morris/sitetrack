import type {
  Request,
  Response
} from 'express'

import {
  UserDomainError
} from '../models/User.js'

import {
  userService
} from '../services/users.service.js'

function getDatabaseErrorCode(
  error: unknown
) {
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error
  ) {
    return String(error.code)
  }

  return null
}

export class UsersController {
  async getAll(
    req: Request,
    res: Response
  ) {
    try {
      const users =
        await userService.getAll()

      res.json(users)
    } catch (error) {
      console.error(error)

      res.status(500).json({
        message:
          'Unable to retrieve users'
      })
    }
  }

  async getById(
    req: Request,
    res: Response
  ) {
    try {
      const id =
        Number(req.params.id)

      if (
        !Number.isInteger(id) ||
        id <= 0
      ) {
        res.status(400).json({
          message: 'Invalid user ID'
        })
        return
      }

      const user =
        await userService.getById(id)

      if (!user) {
        res.status(404).json({
          message: 'User not found'
        })
        return
      }

      res.json(user)
    } catch (error) {
      console.error(error)

      res.status(500).json({
        message:
          'Unable to retrieve user'
      })
    }
  }

  async create(
    req: Request,
    res: Response
  ) {
    try {
      const actorUserId = Number(
        res.locals.auth.userId
      )

      const user =
        await userService.create(
          req.body,
          actorUserId
        )

      res.status(201).json(user)
    } catch (error) {
      console.error(error)

      const databaseErrorCode =
        getDatabaseErrorCode(error)

      if (databaseErrorCode === '23505') {
        res.status(409).json({
          message:
            'A user with this email address already exists'
        })
        return
      }

      if (databaseErrorCode === '23503') {
        res.status(400).json({
          message:
            'The selected role does not exist'
        })
        return
      }

      if (
        error instanceof UserDomainError
      ) {
        res.status(400).json({
          message: error.message
        })
        return
      }

      res.status(500).json({
        message:
          'Unable to create user'
      })
    }
  }

  async update(
    req: Request,
    res: Response
  ) {
    try {
      const id =
        Number(req.params.id)

      if (
        !Number.isInteger(id) ||
        id <= 0
      ) {
        res.status(400).json({
          message: 'Invalid user ID'
        })
        return
      }

      const actorUserId = Number(
        res.locals.auth.userId
      )

      const user =
        await userService.update(
          id,
          req.body,
          actorUserId
        )

      if (!user) {
        res.status(404).json({
          message: 'User not found'
        })
        return
      }

      res.json(user)
    } catch (error) {
      console.error(error)

      const databaseErrorCode =
        getDatabaseErrorCode(error)

      if (databaseErrorCode === '23505') {
        res.status(409).json({
          message:
            'A user with this email address already exists'
        })
        return
      }

      if (databaseErrorCode === '23503') {
        res.status(400).json({
          message:
            'The selected role does not exist'
        })
        return
      }

      if (
        error instanceof UserDomainError
      ) {
        res.status(400).json({
          message: error.message
        })
        return
      }

      res.status(500).json({
        message:
          'Unable to update user'
      })
    }
  }
}

export const usersController =
  new UsersController()