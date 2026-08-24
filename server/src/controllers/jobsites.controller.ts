import type { Request, Response } from 'express'

import {
  createJobsite,
  getAllJobsites,
  getJobsiteById,
  updateJobsite
} from '../services/jobsites.service.js'

export async function getJobsites(req: Request, res: Response) {
  try {
    const jobsites = await getAllJobsites()
    res.json(jobsites)
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: 'Unable to retrieve jobsites'
    })
  }
}

export async function getJobsite(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const jobsite = await getJobsiteById(id)

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
      message: 'Unable to retrieve jobsite'
    })
  }
}

export async function addJobsite(req: Request, res: Response) {
  try {
    const {
      name,
      location,
      status,
      start_date,
      end_date,
      description
    } = req.body

    if (!name) {
      res.status(400).json({
        message: 'Jobsite name is required'
      })
      return
    }

    const jobsite = await createJobsite({
      name,
      location: location || '',
      status: status || 'Active',
      start_date: start_date || null,
      end_date: end_date || null,
      description: description || ''
    })

    res.status(201).json(jobsite)
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: 'Unable to create jobsite'
    })
  }
}

export async function editJobsite(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)

    const existingJobsite = await getJobsiteById(id)

    if (!existingJobsite) {
      res.status(404).json({
        message: 'Jobsite not found'
      })
      return
    }

    const {
      name,
      location,
      status,
      start_date,
      end_date,
      description
    } = req.body

    const jobsite = await updateJobsite(id, {
      name,
      location,
      status,
      start_date: start_date || null,
      end_date: end_date || null,
      description
    })

    res.json(jobsite)
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: 'Unable to update jobsite'
    })
  }
}