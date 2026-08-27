import type {
  Request,
  Response
} from 'express'

import {
  dashboardService
} from '../services/dashboard.service.js'

export class DashboardController {
  async getDashboard(
    req: Request,
    res: Response
  ) {
    try {
      const dashboard =
        await dashboardService.getSummary()

      res.json(dashboard)
    } catch (error) {
      console.error(error)

      res.status(500).json({
        message:
          'Unable to retrieve dashboard data'
      })
    }
  }
}

export const dashboardController =
  new DashboardController()