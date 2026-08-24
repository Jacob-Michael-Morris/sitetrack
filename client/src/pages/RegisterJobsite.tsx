import { useState } from 'react'
import { useNavigate } from 'react-router'
import { createJobsite } from '../services/jobsites.service.js'
import type { JobsiteInput } from '../types/Jobsite.js'

function RegisterJobsite() {
  const navigate = useNavigate()

  const [form, setForm] = useState<JobsiteInput>({
    name: '',
    location: '',
    status: 'Active',
    start_date: '',
    end_date: '',
    description: ''
  })

  const [error, setError] = useState('')

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    })
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    try {
      const jobsite = await createJobsite(form)
      navigate(`/jobsites/${jobsite.jobsite_id}`)
    } catch {
      setError('Unable to create jobsite.')
    }
  }

  return (
    <div>
      <h1>Add Jobsite</h1>

      {error && <p>{error}</p>}

      <form className="tool-form" onSubmit={handleSubmit}>
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

        <button type="submit">
          Add Jobsite
        </button>
      </form>
    </div>
  )
}

export default RegisterJobsite