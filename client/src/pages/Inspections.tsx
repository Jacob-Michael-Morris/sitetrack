import { useEffect, useState } from 'react'

import {
  createInspection,
  getInspections
} from '../services/inspections.service.js'

import { getTools } from '../services/tools.service.js'

import type { Inspection } from '../types/Inspection.js'
import type { Tool } from '../types/Tool.js'

function Inspections() {
  const [inspections, setInspections] = useState<Inspection[]>([])
  const [tools, setTools] = useState<Tool[]>([])

  const [toolId, setToolId] = useState('')
  const [result, setResult] = useState('Passed')
  const [condition, setCondition] = useState('Good')
  const [notes, setNotes] = useState('')
  const [nextInspectionDate, setNextInspectionDate] = useState('')

  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function loadData() {
    const [inspectionData, toolData] = await Promise.all([
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
      .then(([inspectionData, toolData]) => {
        if (cancelled) return

        setInspections(inspectionData)
        setTools(toolData)
      })
      .catch(() => {
        if (!cancelled) {
          setError('Unable to load inspection data.')
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
      await createInspection({
        tool_id: Number(toolId),
        result,
        condition,
        notes,
        next_inspection_date: nextInspectionDate
      })

      setToolId('')
      setResult('Passed')
      setCondition('Good')
      setNotes('')
      setNextInspectionDate('')
      setError('')
      setMessage('Inspection recorded successfully.')

      await loadData()
    } catch {
      setError('Unable to record inspection.')
      setMessage('')
    }
  }

  return (
    <div>
      <h1>Inspections</h1>

      {error && <p>{error}</p>}
      {message && <p>{message}</p>}

      <h2>Perform Inspection</h2>

      <form className="tool-form" onSubmit={handleSubmit}>
        <label>
          Tool
          <select
            value={toolId}
            onChange={(event) => setToolId(event.target.value)}
            required
          >
            <option value="">Select Tool</option>

            {tools.map((tool) => (
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
          Result
          <select
            value={result}
            onChange={(event) => setResult(event.target.value)}
          >
            <option>Passed</option>
            <option>Failed</option>
          </select>
        </label>

        <label>
          Condition
          <select
            value={condition}
            onChange={(event) => setCondition(event.target.value)}
          >
            <option>Good</option>
            <option>Fair</option>
            <option>Needs Repair</option>
            <option>Damaged</option>
          </select>
        </label>

        <label>
          Next Inspection Date
          <input
            type="date"
            value={nextInspectionDate}
            onChange={(event) =>
              setNextInspectionDate(event.target.value)
            }
          />
        </label>

        <label>
          Notes
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />
        </label>

        <button type="submit">
          Record Inspection
        </button>
      </form>

      <h2>Inspection History</h2>

      <table>
        <thead>
          <tr>
            <th>Tool</th>
            <th>Serial Number</th>
            <th>Date</th>
            <th>Result</th>
            <th>Condition</th>
            <th>Next Inspection</th>
          </tr>
        </thead>

        <tbody>
          {inspections.map((inspection) => (
            <tr key={inspection.inspection_id}>
              <td>{inspection.tool_name}</td>
              <td>{inspection.serial_number}</td>
              <td>
                {new Date(
                  inspection.inspection_date
                ).toLocaleDateString()}
              </td>
              <td>{inspection.result}</td>
              <td>{inspection.condition}</td>
              <td>
                {inspection.next_inspection_date
                  ? new Date(
                      inspection.next_inspection_date
                    ).toLocaleDateString()
                  : 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Inspections