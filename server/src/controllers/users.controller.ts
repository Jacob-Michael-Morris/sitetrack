import type { Request, Response } from 'express'

import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser
} from '../services/users.service.js'

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

    if (!name || !email || !password || !role_id) {
      res.status(400).json({
        message: 'Name, email, password, and role are required'
      })
      return
    }

    const actorUserId = Number(res.locals.auth.userId)

    const user = await createUser(
      {
        name,
        email,
        password,
        role_id: Number(role_id)
      },
      actorUserId
    )

    res.status(201).json(user)
  } catch (error) {
    console.error(error)

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

    if (!name || !email || !role_id) {
      res.status(400).json({
        message: 'Name, email, and role are required'
      })
      return
    }

    const actorUserId = Number(res.locals.auth.userId)

    if (
      id === actorUserId &&
      is_active === false
    ) {
      res.status(400).json({
        message: 'You cannot deactivate your own account'
      })
      return
    }

    const user = await updateUser(
      id,
      {
        name,
        email,
        role_id: Number(role_id),
        is_active: Boolean(is_active)
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

    res.status(500).json({
      message: 'Unable to update user'
    })
  }
}