import { Router } from 'express'

import {
  toolsController
} from '../controllers/tools.controller.js'

import {
  requireAuth,
  requirePermission
} from '../middleware/auth.middleware.js'

const router = Router()

router.use(requireAuth)

router.get(
  '/',
  requirePermission(
    'tools.view'
  ),
  (req, res) =>
    toolsController.getAll(
      req,
      res
    )
)

router.get(
  '/:id',
  requirePermission(
    'tools.view'
  ),
  (req, res) =>
    toolsController.getById(
      req,
      res
    )
)

router.post(
  '/',
  requirePermission(
    'tools.create'
  ),
  (req, res) =>
    toolsController.create(
      req,
      res
    )
)

router.put(
  '/:id',
  requirePermission(
    'tools.edit'
  ),
  (req, res) =>
    toolsController.update(
      req,
      res
    )
)

export default router