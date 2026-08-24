import type { Request, Response } from 'express'

import {
  generateInspectionAlerts,
  getAlertById,
  getAllAlerts,
  markAlertRead,
  markAllAlertsRead
} from '../services/alerts.service.js'

export async function getAlerts(
  req: Request,
  res: Response
) {
  try {
    await generateInspectionAlerts()

    const alerts = await getAllAlerts()
    res.json(alerts)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Unable to retrieve alerts'
    })
  }
}

export async function getAlert(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id)
    const alert = await getAlertById(id)

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
      message: 'Unable to retrieve alert'
    })
  }
}

export async function readAlert(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id)
    const alert = await markAlertRead(id)

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
      message: 'Unable to update alert'
    })
  }
}

export async function readAllAlerts(
  req: Request,
  res: Response
) {
  try {
    await markAllAlertsRead()

    res.json({
      message: 'All alerts marked as read'
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Unable to update alerts'
    })
  }
}