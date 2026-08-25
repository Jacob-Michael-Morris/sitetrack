import type { Request, Response } from 'express'

import {
  completeWorkOrder,
  createWorkOrder,
  getAllWorkOrders,
  getWorkOrderById,
  returnToolToService
} from '../services/work-orders.service.js'

export async function getWorkOrders(
  req: Request,
  res: Response
) {
  try {
    const workOrders = await getAllWorkOrders()
    res.json(workOrders)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Unable to retrieve work orders'
    })
  }
}

export async function getWorkOrder(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id)
    const workOrder = await getWorkOrderById(id)

    if (!workOrder) {
      res.status(404).json({
        message: 'Work order not found'
      })
      return
    }

    res.json(workOrder)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Unable to retrieve work order'
    })
  }
}

export async function addWorkOrder(
  req: Request,
  res: Response
) {
  try {
    const {
      tool_id,
      damage_report_id,
      description,
      priority,
      assigned_to,
      notes
    } = req.body

    if (!tool_id || !description) {
      res.status(400).json({
        message: 'Tool and description are required'
      })
      return
    }

    const userId = Number(res.locals.auth.userId)

    const workOrder = await createWorkOrder(
      {
        tool_id: Number(tool_id),
        damage_report_id: damage_report_id
          ? Number(damage_report_id)
          : null,
        description,
        priority: priority || 'Medium',
        assigned_to: assigned_to || '',
        notes: notes || ''
      },
      userId
    )

    res.status(201).json(workOrder)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Unable to create work order'
    })
  }
}

export async function completeWorkOrderRequest(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id)
    const userId = Number(res.locals.auth.userId)

    const workOrder = await completeWorkOrder(
      id,
      userId
    )

    if (!workOrder) {
      res.status(404).json({
        message: 'Work order not found'
      })
      return
    }

    res.json(workOrder)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Unable to complete work order'
    })
  }
}

export async function returnToService(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id)
    const userId = Number(res.locals.auth.userId)

    await returnToolToService(
      id,
      userId
    )

    res.json({
      message: 'Tool returned to service successfully'
    })
  } catch (error) {
    console.error(error)

    res.status(400).json({
      message: 'Unable to return tool to service'
    })
  }
}