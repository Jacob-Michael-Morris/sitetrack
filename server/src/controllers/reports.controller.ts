import type {
  Request,
  Response
} from 'express'

import {
  reportService
} from '../services/reports.service.js'

export class ReportsController {
  async getToolInventory(
    req: Request,
    res: Response
  ) {
    try {
      const report =
        await reportService
          .getToolInventory()

      res.json(report)
    } catch (error) {
      console.error(error)

      res.status(500).json({
        message:
          'Unable to retrieve tool inventory report'
      })
    }
  }

  async getCurrentAssignments(
    req: Request,
    res: Response
  ) {
    try {
      const report =
        await reportService
          .getCurrentAssignments()

      res.json(report)
    } catch (error) {
      console.error(error)

      res.status(500).json({
        message:
          'Unable to retrieve current assignments report'
      })
    }
  }

  async getMaintenanceHistory(
    req: Request,
    res: Response
  ) {
    try {
      const report =
        await reportService
          .getMaintenanceHistory()

      res.json(report)
    } catch (error) {
      console.error(error)

      res.status(500).json({
        message:
          'Unable to retrieve maintenance history report'
      })
    }
  }

  async getInspectionStatus(
    req: Request,
    res: Response
  ) {
    try {
      const report =
        await reportService
          .getInspectionStatus()

      res.json(report)
    } catch (error) {
      console.error(error)

      res.status(500).json({
        message:
          'Unable to retrieve inspection status report'
      })
    }
  }

  async getDamageHistory(
    req: Request,
    res: Response
  ) {
    try {
      const report =
        await reportService
          .getDamageHistory()

      res.json(report)
    } catch (error) {
      console.error(error)

      res.status(500).json({
        message:
          'Unable to retrieve damage history report'
      })
    }
  }
}

export const reportsController =
  new ReportsController()