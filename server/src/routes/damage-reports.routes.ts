import { Router } from 'express'

import {
  damageReportsController
} from '../controllers/damage-reports.controller.js'

import {
  requireAuth,
  requirePermission
} from '../middleware/auth.middleware.js'

const router = Router()

router.use(requireAuth)

router.get(
  '/',
  requirePermission(
    'damage_reports.view'
  ),
  (req, res) =>
    damageReportsController.getAll(
      req,
      res
    )
)

router.get(
  '/:id',
  requirePermission(
    'damage_reports.view'
  ),
  (req, res) =>
    damageReportsController.getById(
      req,
      res
    )
)

router.post(
  '/',
  requirePermission(
    'damage_reports.create'
  ),
  (req, res) =>
    damageReportsController.create(
      req,
      res
    )
)

export default router