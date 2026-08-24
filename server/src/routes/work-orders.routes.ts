import { Router } from 'express'

import {
  addWorkOrder,
  completeWorkOrderRequest,
  getWorkOrder,
  getWorkOrders,
  returnToService
} from '../controllers/work-orders.controller.js'

const router = Router()

router.get('/', getWorkOrders)
router.get('/:id', getWorkOrder)
router.post('/', addWorkOrder)
router.put('/:id/complete', completeWorkOrderRequest)
router.put('/:id/return-to-service', returnToService)

export default router