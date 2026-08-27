import { Router } from 'express'

import {
  rolesController
} from '../controllers/roles.controller.js'

import {
  requireAuth,
  requireRole
} from '../middleware/auth.middleware.js'

const router = Router()

router.use(requireAuth)

router.use(
  requireRole('Administrator')
)

router.get(
  '/',
  (req, res) =>
    rolesController.getAll(
      req,
      res
    )
)

export default router