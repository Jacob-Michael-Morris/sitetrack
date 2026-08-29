import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'

import StatusBadge from '../components/StatusBadge.js'
import { getJobsite } from '../services/jobsites.service.js'

import type { Jobsite } from '../types/Jobsite.js'

function JobsiteDetails() {
  const { id } = useParams()

  const [jobsite, setJobsite] =
    useState<Jobsite | null>(null)

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  useEffect(() => {
    async function loadJobsite() {
      if (!id) {
        setLoading(false)
        setError('Invalid jobsite ID.')
        return
      }

      try {
        const data =
          await getJobsite(id)

        setJobsite(data)
      } catch {
        setError(
          'Unable to load jobsite.'
        )
      } finally {
        setLoading(false)
      }
    }

    loadJobsite()
  }, [id])

  if (loading) {
    return <p>Loading jobsite...</p>
  }

  if (error || !jobsite) {
    return (
      <p role="alert">
        {error || 'Jobsite not found.'}
      </p>
    )
  }

  return (
    <div className="detail-page">
      <div className="page-header">
        <div>
          <h1>{jobsite.name}</h1>

          <p>
            Jobsite #{jobsite.jobsite_id}
          </p>
        </div>

        <Link
          className="button"
          to={`/jobsites/${jobsite.jobsite_id}/edit`}
        >
          Edit Jobsite
        </Link>
      </div>

      <div className="details-card">
        <div className="details-list">
          <div className="details-row">
            <span className="details-label">
              Location
            </span>

            <span className="details-value">
              {jobsite.location || 'N/A'}
            </span>
          </div>

          <div className="details-row">
            <span className="details-label">
              Status
            </span>

            <span className="details-value">
              <StatusBadge
                value={jobsite.status}
              />
            </span>
          </div>

          <div className="details-row">
            <span className="details-label">
              Start Date
            </span>

            <span className="details-value">
              {jobsite.start_date
                ? new Date(
                    jobsite.start_date
                  ).toLocaleDateString()
                : 'N/A'}
            </span>
          </div>

          <div className="details-row">
            <span className="details-label">
              End Date
            </span>

            <span className="details-value">
              {jobsite.end_date
                ? new Date(
                    jobsite.end_date
                  ).toLocaleDateString()
                : 'N/A'}
            </span>
          </div>

          <div className="details-row">
            <span className="details-label">
              Description
            </span>

            <span className="details-value">
              {jobsite.description ||
                'N/A'}
            </span>
          </div>
        </div>
      </div>

      <Link
        className="back-link"
        to="/jobsites"
      >
        ← Back to Jobsites
      </Link>
    </div>
  )
}

export default JobsiteDetails