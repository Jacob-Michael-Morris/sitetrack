import pool from '../database/pool.js'

import {
  AssignmentDomainError,
  ToolAssignment
} from '../models/ToolAssignment.js'

import type {
  CheckoutAssignmentInput,
  ReturnAssignmentInput,
  TransferAssignmentInput
} from '../models/ToolAssignment.js'

import {
  createAuditLog
} from './audit-logs.service.js'

export class AssignmentService {
  async getAll() {
    const result = await pool.query(
      `SELECT
         a.assignment_id,
         a.tool_id,
         t.name AS tool_name,
         t.serial_number,
         a.jobsite_id,
         j.name AS jobsite_name,
         a.assigned_at,
         a.released_at,
         a.status,
         a.notes
       FROM tool_assignments a
       JOIN tools t
         ON a.tool_id = t.tool_id
       JOIN jobsites j
         ON a.jobsite_id = j.jobsite_id
       ORDER BY a.assigned_at DESC`
    )

    return result.rows
  }

  async checkout(
    input: CheckoutAssignmentInput,
    userId: number
  ) {
    const assignment =
      ToolAssignment.forCheckout(input)

    const client =
      await pool.connect()

    try {
      await client.query('BEGIN')

      const toolResult =
        await client.query(
          `SELECT
             tool_id,
             name,
             status
           FROM tools
           WHERE tool_id = $1
           FOR UPDATE`,
          [assignment.toolId]
        )

      const tool =
        toolResult.rows[0]

      if (!tool) {
        throw new AssignmentDomainError(
          'Tool not found'
        )
      }

      const activeAssignmentResult =
        await client.query(
          `SELECT assignment_id
           FROM tool_assignments
           WHERE tool_id = $1
             AND released_at IS NULL`,
          [assignment.toolId]
        )

      if (
        (activeAssignmentResult.rowCount ?? 0) >
        0
      ) {
        throw new AssignmentDomainError(
          'Tool already has an active assignment'
        )
      }

      const jobsiteResult =
        await client.query(
          `SELECT
             jobsite_id,
             name
           FROM jobsites
           WHERE jobsite_id = $1`,
          [assignment.jobsiteId]
        )

      const jobsite =
        jobsiteResult.rows[0]

      if (!jobsite) {
        throw new AssignmentDomainError(
          'Jobsite not found'
        )
      }

      const assignmentResult =
        await client.query(
          `INSERT INTO tool_assignments
            (
              tool_id,
              jobsite_id,
              status,
              notes
            )
           VALUES ($1, $2, $3, $4)
           RETURNING *`,
          [
            assignment.toolId,
            assignment.jobsiteId,
            ToolAssignment
              .CHECKED_OUT_STATUS,
            assignment.notes || null
          ]
        )

      const createdAssignment =
        assignmentResult.rows[0]

      await client.query(
        `UPDATE tools
         SET
           status = $1,
           updated_at = CURRENT_TIMESTAMP
         WHERE tool_id = $2`,
        [
          ToolAssignment
            .CHECKED_OUT_STATUS,
          assignment.toolId
        ]
      )

      await createAuditLog(
        {
          user_id: userId,
          action: 'TOOL_CHECKOUT',
          entity_type: 'Tool',
          entity_id: assignment.toolId,
          description:
            `Tool "${tool.name}" was checked out to jobsite "${jobsite.name}".`
        },
        client
      )

      await client.query('COMMIT')

      return createdAssignment
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }

  async return(
    input: ReturnAssignmentInput,
    userId: number
  ) {
    const assignment =
      ToolAssignment.forReturn(input)

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
          [assignment.toolId]
        )

      const tool =
        toolResult.rows[0]

      if (!tool) {
        throw new AssignmentDomainError(
          'Tool not found'
        )
      }

      const activeAssignmentResult =
        await client.query(
          `SELECT
             assignment_id,
             jobsite_id
           FROM tool_assignments
           WHERE tool_id = $1
             AND released_at IS NULL
           FOR UPDATE`,
          [assignment.toolId]
        )

      const activeAssignment =
        activeAssignmentResult.rows[0]

      if (!activeAssignment) {
        throw new AssignmentDomainError(
          'Tool does not have an active assignment'
        )
      }

      const result =
        await client.query(
          `UPDATE tool_assignments
           SET
             released_at =
               CURRENT_TIMESTAMP,
             status = $1,
             notes = CASE
               WHEN $2 = ''
                 THEN notes
               ELSE $2
             END
           WHERE assignment_id = $3
           RETURNING *`,
          [
            ToolAssignment.RETURNED_STATUS,
            assignment.notes,
            activeAssignment.assignment_id
          ]
        )

      const returnedAssignment =
        result.rows[0]

      await client.query(
        `UPDATE tools
         SET
           status = 'Available',
           updated_at = CURRENT_TIMESTAMP
         WHERE tool_id = $1`,
        [assignment.toolId]
      )

      await createAuditLog(
        {
          user_id: userId,
          action: 'TOOL_RETURN',
          entity_type: 'Tool',
          entity_id: assignment.toolId,
          description:
            `Tool "${tool.name}" was returned.`
        },
        client
      )

      await client.query('COMMIT')

      return returnedAssignment
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }

  async transfer(
    input: TransferAssignmentInput,
    userId: number
  ) {
    const assignment =
      ToolAssignment.forTransfer(input)

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
          [assignment.toolId]
        )

      const tool =
        toolResult.rows[0]

      if (!tool) {
        throw new AssignmentDomainError(
          'Tool not found'
        )
      }

      const activeAssignmentResult =
        await client.query(
          `SELECT
             assignment_id,
             jobsite_id
           FROM tool_assignments
           WHERE tool_id = $1
             AND released_at IS NULL
           FOR UPDATE`,
          [assignment.toolId]
        )

      const activeAssignment =
        activeAssignmentResult.rows[0]

      if (!activeAssignment) {
        throw new AssignmentDomainError(
          'Tool does not have an active assignment'
        )
      }

      assignment.assertDifferentJobsite(
        Number(
          activeAssignment.jobsite_id
        )
      )

      const oldJobsiteResult =
        await client.query(
          `SELECT name
           FROM jobsites
           WHERE jobsite_id = $1`,
          [
            activeAssignment.jobsite_id
          ]
        )

      const newJobsiteResult =
        await client.query(
          `SELECT
             jobsite_id,
             name
           FROM jobsites
           WHERE jobsite_id = $1`,
          [assignment.jobsiteId]
        )

      const oldJobsite =
        oldJobsiteResult.rows[0]

      const newJobsite =
        newJobsiteResult.rows[0]

      if (!newJobsite) {
        throw new AssignmentDomainError(
          'New jobsite not found'
        )
      }

      await client.query(
        `UPDATE tool_assignments
         SET
           released_at =
             CURRENT_TIMESTAMP,
           status = $1
         WHERE assignment_id = $2`,
        [
          ToolAssignment
            .TRANSFERRED_STATUS,
          activeAssignment.assignment_id
        ]
      )

      const result =
        await client.query(
          `INSERT INTO tool_assignments
            (
              tool_id,
              jobsite_id,
              status,
              notes
            )
           VALUES ($1, $2, $3, $4)
           RETURNING *`,
          [
            assignment.toolId,
            assignment.jobsiteId,
            ToolAssignment
              .CHECKED_OUT_STATUS,
            assignment.notes || null
          ]
        )

      const transferredAssignment =
        result.rows[0]

      await client.query(
        `UPDATE tools
         SET
           status = $1,
           updated_at = CURRENT_TIMESTAMP
         WHERE tool_id = $2`,
        [
          ToolAssignment
            .CHECKED_OUT_STATUS,
          assignment.toolId
        ]
      )

      await createAuditLog(
        {
          user_id: userId,
          action: 'TOOL_TRANSFER',
          entity_type: 'Tool',
          entity_id: assignment.toolId,
          description:
            `Tool "${tool.name}" was transferred from "${oldJobsite?.name ?? 'Unknown Jobsite'}" to "${newJobsite.name}".`
        },
        client
      )

      await client.query('COMMIT')

      return transferredAssignment
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }
}

export const assignmentService =
  new AssignmentService()