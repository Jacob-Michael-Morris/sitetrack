import API_BASE_URL from '../config/api.js'
import { apiRequest } from '../utils/api-request.js'

import type { ToolAssignment } from '../types/ToolAssignment.js'

const API_URL =
  `${API_BASE_URL}/assignments`

export async function getAssignments():
Promise<ToolAssignment[]> {
  return apiRequest<ToolAssignment[]>(
    API_URL,
    {},
    'Unable to retrieve assignments'
  )
}

export async function checkoutTool(
  toolId: number,
  jobsiteId: number,
  notes: string
) {
  return apiRequest(
    `${API_URL}/checkout`,
    {
      method: 'POST',
      body: JSON.stringify({
        tool_id: toolId,
        jobsite_id: jobsiteId,
        notes
      })
    },
    'Unable to check out tool'
  )
}

export async function returnTool(
  toolId: number,
  notes: string
) {
  return apiRequest(
    `${API_URL}/return`,
    {
      method: 'POST',
      body: JSON.stringify({
        tool_id: toolId,
        notes
      })
    },
    'Unable to return tool'
  )
}

export async function transferTool(
  toolId: number,
  jobsiteId: number,
  notes: string
) {
  return apiRequest(
    `${API_URL}/transfer`,
    {
      method: 'POST',
      body: JSON.stringify({
        tool_id: toolId,
        jobsite_id: jobsiteId,
        notes
      })
    },
    'Unable to transfer tool'
  )
}