import pool from '../database/pool.js'
import { createAuditLog } from './audit-logs.service.js'

export async function getAllTools() {
  const result = await pool.query(
    'SELECT * FROM tools ORDER BY tool_id'
  )

  return result.rows
}

export async function getToolById(id: number) {
  const result = await pool.query(
    'SELECT * FROM tools WHERE tool_id = $1',
    [id]
  )

  return result.rows[0]
}

export async function createTool(tool: {
  name: string
  serial_number: string
  category: string
  status: string
  condition: string
  purchase_date: string | null
}) {
  const result = await pool.query(
    `INSERT INTO tools
      (name, serial_number, category, status, condition, purchase_date)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      tool.name,
      tool.serial_number,
      tool.category,
      tool.status,
      tool.condition,
      tool.purchase_date
    ]
  )

const createdTool = result.rows[0]

await createAuditLog({
  user_id: null,
  action: 'CREATE',
  entity_type: 'Tool',
  entity_id: createdTool.tool_id,
  description: `Tool "${createdTool.name}" was registered.`
})

return createdTool
}

export async function updateTool(
  id: number,
  tool: {
    name: string
    serial_number: string
    category: string
    status: string
    condition: string
    purchase_date: string | null
  }
) {
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
      tool.serial_number,
      tool.category,
      tool.status,
      tool.condition,
      tool.purchase_date,
      id
    ]
  )

const updatedTool = result.rows[0]

await createAuditLog({
  user_id: null,
  action: 'UPDATE',
  entity_type: 'Tool',
  entity_id: updatedTool.tool_id,
  description: `Tool "${updatedTool.name}" was updated.`
})

return updatedTool
}