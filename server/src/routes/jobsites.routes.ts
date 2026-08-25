import { Router } from 'express'

import {
  addJobsite,
  editJobsite,
  getJobsite,
  getJobsites
} from '../controllers/jobsites.controller.js'

import {
  requireAuth,
  requireRole
} from '../middleware/auth.middleware.js'

const router = Router()

router.use(requireAuth)

router.use(
  requireRole(
    'Administrator',
    'Equipment Manager'
  )
)

router.get('/', getJobsites)
router.get('/:id', getJobsite)
router.post('/', addJobsite)
router.put('/:id', editJobsite)

export default router