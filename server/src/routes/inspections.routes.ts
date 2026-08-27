import { Router } from 'express'

import {
  inspectionsController
} from '../controllers/inspections.controller.js'

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
    'Safety Personnel'
  )
)

router.get(
  '/',
  (req, res) =>
    inspectionsController.getAll(
      req,
      res
    )
)

router.get(
  '/:id',
  (req, res) =>
    inspectionsController.getById(
      req,
      res
    )
)

router.post(
  '/',
  (req, res) =>
    inspectionsController.create(
      req,
      res
    )
)

export default router