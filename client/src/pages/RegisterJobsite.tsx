import { useState } from 'react'
import { useNavigate } from 'react-router'

import {
  createJobsite
} from '../services/jobsites.service.js'

import type {
  JobsiteInput
} from '../types/Jobsite.js'

function RegisterJobsite() {
  const navigate = useNavigate()

  const [form, setForm] =
    useState<JobsiteInput>({
      name: '',
      location: '',
      status: 'Active',
      start_date: '',
      end_date: '',
      description: ''
    })

  const [error, setError] =
    useState('')

  const [submitting, setSubmitting] =
    useState(false)

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement |
      HTMLSelectElement |
      HTMLTextAreaElement
    >
  ) {
    setForm({
      ...form,
      [event.target.name]:
        event.target.value
    })
  }

  async function handleSubmit(
    event:
      React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    const cleanName =
      form.name.trim()

    const cleanLocation =
      form.location.trim()

    const cleanDescription =
      form.description.trim()

    if (!cleanName) {
      setError(
        'Jobsite name is required.'
      )
      return
    }

    if (!cleanLocation) {
      setError(
        'Jobsite location is required.'
      )
      return
    }

    if (
      form.start_date &&
      form.end_date &&
      form.end_date <
        form.start_date
    ) {
      setError(
        'End date cannot be before start date.'
      )
      return
    }

    try {
      setSubmitting(true)
      setError('')

      const jobsite =
        await createJobsite({
          ...form,
          name: cleanName,
          location: cleanLocation,
          description:
            cleanDescription
        })

      navigate(
        `/jobsites/${jobsite.jobsite_id}`
      )
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Unable to create jobsite.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="form-page">
      <div className="page-header">
        <div>
          <h1>Add Jobsite</h1>

          <p>
            Add a new construction
            jobsite to SiteTrack.
          </p>
        </div>
      </div>

      {error && (
        <p role="alert">
          {error}
        </p>
      )}

      <form
        className="tool-form"
        onSubmit={handleSubmit}
      >
        <label>
          Jobsite Name

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Location

          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Status

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option>Active</option>
            <option>Completed</option>
            <option>Inactive</option>
          </select>
        </label>

        <label>
          Start Date

          <input
            type="date"
            name="start_date"
            value={form.start_date}
            onChange={handleChange}
          />
        </label>

        <label>
          End Date

          <input
            type="date"
            name="end_date"
            value={form.end_date}
            onChange={handleChange}
            min={
              form.start_date ||
              undefined
            }
          />
        </label>

        <label>
          Description

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </label>

        <button
          type="submit"
          disabled={submitting}
        >
          {submitting
            ? 'Adding...'
            : 'Add Jobsite'}
        </button>
      </form>
    </div>
  )
}

export default RegisterJobsite