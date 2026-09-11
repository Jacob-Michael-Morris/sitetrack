import { Router } from 'express'

import {
  alertsController
} from './alerts.controller.js'

import {
  requireAuth,
  requirePermission
} from '../authentication-rbac/authentication/auth.middleware.js'

const router = Router()

router.use(requireAuth)

router.get(
  '/',
  requirePermission(
    'alerts.view'
  ),
  (req, res) =>
    alertsController.getAll(
      req,
      res
    )
)

router.get(
  '/:id',
  requirePermission(
    'alerts.view'
  ),
  (req, res) =>
    alertsController.getById(
      req,
      res
    )
)

router.put(
  '/read-all',
  requirePermission(
    'alerts.view'
  ),
  (req, res) =>
    alertsController.markAllRead(
      req,
      res
    )
)

router.put(
  '/:id/read',
  requirePermission(
    'alerts.view'
  ),
  (req, res) =>
    alertsController.markRead(
      req,
      res
    )
)

export default router