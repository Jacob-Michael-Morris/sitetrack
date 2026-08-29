import API_BASE_URL from '../config/api.js'
import { apiRequest } from '../utils/api-request.js'

import type {
  Tool,
  ToolInput
} from '../types/Tool.js'

const API_URL =
  `${API_BASE_URL}/tools`

export async function getTools():
Promise<Tool[]> {
  return apiRequest<Tool[]>(
    API_URL,
    {},
    'Unable to retrieve tools'
  )
}

export async function getTool(
  id: string
): Promise<Tool> {
  return apiRequest<Tool>(
    `${API_URL}/${id}`,
    {},
    'Unable to retrieve tool'
  )
}

export async function createTool(
  tool: ToolInput
): Promise<Tool> {
  return apiRequest<Tool>(
    API_URL,
    {
      method: 'POST',
      body: JSON.stringify(tool)
    },
    'Unable to create tool'
  )
}

export async function updateTool(
  id: string,
  tool: ToolInput
): Promise<Tool> {
  return apiRequest<Tool>(
    `${API_URL}/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(tool)
    },
    'Unable to update tool'
  )
}