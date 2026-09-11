import { Router } from 'express'

import {
  usersController
} from './users.controller.js'

import {
  requireAuth,
  requirePermission
} from '../authentication/auth.middleware.js'

const router = Router()

router.use(requireAuth)

router.get(
  '/',
  requirePermission(
    'users.view'
  ),
  (req, res) =>
    usersController.getAll(
      req,
      res
    )
)

router.get(
  '/:id',
  requirePermission(
    'users.view'
  ),
  (req, res) =>
    usersController.getById(
      req,
      res
    )
)

router.post(
  '/',
  requirePermission(
    'users.create'
  ),
  (req, res) =>
    usersController.create(
      req,
      res
    )
)

router.put(
  '/:id',
  requirePermission(
    'users.edit'
  ),
  (req, res) =>
    usersController.update(
      req,
      res
    )
)

export default router