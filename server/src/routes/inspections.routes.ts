import { Router } from 'express'

import {
  addInspection,
  getInspection,
  getInspections
} from '../controllers/inspections.controller.js'

const router = Router()

router.get('/', getInspections)
router.get('/:id', getInspection)
router.post('/', addInspection)

export default router