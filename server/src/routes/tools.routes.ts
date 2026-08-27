import { Router } from 'express'

import {
  toolsController
} from '../controllers/tools.controller.js'

import {
  requireAuth,
  requireRole
} from '../middleware/auth.middleware.js'

const router = Router()

router.use(requireAuth)

router.get(
  '/',
  (req, res) =>
    toolsController.getAll(req, res)
)

router.get(
  '/:id',
  (req, res) =>
    toolsController.getById(req, res)
)

router.post(
  '/',
  requireRole(
    'Administrator',
    'Equipment Manager'
  ),
  (req, res) =>
    toolsController.create(req, res)
)

router.put(
  '/:id',
  requireRole(
    'Administrator',
    'Equipment Manager'
  ),
  (req, res) =>
    toolsController.update(req, res)
)

export default router