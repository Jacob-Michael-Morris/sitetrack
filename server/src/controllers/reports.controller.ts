import type { Request, Response } from 'express'

import {
  getCurrentAssignmentsReport,
  getDamageHistoryReport,
  getInspectionStatusReport,
  getMaintenanceHistoryReport,
  getToolInventoryReport
} from '../services/reports.service.js'

export async function getToolInventory(
  req: Request,
  res: Response
) {
  try {
    const report = await getToolInventoryReport()
    res.json(report)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Unable to generate tool inventory report'
    })
  }
}

export async function getCurrentAssignments(
  req: Request,
  res: Response
) {
  try {
    const report = await getCurrentAssignmentsReport()
    res.json(report)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Unable to generate assignments report'
    })
  }
}

export async function getMaintenanceHistory(
  req: Request,
  res: Response
) {
  try {
    const report = await getMaintenanceHistoryReport()
    res.json(report)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Unable to generate maintenance report'
    })
  }
}

export async function getInspectionStatus(
  req: Request,
  res: Response
) {
  try {
    const report = await getInspectionStatusReport()
    res.json(report)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Unable to generate inspection report'
    })
  }
}

export async function getDamageHistory(
  req: Request,
  res: Response
) {
  try {
    const report = await getDamageHistoryReport()
    res.json(report)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Unable to generate damage report'
    })
  }
}