import pool from '../database/pool.js'

export class RoleService {
  async getAll() {
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
}

export const roleService =
  new RoleService()