import { Router } from 'express'

import {
  checkout,
  getAssignments,
  returnAssignment,
  transfer
} from '../controllers/assignments.controller.js'

const router = Router()

router.get('/', getAssignments)

router.post('/checkout', checkout)
router.post('/return', returnAssignment)
router.post('/transfer', transfer)

export default router