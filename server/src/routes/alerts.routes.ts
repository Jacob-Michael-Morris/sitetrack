import { Router } from 'express'

import {
  alertsController
} from '../controllers/alerts.controller.js'

import {
  requireAuth,
  requireRole
} from '../middleware/auth.middleware.js'

const router = Router()

router.use(requireAuth)

router.use(
  requireRole(
    'Administrator',
    'Equipment Manager',
    'Maintenance Technician',
    'Safety Personnel'
  )
)

router.get(
  '/',
  (req, res) =>
    alertsController.getAll(
      req,
      res
    )
)

router.get(
  '/:id',
  (req, res) =>
    alertsController.getById(
      req,
      res
    )
)

router.put(
  '/read-all',
  (req, res) =>
    alertsController.markAllRead(
      req,
      res
    )
)

router.put(
  '/:id/read',
  (req, res) =>
    alertsController.markRead(
      req,
      res
    )
)

export default router