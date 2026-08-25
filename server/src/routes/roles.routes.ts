import { Router } from 'express'

import {
  getRoles
} from '../controllers/roles.controller.js'

import {
  requireAuth,
  requireRole
} from '../middleware/auth.middleware.js'

const router = Router()

router.use(requireAuth)
router.use(requireRole('Administrator'))

router.get('/', getRoles)

export default router