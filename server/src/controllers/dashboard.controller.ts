import type { Request, Response } from 'express'

import {
  getDashboardSummary
} from '../services/dashboard.service.js'

export async function getDashboard(
  req: Request,
  res: Response
) {
  try {
    const dashboard = await getDashboardSummary()

    res.json(dashboard)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Unable to retrieve dashboard data'
    })
  }
}