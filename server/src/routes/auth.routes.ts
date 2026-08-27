import { Router } from 'express'

import {
  authController
} from '../controllers/auth.controller.js'

import {
  requireAuth
} from '../middleware/auth.middleware.js'

const router = Router()

router.post(
  '/login',
  (req, res) =>
    authController.login(
      req,
      res
    )
)

router.post(
  '/logout',
  (req, res) =>
    authController.logout(
      req,
      res
    )
)

router.get(
  '/me',
  requireAuth,
  (req, res) =>
    authController.getCurrentUser(
      req,
      res
    )
)

export default router