import type { Request, Response } from 'express'

import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser
} from '../services/users.service.js'

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function getDatabaseErrorCode(error: unknown) {
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error
  ) {
    return String(error.code)
  }

  return null
}

export async function getUsers(
  req: Request,
  res: Response
) {
  try {
    const users = await getAllUsers()
    res.json(users)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Unable to retrieve users'
    })
  }
}

export async function getUser(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id)

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({
        message: 'Invalid user ID'
      })
      return
    }

    const user = await getUserById(id)

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
      message: 'Unable to retrieve user'
    })
  }
}

export async function addUser(
  req: Request,
  res: Response
) {
  try {
    const {
      name,
      email,
      password,
      role_id
    } = req.body

    const cleanName = String(name ?? '').trim()
    const cleanEmail = String(email ?? '')
      .trim()
      .toLowerCase()

    const roleId = Number(role_id)

    if (!cleanName) {
      res.status(400).json({
        message: 'Name is required'
      })
      return
    }

    if (!cleanEmail) {
      res.status(400).json({
        message: 'Email is required'
      })
      return
    }

    if (!isValidEmail(cleanEmail)) {
      res.status(400).json({
        message: 'Enter a valid email address'
      })
      return
    }

    if (!password) {
      res.status(400).json({
        message: 'Password is required'
      })
      return
    }

    if (String(password).length < 8) {
      res.status(400).json({
        message:
          'Password must be at least 8 characters long'
      })
      return
    }

    if (!Number.isInteger(roleId) || roleId <= 0) {
      res.status(400).json({
        message: 'A valid role is required'
      })
      return
    }

    const actorUserId = Number(
      res.locals.auth.userId
    )

    const user = await createUser(
      {
        name: cleanName,
        email: cleanEmail,
        password: String(password),
        role_id: roleId
      },
      actorUserId
    )

    res.status(201).json(user)
  } catch (error) {
    console.error(error)

    if (getDatabaseErrorCode(error) === '23505') {
      res.status(409).json({
        message:
          'A user with this email address already exists'
      })
      return
    }

    if (getDatabaseErrorCode(error) === '23503') {
      res.status(400).json({
        message: 'The selected role does not exist'
      })
      return
    }

    res.status(500).json({
      message: 'Unable to create user'
    })
  }
}

export async function editUser(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id)

    const {
      name,
      email,
      role_id,
      is_active
    } = req.body

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({
        message: 'Invalid user ID'
      })
      return
    }

    const cleanName = String(name ?? '').trim()
    const cleanEmail = String(email ?? '')
      .trim()
      .toLowerCase()

    const roleId = Number(role_id)

    if (!cleanName) {
      res.status(400).json({
        message: 'Name is required'
      })
      return
    }

    if (!isValidEmail(cleanEmail)) {
      res.status(400).json({
        message: 'Enter a valid email address'
      })
      return
    }

    if (!Number.isInteger(roleId) || roleId <= 0) {
      res.status(400).json({
        message: 'A valid role is required'
      })
      return
    }

    if (typeof is_active !== 'boolean') {
      res.status(400).json({
        message: 'Account status is required'
      })
      return
    }

    const actorUserId = Number(
      res.locals.auth.userId
    )

    if (
      id === actorUserId &&
      is_active === false
    ) {
      res.status(400).json({
        message:
          'You cannot deactivate your own account'
      })
      return
    }

    const user = await updateUser(
      id,
      {
        name: cleanName,
        email: cleanEmail,
        role_id: roleId,
        is_active
      },
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

    if (getDatabaseErrorCode(error) === '23505') {
      res.status(409).json({
        message:
          'A user with this email address already exists'
      })
      return
    }

    if (getDatabaseErrorCode(error) === '23503') {
      res.status(400).json({
        message: 'The selected role does not exist'
      })
      return
    }

    res.status(500).json({
      message: 'Unable to update user'
    })
  }
}