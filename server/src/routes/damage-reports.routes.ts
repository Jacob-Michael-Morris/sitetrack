import { Router } from 'express'

import {
  damageReportsController
} from '../controllers/damage-reports.controller.js'

import {
  requireAuth,
  requireRole
} from '../middleware/auth.middleware.js'

const router = Router()

router.use(requireAuth)

router.use(
  requireRole(
    'Administrator',
    'Maintenance Technician',
    'Worker',
    'Safety Personnel'
  )
)

router.get(
  '/',
  (req, res) =>
    damageReportsController.getAll(
      req,
      res
    )
)

router.get(
  '/:id',
  (req, res) =>
    damageReportsController.getById(
      req,
      res
    )
)

router.post(
  '/',
  (req, res) =>
    damageReportsController.create(
      req,
      res
    )
)

export default router