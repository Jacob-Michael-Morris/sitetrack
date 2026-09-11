import { useEffect, useState } from 'react'

import {
  Link,
  useParams
} from 'react-router'

import StatusBadge from '../../shared/components/StatusBadge.js'
import { useAuth } from '../../session-navigation/context/useAuth.js'
import { getTool } from './tools.service.js'

import type { Tool } from './Tool.js'

function ToolDetails() {
  const { id } = useParams()
  const { hasPermission } = useAuth()

  const canEditTool =
    hasPermission(
      'tools.edit'
    )

  const [tool, setTool] =
    useState<Tool | null>(null)

  const [error, setError] =
    useState('')

  useEffect(() => {
    if (!id) {
      return
    }

    let cancelled = false

    getTool(id)
      .then((data) => {
        if (!cancelled) {
          setTool(data)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(
            'Unable to load tool.'
          )
        }
      })

    return () => {
      cancelled = true
    }
  }, [id])

  if (!id) {
    return (
      <p role="alert">
        Invalid tool ID.
      </p>
    )
  }

  if (error) {
    return (
      <p role="alert">
        {error}
      </p>
    )
  }

  if (!tool) {
    return (
      <p>
        Loading tool...
      </p>
    )
  }

  return (
    <div className="detail-page">
      <div className="page-header">
        <div>
          <h1>
            {tool.name}
          </h1>

          <p>
            Tool #{tool.tool_id}
          </p>
        </div>

        {canEditTool && (
          <Link
            className="button"
            to={`/tools/${tool.tool_id}/edit`}
          >
            Edit Tool
          </Link>
        )}
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
              {tool.category}
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
        &larr; Back to Tools
      </Link>
    </div>
  )
}

export default ToolDetails