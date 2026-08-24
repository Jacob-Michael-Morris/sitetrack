import pool from '../database/pool.js'
import { createAlert } from './alerts.service.js'

export async function getAllInspections() {
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
     JOIN tools t ON i.tool_id = t.tool_id
     ORDER BY i.inspection_date DESC`
  )

  return result.rows
}

export async function getInspectionById(id: number) {
  const result = await pool.query(
    `SELECT
       i.*,
       t.name AS tool_name,
       t.serial_number
     FROM inspections i
     JOIN tools t ON i.tool_id = t.tool_id
     WHERE inspection_id = $1`,
    [id]
  )

  return result.rows[0]
}

export async function createInspection(inspection: {
  tool_id: number
  result: string
  condition: string
  notes: string
  next_inspection_date: string | null
}) {
  const result = await pool.query(
    `INSERT INTO inspections
      (tool_id, result, condition, notes, next_inspection_date)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [
      inspection.tool_id,
      inspection.result,
      inspection.condition,
      inspection.notes,
      inspection.next_inspection_date
    ]
  )

const createdInspection = result.rows[0]

if (inspection.result === 'Failed') {
  await createAlert({
    tool_id: inspection.tool_id,
    jobsite_id: null,
    alert_type: 'Failed Inspection',
    message: 'Tool failed inspection and requires review.',
    severity: 'High'
  })
}

return createdInspection
}