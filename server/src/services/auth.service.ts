import pool from '../database/pool.js'

export async function getUserByEmail(email: string) {
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
     JOIN roles r ON u.role_id = r.role_id
     WHERE LOWER(u.email) = LOWER($1)`,
    [email]
  )

  return result.rows[0]
}

export async function getUserById(id: number) {
  const result = await pool.query(
    `SELECT
       u.user_id,
       u.name,
       u.email,
       u.is_active,
       r.role_id,
       r.name AS role_name
     FROM users u
     JOIN roles r ON u.role_id = r.role_id
     WHERE u.user_id = $1`,
    [id]
  )

  return result.rows[0]
}