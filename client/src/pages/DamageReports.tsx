import { useEffect, useState } from 'react'

import {
  createDamageReport,
  getDamageReports
} from '../services/damage-reports.service.js'

import { getTools } from '../services/tools.service.js'

import type { DamageReport } from '../types/DamageReport.js'
import type { Tool } from '../types/Tool.js'

function DamageReports() {
  const [reports, setReports] = useState<DamageReport[]>([])
  const [tools, setTools] = useState<Tool[]>([])

  const [toolId, setToolId] = useState('')
  const [description, setDescription] = useState('')
  const [severity, setSeverity] = useState('Medium')
  const [notes, setNotes] = useState('')

  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function loadData() {
    const [reportData, toolData] = await Promise.all([
      getDamageReports(),
      getTools()
    ])

    setReports(reportData)
    setTools(toolData)
  }

  useEffect(() => {
    let cancelled = false

    Promise.all([
      getDamageReports(),
      getTools()
    ])
      .then(([reportData, toolData]) => {
        if (cancelled) return

        setReports(reportData)
        setTools(toolData)
      })
      .catch(() => {
        if (!cancelled) {
          setError('Unable to load damage reports.')
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
      await createDamageReport({
        tool_id: Number(toolId),
        inspection_id: null,
        description,
        severity,
        notes
      })

      setToolId('')
      setDescription('')
      setSeverity('Medium')
      setNotes('')
      setError('')
      setMessage('Damage report created successfully.')

      await loadData()
    } catch {
      setError('Unable to create damage report.')
      setMessage('')
    }
  }

  return (
    <div>
      <h1>Damage Reports</h1>

      {error && <p>{error}</p>}
      {message && <p>{message}</p>}

      <h2>Report Damaged Tool</h2>

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
          Severity
          <select
            value={severity}
            onChange={(event) => setSeverity(event.target.value)}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
            <option>Critical</option>
          </select>
        </label>

        <label>
          Description
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            required
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
          Submit Damage Report
        </button>
      </form>

      <h2>Damage Report History</h2>

      <table>
        <thead>
          <tr>
            <th>Tool</th>
            <th>Serial Number</th>
            <th>Severity</th>
            <th>Status</th>
            <th>Reported</th>
            <th>Description</th>
          </tr>
        </thead>

        <tbody>
          {reports.map((report) => (
            <tr key={report.damage_report_id}>
              <td>{report.tool_name}</td>
              <td>{report.serial_number}</td>
              <td>{report.severity}</td>
              <td>{report.status}</td>
              <td>
                {new Date(report.reported_at).toLocaleDateString()}
              </td>
              <td>{report.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default DamageReports