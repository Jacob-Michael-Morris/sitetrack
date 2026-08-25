import type { Request, Response } from 'express'
import { getAllAuditLogs } from '../services/audit-logs.service.js'

export async function getAuditLogs(
  req: Request,
  res: Response
) {
  try {
    const logs = await getAllAuditLogs()
    res.json(logs)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Unable to retrieve audit logs'
    })
  }
}