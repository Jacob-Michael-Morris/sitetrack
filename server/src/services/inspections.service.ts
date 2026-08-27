import pool from '../database/pool.js'

import {
  Inspection,
  InspectionDomainError
} from '../models/Inspection.js'

import type {
  InspectionInput
} from '../models/Inspection.js'

import {
  createAlert
} from './alerts.service.js'

import {
  createAuditLog
} from './audit-logs.service.js'

export class InspectionService {
  async getAll() {
    const result = await pool.query(
      `SELECT
         i.inspection_id,
         i.tool_id,
         i.inspection_date,
         i.result,
         i.condition,
         i.notes,
         i.next_inspection_date,
         t.name AS tool_name,
         t.serial_number
       FROM inspections i
       JOIN tools t
         ON i.tool_id = t.tool_id
       ORDER BY i.inspection_date DESC`
    )

    return result.rows
  }

  async getById(id: number) {
    const result = await pool.query(
      `SELECT
         i.*,
         t.name AS tool_name,
         t.serial_number
       FROM inspections i
       JOIN tools t
         ON i.tool_id = t.tool_id
       WHERE i.inspection_id = $1`,
      [id]
    )

    return result.rows[0]
  }

  async create(
    input: InspectionInput,
    userId: number
  ) {
    const inspection =
      new Inspection(input)

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
           WHERE tool_id = $1`,
          [inspection.toolId]
        )

      const tool =
        toolResult.rows[0]

      if (!tool) {
        throw new InspectionDomainError(
          'Tool not found'
        )
      }

      const result =
        await client.query(
          `INSERT INTO inspections
            (
              tool_id,
              result,
              condition,
              notes,
              next_inspection_date
            )
           VALUES ($1, $2, $3, $4, $5)
           RETURNING *`,
          [
            inspection.toolId,
            inspection.result,
            inspection.condition,
            inspection.notes,
            inspection.nextInspectionDate
          ]
        )

      const createdInspection =
        result.rows[0]

      if (inspection.isFailed()) {
        await createAlert(
          {
            tool_id: inspection.toolId,
            jobsite_id: null,
            alert_type:
              'Failed Inspection',
            message:
              'Tool failed inspection and requires review.',
            severity: 'High'
          },
          client
        )
      }

      await createAuditLog(
        {
          user_id: userId,
          action: 'INSPECTION',
          entity_type: 'Tool',
          entity_id:
            inspection.toolId,
          description:
            `Inspection recorded with result: ${inspection.result}.`
        },
        client
      )

      await client.query('COMMIT')

      return createdInspection
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }
}

export const inspectionService =
  new InspectionService()