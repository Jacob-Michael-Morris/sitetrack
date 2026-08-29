import type {
  WorkOrder,
  WorkOrderInput,
  ReturnServiceDecision
} from '../types/WorkOrder.js'
import API_BASE_URL from '../config/api.js'
import { getResponseError } from '../utils/response-error.js'

const API_URL = `${API_BASE_URL}/work-orders`

export interface MaintenanceTechnician {
  user_id: number
  name: string
}

export async function getMaintenanceTechnicians(): Promise<MaintenanceTechnician[]> {
  const response = await fetch(
    `${API_URL}/technicians`,
    {
      credentials: 'include'
    }
  )

  if (!response.ok) {
    throw new Error(
      await getResponseError(
        response,
        'Unable to retrieve maintenance technicians'
      )
    )
  }

  return response.json()
}

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
    throw new Error(
      await getResponseError(
        response,
        'Unable to create work order'
      )
    )
  }

  return response.json()
}

export async function completeWorkOrder(id: number) {
  const response = await fetch(`${API_URL}/${id}/complete`, {
    method: 'PUT',
    credentials: 'include'
  })

  if (!response.ok) {
    throw new Error(
      await getResponseError(
        response,
        'Unable to complete work order'
      )
    )
  }

  return response.json()
}

export async function requestReturnToService(id: number) {
  const response = await fetch(
    `${API_URL}/${id}/return-request`,
    {
      method: 'PUT',
      credentials: 'include'
    }
  )

  if (!response.ok) {
    throw new Error(
      await getResponseError(
        response,
        'Unable to request return-to-service review'
      )
    )
  }

  return response.json()
}

export async function decideReturnToService(
  id: number,
  decision: ReturnServiceDecision,
  reason: string
) {
  const response = await fetch(
    `${API_URL}/${id}/return-decision`,
    {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        decision,
        reason
      })
    }
  )

  if (!response.ok) {
    throw new Error(
      await getResponseError(
        response,
        'Unable to record return-to-service decision'
      )
    )
  }

  return response.json()
}
