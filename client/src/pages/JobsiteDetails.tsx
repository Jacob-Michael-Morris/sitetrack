import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { getJobsite } from '../services/jobsites.service.js'
import type { Jobsite } from '../types/Jobsite.js'

function JobsiteDetails() {
  const { id } = useParams()

  const [jobsite, setJobsite] = useState<Jobsite | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadJobsite() {
      if (!id) return

      try {
        const data = await getJobsite(id)
        setJobsite(data)
      } catch {
        setError('Unable to load jobsite.')
      } finally {
        setLoading(false)
      }
    }

    loadJobsite()
  }, [id])

  if (loading) return <p>Loading jobsite...</p>

  if (error || !jobsite) {
    return <p>{error || 'Jobsite not found.'}</p>
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>{jobsite.name}</h1>
          <p>Jobsite #{jobsite.jobsite_id}</p>
        </div>

        <Link
          className="button"
          to={`/jobsites/${jobsite.jobsite_id}/edit`}
        >
          Edit Jobsite
        </Link>
      </div>

      <div className="details-card">
        <p><strong>Location:</strong> {jobsite.location || 'N/A'}</p>
        <p><strong>Status:</strong> {jobsite.status}</p>
        <p><strong>Description:</strong> {jobsite.description || 'N/A'}</p>
      </div>

      <Link to="/jobsites">Back to Jobsites</Link>
    </div>
  )
}

export default JobsiteDetails