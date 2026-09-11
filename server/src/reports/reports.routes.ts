import { Router } from 'express'

import {
  reportsController
} from './reports.controller.js'

import {
  requireAuth,
  requirePermission
} from '../authentication-rbac/authentication/auth.middleware.js'

const router = Router()

router.use(requireAuth)

router.get(
  '/tool-inventory',
  requirePermission(
    'reports.view'
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
  requirePermission(
    'reports.view'
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
  requirePermission(
    'reports.view'
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
  requirePermission(
    'reports.view'
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
  requirePermission(
    'reports.view'
  ),
  (req, res) =>
    reportsController
      .getDamageHistory(
        req,
        res
      )
)

export default router