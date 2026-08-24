import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { getTool } from '../services/tools.service'
import type { Tool } from '../types/Tool'

function ToolDetails() {
  const { id } = useParams()
  const [tool, setTool] = useState<Tool | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadTool() {
      if (!id) {
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
    return <p>{error || 'Tool not found.'}</p>
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>{tool.name}</h1>
          <p>Tool #{tool.tool_id}</p>
        </div>

        <Link
          className="button"
          to={`/tools/${tool.tool_id}/edit`}
        >
          Edit Tool
        </Link>
      </div>

      <div className="details-card">
        <p><strong>Serial Number:</strong> {tool.serial_number}</p>
        <p><strong>Category:</strong> {tool.category || 'N/A'}</p>
        <p><strong>Status:</strong> {tool.status}</p>
        <p><strong>Condition:</strong> {tool.condition}</p>

        <p>
          <strong>Purchase Date:</strong>{' '}
          {tool.purchase_date
            ? new Date(tool.purchase_date).toLocaleDateString()
            : 'N/A'}
        </p>
      </div>

      <Link to="/tools">Back to Tools</Link>
    </div>
  )
}

export default ToolDetails