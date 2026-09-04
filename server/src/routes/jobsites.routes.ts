import { Router } from 'express'

import {
  jobsitesController
} from '../controllers/jobsites.controller.js'

import {
  requireAuth,
  requireRole
} from '../middleware/auth.middleware.js'

const router = Router()

router.use(requireAuth)

router.get(
  '/',
  (req, res) =>
    jobsitesController.getAll(req, res)
)

router.get(
  '/:id',
  (req, res) =>
    jobsitesController.getById(req, res)
)

router.post(
  '/',
  requireRole(
    'Administrator',
    'Equipment Manager'
  ),
  (req, res) =>
    jobsitesController.create(req, res)
)

router.put(
  '/:id',
  requireRole(
    'Administrator',
    'Equipment Manager'
  ),
  (req, res) =>
    jobsitesController.update(req, res)
)

export default router