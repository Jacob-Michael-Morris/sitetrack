import { Router } from 'express'

import {
  getAuditLogs
} from '../controllers/audit-logs.controller.js'

import {
  requireAuth,
  requireRole
} from '../middleware/auth.middleware.js'

const router = Router()

router.use(requireAuth)
router.use(requireRole('Administrator'))

router.get('/', getAuditLogs)

export default router