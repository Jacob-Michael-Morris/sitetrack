import type {
  Request,
  Response
} from 'express'

import {
  jobsiteService
} from '../services/jobsites.service.js'

export class JobsitesController {
  async getAll(
    req: Request,
    res: Response
  ) {
    try {
      const jobsites =
        await jobsiteService.getAll()

      res.json(jobsites)
    } catch (error) {
      console.error(error)

      res.status(500).json({
        message:
          'Unable to retrieve jobsites'
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
          message: 'Invalid jobsite ID'
        })
        return
      }

      const jobsite =
        await jobsiteService.getById(id)

      if (!jobsite) {
        res.status(404).json({
          message: 'Jobsite not found'
        })
        return
      }

      res.json(jobsite)
    } catch (error) {
      console.error(error)

      res.status(500).json({
        message:
          'Unable to retrieve jobsite'
      })
    }
  }

  async create(
    req: Request,
    res: Response
  ) {
    try {
      const jobsite =
        await jobsiteService.create(
          req.body
        )

      res.status(201).json(jobsite)
    } catch (error) {
      console.error(error)

      if (error instanceof Error) {
        res.status(400).json({
          message: error.message
        })
        return
      }

      res.status(500).json({
        message:
          'Unable to create jobsite'
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
          message: 'Invalid jobsite ID'
        })
        return
      }

      const existingJobsite =
        await jobsiteService.getById(id)

      if (!existingJobsite) {
        res.status(404).json({
          message: 'Jobsite not found'
        })
        return
      }

      const jobsite =
        await jobsiteService.update(
          id,
          req.body
        )

      res.json(jobsite)
    } catch (error) {
      console.error(error)

      if (error instanceof Error) {
        res.status(400).json({
          message: error.message
        })
        return
      }

      res.status(500).json({
        message:
          'Unable to update jobsite'
      })
    }
  }
}

export const jobsitesController =
  new JobsitesController()