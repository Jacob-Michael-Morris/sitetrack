import type { Request, Response } from 'express'

import {
  checkoutTool,
  getAllAssignments,
  returnTool,
  transferTool
} from '../services/assignments.service.js'

export async function getAssignments(
  req: Request,
  res: Response
) {
  try {
    const assignments = await getAllAssignments()

    res.json(assignments)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Unable to retrieve assignments'
    })
  }
}

export async function checkout(
  req: Request,
  res: Response
) {
  try {
    const {
      tool_id,
      jobsite_id,
      notes
    } = req.body

    const userId = Number(res.locals.auth.userId)

    const assignment = await checkoutTool(
      Number(tool_id),
      Number(jobsite_id),
      notes ?? '',
      userId
    )

    res.status(201).json(assignment)
  } catch (error) {
    console.error(error)

    res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : 'Unable to check out tool'
    })
  }
}

export async function returnAssignment(
  req: Request,
  res: Response
) {
  try {
    const {
      tool_id,
      notes
    } = req.body

    const userId = Number(res.locals.auth.userId)

    const assignment = await returnTool(
      Number(tool_id),
      notes ?? '',
      userId
    )

    res.json(assignment)
  } catch (error) {
    console.error(error)

    res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : 'Unable to return tool'
    })
  }
}

export async function transfer(
  req: Request,
  res: Response
) {
  try {
    const {
      tool_id,
      jobsite_id,
      notes
    } = req.body

    const userId = Number(res.locals.auth.userId)

    const assignment = await transferTool(
      Number(tool_id),
      Number(jobsite_id),
      notes ?? '',
      userId
    )

    res.json(assignment)
  } catch (error) {
    console.error(error)

    res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : 'Unable to transfer tool'
    })
  }
}