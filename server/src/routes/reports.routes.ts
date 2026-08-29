import { Router } from 'express'

import {
  reportsController
} from '../controllers/reports.controller.js'

import {
  requireAuth,
  requireRole
} from '../middleware/auth.middleware.js'

const router = Router()

router.use(requireAuth)

router.get(
  '/tool-inventory',
  requireRole(
    'Administrator',
    'Equipment Manager',
    'Maintenance Technician',
    'Safety Personnel'
  ),
  (req, res) =>
    reportsController
      .getToolInventory(
        req,
        res
      )
)

router.get(
  '/current-assignments',
  requireRole(
    'Administrator',
    'Equipment Manager'
  ),
  (req, res) =>
    reportsController
      .getCurrentAssignments(
        req,
        res
      )
)

router.get(
  '/maintenance-history',
  requireRole(
    'Administrator',
    'Equipment Manager',
    'Maintenance Technician',
    'Safety Personnel'
  ),
  (req, res) =>
    reportsController
      .getMaintenanceHistory(
        req,
        res
      )
)

router.get(
  '/inspection-status',
  requireRole(
    'Administrator',
    'Equipment Manager',
    'Maintenance Technician',
    'Safety Personnel'
  ),
  (req, res) =>
    reportsController
      .getInspectionStatus(
        req,
        res
      )
)

router.get(
  '/damage-history',
  requireRole(
    'Administrator',
    'Equipment Manager',
    'Maintenance Technician',
    'Safety Personnel'
  ),
  (req, res) =>
    reportsController
      .getDamageHistory(
        req,
        res
      )
)

export default router
