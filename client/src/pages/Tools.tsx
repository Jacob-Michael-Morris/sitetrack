import { useEffect, useState } from 'react'
import { getTools } from '../services/tools.service'
import type { Tool } from '../types/Tool'

function Tools() {
  const [tools, setTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadTools() {
      try {
        const data = await getTools()
        setTools(data)
      } catch {
        setError('Unable to load tools.')
      } finally {
        setLoading(false)
      }
    }

    loadTools()
  }, [])

  if (loading) {
    return <p>Loading tools...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  return (
    <div>
      <h1>Tools</h1>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tool</th>
            <th>Serial Number</th>
            <th>Category</th>
            <th>Status</th>
            <th>Condition</th>
            <th>Purchase Date</th>
          </tr>
        </thead>

        <tbody>
          {tools.map((tool) => (
            <tr key={tool.tool_id}>
              <td>{tool.tool_id}</td>
              <td>{tool.name}</td>
              <td>{tool.serial_number}</td>
              <td>{tool.category}</td>
              <td>{tool.status}</td>
              <td>{tool.condition}</td>
              <td>
                {tool.purchase_date
                  ? new Date(tool.purchase_date).toLocaleDateString()
                  : 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Tools