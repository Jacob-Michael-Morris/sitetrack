import 'dotenv/config'
import bcrypt from 'bcryptjs'

import pool from '../database/pool.js'

interface TestUser {
  name: string
  email: string
  role: string
}

const testUsers: TestUser[] = [
  {
    name: 'Eric Manager',
    email: 'equipment@sitetrack.local',
    role: 'Equipment Manager'
  },
  {
    name: 'Maria Technician',
    email: 'maintenance@sitetrack.local',
    role: 'Maintenance Technician'
  },
  {
    name: 'William Worker',
    email: 'worker@sitetrack.local',
    role: 'Worker'
  },
  {
    name: 'Sarah Safety',
    email: 'safety@sitetrack.local',
    role: 'Safety Personnel'
  }
]

async function createTestUsers() {
  const password = process.env.TEST_USER_PASSWORD

  if (!password) {
    throw new Error(
      'TEST_USER_PASSWORD must be set in the .env file'
    )
  }

  const passwordHash = await bcrypt.hash(password, 12)

  for (const user of testUsers) {
    const roleResult = await pool.query(
      `SELECT role_id
       FROM roles
       WHERE name = $1`,
      [user.role]
    )

    if (roleResult.rowCount === 0) {
      throw new Error(
        `Role "${user.role}" does not exist`
      )
    }

    const roleId = roleResult.rows[0].role_id

    await pool.query(
      `INSERT INTO users
        (
          role_id,
          name,
          email,
          password_hash
        )
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email)
       DO UPDATE SET
         role_id = EXCLUDED.role_id,
         name = EXCLUDED.name,
         password_hash = EXCLUDED.password_hash,
         is_active = TRUE,
         updated_at = CURRENT_TIMESTAMP`,
      [
        roleId,
        user.name,
        user.email,
        passwordHash
      ]
    )

    console.log(
      `Created ${user.role}: ${user.email}`
    )
  }
}

createTestUsers()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await pool.end()
  })