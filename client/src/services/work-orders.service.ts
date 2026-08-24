import type {
  WorkOrder,
  WorkOrderInput
} from '../types/WorkOrder.js'

const API_URL = 'http://localhost:3000/api/work-orders'

export async function getWorkOrders(): Promise<WorkOrder[]> {
  const response = await fetch(API_URL)

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
    method: 'PUT'
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
      method: 'PUT'
    }
  )

  if (!response.ok) {
    throw new Error('Unable to return tool to service')
  }

  return response.json()
}