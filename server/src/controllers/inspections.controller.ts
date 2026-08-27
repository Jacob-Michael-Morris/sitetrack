import type {
  Request,
  Response
} from 'express'

import {
  InspectionDomainError
} from '../models/Inspection.js'

import {
  inspectionService
} from '../services/inspections.service.js'

export class InspectionsController {
  async getAll(
    req: Request,
    res: Response
  ) {
    try {
      const inspections =
        await inspectionService.getAll()

      res.json(inspections)
    } catch (error) {
      console.error(error)

      res.status(500).json({
        message:
          'Unable to retrieve inspections'
      })
    }
  }

  async getById(
    req: Request,
    res: Response
  ) {
    try {
      const id =
        Number(req.params.id)

      if (
        !Number.isInteger(id) ||
        id <= 0
      ) {
        res.status(400).json({
          message:
            'Invalid inspection ID'
        })
        return
      }

      const inspection =
        await inspectionService.getById(
          id
        )

      if (!inspection) {
        res.status(404).json({
          message:
            'Inspection not found'
        })
        return
      }

      res.json(inspection)
    } catch (error) {
      console.error(error)

      res.status(500).json({
        message:
          'Unable to retrieve inspection'
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

      const inspection =
        await inspectionService.create(
          req.body,
          userId
        )

      res.status(201).json(
        inspection
      )
    } catch (error) {
      console.error(error)

      if (
        error instanceof
        InspectionDomainError
      ) {
        res.status(400).json({
          message: error.message
        })
        return
      }

      res.status(500).json({
        message:
          'Unable to create inspection'
      })
    }
  }
}

export const inspectionsController =
  new InspectionsController()