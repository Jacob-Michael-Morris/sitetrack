import API_BASE_URL from '../config/api.js'
import { apiRequest } from '../utils/api-request.js'

import type {
  WorkOrder,
  WorkOrderInput
} from '../types/WorkOrder.js'

const API_URL =
  `${API_BASE_URL}/work-orders`

export async function getWorkOrders():
Promise<WorkOrder[]> {
  return apiRequest<WorkOrder[]>(
    API_URL,
    {},
    'Unable to retrieve work orders'
  )
}

export async function createWorkOrder(
  workOrder: WorkOrderInput
): Promise<WorkOrder> {
  return apiRequest<WorkOrder>(
    API_URL,
    {
      method: 'POST',
      body: JSON.stringify(
        workOrder
      )
    },
    'Unable to create work order'
  )
}

export async function completeWorkOrder(
  id: number
) {
  return apiRequest(
    `${API_URL}/${id}/complete`,
    {
      method: 'PUT'
    },
    'Unable to complete work order'
  )
}

export async function returnToService(
  id: number
) {
  return apiRequest(
    `${API_URL}/${id}/return-to-service`,
    {
      method: 'PUT'
    },
    'Unable to return tool to service'
  )
}