import { Router } from 'express'

import {
  usersController
} from '../controllers/users.controller.js'

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
    usersController.getAll(req, res)
)

router.get(
  '/:id',
  (req, res) =>
    usersController.getById(req, res)
)

router.post(
  '/',
  (req, res) =>
    usersController.create(req, res)
)

router.put(
  '/:id',
  (req, res) =>
    usersController.update(req, res)
)

export default router