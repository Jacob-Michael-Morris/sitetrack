import type { Request, Response } from 'express'

import {
  createTool,
  getAllTools,
  getToolById,
  updateTool
} from '../services/tools.service.js'

const VALID_STATUSES = [
  'Available',
  'Checked Out',
  'Maintenance',
  'Out of Service'
]

const VALID_CONDITIONS = [
  'Good',
  'Fair',
  'Needs Repair',
  'Damaged'
]

function getDatabaseErrorCode(error: unknown) {
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error
  ) {
    return String(error.code)
  }

  return null
}

function isFutureDate(date: string) {
  const selectedDate = new Date(`${date}T00:00:00`)
  const today = new Date()

  today.setHours(0, 0, 0, 0)

  return selectedDate > today
}

export async function getTools(
  req: Request,
  res: Response
) {
  try {
    const tools = await getAllTools()
    res.json(tools)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Unable to retrieve tools'
    })
  }
}

export async function getTool(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id)

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({
        message: 'Invalid tool ID'
      })
      return
    }

    const tool = await getToolById(id)

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
      message: 'Unable to retrieve tool'
    })
  }
}

export async function addTool(
  req: Request,
  res: Response
) {
  try {
    const {
      name,
      serial_number,
      category,
      status,
      condition,
      purchase_date
    } = req.body

    const cleanName = String(name ?? '').trim()

    const cleanSerialNumber = String(
      serial_number ?? ''
    ).trim()

    const cleanCategory = String(
      category ?? ''
    ).trim()

    const cleanStatus =
      String(status ?? 'Available')

    const cleanCondition =
      String(condition ?? 'Good')

    const cleanPurchaseDate =
      purchase_date
        ? String(purchase_date)
        : null

    if (!cleanName) {
      res.status(400).json({
        message: 'Tool name is required'
      })
      return
    }

    if (!cleanSerialNumber) {
      res.status(400).json({
        message: 'Serial number is required'
      })
      return
    }

    if (!cleanCategory) {
      res.status(400).json({
        message: 'Category is required'
      })
      return
    }

    if (!VALID_STATUSES.includes(cleanStatus)) {
      res.status(400).json({
        message: 'Invalid tool status'
      })
      return
    }

    if (
      !VALID_CONDITIONS.includes(cleanCondition)
    ) {
      res.status(400).json({
        message: 'Invalid tool condition'
      })
      return
    }

    if (
      cleanPurchaseDate &&
      isFutureDate(cleanPurchaseDate)
    ) {
      res.status(400).json({
        message:
          'Purchase date cannot be in the future'
      })
      return
    }

    const userId = Number(
      res.locals.auth.userId
    )

    const tool = await createTool(
      {
        name: cleanName,
        serial_number: cleanSerialNumber,
        category: cleanCategory,
        status: cleanStatus,
        condition: cleanCondition,
        purchase_date: cleanPurchaseDate
      },
      userId
    )

    res.status(201).json(tool)
  } catch (error) {
    console.error(error)

    if (getDatabaseErrorCode(error) === '23505') {
      res.status(409).json({
        message:
          'A tool with this serial number already exists'
      })
      return
    }

    res.status(500).json({
      message: 'Unable to create tool'
    })
  }
}

export async function editTool(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id)

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({
        message: 'Invalid tool ID'
      })
      return
    }

    const {
      name,
      serial_number,
      category,
      status,
      condition,
      purchase_date
    } = req.body

    const cleanName = String(name ?? '').trim()

    const cleanSerialNumber = String(
      serial_number ?? ''
    ).trim()

    const cleanCategory = String(
      category ?? ''
    ).trim()

    const cleanStatus = String(status ?? '')

    const cleanCondition = String(
      condition ?? ''
    )

    const cleanPurchaseDate =
      purchase_date
        ? String(purchase_date)
        : null

    if (!cleanName) {
      res.status(400).json({
        message: 'Tool name is required'
      })
      return
    }

    if (!cleanSerialNumber) {
      res.status(400).json({
        message: 'Serial number is required'
      })
      return
    }

    if (!cleanCategory) {
      res.status(400).json({
        message: 'Category is required'
      })
      return
    }

    if (!VALID_STATUSES.includes(cleanStatus)) {
      res.status(400).json({
        message: 'Invalid tool status'
      })
      return
    }

    if (
      !VALID_CONDITIONS.includes(cleanCondition)
    ) {
      res.status(400).json({
        message: 'Invalid tool condition'
      })
      return
    }

    if (
      cleanPurchaseDate &&
      isFutureDate(cleanPurchaseDate)
    ) {
      res.status(400).json({
        message:
          'Purchase date cannot be in the future'
      })
      return
    }

    const userId = Number(
      res.locals.auth.userId
    )

    const tool = await updateTool(
      id,
      {
        name: cleanName,
        serial_number: cleanSerialNumber,
        category: cleanCategory,
        status: cleanStatus,
        condition: cleanCondition,
        purchase_date: cleanPurchaseDate
      },
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

    if (getDatabaseErrorCode(error) === '23505') {
      res.status(409).json({
        message:
          'A tool with this serial number already exists'
      })
      return
    }

    res.status(500).json({
      message: 'Unable to update tool'
    })
  }
}