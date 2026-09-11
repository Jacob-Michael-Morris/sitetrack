import { useEffect, useState } from 'react'

import StatusBadge from '../../shared/components/StatusBadge.js'
import { useAuth } from '../../session-navigation/context/useAuth.js'

import {
  completeWorkOrder,
  createWorkOrder,
  decideReturnToService,
  getMaintenanceTechnicians,
  getWorkOrders,
  requestReturnToService
} from './work-orders.service.js'

import { getTools } from '../../jobsite-tool-operations/tools/tools.service.js'

import type { Tool } from '../../jobsite-tool-operations/tools/Tool.js'
import type {
  ReturnServiceDecision,
  WorkOrder
} from './WorkOrder.js'

import type {
  MaintenanceTechnician
} from './work-orders.service.js'

function Maintenance() {
  const {
    user,
    hasPermission
  } = useAuth()

  const canCreateWorkOrder =
    hasPermission(
      'maintenance.create'
    )

  const canCompleteRepair =
    hasPermission(
      'maintenance.complete'
    )

  const canRequestReturn =
    hasPermission(
      'maintenance.return_request'
    )

  const canApproveReturn =
    hasPermission(
      'maintenance.return_approve'
    )

  const [workOrders, setWorkOrders] =
    useState<WorkOrder[]>([])

  const [tools, setTools] =
    useState<Tool[]>([])

  const [technicians, setTechnicians] =
    useState<MaintenanceTechnician[]>([])

  const [toolId, setToolId] =
    useState('')

  const [
    description,
    setDescription
  ] = useState('')

  const [priority, setPriority] =
    useState('Medium')

  const [
    assignedTo,
    setAssignedTo
  ] = useState('')

  const [notes, setNotes] =
    useState('')

  const [error, setError] =
    useState('')

  const [message, setMessage] =
    useState('')

  const [
    pendingAction,
    setPendingAction
  ] = useState<string | null>(
    null
  )

  const [
    decisionReasons,
    setDecisionReasons
  ] = useState<
    Record<number, string>
  >({})

  async function loadData() {
    const [
      workOrderData,
      toolData,
      technicianData
    ] = await Promise.all([
      getWorkOrders(),
      getTools(),
      getMaintenanceTechnicians()
    ])

    setWorkOrders(
      workOrderData
    )

    setTools(toolData)

    setTechnicians(
      technicianData
    )
  }

  useEffect(() => {
    let cancelled = false

    Promise.all([
      getWorkOrders(),
      getTools(),
      getMaintenanceTechnicians()
    ])
      .then(
        ([
          workOrderData,
          toolData,
          technicianData
        ]) => {
          if (cancelled) {
            return
          }

          setWorkOrders(
            workOrderData
          )

          setTools(toolData)

          setTechnicians(
            technicianData
          )
        }
      )
      .catch(() => {
        if (!cancelled) {
          setError(
            'Unable to load maintenance data.'
          )
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  async function handleSubmit(
    event:
      React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    if (
      !canCreateWorkOrder ||
      pendingAction !== null
    ) {
      return
    }

    setPendingAction(
      'create'
    )

    try {
      await createWorkOrder({
        tool_id: Number(toolId),
        damage_report_id: null,
        description,
        priority,
        assigned_to: assignedTo,
        notes
      })

      setToolId('')
      setDescription('')
      setPriority('Medium')
      setAssignedTo('')
      setNotes('')
      setError('')

      setMessage(
        'Work order created successfully.'
      )

      await loadData()
    } catch (createError) {
      setError(
        createError instanceof Error
          ? createError.message
          : 'Unable to create work order.'
      )

      setMessage('')
    } finally {
      setPendingAction(null)
    }
  }

  async function handleComplete(
    id: number
  ) {
    if (
      !canCompleteRepair ||
      pendingAction !== null
    ) {
      return
    }

    setPendingAction(
      `complete-${id}`
    )

    try {
      await completeWorkOrder(id)

      setMessage(
        'Work order completed.'
      )

      setError('')

      await loadData()
    } catch (completeError) {
      setError(
        completeError instanceof Error
          ? completeError.message
          : 'Unable to complete work order.'
      )

      setMessage('')
    } finally {
      setPendingAction(null)
    }
  }

  async function handleReturnRequest(
    id: number
  ) {
    if (
      !canRequestReturn ||
      pendingAction !== null
    ) {
      return
    }

    setPendingAction(
      `request-${id}`
    )

    try {
      await requestReturnToService(
        id
      )

      setMessage(
        'Return-to-service review requested.'
      )

      setError('')

      await loadData()
    } catch (returnError) {
      setError(
        returnError instanceof Error
          ? returnError.message
          : 'Unable to request return-to-service review.'
      )

      setMessage('')
    } finally {
      setPendingAction(null)
    }
  }

  async function handleDecision(
    id: number,
    decision:
      ReturnServiceDecision
  ) {
    if (
      !canApproveReturn ||
      pendingAction !== null
    ) {
      return
    }

    const reason =
      decisionReasons[
        id
      ]?.trim() ?? ''

    if (!reason) {
      setError(
        'Enter a reason before recording the decision.'
      )

      setMessage('')
      return
    }

    setPendingAction(
      `${decision.toLowerCase()}-${id}`
    )

    try {
      await decideReturnToService(
        id,
        decision,
        reason
      )

      setDecisionReasons(
        (current) => {
          const next = {
            ...current
          }

          delete next[id]

          return next
        }
      )

      setMessage(
        `Return to service ${decision.toLowerCase()}.`
      )

      setError('')

      await loadData()
    } catch (decisionError) {
      setError(
        decisionError instanceof Error
          ? decisionError.message
          : 'Unable to record return-to-service decision.'
      )

      setMessage('')
    } finally {
      setPendingAction(null)
    }
  }

  const maintenanceTools =
    tools.filter(
      (tool) =>
        (
          tool.status ===
            'Out of Service' ||
          tool.status ===
            'Maintenance'
        ) &&
        !workOrders.some(
          (workOrder) =>
            workOrder.tool_id ===
              tool.tool_id &&
            [
              'Open',
              'Completed',
              'Awaiting Approval'
            ].includes(
              workOrder.status
            )
        )
    )

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>
            Maintenance
          </h1>

          <p>
            Create work orders and
            manage tools undergoing
            maintenance.
          </p>
        </div>
      </div>

      {error && (
        <p role="alert">
          {error}
        </p>
      )}

      {message && (
        <p>
          {message}
        </p>
      )}

      {canCreateWorkOrder && (
        <>
          <h2>
            Create Work Order
          </h2>

          <form
            className="tool-form"
            onSubmit={
              handleSubmit
            }
          >
            <label>
              Tool

              <select
                value={toolId}
                onChange={(event) =>
                  setToolId(
                    event.target.value
                  )
                }
                required
              >
                <option value="">
                  {maintenanceTools
                    .length > 0
                    ? 'Select Tool'
                    : 'No tools require maintenance'}
                </option>

                {maintenanceTools.map(
                  (tool) => (
                    <option
                      key={
                        tool.tool_id
                      }
                      value={
                        tool.tool_id
                      }
                    >
                      {tool.name} -{' '}
                      {
                        tool.serial_number
                      }
                    </option>
                  )
                )}
              </select>
            </label>

            <label>
              Priority

              <select
                value={priority}
                onChange={(event) =>
                  setPriority(
                    event.target.value
                  )
                }
              >
                <option>
                  Low
                </option>

                <option>
                  Medium
                </option>

                <option>
                  High
                </option>

                <option>
                  Critical
                </option>
              </select>
            </label>

            <label>
              Assigned To

              <select
                value={assignedTo}
                onChange={(event) =>
                  setAssignedTo(
                    event.target.value
                  )
                }
              >
                <option value="">
                  Unassigned
                </option>

                {technicians.map(
                  (technician) => (
                    <option
                      key={
                        technician.user_id
                      }
                      value={
                        technician.name
                      }
                    >
                      {
                        technician.name
                      }
                    </option>
                  )
                )}
              </select>
            </label>

            <label>
              Description

              <textarea
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value
                  )
                }
                required
              />
            </label>

            <label>
              Notes

              <textarea
                value={notes}
                onChange={(event) =>
                  setNotes(
                    event.target.value
                  )
                }
              />
            </label>

            {maintenanceTools.length ===
              0 && (
              <p className="form-help">
                Work orders can be
                created for tools
                marked Maintenance or
                Out of Service.
              </p>
            )}

            <button
              type="submit"
              disabled={
                toolId === '' ||
                description.trim() ===
                  '' ||
                pendingAction !==
                  null
              }
            >
              {pendingAction ===
              'create'
                ? 'Creating...'
                : 'Create Work Order'}
            </button>
          </form>
        </>
      )}

      <h2>
        Work Orders
      </h2>

      <div className="responsive-table-view">
        <table>
          <thead>
            <tr>
              <th>Tool</th>
              <th>Priority</th>
              <th>Status</th>
              <th>
                Assigned To
              </th>
              <th>Description</th>

              <th>
                Latest Decision
              </th>

              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {workOrders.map(
              (workOrder) => (
                <tr
                  key={
                    workOrder
                      .work_order_id
                  }
                >
                  <td>
                    {
                      workOrder
                        .tool_name
                    }
                  </td>

                  <td>
                    <StatusBadge
                      value={
                        workOrder
                          .priority
                      }
                    />
                  </td>

                  <td>
                    <StatusBadge
                      value={
                        workOrder
                          .status
                      }
                    />
                  </td>

                  <td>
                    {workOrder
                      .assigned_to ||
                      'Unassigned'}
                  </td>

                  <td>
                    {
                      workOrder
                        .description
                    }
                  </td>

                  <td>
                    {workOrder
                      .decision ? (
                      <>
                        <StatusBadge
                          value={
                            workOrder
                              .decision
                          }
                        />

                        <div className="decision-summary">
                          {
                            workOrder
                              .approver_name
                          }
                          {': '}
                          {
                            workOrder
                              .decision_reason
                          }
                        </div>
                      </>
                    ) : (
                      'No decision recorded'
                    )}
                  </td>

                  <td>
                    {canCompleteRepair &&
                    workOrder.status ===
                      'Open' && (
                      <button
                        type="button"
                        disabled={
                          pendingAction !==
                          null
                        }
                        onClick={() =>
                          handleComplete(
                            workOrder
                              .work_order_id
                          )
                        }
                      >
                        {pendingAction ===
                        `complete-${workOrder.work_order_id}`
                          ? 'Completing...'
                          : 'Complete'}
                      </button>
                    )}

                    {canRequestReturn &&
                    workOrder.status ===
                      'Completed' && (
                      <button
                        type="button"
                        disabled={
                          pendingAction !==
                          null
                        }
                        onClick={() =>
                          handleReturnRequest(
                            workOrder
                              .work_order_id
                          )
                        }
                      >
                        {pendingAction ===
                        `request-${workOrder.work_order_id}`
                          ? 'Requesting...'
                          : 'Request Review'}
                      </button>
                    )}

                    {canApproveReturn &&
                    workOrder.status ===
                      'Awaiting Approval' &&
                    user?.user_id !==
                      workOrder
                        .completed_by && (
                      <div className="decision-controls">
                        <label>
                          Decision Reason

                          <textarea
                            value={
                              decisionReasons[
                                workOrder
                                  .work_order_id
                              ] ?? ''
                            }
                            onChange={(
                              event
                            ) =>
                              setDecisionReasons(
                                (
                                  current
                                ) => ({
                                  ...current,
                                  [workOrder.work_order_id]:
                                    event
                                      .target
                                      .value
                                })
                              )
                            }
                          />
                        </label>

                        <div className="decision-buttons">
                          <button
                            type="button"
                            disabled={
                              pendingAction !==
                              null
                            }
                            onClick={() =>
                              handleDecision(
                                workOrder
                                  .work_order_id,
                                'Approved'
                              )
                            }
                          >
                            Approve
                          </button>

                          <button
                            type="button"
                            className="secondary-button"
                            disabled={
                              pendingAction !==
                              null
                            }
                            onClick={() =>
                              handleDecision(
                                workOrder
                                  .work_order_id,
                                'Denied'
                              )
                            }
                          >
                            Deny
                          </button>
                        </div>
                      </div>
                    )}

                    {canApproveReturn &&
                    workOrder.status ===
                      'Awaiting Approval' &&
                    user?.user_id ===
                      workOrder
                        .completed_by && (
                      <span>
                        Another authorized
                        approver must decide.
                      </span>
                    )}

                    {workOrder.status ===
                      'Closed' && (
                      <StatusBadge
                        value="Closed"
                      />
                    )}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      <div className="mobile-card-list">
        {workOrders.map(
          (workOrder) => (
            <article
              className="mobile-data-card"
              key={
                workOrder
                  .work_order_id
              }
            >
              <div className="mobile-data-card-header">
                <div>
                  <h2>
                    {
                      workOrder
                        .tool_name
                    }
                  </h2>
                </div>

                <StatusBadge
                  value={
                    workOrder
                      .priority
                  }
                />
              </div>

              <div className="mobile-data-card-body">
                <div className="mobile-data-row">
                  <span className="mobile-data-label">
                    Work Order
                  </span>

                  <span>
                    #
                    {
                      workOrder
                        .work_order_id
                    }
                  </span>
                </div>

                <div className="mobile-data-row">
                  <span className="mobile-data-label">
                    Priority
                  </span>

                  <StatusBadge
                    value={
                      workOrder
                        .priority
                    }
                  />
                </div>

                <div className="mobile-data-row">
                  <span className="mobile-data-label">
                    Status
                  </span>

                  <StatusBadge
                    value={
                      workOrder.status
                    }
                  />
                </div>

                <div className="mobile-data-row">
                  <span className="mobile-data-label">
                    Assigned To
                  </span>

                  <span>
                    {workOrder
                      .assigned_to ||
                      'Unassigned'}
                  </span>
                </div>

                <div className="mobile-data-row">
                  <span className="mobile-data-label">
                    Description
                  </span>

                  <span>
                    {
                      workOrder
                        .description
                    }
                  </span>
                </div>

                <div className="mobile-data-row">
                  <span className="mobile-data-label">
                    Latest Decision
                  </span>

                  <span>
                    {workOrder.decision
                      ? `${workOrder.decision}: ${workOrder.decision_reason}`
                      : 'None'}
                  </span>
                </div>
              </div>

              {canCompleteRepair &&
              workOrder.status ===
                'Open' && (
                <button
                  type="button"
                  className="mobile-card-action"
                  disabled={
                    pendingAction !==
                    null
                  }
                  onClick={() =>
                    handleComplete(
                      workOrder
                        .work_order_id
                    )
                  }
                >
                  {pendingAction ===
                  `complete-${workOrder.work_order_id}`
                    ? 'Completing...'
                    : 'Complete Work Order'}
                </button>
              )}

              {canRequestReturn &&
              workOrder.status ===
                'Completed' && (
                <button
                  type="button"
                  className="mobile-card-action"
                  disabled={
                    pendingAction !==
                    null
                  }
                  onClick={() =>
                    handleReturnRequest(
                      workOrder
                        .work_order_id
                    )
                  }
                >
                  {pendingAction ===
                  `request-${workOrder.work_order_id}`
                    ? 'Requesting...'
                    : 'Request Return Review'}
                </button>
              )}

              {canApproveReturn &&
              workOrder.status ===
                'Awaiting Approval' &&
              user?.user_id !==
                workOrder.completed_by && (
                <div className="mobile-decision-panel">
                  <label>
                    Decision Reason

                    <textarea
                      value={
                        decisionReasons[
                          workOrder
                            .work_order_id
                        ] ?? ''
                      }
                      onChange={(
                        event
                      ) =>
                        setDecisionReasons(
                          (
                            current
                          ) => ({
                            ...current,
                            [workOrder.work_order_id]:
                              event
                                .target
                                .value
                          })
                        )
                      }
                    />
                  </label>

                  <div className="decision-buttons">
                    <button
                      type="button"
                      disabled={
                        pendingAction !==
                        null
                      }
                      onClick={() =>
                        handleDecision(
                          workOrder
                            .work_order_id,
                          'Approved'
                        )
                      }
                    >
                      Approve
                    </button>

                    <button
                      type="button"
                      className="secondary-button"
                      disabled={
                        pendingAction !==
                        null
                      }
                      onClick={() =>
                        handleDecision(
                          workOrder
                            .work_order_id,
                          'Denied'
                        )
                      }
                    >
                      Deny
                    </button>
                  </div>
                </div>
              )}

              {canApproveReturn &&
              workOrder.status ===
                'Awaiting Approval' &&
              user?.user_id ===
                workOrder.completed_by && (
                <p className="form-help">
                  Another authorized
                  approver must decide.
                </p>
              )}
            </article>
          )
        )}
      </div>

      {workOrders.length === 0 && (
        <p>
          No work orders found.
        </p>
      )}
    </div>
  )
}

export default Maintenance