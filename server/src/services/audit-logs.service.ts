import type { PoolClient } from 'pg'
import pool from '../database/pool.js'

export async function getAllAuditLogs() {
  const result = await pool.query(
    `SELECT *
     FROM audit_logs
     ORDER BY created_at DESC`
  )

  return result.rows
}

export async function createAuditLog(
  log: {
    user_id: number | null
    action: string
    entity_type: string
    entity_id: number | null
    description: string
  },
  client?: PoolClient
) {
  const query = `
    INSERT INTO audit_logs
      (user_id, action, entity_type, entity_id, description)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `

  const values = [
    log.user_id,
    log.action,
    log.entity_type,
    log.entity_id,
    log.description
  ]

  const result = client
    ? await client.query(query, values)
    : await pool.query(query, values)

  return result.rows[0]
}