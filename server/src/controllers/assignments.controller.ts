import type { Request, Response } from 'express'

import {
  checkoutTool,
  getAllAssignments,
  returnTool,
  transferTool
} from '../services/assignments.service.js'

export async function getAssignments(req: Request, res: Response) {
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

export async function checkout(req: Request, res: Response) {
  try {
    const toolId = Number(req.body.tool_id)
    const jobsiteId = Number(req.body.jobsite_id)
    const notes = req.body.notes || ''

    if (!toolId || !jobsiteId) {
      res.status(400).json({
        message: 'Tool and jobsite are required'
      })
      return
    }

    const assignment = await checkoutTool(
      toolId,
      jobsiteId,
      notes
    )

    res.status(201).json(assignment)
  } catch (error) {
    console.error(error)

    res.status(400).json({
      message: 'Unable to check out tool'
    })
  }
}

export async function returnAssignment(
  req: Request,
  res: Response
) {
  try {
    const toolId = Number(req.body.tool_id)
    const notes = req.body.notes || ''

    await returnTool(toolId, notes)

    res.json({
      message: 'Tool returned successfully'
    })
  } catch (error) {
    console.error(error)

    res.status(400).json({
      message: 'Unable to return tool'
    })
  }
}

export async function transfer(
  req: Request,
  res: Response
) {
  try {
    const toolId = Number(req.body.tool_id)
    const jobsiteId = Number(req.body.jobsite_id)
    const notes = req.body.notes || ''

    const assignment = await transferTool(
      toolId,
      jobsiteId,
      notes
    )

    res.json(assignment)
  } catch (error) {
    console.error(error)

    res.status(400).json({
      message: 'Unable to transfer tool'
    })
  }
}