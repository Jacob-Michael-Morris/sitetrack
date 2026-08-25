import type { Request, Response } from 'express'

import {
  createDamageReport,
  getAllDamageReports,
  getDamageReportById
} from '../services/damage-reports.service.js'

export async function getDamageReports(
  req: Request,
  res: Response
) {
  try {
    const reports = await getAllDamageReports()
    res.json(reports)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Unable to retrieve damage reports'
    })
  }
}

export async function getDamageReport(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id)
    const report = await getDamageReportById(id)

    if (!report) {
      res.status(404).json({
        message: 'Damage report not found'
      })
      return
    }

    res.json(report)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Unable to retrieve damage report'
    })
  }
}

export async function addDamageReport(
  req: Request,
  res: Response
) {
  try {
    const {
      tool_id,
      inspection_id,
      description,
      severity,
      notes
    } = req.body

    if (!tool_id || !description || !severity) {
      res.status(400).json({
        message: 'Tool, description, and severity are required'
      })
      return
    }

    const userId = Number(res.locals.auth.userId)

    const report = await createDamageReport(
      {
        tool_id: Number(tool_id),
        inspection_id: inspection_id
          ? Number(inspection_id)
          : null,
        description,
        severity,
        notes: notes || ''
      },
      userId
    )

    res.status(201).json(report)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Unable to create damage report'
    })
  }
}