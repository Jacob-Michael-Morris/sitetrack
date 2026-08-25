import { Router } from 'express'

import {
  addTool,
  editTool,
  getTool,
  getTools
} from '../controllers/tools.controller.js'

import {
  requireAuth,
  requireRole
} from '../middleware/auth.middleware.js'

const router = Router()

router.use(requireAuth)

router.get('/', getTools)
router.get('/:id', getTool)

router.post(
  '/',
  requireRole(
    'Administrator',
    'Equipment Manager'
  ),
  addTool
)

router.put(
  '/:id',
  requireRole(
    'Administrator',
    'Equipment Manager'
  ),
  editTool
)

export default router