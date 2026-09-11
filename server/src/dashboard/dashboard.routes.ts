import { Router } from 'express'

import {
  dashboardController
} from './dashboard.controller.js'

import {
  requireAuth,
  requirePermission
} from '../authentication-rbac/authentication/auth.middleware.js'

const router = Router()

router.use(requireAuth)

router.get(
  '/',
  requirePermission(
    'dashboard.view'
  ),
  (req, res) =>
    dashboardController.getDashboard(
      req,
      res
    )
)

export default router