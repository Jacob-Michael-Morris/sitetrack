import pool from '../database/pool.js'

import {
  createAuditLog
} from './audit-logs.service.js'

export async function getAllAssignments() {
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

export async function checkoutTool(
  toolId: number,
  jobsiteId: number,
  notes: string,
  userId: number
) {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    const toolResult = await client.query(
      `SELECT
         tool_id,
         name,
         status
       FROM tools
       WHERE tool_id = $1
       FOR UPDATE`,
      [toolId]
    )

    const tool = toolResult.rows[0]

    if (!tool) {
      throw new Error('Tool not found')
    }

    const activeAssignmentResult = await client.query(
      `SELECT assignment_id
       FROM tool_assignments
       WHERE tool_id = $1
         AND released_at IS NULL`,
      [toolId]
    )

    if (activeAssignmentResult.rowCount !== 0) {
      throw new Error(
        'Tool already has an active assignment'
      )
    }

    const jobsiteResult = await client.query(
      `SELECT
         jobsite_id,
         name
       FROM jobsites
       WHERE jobsite_id = $1`,
      [jobsiteId]
    )

    const jobsite = jobsiteResult.rows[0]

    if (!jobsite) {
      throw new Error('Jobsite not found')
    }

    const assignmentResult = await client.query(
      `INSERT INTO tool_assignments
        (
          tool_id,
          jobsite_id,
          status,
          notes
        )
       VALUES ($1, $2, 'Checked Out', $3)
       RETURNING *`,
      [
        toolId,
        jobsiteId,
        notes || null
      ]
    )

    const assignment = assignmentResult.rows[0]

    await client.query(
      `UPDATE tools
       SET
         status = 'Checked Out',
         updated_at = CURRENT_TIMESTAMP
       WHERE tool_id = $1`,
      [toolId]
    )

    await createAuditLog(
      {
        user_id: userId,
        action: 'TOOL_CHECKOUT',
        entity_type: 'Tool',
        entity_id: toolId,
        description:
          `Tool "${tool.name}" was checked out to jobsite "${jobsite.name}".`
      },
      client
    )

    await client.query('COMMIT')

    return assignment
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

export async function returnTool(
  toolId: number,
  notes: string,
  userId: number
) {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    const toolResult = await client.query(
      `SELECT
         tool_id,
         name
       FROM tools
       WHERE tool_id = $1
       FOR UPDATE`,
      [toolId]
    )

    const tool = toolResult.rows[0]

    if (!tool) {
      throw new Error('Tool not found')
    }

    const activeAssignmentResult = await client.query(
      `SELECT
         assignment_id,
         jobsite_id
       FROM tool_assignments
       WHERE tool_id = $1
         AND released_at IS NULL
       FOR UPDATE`,
      [toolId]
    )

    const activeAssignment =
      activeAssignmentResult.rows[0]

    if (!activeAssignment) {
      throw new Error(
        'Tool does not have an active assignment'
      )
    }

    const result = await client.query(
      `UPDATE tool_assignments
       SET
         released_at = CURRENT_TIMESTAMP,
         status = 'Returned',
         notes = CASE
           WHEN $1 = '' THEN notes
           ELSE $1
         END
       WHERE assignment_id = $2
       RETURNING *`,
      [
        notes,
        activeAssignment.assignment_id
      ]
    )

    const assignment = result.rows[0]

    await client.query(
      `UPDATE tools
       SET
         status = 'Available',
         updated_at = CURRENT_TIMESTAMP
       WHERE tool_id = $1`,
      [toolId]
    )

    await createAuditLog(
      {
        user_id: userId,
        action: 'TOOL_RETURN',
        entity_type: 'Tool',
        entity_id: toolId,
        description:
          `Tool "${tool.name}" was returned.`
      },
      client
    )

    await client.query('COMMIT')

    return assignment
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

export async function transferTool(
  toolId: number,
  newJobsiteId: number,
  notes: string,
  userId: number
) {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    const toolResult = await client.query(
      `SELECT
         tool_id,
         name
       FROM tools
       WHERE tool_id = $1
       FOR UPDATE`,
      [toolId]
    )

    const tool = toolResult.rows[0]

    if (!tool) {
      throw new Error('Tool not found')
    }

    const activeAssignmentResult = await client.query(
      `SELECT
         assignment_id,
         jobsite_id
       FROM tool_assignments
       WHERE tool_id = $1
         AND released_at IS NULL
       FOR UPDATE`,
      [toolId]
    )

    const activeAssignment =
      activeAssignmentResult.rows[0]

    if (!activeAssignment) {
      throw new Error(
        'Tool does not have an active assignment'
      )
    }

    if (
      Number(activeAssignment.jobsite_id) ===
      newJobsiteId
    ) {
      throw new Error(
        'Tool is already assigned to this jobsite'
      )
    }

    const oldJobsiteResult = await client.query(
      `SELECT name
       FROM jobsites
       WHERE jobsite_id = $1`,
      [activeAssignment.jobsite_id]
    )

    const newJobsiteResult = await client.query(
      `SELECT
         jobsite_id,
         name
       FROM jobsites
       WHERE jobsite_id = $1`,
      [newJobsiteId]
    )

    const oldJobsite = oldJobsiteResult.rows[0]
    const newJobsite = newJobsiteResult.rows[0]

    if (!newJobsite) {
      throw new Error('New jobsite not found')
    }

    await client.query(
      `UPDATE tool_assignments
       SET
         released_at = CURRENT_TIMESTAMP,
         status = 'Transferred'
       WHERE assignment_id = $1`,
      [activeAssignment.assignment_id]
    )

    const result = await client.query(
      `INSERT INTO tool_assignments
        (
          tool_id,
          jobsite_id,
          status,
          notes
        )
       VALUES ($1, $2, 'Checked Out', $3)
       RETURNING *`,
      [
        toolId,
        newJobsiteId,
        notes || null
      ]
    )

    const assignment = result.rows[0]

    await client.query(
      `UPDATE tools
       SET
         status = 'Checked Out',
         updated_at = CURRENT_TIMESTAMP
       WHERE tool_id = $1`,
      [toolId]
    )

    await createAuditLog(
      {
        user_id: userId,
        action: 'TOOL_TRANSFER',
        entity_type: 'Tool',
        entity_id: toolId,
        description:
          `Tool "${tool.name}" was transferred from "${oldJobsite?.name ?? 'Unknown Jobsite'}" to "${newJobsite.name}".`
      },
      client
    )

    await client.query('COMMIT')

    return assignment
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}