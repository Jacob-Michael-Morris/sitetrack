import bcrypt from 'bcryptjs'

import pool from '../database/pool.js'

import {
  User
} from '../models/User.js'

import type {
  CreateUserInput,
  UpdateUserInput
} from '../models/User.js'

import {
  createAuditLog
} from './audit-logs.service.js'

export class UserService {
  async getAll() {
    const result = await pool.query(
      `SELECT
         u.user_id,
         u.name,
         u.email,
         u.is_active,
         u.created_at,
         u.updated_at,
         r.role_id,
         r.name AS role_name
       FROM users u
       JOIN roles r
         ON u.role_id = r.role_id
       ORDER BY u.name`
    )

    return result.rows
  }

  async getById(id: number) {
    const result = await pool.query(
      `SELECT
         u.user_id,
         u.name,
         u.email,
         u.is_active,
         u.created_at,
         u.updated_at,
         r.role_id,
         r.name AS role_name
       FROM users u
       JOIN roles r
         ON u.role_id = r.role_id
       WHERE u.user_id = $1`,
      [id]
    )

    return result.rows[0]
  }

  async create(
    input: CreateUserInput,
    actorUserId: number
  ) {
    const user =
      User.forCreate(input)

    const passwordHash =
      await bcrypt.hash(
        user.password!,
        12
      )

    const result = await pool.query(
      `INSERT INTO users
        (
          role_id,
          name,
          email,
          password_hash
        )
       VALUES ($1, $2, $3, $4)
       RETURNING
         user_id,
         role_id,
         name,
         email,
         is_active,
         created_at,
         updated_at`,
      [
        user.roleId,
        user.name,
        user.email,
        passwordHash
      ]
    )

    const createdUser = result.rows[0]

    await createAuditLog({
      user_id: actorUserId,
      action: 'USER_CREATED',
      entity_type: 'User',
      entity_id: createdUser.user_id,
      description:
        `User "${createdUser.name}" was created.`
    })

    return createdUser
  }

  async update(
    id: number,
    input: UpdateUserInput,
    actorUserId: number
  ) {
    const user =
      User.forUpdate(input)

    user.assertCanBeUpdatedBy(
      id,
      actorUserId
    )

    const result = await pool.query(
      `UPDATE users
       SET
         name = $1,
         email = $2,
         role_id = $3,
         is_active = $4,
         updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $5
       RETURNING
         user_id,
         role_id,
         name,
         email,
         is_active,
         created_at,
         updated_at`,
      [
        user.name,
        user.email,
        user.roleId,
        user.isActive,
        id
      ]
    )

    const updatedUser =
      result.rows[0]

    if (!updatedUser) {
      return undefined
    }

    await createAuditLog({
      user_id: actorUserId,
      action: 'USER_UPDATED',
      entity_type: 'User',
      entity_id: updatedUser.user_id,
      description:
        `User "${updatedUser.name}" was updated.`
    })

    return updatedUser
  }
}

export const userService =
  new UserService()