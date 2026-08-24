import { Router } from 'express'
import {
  addTool,
  editTool,
  getTool,
  getTools
} from '../controllers/tools.controller.js'

const router = Router()

router.get('/', getTools)
router.get('/:id', getTool)
router.post('/', addTool)
router.put('/:id', editTool)

export default router