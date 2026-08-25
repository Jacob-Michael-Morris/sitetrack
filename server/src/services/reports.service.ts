import pool from '../database/pool.js'

export async function getToolInventoryReport() {
  const result = await pool.query(
    `SELECT
       t.tool_id,
       t.name,
       t.serial_number,
       t.category,
       t.status,
       t.condition,
       t.purchase_date,
       j.name AS current_jobsite
     FROM tools t
     LEFT JOIN tool_assignments a
       ON t.tool_id = a.tool_id
       AND a.released_at IS NULL
     LEFT JOIN jobsites j
       ON a.jobsite_id = j.jobsite_id
     ORDER BY t.name`
  )

  return result.rows
}

export async function getCurrentAssignmentsReport() {
  const result = await pool.query(
    `SELECT
       a.assignment_id,
       a.tool_id,
       t.name AS tool_name,
       t.serial_number,
       a.jobsite_id,
       j.name AS jobsite_name,
       a.assigned_at,
       a.status,
       a.notes
     FROM tool_assignments a
     JOIN tools t
       ON a.tool_id = t.tool_id
     JOIN jobsites j
       ON a.jobsite_id = j.jobsite_id
     WHERE a.released_at IS NULL
     ORDER BY a.assigned_at DESC`
  )

  return result.rows
}

export async function getMaintenanceHistoryReport() {
  const result = await pool.query(
    `SELECT
       w.work_order_id,
       w.tool_id,
       t.name AS tool_name,
       t.serial_number,
       w.damage_report_id,
       w.description,
       w.priority,
       w.status,
       w.assigned_to,
       w.opened_at,
       w.completed_at,
       w.notes
     FROM work_orders w
     JOIN tools t
       ON w.tool_id = t.tool_id
     ORDER BY w.opened_at DESC`
  )

  return result.rows
}

export async function getInspectionStatusReport() {
  const result = await pool.query(
    `SELECT
       t.tool_id,
       t.name AS tool_name,
       t.serial_number,
       i.inspection_id,
       i.inspection_date,
       i.result,
       i.condition,
       i.next_inspection_date,
       CASE
         WHEN i.inspection_id IS NULL
           THEN 'No Inspection'
         WHEN i.next_inspection_date IS NULL
           THEN 'Not Scheduled'
         WHEN i.next_inspection_date < CURRENT_DATE
           THEN 'Overdue'
         WHEN i.next_inspection_date = CURRENT_DATE
           THEN 'Due Today'
         ELSE 'Current'
       END AS inspection_status
     FROM tools t
     LEFT JOIN LATERAL (
       SELECT
         i2.inspection_id,
         i2.inspection_date,
         i2.result,
         i2.condition,
         i2.next_inspection_date
       FROM inspections i2
       WHERE i2.tool_id = t.tool_id
       ORDER BY
         i2.inspection_date DESC,
         i2.inspection_id DESC
       LIMIT 1
     ) i ON TRUE
     ORDER BY t.name`
  )

  return result.rows
}

export async function getDamageHistoryReport() {
  const result = await pool.query(
    `SELECT
       d.damage_report_id,
       d.tool_id,
       t.name AS tool_name,
       t.serial_number,
       d.inspection_id,
       d.description,
       d.severity,
       d.status,
       d.reported_at,
       d.resolved_at,
       d.notes
     FROM damage_reports d
     JOIN tools t
       ON d.tool_id = t.tool_id
     ORDER BY d.reported_at DESC`
  )

  return result.rows
}