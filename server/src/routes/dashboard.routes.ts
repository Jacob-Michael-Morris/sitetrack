import { Router } from 'express'

import {
  dashboardController
} from '../controllers/dashboard.controller.js'

import {
  requireAuth
} from '../middleware/auth.middleware.js'

const router = Router()

router.use(requireAuth)

router.get(
  '/',
  (req, res) =>
    dashboardController.getDashboard(
      req,
      res
    )
)

export default router