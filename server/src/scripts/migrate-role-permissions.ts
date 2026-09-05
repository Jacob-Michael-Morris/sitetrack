import 'dotenv/config'

import { readFile } from 'node:fs/promises'

import pool from '../database/pool.js'

const rolePermissionsMigrationUrl =
  new URL(
    '../database/migrations/002_role_permissions.sql',
    import.meta.url
  )

const seedPermissionsMigrationUrl =
  new URL(
    '../database/migrations/003_seed_role_permissions.sql',
    import.meta.url
  )

const client = await pool.connect()

try {
  const rolePermissionsSql =
    await readFile(
      rolePermissionsMigrationUrl,
      'utf8'
    )

  const seedPermissionsSql =
    await readFile(
      seedPermissionsMigrationUrl,
      'utf8'
    )

  await client.query('BEGIN')

  await client.query(
    rolePermissionsSql
  )

  await client.query(
    seedPermissionsSql
  )

  await client.query('COMMIT')

  console.log(
    'Role permission migrations completed.'
  )

  const permissionCount =
    await client.query(
      `SELECT COUNT(*)::int AS count
       FROM permissions`
    )

  console.log(
    `Permissions: ${
      permissionCount.rows[0].count
    }`
  )

  const rolePermissionCounts =
    await client.query(
      `SELECT
         r.name,
         COUNT(
           rp.permission_id
         )::int AS permission_count
       FROM roles r
       LEFT JOIN role_permissions rp
         ON rp.role_id = r.role_id
       GROUP BY
         r.role_id,
         r.name
       ORDER BY r.role_id`
    )

  console.table(
    rolePermissionCounts.rows
  )
} catch (error) {
  await client.query('ROLLBACK')

  console.error(
    'Role permission migration failed.'
  )

  console.error(error)

  process.exitCode = 1
} finally {
  client.release()
  await pool.end()
}