import assert from 'node:assert/strict'
import test from 'node:test'

import {
  WorkOrder,
  WorkOrderDomainError
} from './WorkOrder.js'

import {
  Inspection,
  InspectionDomainError
} from './Inspection.js'

test(
  'return review can only be requested after repair completion',
  () => {
    assert.doesNotThrow(() =>
      WorkOrder.assertCanRequestReturnToService(
        WorkOrder.COMPLETED_STATUS
      )
    )

    assert.throws(
      () =>
        WorkOrder.assertCanRequestReturnToService(
          WorkOrder.OPEN_STATUS
        ),
      WorkOrderDomainError
    )
  }
)

test(
  'return decision requires a pending approval request',
  () => {
    assert.doesNotThrow(() =>
      WorkOrder.assertCanDecideReturnToService(
        WorkOrder.AWAITING_APPROVAL_STATUS
      )
    )

    assert.throws(
      () =>
        WorkOrder.assertCanDecideReturnToService(
          WorkOrder.COMPLETED_STATUS
        ),
      WorkOrderDomainError
    )
  }
)

test(
  'next inspection date cannot be in the past',
  () => {
    assert.throws(
      () =>
        new Inspection({
          tool_id: 1,
          result: 'Passed',
          condition: 'Good',
          next_inspection_date: '2000-01-01'
        }),
      InspectionDomainError
    )
  }
)
