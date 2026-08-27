import type { PoolClient } from 'pg'

import pool from '../database/pool.js'

import {
  Alert
} from '../models/Alert.js'

import type {
  AlertInput
} from '../models/Alert.js'

export class AlertService {
  async getAll() {
    const result = await pool.query(
      `SELECT
         a.alert_id,
         a.tool_id,
         a.jobsite_id,
         a.alert_type,
         a.message,
         a.severity,
         a.is_read,
         a.created_at,
         a.resolved_at,
         t.name AS tool_name,
         j.name AS jobsite_name
       FROM alerts a
       LEFT JOIN tools t
         ON a.tool_id = t.tool_id
       LEFT JOIN jobsites j
         ON a.jobsite_id = j.jobsite_id
       ORDER BY a.created_at DESC`
    )

    return result.rows
  }

  async getById(id: number) {
    const result = await pool.query(
      `SELECT *
       FROM alerts
       WHERE alert_id = $1`,
      [id]
    )

    return result.rows[0]
  }

  async markRead(id: number) {
    const result = await pool.query(
      `UPDATE alerts
       SET is_read = TRUE
       WHERE alert_id = $1
       RETURNING *`,
      [id]
    )

    return result.rows[0]
  }

  async markAllRead() {
    await pool.query(
      `UPDATE alerts
       SET is_read = TRUE
       WHERE is_read = FALSE`
    )
  }

  async create(
    input: AlertInput,
    client?: PoolClient
  ) {
    const alert =
      new Alert(input)

    const database =
      client ?? pool

    const result = await database.query(
      `INSERT INTO alerts
        (
          tool_id,
          jobsite_id,
          alert_type,
          message,
          severity
        )
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        alert.toolId,
        alert.jobsiteId,
        alert.alertType,
        alert.message,
        alert.severity
      ]
    )

    return result.rows[0]
  }

  async generateInspectionAlerts() {
    await this.generateOverdueInspectionAlerts()

    await this.generateUpcomingInspectionAlerts()
  }

  private async generateOverdueInspectionAlerts() {
    await pool.query(
      `WITH latest_inspections AS (
         SELECT DISTINCT ON (tool_id)
           tool_id,
           next_inspection_date
         FROM inspections
         WHERE next_inspection_date IS NOT NULL
         ORDER BY
           tool_id,
           inspection_date DESC,
           inspection_id DESC
       )
       INSERT INTO alerts
         (
           tool_id,
           alert_type,
           message,
           severity
         )
       SELECT
         tool_id,
         'Overdue Inspection',
         'Tool inspection is overdue.',
         'High'
       FROM latest_inspections l
       WHERE
         l.next_inspection_date <
           CURRENT_DATE
         AND NOT EXISTS (
           SELECT 1
           FROM alerts a
           WHERE
             a.tool_id = l.tool_id
             AND a.alert_type =
               'Overdue Inspection'
             AND a.resolved_at IS NULL
         )`
    )
  }

  private async generateUpcomingInspectionAlerts() {
    await pool.query(
      `WITH latest_inspections AS (
         SELECT DISTINCT ON (tool_id)
           tool_id,
           next_inspection_date
         FROM inspections
         WHERE next_inspection_date IS NOT NULL
         ORDER BY
           tool_id,
           inspection_date DESC,
           inspection_id DESC
       )
       INSERT INTO alerts
         (
           tool_id,
           alert_type,
           message,
           severity
         )
       SELECT
         tool_id,
         'Upcoming Inspection',
         'Tool inspection is due within 7 days.',
         'Warning'
       FROM latest_inspections l
       WHERE
         l.next_inspection_date >=
           CURRENT_DATE
         AND l.next_inspection_date <=
           CURRENT_DATE + INTERVAL '7 days'
         AND NOT EXISTS (
           SELECT 1
           FROM alerts a
           WHERE
             a.tool_id = l.tool_id
             AND a.alert_type =
               'Upcoming Inspection'
             AND a.resolved_at IS NULL
         )`
    )
  }
}

export const alertService =
  new AlertService()

export async function getAllAlerts() {
  return alertService.getAll()
}

export async function getAlertById(
  id: number
) {
  return alertService.getById(id)
}

export async function markAlertRead(
  id: number
) {
  return alertService.markRead(id)
}

export async function markAllAlertsRead() {
  return alertService.markAllRead()
}

export async function createAlert(
  alert: AlertInput,
  client?: PoolClient
) {
  return alertService.create(
    alert,
    client
  )
}

export async function generateInspectionAlerts() {
  return alertService.generateInspectionAlerts()
}