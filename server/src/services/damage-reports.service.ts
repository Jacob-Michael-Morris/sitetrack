import pool from '../database/pool.js'

import {
  DamageReport,
  DamageReportDomainError
} from '../models/DamageReport.js'

import type {
  DamageReportInput
} from '../models/DamageReport.js'

import {
  createAlert
} from './alerts.service.js'

import {
  createAuditLog
} from './audit-logs.service.js'

export class DamageReportService {
  async getAll() {
    const result = await pool.query(
      `SELECT
         d.damage_report_id,
         d.tool_id,
         d.inspection_id,
         d.description,
         d.severity,
         d.status,
         d.reported_at,
         d.resolved_at,
         d.notes,
         t.name AS tool_name,
         t.serial_number
       FROM damage_reports d
       JOIN tools t
         ON d.tool_id = t.tool_id
       ORDER BY d.reported_at DESC`
    )

    return result.rows
  }

  async getById(id: number) {
    const result = await pool.query(
      `SELECT
         d.*,
         t.name AS tool_name,
         t.serial_number
       FROM damage_reports d
       JOIN tools t
         ON d.tool_id = t.tool_id
       WHERE d.damage_report_id = $1`,
      [id]
    )

    return result.rows[0]
  }

  async create(
    input: DamageReportInput,
    userId: number
  ) {
    const report =
      new DamageReport(input)

    const client =
      await pool.connect()

    try {
      await client.query('BEGIN')

      const toolResult =
        await client.query(
          `SELECT
             tool_id,
             name
           FROM tools
           WHERE tool_id = $1
           FOR UPDATE`,
          [report.toolId]
        )

      const tool =
        toolResult.rows[0]

      if (!tool) {
        throw new DamageReportDomainError(
          'Tool not found'
        )
      }

      if (report.inspectionId !== null) {
        const inspectionResult =
          await client.query(
            `SELECT
               inspection_id,
               tool_id
             FROM inspections
             WHERE inspection_id = $1`,
            [report.inspectionId]
          )

        const inspection =
          inspectionResult.rows[0]

        if (!inspection) {
          throw new DamageReportDomainError(
            'Inspection not found'
          )
        }

        if (
          Number(inspection.tool_id) !==
          report.toolId
        ) {
          throw new DamageReportDomainError(
            'Inspection does not belong to selected tool'
          )
        }
      }

      const result =
        await client.query(
          `INSERT INTO damage_reports
            (
              tool_id,
              inspection_id,
              description,
              severity,
              notes
            )
           VALUES ($1, $2, $3, $4, $5)
           RETURNING *`,
          [
            report.toolId,
            report.inspectionId,
            report.description,
            report.severity,
            report.notes
          ]
        )

      const createdReport =
        result.rows[0]

      const existingWorkOrderResult =
        await client.query(
          `SELECT work_order_id
           FROM work_orders
           WHERE tool_id = $1
             AND status IN (
               'Open',
               'Completed',
               'Awaiting Approval'
             )
           LIMIT 1`,
          [report.toolId]
        )

      if (
        (existingWorkOrderResult.rowCount ?? 0) ===
        0
      ) {
        await client.query(
          `INSERT INTO work_orders
            (
              tool_id,
              damage_report_id,
              description,
              priority,
              notes
            )
           VALUES ($1, $2, $3, $4, $5)`,
          [
            report.toolId,
            createdReport.damage_report_id,
            `Repair required for reported damage: ${report.description}`,
            report.severity,
            report.notes || null
          ]
        )
      }

      await client.query(
        `UPDATE tools
         SET
           status = $1,
           condition = $2,
           updated_at = CURRENT_TIMESTAMP
         WHERE tool_id = $3`,
        [
          DamageReport.TOOL_STATUS,
          DamageReport.TOOL_CONDITION,
          report.toolId
        ]
      )

      await createAlert(
        {
          tool_id: report.toolId,
          jobsite_id: null,
          alert_type: 'Damage Report',
          message:
            report.getAlertMessage(),
          severity: report.severity
        },
        client
      )

      await createAuditLog(
        {
          user_id: userId,
          action: 'DAMAGE_REPORT',
          entity_type: 'Tool',
          entity_id: report.toolId,
          description:
            report.getAuditDescription()
        },
        client
      )

      await client.query('COMMIT')

      return createdReport
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }
}

export const damageReportService =
  new DamageReportService()
