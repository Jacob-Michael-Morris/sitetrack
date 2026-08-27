import type {
  Request,
  Response
} from 'express'

import {
  toolService
} from '../services/tools.service.js'

function getDatabaseErrorCode(
  error: unknown
) {
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error
  ) {
    return String(error.code)
  }

  return null
}

export class ToolsController {
  async getAll(
    req: Request,
    res: Response
  ) {
    try {
      const tools =
        await toolService.getAll()

      res.json(tools)
    } catch (error) {
      console.error(error)

      res.status(500).json({
        message:
          'Unable to retrieve tools'
      })
    }
  }

  async getById(
    req: Request,
    res: Response
  ) {
    try {
      const id = Number(req.params.id)

      if (
        !Number.isInteger(id) ||
        id <= 0
      ) {
        res.status(400).json({
          message: 'Invalid tool ID'
        })
        return
      }

      const tool =
        await toolService.getById(id)

      if (!tool) {
        res.status(404).json({
          message: 'Tool not found'
        })
        return
      }

      res.json(tool)
    } catch (error) {
      console.error(error)

      res.status(500).json({
        message:
          'Unable to retrieve tool'
      })
    }
  }

  async create(
    req: Request,
    res: Response
  ) {
    try {
      const userId = Number(
        res.locals.auth.userId
      )

      const tool =
        await toolService.create(
          req.body,
          userId
        )

      res.status(201).json(tool)
    } catch (error) {
      console.error(error)

      if (
        getDatabaseErrorCode(error) ===
        '23505'
      ) {
        res.status(409).json({
          message:
            'A tool with this serial number already exists'
        })
        return
      }

      if (error instanceof Error) {
        res.status(400).json({
          message: error.message
        })
        return
      }

      res.status(500).json({
        message:
          'Unable to create tool'
      })
    }
  }

  async update(
    req: Request,
    res: Response
  ) {
    try {
      const id = Number(req.params.id)

      if (
        !Number.isInteger(id) ||
        id <= 0
      ) {
        res.status(400).json({
          message: 'Invalid tool ID'
        })
        return
      }

      const userId = Number(
        res.locals.auth.userId
      )

      const tool =
        await toolService.update(
          id,
          req.body,
          userId
        )

      if (!tool) {
        res.status(404).json({
          message: 'Tool not found'
        })
        return
      }

      res.json(tool)
    } catch (error) {
      console.error(error)

      if (
        getDatabaseErrorCode(error) ===
        '23505'
      ) {
        res.status(409).json({
          message:
            'A tool with this serial number already exists'
        })
        return
      }

      if (error instanceof Error) {
        res.status(400).json({
          message: error.message
        })
        return
      }

      res.status(500).json({
        message:
          'Unable to update tool'
      })
    }
  }
}

export const toolsController =
  new ToolsController()