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
  async getMaintenanceTechnicians(
    req: Request,
    res: Response
  ) {
    try {
      const technicians =
        await workOrderService
          .getMaintenanceTechnicians()

      res.json(technicians)
    } catch (error) {
      console.error(error)

      res.status(500).json({
        message:
          'Unable to retrieve maintenance technicians'
      })
    }
  }

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

  async requestReturnToService(
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
          .requestReturnToService(
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
          'Return-to-service review requested successfully'
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
            'Unable to request return-to-service review'
      })
    }
  }

  async decideReturnToService(
    req: Request,
    res: Response
  ) {
    try {
      const id = Number(req.params.id)

      if (
        !Number.isInteger(id) ||
        id <= 0
      ) {
        res.status(400).json({
          message: 'Invalid work order ID'
        })
        return
      }

      const userId = Number(
        res.locals.auth.userId
      )

      const result =
        await workOrderService
          .decideReturnToService(
            id,
            userId,
            req.body.decision,
            req.body.reason
          )

      if (!result) {
        res.status(404).json({
          message: 'Work order not found'
        })
        return
      }

      res.json(result)
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
          'Unable to record return-to-service decision'
      })
    }
  }
}

export const workOrdersController =
  new WorkOrdersController()
