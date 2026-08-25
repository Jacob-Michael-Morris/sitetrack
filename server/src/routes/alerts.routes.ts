import { Router } from 'express'

import {
  getAlert,
  getAlerts,
  readAlert,
  readAllAlerts
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

router.get('/', getAlerts)
router.get('/:id', getAlert)
router.put('/read-all', readAllAlerts)
router.put('/:id/read', readAlert)

export default router