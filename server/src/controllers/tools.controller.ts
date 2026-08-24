import type { Request, Response } from 'express'

import {
  createTool,
  getAllTools,
  getToolById,
  updateTool
} from '../services/tools.service.js'

export async function getTools(req: Request, res: Response) {
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

export async function getTool(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)

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

export async function addTool(req: Request, res: Response) {
  try {
    const {
      name,
      serial_number,
      category,
      status,
      condition,
      purchase_date
    } = req.body

    if (!name || !serial_number) {
      res.status(400).json({
        message: 'Name and serial number are required'
      })
      return
    }

    const tool = await createTool({
      name,
      serial_number,
      category: category || '',
      status: status || 'Available',
      condition: condition || 'Good',
      purchase_date: purchase_date || null
    })

    res.status(201).json(tool)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Unable to create tool'
    })
  }
}

export async function editTool(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)

    const existingTool = await getToolById(id)

    if (!existingTool) {
      res.status(404).json({
        message: 'Tool not found'
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

    const tool = await updateTool(id, {
      name,
      serial_number,
      category,
      status,
      condition,
      purchase_date: purchase_date || null
    })

    res.json(tool)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Unable to update tool'
    })
  }
}