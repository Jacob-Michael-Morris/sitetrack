import { Router } from 'express'

import {
  workOrdersController
} from '../controllers/work-orders.controller.js'

import {
  requireAuth,
  requirePermission
} from '../middleware/auth.middleware.js'

const router = Router()

router.use(requireAuth)

router.get(
  '/',
  requirePermission(
    'maintenance.view'
  ),
  (req, res) =>
    workOrdersController.getAll(
      req,
      res
    )
)

router.get(
  '/technicians',
  requirePermission(
    'maintenance.view'
  ),
  (req, res) =>
    workOrdersController
      .getMaintenanceTechnicians(
        req,
        res
      )
)

router.get(
  '/:id',
  requirePermission(
    'maintenance.view'
  ),
  (req, res) =>
    workOrdersController.getById(
      req,
      res
    )
)

router.post(
  '/',
  requirePermission(
    'maintenance.create'
  ),
  (req, res) =>
    workOrdersController.create(
      req,
      res
    )
)

router.put(
  '/:id/complete',
  requirePermission(
    'maintenance.complete'
  ),
  (req, res) =>
    workOrdersController.complete(
      req,
      res
    )
)

router.put(
  '/:id/return-request',
  requirePermission(
    'maintenance.return_request'
  ),
  (req, res) =>
    workOrdersController
      .requestReturnToService(
        req,
        res
      )
)

router.put(
  '/:id/return-decision',
  requirePermission(
    'maintenance.return_approve'
  ),
  (req, res) =>
    workOrdersController
      .decideReturnToService(
        req,
        res
      )
)

export default router