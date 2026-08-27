import pool from '../database/pool.js'

import {
  WorkOrder,
  WorkOrderDomainError
} from '../models/WorkOrder.js'

import type {
  WorkOrderInput
} from '../models/WorkOrder.js'

import {
  createAlert
} from './alerts.service.js'

import {
  createAuditLog
} from './audit-logs.service.js'

export class WorkOrderService {
  async getAll() {
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
       JOIN tools t
         ON w.tool_id = t.tool_id
       ORDER BY w.opened_at DESC`
    )

    return result.rows
  }

  async getById(id: number) {
    const result = await pool.query(
      `SELECT
         w.*,
         t.name AS tool_name,
         t.serial_number
       FROM work_orders w
       JOIN tools t
         ON w.tool_id = t.tool_id
       WHERE w.work_order_id = $1`,
      [id]
    )

    return result.rows[0]
  }

  async create(
    input: WorkOrderInput,
    userId: number
  ) {
    const workOrder =
      new WorkOrder(input)

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
          [workOrder.toolId]
        )

      const tool =
        toolResult.rows[0]

      if (!tool) {
        throw new WorkOrderDomainError(
          'Tool not found'
        )
      }

      if (
        workOrder.damageReportId !== null
      ) {
        const damageReportResult =
          await client.query(
            `SELECT
               damage_report_id,
               tool_id
             FROM damage_reports
             WHERE damage_report_id = $1`,
            [workOrder.damageReportId]
          )

        const damageReport =
          damageReportResult.rows[0]

        if (!damageReport) {
          throw new WorkOrderDomainError(
            'Damage report not found'
          )
        }

        if (
          Number(damageReport.tool_id) !==
          workOrder.toolId
        ) {
          throw new WorkOrderDomainError(
            'Damage report does not belong to selected tool'
          )
        }
      }

      const result =
        await client.query(
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
            workOrder.toolId,
            workOrder.damageReportId,
            workOrder.description,
            workOrder.priority,
            workOrder.assignedTo,
            workOrder.notes
          ]
        )

      const createdWorkOrder =
        result.rows[0]

      await client.query(
        `UPDATE tools
         SET
           status = $1,
           updated_at = CURRENT_TIMESTAMP
         WHERE tool_id = $2`,
        [
          WorkOrder.MAINTENANCE_STATUS,
          workOrder.toolId
        ]
      )

      await createAlert(
        {
          tool_id: workOrder.toolId,
          jobsite_id: null,
          alert_type:
            'Maintenance Work Order',
          message:
            workOrder
              .getCreationAlertMessage(),
          severity: workOrder.priority
        },
        client
      )

      await createAuditLog(
        {
          user_id: userId,
          action: 'WORK_ORDER_CREATED',
          entity_type: 'Tool',
          entity_id: workOrder.toolId,
          description:
            workOrder
              .getCreationAuditDescription(
                createdWorkOrder.work_order_id
              )
        },
        client
      )

      await client.query('COMMIT')

      return createdWorkOrder
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }

  async complete(
    id: number,
    userId: number
  ) {
    const client =
      await pool.connect()

    try {
      await client.query('BEGIN')

      const existingResult =
        await client.query(
          `SELECT
             work_order_id,
             tool_id,
             status
           FROM work_orders
           WHERE work_order_id = $1
           FOR UPDATE`,
          [id]
        )

      const existingWorkOrder =
        existingResult.rows[0]

      if (!existingWorkOrder) {
        await client.query('ROLLBACK')
        return undefined
      }

      WorkOrder.assertCanComplete(
        existingWorkOrder.status
      )

      const result =
        await client.query(
          `UPDATE work_orders
           SET
             status = $1,
             completed_at =
               CURRENT_TIMESTAMP
           WHERE work_order_id = $2
           RETURNING *`,
          [
            WorkOrder.COMPLETED_STATUS,
            id
          ]
        )

      const completedWorkOrder =
        result.rows[0]

      await createAuditLog(
        {
          user_id: userId,
          action:
            'WORK_ORDER_COMPLETED',
          entity_type: 'Tool',
          entity_id:
            completedWorkOrder.tool_id,
          description:
            WorkOrder
              .getCompletionAuditDescription(
                completedWorkOrder
                  .work_order_id
              )
        },
        client
      )

      await client.query('COMMIT')

      return completedWorkOrder
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }

  async returnToService(
    id: number,
    userId: number
  ) {
    const client =
      await pool.connect()

    try {
      await client.query('BEGIN')

      const result =
        await client.query(
          `SELECT
             work_order_id,
             tool_id,
             damage_report_id,
             status
           FROM work_orders
           WHERE work_order_id = $1
           FOR UPDATE`,
          [id]
        )

      const workOrder =
        result.rows[0]

      if (!workOrder) {
        await client.query('ROLLBACK')
        return undefined
      }

      WorkOrder.assertCanReturnToService(
        workOrder.status
      )

      await client.query(
        `UPDATE work_orders
         SET status = $1
         WHERE work_order_id = $2`,
        [
          WorkOrder.CLOSED_STATUS,
          id
        ]
      )

      await client.query(
        `UPDATE tools
         SET
           status = $1,
           condition = $2,
           updated_at =
             CURRENT_TIMESTAMP
         WHERE tool_id = $3`,
        [
          WorkOrder.AVAILABLE_STATUS,
          WorkOrder.GOOD_CONDITION,
          workOrder.tool_id
        ]
      )

      if (
        workOrder.damage_report_id
      ) {
        await client.query(
          `UPDATE damage_reports
           SET
             status = 'Resolved',
             resolved_at =
               CURRENT_TIMESTAMP
           WHERE damage_report_id = $1`,
          [
            workOrder.damage_report_id
          ]
        )
      }

      await createAlert(
        {
          tool_id: workOrder.tool_id,
          jobsite_id: null,
          alert_type:
            'Return to Service',
          message:
            WorkOrder
              .getReturnToServiceMessage(),
          severity: 'Info'
        },
        client
      )

      await createAuditLog(
        {
          user_id: userId,
          action: 'RETURN_TO_SERVICE',
          entity_type: 'Tool',
          entity_id:
            workOrder.tool_id,
          description:
            WorkOrder
              .getReturnToServiceAuditDescription(
                id
              )
        },
        client
      )

      await client.query('COMMIT')

      return workOrder
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }
}

export const workOrderService =
  new WorkOrderService()