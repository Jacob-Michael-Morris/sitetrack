import type {
  Request,
  Response
} from 'express'

import {
  DamageReportDomainError
} from '../models/DamageReport.js'

import {
  damageReportService
} from '../services/damage-reports.service.js'

export class DamageReportsController {
  async getAll(
    req: Request,
    res: Response
  ) {
    try {
      const reports =
        await damageReportService.getAll()

      res.json(reports)
    } catch (error) {
      console.error(error)

      res.status(500).json({
        message:
          'Unable to retrieve damage reports'
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
            'Invalid damage report ID'
        })
        return
      }

      const report =
        await damageReportService.getById(
          id
        )

      if (!report) {
        res.status(404).json({
          message:
            'Damage report not found'
        })
        return
      }

      res.json(report)
    } catch (error) {
      console.error(error)

      res.status(500).json({
        message:
          'Unable to retrieve damage report'
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

      const report =
        await damageReportService.create(
          req.body,
          userId
        )

      res.status(201).json(report)
    } catch (error) {
      console.error(error)

      if (
        error instanceof
        DamageReportDomainError
      ) {
        res.status(400).json({
          message: error.message
        })
        return
      }

      res.status(500).json({
        message:
          'Unable to create damage report'
      })
    }
  }
}

export const damageReportsController =
  new DamageReportsController()