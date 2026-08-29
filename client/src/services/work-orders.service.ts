import API_BASE_URL from '../config/api.js'
import { apiRequest } from '../utils/api-request.js'

import type {
  WorkOrder,
  WorkOrderInput,
  ReturnServiceDecision
} from '../types/WorkOrder.js'

const API_URL =
  `${API_BASE_URL}/work-orders`

export interface MaintenanceTechnician {
  user_id: number
  name: string
}

export async function getMaintenanceTechnicians():
Promise<MaintenanceTechnician[]> {
  return apiRequest<
    MaintenanceTechnician[]
  >(
    `${API_URL}/technicians`,
    {},
    'Unable to retrieve maintenance technicians'
  )
}

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

export async function requestReturnToService(
  id: number
) {
  return apiRequest(
    `${API_URL}/${id}/return-request`,
    {
      method: 'PUT'
    },
    'Unable to request return-to-service review'
  )
}

export async function decideReturnToService(
  id: number,
  decision: ReturnServiceDecision,
  reason: string
) {
  return apiRequest(
    `${API_URL}/${id}/return-decision`,
    {
      method: 'PUT',
      body: JSON.stringify({
        decision,
        reason
      })
    },
    'Unable to record return-to-service decision'
  )
}