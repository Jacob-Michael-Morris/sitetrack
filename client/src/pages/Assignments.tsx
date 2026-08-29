import { useEffect, useState } from 'react'

import StatusBadge from '../components/StatusBadge.js'

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
  const [assignments, setAssignments] =
    useState<ToolAssignment[]>([])

  const [tools, setTools] =
    useState<Tool[]>([])

  const [jobsites, setJobsites] =
    useState<Jobsite[]>([])

  const [
    checkoutToolId,
    setCheckoutToolId
  ] = useState('')

  const [
    checkoutJobsiteId,
    setCheckoutJobsiteId
  ] = useState('')

  const [
    returnToolId,
    setReturnToolId
  ] = useState('')

  const [
    transferToolId,
    setTransferToolId
  ] = useState('')

  const [
    transferJobsiteId,
    setTransferJobsiteId
  ] = useState('')

  const [notes, setNotes] =
    useState('')

  const [error, setError] =
    useState('')

  const [message, setMessage] =
    useState('')

  const [pendingAction, setPendingAction] =
    useState<
      'checkout' | 'return' | 'transfer' | null
    >(null)

  async function loadData() {
    const [
      assignmentData,
      toolData,
      jobsiteData
    ] = await Promise.all([
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
      .then(
        ([
          assignmentData,
          toolData,
          jobsiteData
        ]) => {
          if (cancelled) {
            return
          }

          setAssignments(
            assignmentData
          )

          setTools(toolData)
          setJobsites(jobsiteData)
        }
      )
      .catch(() => {
        if (!cancelled) {
          setError(
            'Unable to load assignment data.'
          )
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  const availableTools =
    tools.filter(
      (tool) =>
        tool.status === 'Available'
    )

  const activeJobsites =
    jobsites.filter(
      (jobsite) =>
        jobsite.status === 'Active'
    )

  const activeAssignments =
    assignments.filter(
      (assignment) =>
        assignment.released_at === null
    )

  const transferAssignment =
    activeAssignments.find(
      (assignment) =>
        String(assignment.tool_id) ===
        transferToolId
    )

  const transferJobsites =
    activeJobsites.filter(
      (jobsite) =>
        jobsite.jobsite_id !==
        transferAssignment?.jobsite_id
    )

  const canCheckout =
    checkoutToolId !== '' &&
    checkoutJobsiteId !== ''

  const canReturn =
    returnToolId !== ''

  const canTransfer =
    transferToolId !== '' &&
    transferJobsiteId !== ''

  async function handleCheckout(
    event:
      React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    if (pendingAction !== null) {
      return
    }

    setPendingAction('checkout')

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

      setMessage(
        'Tool checked out successfully.'
      )

      await loadData()
    } catch (checkoutError) {
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : 'Unable to check out tool.'
      )

      setMessage('')
    } finally {
      setPendingAction(null)
    }
  }

  async function handleReturn(
    event:
      React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    if (pendingAction !== null) {
      return
    }

    setPendingAction('return')

    try {
      await returnTool(
        Number(returnToolId),
        notes
      )

      setReturnToolId('')
      setNotes('')
      setError('')

      setMessage(
        'Tool returned successfully.'
      )

      await loadData()
    } catch (returnError) {
      setError(
        returnError instanceof Error
          ? returnError.message
          : 'Unable to return tool.'
      )

      setMessage('')
    } finally {
      setPendingAction(null)
    }
  }

  async function handleTransfer(
    event:
      React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    if (pendingAction !== null) {
      return
    }

    setPendingAction('transfer')

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

      setMessage(
        'Tool transferred successfully.'
      )

      await loadData()
    } catch (transferError) {
      setError(
        transferError instanceof Error
          ? transferError.message
          : 'Unable to transfer tool.'
      )

      setMessage('')
    } finally {
      setPendingAction(null)
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Tool Assignments</h1>

          <p>
            Check out, return, and
            transfer SiteTrack tools.
          </p>
        </div>
      </div>

      {error && (
        <p role="alert">
          {error}
        </p>
      )}

      {message && (
        <p>{message}</p>
      )}

      <h2>Check Out Tool</h2>

      <form
        className="tool-form"
        onSubmit={handleCheckout}
      >
        <label>
          Tool

          <select
            value={checkoutToolId}
            onChange={(event) =>
              setCheckoutToolId(
                event.target.value
              )
            }
            required
          >
            <option value="">
              {availableTools.length > 0
                ? 'Select Tool'
                : 'No available tools'}
            </option>

            {availableTools.map(
              (tool) => (
                <option
                  key={tool.tool_id}
                  value={tool.tool_id}
                >
                  {tool.name} -{' '}
                  {tool.serial_number}
                </option>
              )
            )}
          </select>
        </label>

        <label>
          Jobsite

          <select
            value={checkoutJobsiteId}
            onChange={(event) =>
              setCheckoutJobsiteId(
                event.target.value
              )
            }
            required
          >
            <option value="">
              {activeJobsites.length > 0
                ? 'Select Jobsite'
                : 'No active jobsites'}
            </option>

            {activeJobsites.map(
              (jobsite) => (
                <option
                  key={
                    jobsite.jobsite_id
                  }
                  value={
                    jobsite.jobsite_id
                  }
                >
                  {jobsite.name}
                </option>
              )
            )}
          </select>
        </label>

        {activeJobsites.length === 0 && (
          <p className="form-help">
            Add or activate a jobsite before
            checking out a tool.
          </p>
        )}

        <button
          type="submit"
          disabled={
            !canCheckout ||
            pendingAction !== null
          }
        >
          {pendingAction === 'checkout'
            ? 'Checking Out...'
            : 'Check Out'}
        </button>
      </form>

      <h2>Return Tool</h2>

      <form
        className="tool-form"
        onSubmit={handleReturn}
      >
        <label>
          Tool

          <select
            value={returnToolId}
            onChange={(event) =>
              setReturnToolId(
                event.target.value
              )
            }
            required
          >
            <option value="">
              {activeAssignments.length > 0
                ? 'Select Tool'
                : 'No assigned tools'}
            </option>

            {activeAssignments.map(
              (assignment) => (
                <option
                  key={
                    assignment.assignment_id
                  }
                  value={
                    assignment.tool_id
                  }
                >
                  {
                    assignment.tool_name
                  }{' '}
                  -{' '}
                  {
                    assignment.jobsite_name
                  }
                </option>
              )
            )}
          </select>
        </label>

        <button
          type="submit"
          disabled={
            !canReturn ||
            pendingAction !== null
          }
        >
          {pendingAction === 'return'
            ? 'Returning...'
            : 'Return Tool'}
        </button>
      </form>

      <h2>Transfer Tool</h2>

      <form
        className="tool-form"
        onSubmit={handleTransfer}
      >
        <label>
          Tool

          <select
            value={transferToolId}
            onChange={(event) =>
              setTransferToolId(
                event.target.value
              )
            }
            required
          >
            <option value="">
              {activeAssignments.length > 0
                ? 'Select Tool'
                : 'No assigned tools'}
            </option>

            {activeAssignments.map(
              (assignment) => (
                <option
                  key={
                    assignment.assignment_id
                  }
                  value={
                    assignment.tool_id
                  }
                >
                  {
                    assignment.tool_name
                  }{' '}
                  -{' '}
                  {
                    assignment.jobsite_name
                  }
                </option>
              )
            )}
          </select>
        </label>

        <label>
          New Jobsite

          <select
            value={
              transferJobsiteId
            }
            onChange={(event) =>
              setTransferJobsiteId(
                event.target.value
              )
            }
            required
          >
            <option value="">
              {transferJobsites.length > 0
                ? 'Select Jobsite'
                : 'No other active jobsites'}
            </option>

            {transferJobsites.map(
              (jobsite) => (
                <option
                  key={
                    jobsite.jobsite_id
                  }
                  value={
                    jobsite.jobsite_id
                  }
                >
                  {jobsite.name}
                </option>
              )
            )}
          </select>
        </label>

        {activeAssignments.length === 0 && (
          <p className="form-help">
            Check out a tool before trying
            to transfer it.
          </p>
        )}

        <button
          type="submit"
          disabled={
            !canTransfer ||
            pendingAction !== null
          }
        >
          {pendingAction === 'transfer'
            ? 'Transferring...'
            : 'Transfer Tool'}
        </button>
      </form>

      <h2>Current Assignments</h2>

      <div className="responsive-table-view">
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
            {activeAssignments.map(
              (assignment) => (
                <tr
                  key={
                    assignment.assignment_id
                  }
                >
                  <td>
                    {
                      assignment.tool_name
                    }
                  </td>

                  <td>
                    {
                      assignment.serial_number
                    }
                  </td>

                  <td>
                    {
                      assignment.jobsite_name
                    }
                  </td>

                  <td>
                    {new Date(
                      assignment.assigned_at
                    ).toLocaleDateString()}
                  </td>

                  <td>
                    <StatusBadge
                      value={
                        assignment.status
                      }
                    />
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      <div className="mobile-card-list">
        {activeAssignments.map(
          (assignment) => (
            <article
              className="mobile-data-card"
              key={
                assignment.assignment_id
              }
            >
              <div className="mobile-data-card-header">
                <h2>
                  {
                    assignment.tool_name
                  }
                </h2>

                <StatusBadge
                  value={
                    assignment.status
                  }
                />
              </div>

              <div className="mobile-data-card-body">
                <div className="mobile-data-row">
                  <span className="mobile-data-label">
                    Serial Number
                  </span>

                  <span>
                    {
                      assignment.serial_number
                    }
                  </span>
                </div>

                <div className="mobile-data-row">
                  <span className="mobile-data-label">
                    Jobsite
                  </span>

                  <span>
                    {
                      assignment.jobsite_name
                    }
                  </span>
                </div>

                <div className="mobile-data-row">
                  <span className="mobile-data-label">
                    Assigned
                  </span>

                  <span>
                    {new Date(
                      assignment.assigned_at
                    ).toLocaleDateString()}
                  </span>
                </div>

                <div className="mobile-data-row">
                  <span className="mobile-data-label">
                    Status
                  </span>

                  <StatusBadge
                    value={
                      assignment.status
                    }
                  />
                </div>
              </div>
            </article>
          )
        )}
      </div>

      {activeAssignments.length === 0 && (
        <p>
          No tools are currently
          assigned.
        </p>
      )}
    </div>
  )
}

export default Assignments
