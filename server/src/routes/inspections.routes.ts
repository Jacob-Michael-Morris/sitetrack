import { Router } from 'express'

import {
  inspectionsController
} from '../controllers/inspections.controller.js'

import {
  requireAuth,
  requirePermission
} from '../middleware/auth.middleware.js'

const router = Router()

router.use(requireAuth)

router.get(
  '/',
  requirePermission(
    'inspections.view'
  ),
  (req, res) =>
    inspectionsController.getAll(
      req,
      res
    )
)

router.get(
  '/:id',
  requirePermission(
    'inspections.view'
  ),
  (req, res) =>
    inspectionsController.getById(
      req,
      res
    )
)

router.post(
  '/',
  requirePermission(
    'inspections.create'
  ),
  (req, res) =>
    inspectionsController.create(
      req,
      res
    )
)

export default router