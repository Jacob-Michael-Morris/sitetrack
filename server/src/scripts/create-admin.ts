import 'dotenv/config'
import bcrypt from 'bcryptjs'

import pool from '../database/pool.js'

async function createAdmin() {
  const name = process.env.ADMIN_NAME
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD

  if (!name || !email || !password) {
    throw new Error(
      'ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD must be set'
    )
  }

  const roleResult = await pool.query(
    `SELECT role_id
     FROM roles
     WHERE name = 'Administrator'`
  )

  if (roleResult.rowCount === 0) {
    throw new Error('Administrator role does not exist')
  }

  const roleId = roleResult.rows[0].role_id

  const passwordHash = await bcrypt.hash(password, 12)

  await pool.query(
    `INSERT INTO users
      (role_id, name, email, password_hash)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (email)
     DO UPDATE SET
       name = EXCLUDED.name,
       role_id = EXCLUDED.role_id,
       password_hash = EXCLUDED.password_hash,
       updated_at = CURRENT_TIMESTAMP`,
    [
      roleId,
      name,
      email,
      passwordHash
    ]
  )

  console.log(`Administrator created: ${email}`)
}

createAdmin()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await pool.end()
  })