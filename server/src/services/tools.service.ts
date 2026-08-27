import pool from '../database/pool.js'

import { Tool } from '../models/Tool.js'

import {
  createAuditLog
} from './audit-logs.service.js'

export class ToolService {
  async getAll() {
    const result = await pool.query(
      `SELECT
         tool_id,
         name,
         serial_number,
         category,
         status,
         condition,
         purchase_date,
         created_at,
         updated_at
       FROM tools
       ORDER BY tool_id`
    )

    return result.rows
  }

  async getById(id: number) {
    const result = await pool.query(
      `SELECT
         tool_id,
         name,
         serial_number,
         category,
         status,
         condition,
         purchase_date,
         created_at,
         updated_at
       FROM tools
       WHERE tool_id = $1`,
      [id]
    )

    return result.rows[0]
  }

  async create(
    input: ConstructorParameters<
      typeof Tool
    >[0],
    userId: number
  ) {
    const tool = new Tool(input)

    const result = await pool.query(
      `INSERT INTO tools
        (
          name,
          serial_number,
          category,
          status,
          condition,
          purchase_date
        )
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        tool.name,
        tool.serialNumber,
        tool.category,
        tool.status,
        tool.condition,
        tool.purchaseDate
      ]
    )

    const createdTool = result.rows[0]

    await createAuditLog({
      user_id: userId,
      action: 'TOOL_CREATED',
      entity_type: 'Tool',
      entity_id: createdTool.tool_id,
      description:
        `Tool "${createdTool.name}" was created.`
    })

    return createdTool
  }

  async update(
    id: number,
    input: ConstructorParameters<
      typeof Tool
    >[0],
    userId: number
  ) {
    const tool = new Tool(input)

    const result = await pool.query(
      `UPDATE tools
       SET
         name = $1,
         serial_number = $2,
         category = $3,
         status = $4,
         condition = $5,
         purchase_date = $6,
         updated_at = CURRENT_TIMESTAMP
       WHERE tool_id = $7
       RETURNING *`,
      [
        tool.name,
        tool.serialNumber,
        tool.category,
        tool.status,
        tool.condition,
        tool.purchaseDate,
        id
      ]
    )

    const updatedTool = result.rows[0]

    if (!updatedTool) {
      return undefined
    }

    await createAuditLog({
      user_id: userId,
      action: 'TOOL_UPDATED',
      entity_type: 'Tool',
      entity_id: updatedTool.tool_id,
      description:
        `Tool "${updatedTool.name}" was updated.`
    })

    return updatedTool
  }
}

export const toolService =
  new ToolService()