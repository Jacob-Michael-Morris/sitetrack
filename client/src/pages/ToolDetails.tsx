import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'

import StatusBadge from '../components/StatusBadge.js'
import { getTool } from '../services/tools.service.js'

import type { Tool } from '../types/Tool.js'

function ToolDetails() {
  const { id } = useParams()

  const [tool, setTool] =
    useState<Tool | null>(null)

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  useEffect(() => {
    async function loadTool() {
      if (!id) {
        setLoading(false)
        setError('Invalid tool ID.')
        return
      }

      try {
        const data = await getTool(id)
        setTool(data)
      } catch {
        setError('Unable to load tool.')
      } finally {
        setLoading(false)
      }
    }

    loadTool()
  }, [id])

  if (loading) {
    return <p>Loading tool...</p>
  }

  if (error || !tool) {
    return (
      <p role="alert">
        {error || 'Tool not found.'}
      </p>
    )
  }

  return (
    <div className="detail-page">
      <div className="page-header">
        <div>
          <h1>{tool.name}</h1>

          <p>
            Tool #{tool.tool_id}
          </p>
        </div>

        <Link
          className="button"
          to={`/tools/${tool.tool_id}/edit`}
        >
          Edit Tool
        </Link>
      </div>

      <div className="details-card">
        <div className="details-list">
          <div className="details-row">
            <span className="details-label">
              Serial Number
            </span>

            <span className="details-value">
              {tool.serial_number}
            </span>
          </div>

          <div className="details-row">
            <span className="details-label">
              Category
            </span>

            <span className="details-value">
              {tool.category || 'N/A'}
            </span>
          </div>

          <div className="details-row">
            <span className="details-label">
              Status
            </span>

            <span className="details-value">
              <StatusBadge
                value={tool.status}
              />
            </span>
          </div>

          <div className="details-row">
            <span className="details-label">
              Condition
            </span>

            <span className="details-value">
              <StatusBadge
                value={tool.condition}
              />
            </span>
          </div>

          <div className="details-row">
            <span className="details-label">
              Purchase Date
            </span>

            <span className="details-value">
              {tool.purchase_date
                ? new Date(
                    tool.purchase_date
                  ).toLocaleDateString()
                : 'N/A'}
            </span>
          </div>
        </div>
      </div>

      <Link
        className="back-link"
        to="/tools"
      >
        ← Back to Tools
      </Link>
    </div>
  )
}

export default ToolDetails