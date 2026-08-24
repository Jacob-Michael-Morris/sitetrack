import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { getTools } from '../services/tools.service'
import type { Tool } from '../types/Tool'

function Tools() {
  const [tools, setTools] = useState<Tool[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
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

  const filteredTools = tools.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(search.toLowerCase()) ||
      tool.serial_number.toLowerCase().includes(search.toLowerCase())

    const matchesStatus =
      statusFilter === 'All' ||
      tool.status === statusFilter

    return matchesSearch && matchesStatus
  })

  if (loading) {
    return <p>Loading tools...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Tools</h1>
          <p>Manage SiteTrack tools and equipment.</p>
        </div>

        <Link className="button" to="/tools/new">
          Register Tool
        </Link>
      </div>

      <div className="toolbar">
        <input
          type="text"
          placeholder="Search tools..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Available">Available</option>
          <option value="Checked Out">Checked Out</option>
          <option value="Maintenance">Maintenance</option>
          <option value="Out of Service">Out of Service</option>
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>Tool</th>
            <th>Serial Number</th>
            <th>Category</th>
            <th>Status</th>
            <th>Condition</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredTools.map((tool) => (
            <tr key={tool.tool_id}>
              <td>{tool.name}</td>
              <td>{tool.serial_number}</td>
              <td>{tool.category}</td>
              <td>{tool.status}</td>
              <td>{tool.condition}</td>
              <td>
                <Link to={`/tools/${tool.tool_id}`}>
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredTools.length === 0 && (
        <p>No tools match your search.</p>
      )}
    </div>
  )
}

export default Tools