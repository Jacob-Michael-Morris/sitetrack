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

router.get(
  '/',
  requireRole(
    'Administrator',
    'Equipment Manager',
    'Maintenance Technician',
    'Safety Personnel'
  ),
  (req, res) =>
    workOrdersController.getAll(
      req,
      res
    )
)

router.get(
  '/technicians',
  requireRole(
    'Administrator',
    'Equipment Manager',
    'Maintenance Technician',
    'Safety Personnel'
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
  requireRole(
    'Administrator',
    'Equipment Manager',
    'Maintenance Technician',
    'Safety Personnel'
  ),
  (req, res) =>
    workOrdersController.getById(
      req,
      res
    )
)

router.post(
  '/',
  requireRole(
    'Administrator',
    'Equipment Manager'
  ),
  (req, res) =>
    workOrdersController.create(
      req,
      res
    )
)

router.put(
  '/:id/complete',
  requireRole(
    'Administrator',
    'Maintenance Technician'
  ),
  (req, res) =>
    workOrdersController.complete(
      req,
      res
    )
)

router.put(
  '/:id/return-request',
  requireRole(
    'Administrator',
    'Maintenance Technician'
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
  requireRole(
    'Administrator',
    'Equipment Manager'
  ),
  (req, res) =>
    workOrdersController
      .decideReturnToService(
        req,
        res
      )
)

export default router
