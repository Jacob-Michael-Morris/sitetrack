import type {
  Request,
  Response
} from 'express'

import {
  roleService
} from '../services/roles.service.js'

export class RolesController {
  async getAll(
    req: Request,
    res: Response
  ) {
    try {
      const roles =
        await roleService.getAll()

      res.json(roles)
    } catch (error) {
      console.error(error)

      res.status(500).json({
        message:
          'Unable to retrieve roles'
      })
    }
  }
}

export const rolesController =
  new RolesController()