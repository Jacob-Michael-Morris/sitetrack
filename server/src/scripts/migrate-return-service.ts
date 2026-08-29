import 'dotenv/config'

import { readFile } from 'node:fs/promises'

import pool from '../database/pool.js'

const migrationUrl = new URL(
  '../database/migrations/001_return_service_approval.sql',
  import.meta.url
)

try {
  const sql = await readFile(
    migrationUrl,
    'utf8'
  )

  await pool.query(sql)

  console.log(
    'Return-to-service approval migration completed.'
  )
} finally {
  await pool.end()
}
