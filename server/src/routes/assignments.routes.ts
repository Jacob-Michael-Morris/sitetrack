import { Router } from 'express'

import {
  assignmentsController
} from '../controllers/assignments.controller.js'

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
    'Worker'
  )
)

router.get(
  '/',
  (req, res) =>
    assignmentsController.getAll(
      req,
      res
    )
)

router.post(
  '/checkout',
  (req, res) =>
    assignmentsController.checkout(
      req,
      res
    )
)

router.post(
  '/return',
  (req, res) =>
    assignmentsController
      .returnAssignment(
        req,
        res
      )
)

router.post(
  '/transfer',
  (req, res) =>
    assignmentsController.transfer(
      req,
      res
    )
)

export default router