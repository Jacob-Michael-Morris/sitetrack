import type {
  Request,
  Response
} from 'express'

import {
  auditLogService
} from '../services/audit-logs.service.js'

export class AuditLogsController {
  async getAll(
    req: Request,
    res: Response
  ) {
    try {
      const logs =
        await auditLogService.getAll()

      res.json(logs)
    } catch (error) {
      console.error(error)

      res.status(500).json({
        message:
          'Unable to retrieve audit logs'
      })
    }
  }
}

export const auditLogsController =
  new AuditLogsController()