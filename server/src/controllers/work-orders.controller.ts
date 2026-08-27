import type {
  Request,
  Response
} from 'express'

import {
  WorkOrderDomainError
} from '../models/WorkOrder.js'

import {
  workOrderService
} from '../services/work-orders.service.js'

export class WorkOrdersController {
  async getAll(
    req: Request,
    res: Response
  ) {
    try {
      const workOrders =
        await workOrderService.getAll()

      res.json(workOrders)
    } catch (error) {
      console.error(error)

      res.status(500).json({
        message:
          'Unable to retrieve work orders'
      })
    }
  }

  async getById(
    req: Request,
    res: Response
  ) {
    try {
      const id =
        Number(req.params.id)

      if (
        !Number.isInteger(id) ||
        id <= 0
      ) {
        res.status(400).json({
          message:
            'Invalid work order ID'
        })
        return
      }

      const workOrder =
        await workOrderService.getById(
          id
        )

      if (!workOrder) {
        res.status(404).json({
          message:
            'Work order not found'
        })
        return
      }

      res.json(workOrder)
    } catch (error) {
      console.error(error)

      res.status(500).json({
        message:
          'Unable to retrieve work order'
      })
    }
  }

  async create(
    req: Request,
    res: Response
  ) {
    try {
      const userId = Number(
        res.locals.auth.userId
      )

      const workOrder =
        await workOrderService.create(
          req.body,
          userId
        )

      res.status(201).json(
        workOrder
      )
    } catch (error) {
      console.error(error)

      if (
        error instanceof
        WorkOrderDomainError
      ) {
        res.status(400).json({
          message: error.message
        })
        return
      }

      res.status(500).json({
        message:
          'Unable to create work order'
      })
    }
  }

  async complete(
    req: Request,
    res: Response
  ) {
    try {
      const id =
        Number(req.params.id)

      if (
        !Number.isInteger(id) ||
        id <= 0
      ) {
        res.status(400).json({
          message:
            'Invalid work order ID'
        })
        return
      }

      const userId = Number(
        res.locals.auth.userId
      )

      const workOrder =
        await workOrderService.complete(
          id,
          userId
        )

      if (!workOrder) {
        res.status(404).json({
          message:
            'Work order not found'
        })
        return
      }

      res.json(workOrder)
    } catch (error) {
      console.error(error)

      if (
        error instanceof
        WorkOrderDomainError
      ) {
        res.status(400).json({
          message: error.message
        })
        return
      }

      res.status(500).json({
        message:
          'Unable to complete work order'
      })
    }
  }

  async returnToService(
    req: Request,
    res: Response
  ) {
    try {
      const id =
        Number(req.params.id)

      if (
        !Number.isInteger(id) ||
        id <= 0
      ) {
        res.status(400).json({
          message:
            'Invalid work order ID'
        })
        return
      }

      const userId = Number(
        res.locals.auth.userId
      )

      const workOrder =
        await workOrderService
          .returnToService(
            id,
            userId
          )

      if (!workOrder) {
        res.status(404).json({
          message:
            'Work order not found'
        })
        return
      }

      res.json({
        message:
          'Tool returned to service successfully'
      })
    } catch (error) {
      console.error(error)

      if (
        error instanceof
        WorkOrderDomainError
      ) {
        res.status(400).json({
          message: error.message
        })
        return
      }

      res.status(500).json({
        message:
          'Unable to return tool to service'
      })
    }
  }
}

export const workOrdersController =
  new WorkOrdersController()