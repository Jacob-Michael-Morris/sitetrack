import { useEffect, useState } from 'react'

import StatusBadge from '../components/StatusBadge.js'
import { useAuth } from '../context/useAuth.js'

import {
  createInspection,
  getInspections
} from '../services/inspections.service.js'

import { getTools } from '../services/tools.service.js'

import type { Inspection } from '../types/Inspection.js'
import type { Tool } from '../types/Tool.js'

function Inspections() {
  const { user } = useAuth()

  const canRecordInspection =
    user?.role !== 'Safety Personnel'

  const [inspections, setInspections] =
    useState<Inspection[]>([])

  const [tools, setTools] =
    useState<Tool[]>([])

  const [toolId, setToolId] =
    useState('')

  const [result, setResult] =
    useState('Passed')

  const [condition, setCondition] =
    useState('Good')

  const [notes, setNotes] =
    useState('')

  const [
    nextInspectionDate,
    setNextInspectionDate
  ] = useState('')

  const [error, setError] =
    useState('')

  const [message, setMessage] =
    useState('')

  const [submitting, setSubmitting] =
    useState(false)

  const today =
    new Date().toISOString().slice(0, 10)

  async function loadData() {
    const [
      inspectionData,
      toolData
    ] = await Promise.all([
      getInspections(),
      getTools()
    ])

    setInspections(inspectionData)
    setTools(toolData)
  }

  useEffect(() => {
    let cancelled = false

    Promise.all([
      getInspections(),
      getTools()
    ])
      .then(
        ([
          inspectionData,
          toolData
        ]) => {
          if (cancelled) {
            return
          }

          setInspections(
            inspectionData
          )

          setTools(toolData)
        }
      )
      .catch(() => {
        if (!cancelled) {
          setError(
            'Unable to load inspection data.'
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

    if (submitting) {
      return
    }

    setSubmitting(true)

    try {
      await createInspection({
        tool_id: Number(toolId),
        result,
        condition,
        notes,
        next_inspection_date:
          nextInspectionDate
      })

      setToolId('')
      setResult('Passed')
      setCondition('Good')
      setNotes('')
      setNextInspectionDate('')
      setError('')

      setMessage(
        'Inspection recorded successfully.'
      )

      await loadData()
    } catch (inspectionError) {
      setError(
        inspectionError instanceof Error
          ? inspectionError.message
          : 'Unable to record inspection.'
      )

      setMessage('')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Inspections</h1>

          <p>
            Record inspections and review
            tool inspection history.
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

      <h2>Perform Inspection</h2>

      <form
        className="tool-form"
        onSubmit={handleSubmit}
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
            disabled={!canRecordInspection}
          >
            <option value="">
              Select Tool
            </option>

            {tools.map((tool) => (
              <option
                key={tool.tool_id}
                value={tool.tool_id}
              >
                {tool.name} -{' '}
                {tool.serial_number}
              </option>
            ))}
          </select>
        </label>

        <label>
          Result

          <select
            value={result}
            onChange={(event) =>
              setResult(
                event.target.value
              )
            }
            disabled={!canRecordInspection}
          >
            <option>Passed</option>
            <option>Failed</option>
          </select>
        </label>

        <label>
          Condition

          <select
            value={condition}
            onChange={(event) =>
              setCondition(
                event.target.value
              )
            }
            disabled={!canRecordInspection}
          >
            <option>Good</option>
            <option>Fair</option>

            <option>
              Needs Repair
            </option>

            <option>
              Damaged
            </option>
          </select>
        </label>

        <label>
          Next Inspection Date

          <input
            type="date"
            min={today}
            disabled={!canRecordInspection}
            value={
              nextInspectionDate
            }
            onChange={(event) =>
              setNextInspectionDate(
                event.target.value
              )
            }
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
            disabled={!canRecordInspection}
          />
        </label>

        <button
          type="submit"
          disabled={
            toolId === '' || submitting
            || !canRecordInspection
          }
        >
          {submitting
            ? 'Recording...'
            : 'Record Inspection'}
        </button>

        {!canRecordInspection && (
          <p className="form-help">
            Safety Personnel have review-only
            access to inspection records.
          </p>
        )}
      </form>

      <h2>Inspection History</h2>

      <div className="responsive-table-view">
        <table>
          <thead>
            <tr>
              <th>Tool</th>
              <th>Serial Number</th>
              <th>Date</th>
              <th>Result</th>
              <th>Condition</th>
              <th>
                Next Inspection
              </th>
            </tr>
          </thead>

          <tbody>
            {inspections.map(
              (inspection) => (
                <tr
                  key={
                    inspection.inspection_id
                  }
                >
                  <td>
                    {
                      inspection.tool_name
                    }
                  </td>

                  <td>
                    {
                      inspection.serial_number
                    }
                  </td>

                  <td>
                    {new Date(
                      inspection.inspection_date
                    ).toLocaleDateString()}
                  </td>

                  <td>
                    <StatusBadge
                      value={
                        inspection.result
                      }
                    />
                  </td>

                  <td>
                    <StatusBadge
                      value={
                        inspection.condition
                      }
                    />
                  </td>

                  <td>
                    {inspection
                      .next_inspection_date
                      ? new Date(
                          inspection
                            .next_inspection_date
                        ).toLocaleDateString()
                      : 'N/A'}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      <div className="mobile-card-list">
        {inspections.map(
          (inspection) => (
            <article
              className="mobile-data-card"
              key={
                inspection.inspection_id
              }
            >
              <div className="mobile-data-card-header">
                <h2>
                  {
                    inspection.tool_name
                  }
                </h2>

                <StatusBadge
                  value={
                    inspection.result
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
                      inspection.serial_number
                    }
                  </span>
                </div>

                <div className="mobile-data-row">
                  <span className="mobile-data-label">
                    Inspection Date
                  </span>

                  <span>
                    {new Date(
                      inspection.inspection_date
                    ).toLocaleDateString()}
                  </span>
                </div>

                <div className="mobile-data-row">
                  <span className="mobile-data-label">
                    Result
                  </span>

                  <StatusBadge
                    value={
                      inspection.result
                    }
                  />
                </div>

                <div className="mobile-data-row">
                  <span className="mobile-data-label">
                    Condition
                  </span>

                  <StatusBadge
                    value={
                      inspection.condition
                    }
                  />
                </div>

                <div className="mobile-data-row">
                  <span className="mobile-data-label">
                    Next Inspection
                  </span>

                  <span>
                    {inspection
                      .next_inspection_date
                      ? new Date(
                          inspection
                            .next_inspection_date
                        ).toLocaleDateString()
                      : 'N/A'}
                  </span>
                </div>
              </div>
            </article>
          )
        )}
      </div>

      {inspections.length === 0 && (
        <p>
          No inspection records found.
        </p>
      )}
    </div>
  )
}

export default Inspections
