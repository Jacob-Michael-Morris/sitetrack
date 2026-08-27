import type { PoolClient } from 'pg'

import pool from '../database/pool.js'

import {
  AuditLog
} from '../models/AuditLog.js'

import type {
  AuditLogInput
} from '../models/AuditLog.js'

export class AuditLogService {
  async create(
    input: AuditLogInput,
    client?: PoolClient
  ) {
    const auditLog =
      new AuditLog(input)

    const database =
      client ?? pool

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
        auditLog.userId,
        auditLog.action,
        auditLog.entityType,
        auditLog.entityId,
        auditLog.description
      ]
    )

    return result.rows[0]
  }

  async getAll() {
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
}

export const auditLogService =
  new AuditLogService()

export async function createAuditLog(
  auditLog: AuditLogInput,
  client?: PoolClient
) {
  return auditLogService.create(
    auditLog,
    client
  )
}

export async function getAllAuditLogs() {
  return auditLogService.getAll()
}