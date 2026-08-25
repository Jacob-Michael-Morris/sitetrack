import type { Request, Response } from 'express'

import {
  createInspection,
  getAllInspections,
  getInspectionById
} from '../services/inspections.service.js'

export async function getInspections(
  req: Request,
  res: Response
) {
  try {
    const inspections = await getAllInspections()
    res.json(inspections)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Unable to retrieve inspections'
    })
  }
}

export async function getInspection(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id)
    const inspection = await getInspectionById(id)

    if (!inspection) {
      res.status(404).json({
        message: 'Inspection not found'
      })
      return
    }

    res.json(inspection)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Unable to retrieve inspection'
    })
  }
}

export async function addInspection(
  req: Request,
  res: Response
) {
  try {
    const {
      tool_id,
      result,
      condition,
      notes,
      next_inspection_date
    } = req.body

    if (!tool_id || !result || !condition) {
      res.status(400).json({
        message: 'Tool, result, and condition are required'
      })
      return
    }

    const userId = Number(res.locals.auth.userId)

    const inspection = await createInspection(
      {
        tool_id: Number(tool_id),
        result,
        condition,
        notes: notes || '',
        next_inspection_date: next_inspection_date || null
      },
      userId
    )

    res.status(201).json(inspection)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Unable to create inspection'
    })
  }
}