import { Router } from 'express'

import {
  addDamageReport,
  getDamageReport,
  getDamageReports
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

router.get('/', getDamageReports)
router.get('/:id', getDamageReport)
router.post('/', addDamageReport)

export default router