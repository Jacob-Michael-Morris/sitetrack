import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { getJobsites } from '../services/jobsites.service.js'
import type { Jobsite } from '../types/Jobsite.js'

function Jobsites() {
  const [jobsites, setJobsites] = useState<Jobsite[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadJobsites() {
      try {
        const data = await getJobsites()
        setJobsites(data)
      } catch {
        setError('Unable to load jobsites.')
      } finally {
        setLoading(false)
      }
    }

    loadJobsites()
  }, [])

  const filteredJobsites = jobsites.filter((jobsite) => {
    const matchesSearch =
      jobsite.name.toLowerCase().includes(search.toLowerCase()) ||
      (jobsite.location || '')
        .toLowerCase()
        .includes(search.toLowerCase())

    const matchesStatus =
      statusFilter === 'All' ||
      jobsite.status === statusFilter

    return matchesSearch && matchesStatus
  })

  if (loading) return <p>Loading jobsites...</p>
  if (error) return <p>{error}</p>

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Jobsites</h1>
          <p>Manage SiteTrack construction jobsites.</p>
        </div>

        <Link className="button" to="/jobsites/new">
          Add Jobsite
        </Link>
      </div>

      <div className="toolbar">
        <input
          type="text"
          placeholder="Search jobsites..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Completed">Completed</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>Jobsite</th>
            <th>Location</th>
            <th>Status</th>
            <th>Start Date</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredJobsites.map((jobsite) => (
            <tr key={jobsite.jobsite_id}>
              <td>{jobsite.name}</td>
              <td>{jobsite.location || 'N/A'}</td>
              <td>{jobsite.status}</td>
              <td>
                {jobsite.start_date
                  ? new Date(jobsite.start_date).toLocaleDateString()
                  : 'N/A'}
              </td>
              <td>
                <Link to={`/jobsites/${jobsite.jobsite_id}`}>
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Jobsites