import pool from '../database/pool.js'

export async function getAllAssignments() {
  const result = await pool.query(
    `SELECT
       a.assignment_id,
       a.tool_id,
       a.jobsite_id,
       a.assigned_at,
       a.released_at,
       a.status,
       a.notes,
       t.name AS tool_name,
       t.serial_number,
       j.name AS jobsite_name
     FROM tool_assignments a
     JOIN tools t ON a.tool_id = t.tool_id
     JOIN jobsites j ON a.jobsite_id = j.jobsite_id
     ORDER BY a.assignment_id DESC`
  )

  return result.rows
}

export async function checkoutTool(
  toolId: number,
  jobsiteId: number,
  notes: string
) {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    const toolResult = await client.query(
      'SELECT status FROM tools WHERE tool_id = $1 FOR UPDATE',
      [toolId]
    )

    if (toolResult.rowCount === 0) {
      throw new Error('TOOL_NOT_FOUND')
    }

    if (toolResult.rows[0].status !== 'Available') {
      throw new Error('TOOL_NOT_AVAILABLE')
    }

    const assignmentResult = await client.query(
      `INSERT INTO tool_assignments
        (tool_id, jobsite_id, status, notes)
       VALUES ($1, $2, 'Assigned', $3)
       RETURNING *`,
      [toolId, jobsiteId, notes]
    )

    await client.query(
      `UPDATE tools
       SET status = 'Checked Out',
           updated_at = CURRENT_TIMESTAMP
       WHERE tool_id = $1`,
      [toolId]
    )

    await client.query('COMMIT')

    return assignmentResult.rows[0]
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

export async function returnTool(
  toolId: number,
  notes: string
) {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    const assignmentResult = await client.query(
      `SELECT assignment_id
       FROM tool_assignments
       WHERE tool_id = $1
         AND released_at IS NULL
       FOR UPDATE`,
      [toolId]
    )

    if (assignmentResult.rowCount === 0) {
      throw new Error('NO_ACTIVE_ASSIGNMENT')
    }

    const assignmentId = assignmentResult.rows[0].assignment_id

    await client.query(
      `UPDATE tool_assignments
       SET released_at = CURRENT_TIMESTAMP,
           status = 'Returned',
           notes = CASE
             WHEN $2 = '' THEN notes
             ELSE $2
           END
       WHERE assignment_id = $1`,
      [assignmentId, notes]
    )

    await client.query(
      `UPDATE tools
       SET status = 'Available',
           updated_at = CURRENT_TIMESTAMP
       WHERE tool_id = $1`,
      [toolId]
    )

    await client.query('COMMIT')
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
  notes: string
) {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    const currentResult = await client.query(
      `SELECT assignment_id, jobsite_id
       FROM tool_assignments
       WHERE tool_id = $1
         AND released_at IS NULL
       FOR UPDATE`,
      [toolId]
    )

    if (currentResult.rowCount === 0) {
      throw new Error('NO_ACTIVE_ASSIGNMENT')
    }

    const currentAssignment = currentResult.rows[0]

    if (currentAssignment.jobsite_id === newJobsiteId) {
      throw new Error('SAME_JOBSITE')
    }

    await client.query(
      `UPDATE tool_assignments
       SET released_at = CURRENT_TIMESTAMP,
           status = 'Transferred'
       WHERE assignment_id = $1`,
      [currentAssignment.assignment_id]
    )

    const result = await client.query(
      `INSERT INTO tool_assignments
        (tool_id, jobsite_id, status, notes)
       VALUES ($1, $2, 'Assigned', $3)
       RETURNING *`,
      [toolId, newJobsiteId, notes]
    )

    await client.query('COMMIT')

    return result.rows[0]
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}