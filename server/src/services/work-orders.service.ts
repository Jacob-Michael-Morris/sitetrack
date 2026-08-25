import pool from '../database/pool.js'
import { createAlert } from './alerts.service.js'
import { createAuditLog } from './audit-logs.service.js'

export async function getAllWorkOrders() {
  const result = await pool.query(
    `SELECT
       w.work_order_id,
       w.tool_id,
       w.damage_report_id,
       w.description,
       w.priority,
       w.status,
       w.assigned_to,
       w.opened_at,
       w.completed_at,
       w.notes,
       t.name AS tool_name,
       t.serial_number
     FROM work_orders w
     JOIN tools t ON w.tool_id = t.tool_id
     ORDER BY w.opened_at DESC`
  )

  return result.rows
}

export async function getWorkOrderById(id: number) {
  const result = await pool.query(
    `SELECT
       w.*,
       t.name AS tool_name,
       t.serial_number
     FROM work_orders w
     JOIN tools t ON w.tool_id = t.tool_id
     WHERE w.work_order_id = $1`,
    [id]
  )

  return result.rows[0]
}

export async function createWorkOrder(workOrder: {
  tool_id: number
  damage_report_id: number | null
  description: string
  priority: string
  assigned_to: string
  notes: string
}) {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    const result = await client.query(
      `INSERT INTO work_orders
        (
          tool_id,
          damage_report_id,
          description,
          priority,
          assigned_to,
          notes
        )
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        workOrder.tool_id,
        workOrder.damage_report_id,
        workOrder.description,
        workOrder.priority,
        workOrder.assigned_to,
        workOrder.notes
      ]
    )

    await client.query(
      `UPDATE tools
       SET status = 'Maintenance',
           updated_at = CURRENT_TIMESTAMP
       WHERE tool_id = $1`,
      [workOrder.tool_id]
    )

    await createAlert(
    {
        tool_id: workOrder.tool_id,
        jobsite_id: null,
        alert_type: 'Maintenance Work Order',
        message: 'A maintenance work order was created for this tool.',
        severity: workOrder.priority
    },
    client
    )

    await createAuditLog(
      {
        user_id: null,
        action: 'WORK_ORDER_CREATED',
        entity_type: 'Tool',
        entity_id: workOrder.tool_id,
        description: 'Maintenance work order created.'
      },
      client
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

export async function completeWorkOrder(id: number) {
  const result = await pool.query(
    `UPDATE work_orders
     SET status = 'Completed',
         completed_at = CURRENT_TIMESTAMP
     WHERE work_order_id = $1
     RETURNING *`,
    [id]
  )

  return result.rows[0]
}

export async function returnToolToService(id: number) {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    const result = await client.query(
      `SELECT tool_id, damage_report_id, status
       FROM work_orders
       WHERE work_order_id = $1
       FOR UPDATE`,
      [id]
    )

    if (result.rowCount === 0) {
      throw new Error('WORK_ORDER_NOT_FOUND')
    }

    const workOrder = result.rows[0]

    if (workOrder.status !== 'Completed') {
      throw new Error('WORK_ORDER_NOT_COMPLETED')
    }

    await client.query(
      `UPDATE work_orders
       SET status = 'Closed'
       WHERE work_order_id = $1`,
      [id]
    )

    await client.query(
      `UPDATE tools
       SET status = 'Available',
           condition = 'Good',
           updated_at = CURRENT_TIMESTAMP
       WHERE tool_id = $1`,
      [workOrder.tool_id]
    )

    if (workOrder.damage_report_id) {
      await client.query(
        `UPDATE damage_reports
         SET status = 'Resolved',
             resolved_at = CURRENT_TIMESTAMP
         WHERE damage_report_id = $1`,
        [workOrder.damage_report_id]
      )
    }

    await createAlert(
    {
        tool_id: workOrder.tool_id,
        jobsite_id: null,
        alert_type: 'Return to Service',
        message: 'Maintenance is complete and the tool has been returned to service.',
        severity: 'Info'
    },
    client
    )

    await createAuditLog(
      {
        user_id: null,
        action: 'RETURN_TO_SERVICE',
        entity_type: 'Tool',
        entity_id: workOrder.tool_id,
        description: 'Tool maintenance completed and tool returned to service.'
      },
      client
    )

    await client.query('COMMIT')
    
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}