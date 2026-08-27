import type {
  Request,
  Response
} from 'express'

import {
  alertService
} from '../services/alerts.service.js'

export class AlertsController {
  async getAll(
    req: Request,
    res: Response
  ) {
    try {
      await alertService
        .generateInspectionAlerts()

      const alerts =
        await alertService.getAll()

      res.json(alerts)
    } catch (error) {
      console.error(error)

      res.status(500).json({
        message:
          'Unable to retrieve alerts'
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
          message: 'Invalid alert ID'
        })
        return
      }

      const alert =
        await alertService.getById(id)

      if (!alert) {
        res.status(404).json({
          message: 'Alert not found'
        })
        return
      }

      res.json(alert)
    } catch (error) {
      console.error(error)

      res.status(500).json({
        message:
          'Unable to retrieve alert'
      })
    }
  }

  async markRead(
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
          message: 'Invalid alert ID'
        })
        return
      }

      const alert =
        await alertService.markRead(id)

      if (!alert) {
        res.status(404).json({
          message: 'Alert not found'
        })
        return
      }

      res.json(alert)
    } catch (error) {
      console.error(error)

      res.status(500).json({
        message:
          'Unable to update alert'
      })
    }
  }

  async markAllRead(
    req: Request,
    res: Response
  ) {
    try {
      await alertService.markAllRead()

      res.json({
        message:
          'All alerts marked as read'
      })
    } catch (error) {
      console.error(error)

      res.status(500).json({
        message:
          'Unable to update alerts'
      })
    }
  }
}

export const alertsController =
  new AlertsController()