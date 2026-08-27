import { Router } from 'express'

import {
  auditLogsController
} from '../controllers/audit-logs.controller.js'

import {
  requireAuth,
  requireRole
} from '../middleware/auth.middleware.js'

const router = Router()

router.use(requireAuth)

router.use(
  requireRole('Administrator')
)

router.get(
  '/',
  (req, res) =>
    auditLogsController.getAll(
      req,
      res
    )
)

export default router