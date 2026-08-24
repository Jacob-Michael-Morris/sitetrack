import { Router } from 'express'

import {
  getAlert,
  getAlerts,
  readAlert,
  readAllAlerts
} from '../controllers/alerts.controller.js'

const router = Router()

router.get('/', getAlerts)
router.get('/:id', getAlert)

router.put('/read-all', readAllAlerts)
router.put('/:id/read', readAlert)

export default router