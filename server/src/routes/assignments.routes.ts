import { Router } from 'express'

import {
  checkout,
  getAssignments,
  returnAssignment,
  transfer
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

router.get('/', getAssignments)
router.post('/checkout', checkout)
router.post('/return', returnAssignment)
router.post('/transfer', transfer)

export default router