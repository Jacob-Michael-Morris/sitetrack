import type { Request, Response } from 'express'

import {
  getAllRoles
} from '../services/roles.service.js'

export async function getRoles(
  req: Request,
  res: Response
) {
  try {
    const roles = await getAllRoles()
    res.json(roles)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Unable to retrieve roles'
    })
  }
}