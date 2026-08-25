import bcrypt from 'bcryptjs'
import pool from '../database/pool.js'

import { createAuditLog } from './audit-logs.service.js'

export async function getAllUsers() {
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
     JOIN roles r ON u.role_id = r.role_id
     ORDER BY u.name`
  )

  return result.rows
}

export async function getUserById(id: number) {
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
     JOIN roles r ON u.role_id = r.role_id
     WHERE u.user_id = $1`,
    [id]
  )

  return result.rows[0]
}

export async function createUser(
  user: {
    name: string
    email: string
    password: string
    role_id: number
  },
  actorUserId: number
) {
  const passwordHash = await bcrypt.hash(user.password, 12)

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
      user.role_id,
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
    description: `User "${createdUser.name}" was created.`
  })

  return createdUser
}

export async function updateUser(
  id: number,
  user: {
    name: string
    email: string
    role_id: number
    is_active: boolean
  },
  actorUserId: number
) {
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
      user.role_id,
      user.is_active,
      id
    ]
  )

  const updatedUser = result.rows[0]

  if (!updatedUser) {
    return undefined
  }

  await createAuditLog({
    user_id: actorUserId,
    action: 'USER_UPDATED',
    entity_type: 'User',
    entity_id: id,
    description: `User "${updatedUser.name}" was updated.`
  })

  return updatedUser
}