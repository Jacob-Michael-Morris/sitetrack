import { Router } from 'express'

import {
  addInspection,
  getInspection,
  getInspections
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

router.get('/', getInspections)
router.get('/:id', getInspection)
router.post('/', addInspection)

export default router