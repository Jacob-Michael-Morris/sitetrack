import { Router } from 'express'

import {
  addDamageReport,
  getDamageReport,
  getDamageReports
} from '../controllers/damage-reports.controller.js'

const router = Router()

router.get('/', getDamageReports)
router.get('/:id', getDamageReport)
router.post('/', addDamageReport)

export default router