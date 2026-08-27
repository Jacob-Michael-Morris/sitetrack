import { Router } from 'express'

import {
  workOrdersController
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

router.get(
  '/',
  (req, res) =>
    workOrdersController.getAll(
      req,
      res
    )
)

router.get(
  '/:id',
  (req, res) =>
    workOrdersController.getById(
      req,
      res
    )
)

router.post(
  '/',
  (req, res) =>
    workOrdersController.create(
      req,
      res
    )
)

router.put(
  '/:id/complete',
  (req, res) =>
    workOrdersController.complete(
      req,
      res
    )
)

router.put(
  '/:id/return-to-service',
  (req, res) =>
    workOrdersController
      .returnToService(
        req,
        res
      )
)

export default router