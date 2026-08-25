import pool from '../database/pool.js'

export async function getAllRoles() {
  const result = await pool.query(
    `SELECT
       role_id,
       name,
       description
     FROM roles
     ORDER BY role_id`
  )

  return result.rows
}