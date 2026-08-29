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
  async getMaintenanceTechnicians() {
    const result = await pool.query(
      `SELECT
         u.user_id,
         u.name
       FROM users u
       JOIN roles r
         ON u.role_id = r.role_id
       WHERE r.name = 'Maintenance Technician'
         AND u.is_active = TRUE
       ORDER BY u.name`
    )

    return result.rows
  }

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
         w.completed_by,
         completed_user.name AS completed_by_name,
         w.return_requested_by,
         requested_user.name AS return_requested_by_name,
         w.return_requested_at,
         w.opened_at,
         w.completed_at,
         w.notes,
         t.name AS tool_name,
         t.serial_number,
         decision.decision_id,
         decision.decision,
         decision.reason AS decision_reason,
         decision.decided_at,
         decision.approver_user_id,
         decision.approver_name,
         decision.block_disposition
       FROM work_orders w
       JOIN tools t
         ON w.tool_id = t.tool_id
       LEFT JOIN users completed_user
         ON w.completed_by = completed_user.user_id
       LEFT JOIN users requested_user
         ON w.return_requested_by = requested_user.user_id
       LEFT JOIN LATERAL (
         SELECT
           d.decision_id,
           d.decision,
           d.reason,
           d.decided_at,
           d.approver_user_id,
           approver.name AS approver_name,
           d.block_disposition
         FROM return_service_decisions d
         JOIN users approver
           ON d.approver_user_id = approver.user_id
         WHERE d.work_order_id = w.work_order_id
         ORDER BY d.decided_at DESC
         LIMIT 1
       ) decision ON TRUE
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
             name,
             status
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
        tool.status !== 'Maintenance' &&
        tool.status !== 'Out of Service'
      ) {
        throw new WorkOrderDomainError(
          'Work orders can only be created for tools requiring maintenance or repair'
        )
      }

      const activeOrderResult =
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
          [workOrder.toolId]
        )

      if (
        (activeOrderResult.rowCount ?? 0) > 0
      ) {
        throw new WorkOrderDomainError(
          'This tool already has an active work order'
        )
      }

      if (workOrder.assignedTo) {
        const technicianResult =
          await client.query(
            `SELECT u.user_id
             FROM users u
             JOIN roles r
               ON u.role_id = r.role_id
             WHERE u.name = $1
               AND u.is_active = TRUE
               AND r.name = 'Maintenance Technician'`,
            [workOrder.assignedTo]
          )

        if (
          (technicianResult.rowCount ?? 0) !== 1
        ) {
          throw new WorkOrderDomainError(
            'Select an active maintenance technician'
          )
        }
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
             completed_by = $2,
             completed_at =
               CURRENT_TIMESTAMP
           WHERE work_order_id = $3
           RETURNING *`,
          [
            WorkOrder.COMPLETED_STATUS,
            userId,
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

  async requestReturnToService(
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

      WorkOrder.assertCanRequestReturnToService(
        workOrder.status
      )

      await client.query(
        `UPDATE work_orders
         SET
           status = $1,
           return_requested_by = $2,
           return_requested_at = CURRENT_TIMESTAMP
         WHERE work_order_id = $3`,
        [
          WorkOrder.AWAITING_APPROVAL_STATUS,
          userId,
          id
        ]
      )

      await createAlert(
        {
          tool_id: workOrder.tool_id,
          jobsite_id: null,
          alert_type:
            'Return to Service Approval',
          message:
            'A completed work order is awaiting return-to-service approval.',
          severity: 'Medium'
        },
        client
      )

      await createAuditLog(
        {
          user_id: userId,
          action: 'RETURN_TO_SERVICE_REQUESTED',
          entity_type: 'Tool',
          entity_id:
            workOrder.tool_id,
          description:
            `Return-to-service review was requested for work order #${id}.`
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

  async decideReturnToService(
    id: number,
    userId: number,
    decisionValue: unknown,
    reasonValue: unknown
  ) {
    const decision = String(
      decisionValue ?? ''
    ).trim()

    const reason = String(
      reasonValue ?? ''
    ).trim()

    if (
      decision !== 'Approved' &&
      decision !== 'Denied'
    ) {
      throw new WorkOrderDomainError(
        'Decision must be Approved or Denied'
      )
    }

    if (!reason) {
      throw new WorkOrderDomainError(
        'A decision reason is required'
      )
    }

    const client = await pool.connect()

    try {
      await client.query('BEGIN')

      const result = await client.query(
        `SELECT
           work_order_id,
           tool_id,
           damage_report_id,
           status,
           completed_by
         FROM work_orders
         WHERE work_order_id = $1
         FOR UPDATE`,
        [id]
      )

      const workOrder = result.rows[0]

      if (!workOrder) {
        await client.query('ROLLBACK')
        return undefined
      }

      WorkOrder.assertCanDecideReturnToService(
        workOrder.status
      )

      if (
        Number(workOrder.completed_by) ===
        userId
      ) {
        throw new WorkOrderDomainError(
          'The user who completed the repair cannot approve or deny its return to service'
        )
      }

      const approved =
        decision === 'Approved'

      await client.query(
        `INSERT INTO return_service_decisions
          (
            work_order_id,
            approver_user_id,
            decision,
            reason,
            block_disposition
          )
         VALUES ($1, $2, $3, $4, $5)`,
        [
          id,
          userId,
          decision,
          reason,
          approved
            ? 'Cleared'
            : 'Remains Active'
        ]
      )

      await client.query(
        `UPDATE work_orders
         SET
           status = $1,
           return_requested_by = NULL,
           return_requested_at = NULL
         WHERE work_order_id = $2`,
        [
          approved
            ? WorkOrder.CLOSED_STATUS
            : WorkOrder.OPEN_STATUS,
          id
        ]
      )

      if (approved) {
        await client.query(
          `UPDATE tools
           SET
             status = $1,
             condition = $2,
             updated_at = CURRENT_TIMESTAMP
           WHERE tool_id = $3`,
          [
            WorkOrder.AVAILABLE_STATUS,
            WorkOrder.GOOD_CONDITION,
            workOrder.tool_id
          ]
        )

        if (workOrder.damage_report_id) {
          await client.query(
            `UPDATE damage_reports
             SET
               status = 'Resolved',
               resolved_at = CURRENT_TIMESTAMP
             WHERE damage_report_id = $1`,
            [workOrder.damage_report_id]
          )
        }
      }

      await createAlert(
        {
          tool_id: workOrder.tool_id,
          jobsite_id: null,
          alert_type: 'Return to Service Decision',
          message:
            `Return to service was ${decision.toLowerCase()} for work order #${id}.`,
          severity: approved ? 'Info' : 'High'
        },
        client
      )

      await createAuditLog(
        {
          user_id: userId,
          action: approved
            ? 'RETURN_TO_SERVICE_APPROVED'
            : 'RETURN_TO_SERVICE_DENIED',
          entity_type: 'Tool',
          entity_id: workOrder.tool_id,
          description:
            `Return to service for work order #${id} was ${decision.toLowerCase()}. Reason: ${reason}`
        },
        client
      )

      await client.query('COMMIT')

      return {
        work_order_id: id,
        decision
      }
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
