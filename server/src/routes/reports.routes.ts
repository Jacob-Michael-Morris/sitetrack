import { Router } from 'express'

import {
  getCurrentAssignments,
  getDamageHistory,
  getInspectionStatus,
  getMaintenanceHistory,
  getToolInventory
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
  getToolInventory
)

router.get(
  '/current-assignments',
  requireRole(
    'Administrator',
    'Equipment Manager'
  ),
  getCurrentAssignments
)

router.get(
  '/maintenance-history',
  requireRole(
    'Administrator',
    'Equipment Manager',
    'Maintenance Technician'
  ),
  getMaintenanceHistory
)

router.get(
  '/inspection-status',
  requireRole(
    'Administrator',
    'Equipment Manager',
    'Maintenance Technician',
    'Safety Personnel'
  ),
  getInspectionStatus
)

router.get(
  '/damage-history',
  requireRole(
    'Administrator',
    'Equipment Manager',
    'Maintenance Technician',
    'Safety Personnel'
  ),
  getDamageHistory
)

export default router