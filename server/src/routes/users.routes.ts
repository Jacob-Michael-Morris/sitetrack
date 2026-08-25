import { Router } from 'express'

import {
  addUser,
  editUser,
  getUser,
  getUsers
} from '../controllers/users.controller.js'

import {
  requireAuth,
  requireRole
} from '../middleware/auth.middleware.js'

const router = Router()

router.use(requireAuth)
router.use(requireRole('Administrator'))

router.get('/', getUsers)
router.get('/:id', getUser)
router.post('/', addUser)
router.put('/:id', editUser)

export default router