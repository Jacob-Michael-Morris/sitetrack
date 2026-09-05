import { Router } from 'express'

import {
  jobsitesController
} from '../controllers/jobsites.controller.js'

import {
  requireAuth,
  requirePermission
} from '../middleware/auth.middleware.js'

const router = Router()

router.use(requireAuth)

router.get(
  '/',
  (req, res) =>
    jobsitesController.getAll(
      req,
      res
    )
)

router.get(
  '/:id',
  (req, res) =>
    jobsitesController.getById(
      req,
      res
    )
)

router.post(
  '/',
  requirePermission(
    'jobsites.create'
  ),
  (req, res) =>
    jobsitesController.create(
      req,
      res
    )
)

router.put(
  '/:id',
  requirePermission(
    'jobsites.edit'
  ),
  (req, res) =>
    jobsitesController.update(
      req,
      res
    )
)

export default router