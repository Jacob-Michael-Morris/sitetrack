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

router.get(
  '/',
  requireRole(
    'Administrator',
    'Equipment Manager',
    'Maintenance Technician',
    'Worker',
    'Safety Personnel'
  ),
  (req, res) =>
    inspectionsController.getAll(
      req,
      res
    )
)

router.get(
  '/:id',
  requireRole(
    'Administrator',
    'Equipment Manager',
    'Maintenance Technician',
    'Worker',
    'Safety Personnel'
  ),
  (req, res) =>
    inspectionsController.getById(
      req,
      res
    )
)

router.post(
  '/',
  requireRole(
    'Administrator',
    'Equipment Manager',
    'Maintenance Technician',
    'Worker'
  ),
  (req, res) =>
    inspectionsController.create(
      req,
      res
    )
)

export default router
