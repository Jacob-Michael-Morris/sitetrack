import type {
  WorkOrder,
  WorkOrderInput
} from '../types/WorkOrder.js'
import API_BASE_URL from '../config/api.js'

const API_URL = `${API_BASE_URL}/work-orders`

export async function getWorkOrders(): Promise<WorkOrder[]> {
  const response = await fetch(API_URL, {
    credentials: 'include'
  })

  if (!response.ok) {
    throw new Error('Unable to retrieve work orders')
  }

  return response.json()
}

export async function createWorkOrder(
  workOrder: WorkOrderInput
): Promise<WorkOrder> {
  const response = await fetch(API_URL, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(workOrder)
  })

  if (!response.ok) {
    throw new Error('Unable to create work order')
  }

  return response.json()
}

export async function completeWorkOrder(id: number) {
  const response = await fetch(`${API_URL}/${id}/complete`, {
    method: 'PUT',
    credentials: 'include'
  })

  if (!response.ok) {
    throw new Error('Unable to complete work order')
  }

  return response.json()
}

export async function returnToService(id: number) {
  const response = await fetch(
    `${API_URL}/${id}/return-to-service`,
    {
      method: 'PUT',
      credentials: 'include'
    }
  )

  if (!response.ok) {
    throw new Error('Unable to return tool to service')
  }

  return response.json()
}