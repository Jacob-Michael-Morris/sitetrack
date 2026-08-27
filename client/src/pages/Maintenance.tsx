import { useEffect, useState } from 'react'

import StatusBadge from '../components/StatusBadge.js'

import {
  completeWorkOrder,
  createWorkOrder,
  getWorkOrders,
  returnToService
} from '../services/work-orders.service.js'

import { getTools } from '../services/tools.service.js'

import type { Tool } from '../types/Tool.js'
import type { WorkOrder } from '../types/WorkOrder.js'

function Maintenance() {
  const [workOrders, setWorkOrders] =
    useState<WorkOrder[]>([])

  const [tools, setTools] =
    useState<Tool[]>([])

  const [toolId, setToolId] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('Medium')
  const [assignedTo, setAssignedTo] = useState('')
  const [notes, setNotes] = useState('')

  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function loadData() {
    const [workOrderData, toolData] =
      await Promise.all([
        getWorkOrders(),
        getTools()
      ])

    setWorkOrders(workOrderData)
    setTools(toolData)
  }

  useEffect(() => {
    let cancelled = false

    Promise.all([
      getWorkOrders(),
      getTools()
    ])
      .then(([workOrderData, toolData]) => {
        if (cancelled) {
          return
        }

        setWorkOrders(workOrderData)
        setTools(toolData)
      })
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
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

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
    } catch {
      setError(
        'Unable to create work order.'
      )
      setMessage('')
    }
  }

  async function handleComplete(id: number) {
    try {
      await completeWorkOrder(id)

      setMessage('Work order completed.')
      setError('')

      await loadData()
    } catch {
      setError(
        'Unable to complete work order.'
      )
    }
  }

  async function handleReturnToService(
    id: number
  ) {
    try {
      await returnToService(id)

      setMessage(
        'Tool returned to service.'
      )
      setError('')

      await loadData()
    } catch {
      setError(
        'Unable to return tool to service.'
      )
    }
  }

  const maintenanceTools = tools.filter(
    (tool) =>
      tool.status === 'Out of Service' ||
      tool.status === 'Maintenance'
  )

  return (
    <div>
      <h1>Maintenance</h1>

      {error && (
        <p role="alert">
          {error}
        </p>
      )}

      {message && <p>{message}</p>}

      <h2>Create Work Order</h2>

      <form
        className="tool-form"
        onSubmit={handleSubmit}
      >
        <label>
          Tool
          <select
            value={toolId}
            onChange={(event) =>
              setToolId(event.target.value)
            }
            required
          >
            <option value="">
              Select Tool
            </option>

            {maintenanceTools.map((tool) => (
              <option
                key={tool.tool_id}
                value={tool.tool_id}
              >
                {tool.name} - {tool.serial_number}
              </option>
            ))}
          </select>
        </label>

        <label>
          Priority
          <select
            value={priority}
            onChange={(event) =>
              setPriority(event.target.value)
            }
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
            <option>Critical</option>
          </select>
        </label>

        <label>
          Assigned To
          <input
            value={assignedTo}
            onChange={(event) =>
              setAssignedTo(event.target.value)
            }
          />
        </label>

        <label>
          Description
          <textarea
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            required
          />
        </label>

        <label>
          Notes
          <textarea
            value={notes}
            onChange={(event) =>
              setNotes(event.target.value)
            }
          />
        </label>

        <button type="submit">
          Create Work Order
        </button>
      </form>

      <h2>Work Orders</h2>

      <table>
        <thead>
          <tr>
            <th>Tool</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Assigned To</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {workOrders.map((workOrder) => (
            <tr key={workOrder.work_order_id}>
              <td>{workOrder.tool_name}</td>

              <td>
                <StatusBadge
                  value={workOrder.priority}
                />
              </td>

              <td>
                <StatusBadge
                  value={workOrder.status}
                />
              </td>

              <td>
                {workOrder.assigned_to ||
                  'Unassigned'}
              </td>

              <td>
                {workOrder.description}
              </td>

              <td>
                {workOrder.status === 'Open' && (
                  <button
                    onClick={() =>
                      handleComplete(
                        workOrder.work_order_id
                      )
                    }
                  >
                    Complete
                  </button>
                )}

                {workOrder.status ===
                  'Completed' && (
                  <button
                    onClick={() =>
                      handleReturnToService(
                        workOrder.work_order_id
                      )
                    }
                  >
                    Return to Service
                  </button>
                )}

                {workOrder.status === 'Closed' && (
                  <StatusBadge value="Closed" />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {workOrders.length === 0 && (
        <p>No work orders found.</p>
      )}
    </div>
  )
}

export default Maintenance