import { Router } from 'express'

import {
  addJobsite,
  editJobsite,
  getJobsite,
  getJobsites
} from '../controllers/jobsites.controller.js'

const router = Router()

router.get('/', getJobsites)
router.get('/:id', getJobsite)
router.post('/', addJobsite)
router.put('/:id', editJobsite)

export default router