import type { Request, Response } from 'express'

import {
  createJobsite,
  getAllJobsites,
  getJobsiteById,
  updateJobsite
} from '../services/jobsites.service.js'

const VALID_STATUSES = [
  'Active',
  'Completed',
  'Inactive'
]

function isValidDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false
  }

  const date = new Date(`${value}T00:00:00Z`)

  if (Number.isNaN(date.getTime())) {
    return false
  }

  return date.toISOString().slice(0, 10) === value
}

function validateDates(
  startDate: string | null,
  endDate: string | null
) {
  if (startDate && !isValidDate(startDate)) {
    return 'Start date is invalid'
  }

  if (endDate && !isValidDate(endDate)) {
    return 'End date is invalid'
  }

  if (
    startDate &&
    endDate &&
    endDate < startDate
  ) {
    return 'End date cannot be before start date'
  }

  return null
}

export async function getJobsites(
  req: Request,
  res: Response
) {
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

export async function getJobsite(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id)

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({
        message: 'Invalid jobsite ID'
      })
      return
    }

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

export async function addJobsite(
  req: Request,
  res: Response
) {
  try {
    const {
      name,
      location,
      status,
      start_date,
      end_date,
      description
    } = req.body

    const cleanName = String(name ?? '').trim()

    const cleanLocation = String(
      location ?? ''
    ).trim()

    const cleanStatus = String(
      status ?? 'Active'
    )

    const cleanStartDate =
      start_date
        ? String(start_date)
        : null

    const cleanEndDate =
      end_date
        ? String(end_date)
        : null

    const cleanDescription = String(
      description ?? ''
    ).trim()

    if (!cleanName) {
      res.status(400).json({
        message: 'Jobsite name is required'
      })
      return
    }

    if (!cleanLocation) {
      res.status(400).json({
        message: 'Jobsite location is required'
      })
      return
    }

    if (!VALID_STATUSES.includes(cleanStatus)) {
      res.status(400).json({
        message: 'Invalid jobsite status'
      })
      return
    }

    const dateError = validateDates(
      cleanStartDate,
      cleanEndDate
    )

    if (dateError) {
      res.status(400).json({
        message: dateError
      })
      return
    }

    const jobsite = await createJobsite({
      name: cleanName,
      location: cleanLocation,
      status: cleanStatus,
      start_date: cleanStartDate,
      end_date: cleanEndDate,
      description: cleanDescription
    })

    res.status(201).json(jobsite)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Unable to create jobsite'
    })
  }
}

export async function editJobsite(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id)

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({
        message: 'Invalid jobsite ID'
      })
      return
    }

    const existingJobsite =
      await getJobsiteById(id)

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

    const cleanName = String(name ?? '').trim()

    const cleanLocation = String(
      location ?? ''
    ).trim()

    const cleanStatus = String(status ?? '')

    const cleanStartDate =
      start_date
        ? String(start_date)
        : null

    const cleanEndDate =
      end_date
        ? String(end_date)
        : null

    const cleanDescription = String(
      description ?? ''
    ).trim()

    if (!cleanName) {
      res.status(400).json({
        message: 'Jobsite name is required'
      })
      return
    }

    if (!cleanLocation) {
      res.status(400).json({
        message: 'Jobsite location is required'
      })
      return
    }

    if (!VALID_STATUSES.includes(cleanStatus)) {
      res.status(400).json({
        message: 'Invalid jobsite status'
      })
      return
    }

    const dateError = validateDates(
      cleanStartDate,
      cleanEndDate
    )

    if (dateError) {
      res.status(400).json({
        message: dateError
      })
      return
    }

    const jobsite = await updateJobsite(
      id,
      {
        name: cleanName,
        location: cleanLocation,
        status: cleanStatus,
        start_date: cleanStartDate,
        end_date: cleanEndDate,
        description: cleanDescription
      }
    )

    res.json(jobsite)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Unable to update jobsite'
    })
  }
}