import { Router } from 'express'

import {
  addWorkOrder,
  completeWorkOrderRequest,
  getWorkOrder,
  getWorkOrders,
  returnToService
} from '../controllers/work-orders.controller.js'

import {
  requireAuth,
  requireRole
} from '../middleware/auth.middleware.js'

const router = Router()

router.use(requireAuth)

router.use(
  requireRole(
    'Administrator',
    'Maintenance Technician'
  )
)

router.get('/', getWorkOrders)
router.get('/:id', getWorkOrder)
router.post('/', addWorkOrder)
router.put('/:id/complete', completeWorkOrderRequest)
router.put('/:id/return-to-service', returnToService)

export default router