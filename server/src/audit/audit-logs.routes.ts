import { Router } from 'express'

import {
  auditLogsController
} from './audit-logs.controller.js'

import {
  requireAuth,
  requirePermission
} from '../authentication-rbac/authentication/auth.middleware.js'

const router = Router()

router.use(requireAuth)

router.use(
  requirePermission(
    'audit.view'
  )
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