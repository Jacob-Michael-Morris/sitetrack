import type { ToolAssignment } from '../types/ToolAssignment.js'
import API_BASE_URL from '../config/api.js'
import { getResponseError } from '../utils/response-error.js'

const API_URL = `${API_BASE_URL}/assignments`

export async function getAssignments(): Promise<ToolAssignment[]> {
  const response = await fetch(API_URL, {
    credentials: 'include'
  })

  if (!response.ok) {
    throw new Error('Unable to retrieve assignments')
  }

  return response.json()
}

export async function checkoutTool(
  toolId: number,
  jobsiteId: number,
  notes: string
) {
  const response = await fetch(`${API_URL}/checkout`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      tool_id: toolId,
      jobsite_id: jobsiteId,
      notes
    })
  })

  if (!response.ok) {
    throw new Error(
      await getResponseError(
        response,
        'Unable to check out tool'
      )
    )
  }

  return response.json()
}

export async function returnTool(
  toolId: number,
  notes: string
) {
  const response = await fetch(`${API_URL}/return`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      tool_id: toolId,
      notes
    })
  })

  if (!response.ok) {
    throw new Error(
      await getResponseError(
        response,
        'Unable to return tool'
      )
    )
  }

  return response.json()
}

export async function transferTool(
  toolId: number,
  jobsiteId: number,
  notes: string
) {
  const response = await fetch(`${API_URL}/transfer`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      tool_id: toolId,
      jobsite_id: jobsiteId,
      notes
    })
  })

  if (!response.ok) {
    throw new Error(
      await getResponseError(
        response,
        'Unable to transfer tool'
      )
    )
  }

  return response.json()
}
