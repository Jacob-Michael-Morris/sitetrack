import { Router } from 'express'

import {
  rolesController
} from './roles.controller.js'

import {
  requireAuth,
  requirePermission
} from '../authentication/auth.middleware.js'

const router = Router()

router.use(requireAuth)

router.get(
  '/',
  (req, res) =>
    rolesController.getAll(
      req,
      res
    )
)

router.get(
  '/permissions',
  requirePermission(
    'roles.manage'
  ),
  (req, res) =>
    rolesController
      .getAllPermissions(
        req,
        res
      )
)

router.get(
  '/:id/permissions',
  requirePermission(
    'roles.manage'
  ),
  (req, res) =>
    rolesController
      .getRolePermissions(
        req,
        res
      )
)

router.put(
  '/:id/permissions',
  requirePermission(
    'roles.manage'
  ),
  (req, res) =>
    rolesController
      .updateRolePermissions(
        req,
        res
      )
)

export default router