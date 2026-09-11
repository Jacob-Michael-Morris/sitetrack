import pool from '../../database/pool.js'

import type {
  Permission,
  RolePermission
} from './Permission.js'

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

  async getAllPermissions():
    Promise<Permission[]> {
    const result = await pool.query(
      `SELECT
         permission_id,
         permission_key,
         category,
         display_name,
         description,
         sort_order
       FROM permissions
       ORDER BY
         sort_order,
         permission_id`
    )

    return result.rows
  }

  async getRolePermissions(
    roleId: number
  ): Promise<RolePermission[]> {
    const result = await pool.query(
      `SELECT
         p.permission_id,
         p.permission_key,
         p.category,
         p.display_name,
         p.description,
         p.sort_order,
         EXISTS (
           SELECT 1
           FROM role_permissions rp
           WHERE
             rp.role_id = $1
             AND rp.permission_id =
               p.permission_id
         ) AS enabled
       FROM permissions p
       ORDER BY
         p.sort_order,
         p.permission_id`,
      [roleId]
    )

    return result.rows
  }

  async hasPermission(
    roleName: string,
    permissionKey: string
  ): Promise<boolean> {
    const result = await pool.query(
      `SELECT EXISTS (
         SELECT 1
         FROM roles r
         JOIN role_permissions rp
           ON rp.role_id = r.role_id
         JOIN permissions p
           ON p.permission_id =
             rp.permission_id
         WHERE
           r.name = $1
           AND p.permission_key = $2
       ) AS allowed`,
      [
        roleName,
        permissionKey
      ]
    )

    return result.rows[0].allowed
  }

  async updateRolePermissions(
    roleId: number,
    permissionKeys: string[]
  ): Promise<RolePermission[]> {
    const client =
      await pool.connect()

    try {
      await client.query('BEGIN')

      const roleResult =
        await client.query(
          `SELECT
             role_id,
             name
           FROM roles
           WHERE role_id = $1
           FOR UPDATE`,
          [roleId]
        )

      if (
        roleResult.rowCount === 0
      ) {
        throw new Error(
          'Role not found'
        )
      }

      const role =
        roleResult.rows[0]

      const requestedPermissions =
        new Set(permissionKeys)

      if (
        role.name ===
        'Administrator'
      ) {
        requestedPermissions.add(
          'roles.manage'
        )
      }

      const normalizedPermissions =
        Array.from(
          requestedPermissions
        )

      if (
        normalizedPermissions.length >
        0
      ) {
        const permissionResult =
          await client.query(
            `SELECT permission_key
             FROM permissions
             WHERE permission_key =
               ANY($1::text[])`,
            [normalizedPermissions]
          )

        const validKeys =
          new Set(
            permissionResult.rows.map(
              (row) =>
                row.permission_key
            )
          )

        const invalidKeys =
          normalizedPermissions.filter(
            (key) =>
              !validKeys.has(key)
          )

        if (
          invalidKeys.length > 0
        ) {
          throw new Error(
            `Invalid permissions: ${
              invalidKeys.join(', ')
            }`
          )
        }
      }

      await client.query(
        `DELETE FROM role_permissions
         WHERE role_id = $1`,
        [roleId]
      )

      if (
        normalizedPermissions.length >
        0
      ) {
        await client.query(
          `INSERT INTO role_permissions (
             role_id,
             permission_id
           )
           SELECT
             $1,
             permission_id
           FROM permissions
           WHERE permission_key =
             ANY($2::text[])`,
          [
            roleId,
            normalizedPermissions
          ]
        )
      }

      await client.query('COMMIT')

      return this.getRolePermissions(
        roleId
      )
    } catch (error) {
      await client.query(
        'ROLLBACK'
      )

      throw error
    } finally {
      client.release()
    }
  }
}

export const roleService =
  new RoleService()