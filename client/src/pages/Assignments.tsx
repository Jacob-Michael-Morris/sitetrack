import { useEffect, useState } from 'react'

import {
  checkoutTool,
  getAssignments,
  returnTool,
  transferTool
} from '../services/assignments.service.js'

import { getTools } from '../services/tools.service.js'
import { getJobsites } from '../services/jobsites.service.js'

import type { Tool } from '../types/Tool.js'
import type { Jobsite } from '../types/Jobsite.js'
import type { ToolAssignment } from '../types/ToolAssignment.js'

function Assignments() {
  const [assignments, setAssignments] = useState<ToolAssignment[]>([])
  const [tools, setTools] = useState<Tool[]>([])
  const [jobsites, setJobsites] = useState<Jobsite[]>([])

  const [checkoutToolId, setCheckoutToolId] = useState('')
  const [checkoutJobsiteId, setCheckoutJobsiteId] = useState('')

  const [returnToolId, setReturnToolId] = useState('')

  const [transferToolId, setTransferToolId] = useState('')
  const [transferJobsiteId, setTransferJobsiteId] = useState('')

  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function loadData() {
    const [assignmentData, toolData, jobsiteData] =
      await Promise.all([
        getAssignments(),
        getTools(),
        getJobsites()
      ])

    setAssignments(assignmentData)
    setTools(toolData)
    setJobsites(jobsiteData)
  }

useEffect(() => {
  let cancelled = false

  Promise.all([
    getAssignments(),
    getTools(),
    getJobsites()
  ])
    .then(([assignmentData, toolData, jobsiteData]) => {
      if (cancelled) return

      setAssignments(assignmentData)
      setTools(toolData)
      setJobsites(jobsiteData)
    })
    .catch(() => {
      if (!cancelled) {
        setError('Unable to load assignment data.')
      }
    })

  return () => {
    cancelled = true
  }
}, [])

  const availableTools = tools.filter(
    (tool) => tool.status === 'Available'
  )

  const activeAssignments = assignments.filter(
    (assignment) => assignment.released_at === null
  )

  async function handleCheckout(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    try {
      await checkoutTool(
        Number(checkoutToolId),
        Number(checkoutJobsiteId),
        notes
      )

      setCheckoutToolId('')
      setCheckoutJobsiteId('')
      setNotes('')
      setError('')
      setMessage('Tool checked out successfully.')

      await loadData()
    } catch {
      setError('Unable to check out tool.')
      setMessage('')
    }
  }

  async function handleReturn(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    try {
      await returnTool(
        Number(returnToolId),
        notes
      )

      setReturnToolId('')
      setNotes('')
      setError('')
      setMessage('Tool returned successfully.')

      await loadData()
    } catch {
      setError('Unable to return tool.')
      setMessage('')
    }
  }

  async function handleTransfer(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    try {
      await transferTool(
        Number(transferToolId),
        Number(transferJobsiteId),
        notes
      )

      setTransferToolId('')
      setTransferJobsiteId('')
      setNotes('')
      setError('')
      setMessage('Tool transferred successfully.')

      await loadData()
    } catch {
      setError('Unable to transfer tool.')
      setMessage('')
    }
  }

  return (
    <div>
      <h1>Tool Assignments</h1>

      {error && <p>{error}</p>}
      {message && <p>{message}</p>}

      <h2>Check Out Tool</h2>

      <form className="tool-form" onSubmit={handleCheckout}>
        <label>
          Tool
          <select
            value={checkoutToolId}
            onChange={(event) =>
              setCheckoutToolId(event.target.value)
            }
            required
          >
            <option value="">Select Tool</option>

            {availableTools.map((tool) => (
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
          Jobsite
          <select
            value={checkoutJobsiteId}
            onChange={(event) =>
              setCheckoutJobsiteId(event.target.value)
            }
            required
          >
            <option value="">Select Jobsite</option>

            {jobsites.map((jobsite) => (
              <option
                key={jobsite.jobsite_id}
                value={jobsite.jobsite_id}
              >
                {jobsite.name}
              </option>
            ))}
          </select>
        </label>

        <button type="submit">
          Check Out
        </button>
      </form>

      <h2>Return Tool</h2>

      <form className="tool-form" onSubmit={handleReturn}>
        <label>
          Tool
          <select
            value={returnToolId}
            onChange={(event) =>
              setReturnToolId(event.target.value)
            }
            required
          >
            <option value="">Select Tool</option>

            {activeAssignments.map((assignment) => (
              <option
                key={assignment.assignment_id}
                value={assignment.tool_id}
              >
                {assignment.tool_name} - {assignment.jobsite_name}
              </option>
            ))}
          </select>
        </label>

        <button type="submit">
          Return Tool
        </button>
      </form>

      <h2>Transfer Tool</h2>

      <form className="tool-form" onSubmit={handleTransfer}>
        <label>
          Tool
          <select
            value={transferToolId}
            onChange={(event) =>
              setTransferToolId(event.target.value)
            }
            required
          >
            <option value="">Select Tool</option>

            {activeAssignments.map((assignment) => (
              <option
                key={assignment.assignment_id}
                value={assignment.tool_id}
              >
                {assignment.tool_name} - {assignment.jobsite_name}
              </option>
            ))}
          </select>
        </label>

        <label>
          New Jobsite
          <select
            value={transferJobsiteId}
            onChange={(event) =>
              setTransferJobsiteId(event.target.value)
            }
            required
          >
            <option value="">Select Jobsite</option>

            {jobsites.map((jobsite) => (
              <option
                key={jobsite.jobsite_id}
                value={jobsite.jobsite_id}
              >
                {jobsite.name}
              </option>
            ))}
          </select>
        </label>

        <button type="submit">
          Transfer Tool
        </button>
      </form>

      <h2>Current Assignments</h2>

      <table>
        <thead>
          <tr>
            <th>Tool</th>
            <th>Serial Number</th>
            <th>Jobsite</th>
            <th>Assigned</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {activeAssignments.map((assignment) => (
            <tr key={assignment.assignment_id}>
              <td>{assignment.tool_name}</td>
              <td>{assignment.serial_number}</td>
              <td>{assignment.jobsite_name}</td>
              <td>
                {new Date(
                  assignment.assigned_at
                ).toLocaleDateString()}
              </td>
              <td>{assignment.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Assignments