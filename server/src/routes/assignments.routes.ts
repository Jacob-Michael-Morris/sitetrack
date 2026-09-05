import { Router } from 'express'

import {
  assignmentsController
} from '../controllers/assignments.controller.js'

import {
  requireAuth,
  requirePermission
} from '../middleware/auth.middleware.js'

const router = Router()

router.use(requireAuth)

router.get(
  '/',
  requirePermission(
    'assignments.view'
  ),
  (req, res) =>
    assignmentsController.getAll(
      req,
      res
    )
)

router.post(
  '/checkout',
  requirePermission(
    'assignments.checkout'
  ),
  (req, res) =>
    assignmentsController.checkout(
      req,
      res
    )
)

router.post(
  '/return',
  requirePermission(
    'assignments.return'
  ),
  (req, res) =>
    assignmentsController
      .returnAssignment(
        req,
        res
      )
)

router.post(
  '/transfer',
  requirePermission(
    'assignments.transfer'
  ),
  (req, res) =>
    assignmentsController.transfer(
      req,
      res
    )
)

export default router