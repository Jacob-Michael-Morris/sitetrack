import type { PoolClient } from 'pg'

import pool from '../database/pool.js'

interface AuditLogInput {
  user_id?: number | null
  action: string
  entity_type: string
  entity_id?: number | null
  description: string
}

export async function createAuditLog(
  auditLog: AuditLogInput,
  client?: PoolClient
) {
  const database = client ?? pool

  const result = await database.query(
    `INSERT INTO audit_logs
      (
        user_id,
        action,
        entity_type,
        entity_id,
        description
      )
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [
      auditLog.user_id ?? null,
      auditLog.action,
      auditLog.entity_type,
      auditLog.entity_id ?? null,
      auditLog.description
    ]
  )

  return result.rows[0]
}

export async function getAllAuditLogs() {
  const result = await pool.query(
    `SELECT
       a.audit_log_id,
       a.user_id,
       a.action,
       a.entity_type,
       a.entity_id,
       a.description,
       a.created_at,
       u.name AS user_name,
       u.email AS user_email,
       r.name AS role_name
     FROM audit_logs a
     LEFT JOIN users u
       ON a.user_id = u.user_id
     LEFT JOIN roles r
       ON u.role_id = r.role_id
     ORDER BY a.created_at DESC`
  )

  return result.rows
}