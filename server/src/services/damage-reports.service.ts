import pool from '../database/pool.js'

export async function getAllDamageReports() {
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
     JOIN tools t ON d.tool_id = t.tool_id
     ORDER BY d.reported_at DESC`
  )

  return result.rows
}

export async function getDamageReportById(id: number) {
  const result = await pool.query(
    `SELECT
       d.*,
       t.name AS tool_name,
       t.serial_number
     FROM damage_reports d
     JOIN tools t ON d.tool_id = t.tool_id
     WHERE d.damage_report_id = $1`,
    [id]
  )

  return result.rows[0]
}

export async function createDamageReport(report: {
  tool_id: number
  inspection_id: number | null
  description: string
  severity: string
  notes: string
}) {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    const result = await client.query(
      `INSERT INTO damage_reports
        (tool_id, inspection_id, description, severity, notes)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        report.tool_id,
        report.inspection_id,
        report.description,
        report.severity,
        report.notes
      ]
    )

    await client.query(
      `UPDATE tools
       SET status = 'Out of Service',
           condition = 'Damaged',
           updated_at = CURRENT_TIMESTAMP
       WHERE tool_id = $1`,
      [report.tool_id]
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