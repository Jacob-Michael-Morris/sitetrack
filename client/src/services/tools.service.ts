import type { Tool, ToolInput } from '../types/Tool.js'

const API_URL = 'http://localhost:3000/api/tools'

export async function getTools(): Promise<Tool[]> {
  const response = await fetch(API_URL)
  if (!response.ok) throw new Error('Unable to retrieve tools')
  return response.json()
}

export async function getTool(id: string): Promise<Tool> {
  const response = await fetch(`${API_URL}/${id}`)
  if (!response.ok) throw new Error('Unable to retrieve tool')
  return response.json()
}

export async function createTool(tool: ToolInput): Promise<Tool> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tool)
  })

  if (!response.ok) throw new Error('Unable to create tool')
  return response.json()
}

export async function updateTool(id: string, tool: ToolInput): Promise<Tool> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tool)
  })

  if (!response.ok) throw new Error('Unable to update tool')
  return response.json()
}