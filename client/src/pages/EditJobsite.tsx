import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import {
  getJobsite,
  updateJobsite
} from '../services/jobsites.service.js'
import type { JobsiteInput } from '../types/Jobsite.js'

function EditJobsite() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState<JobsiteInput>({
    name: '',
    location: '',
    status: 'Active',
    start_date: '',
    end_date: '',
    description: ''
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadJobsite() {
      if (!id) return

      try {
        const jobsite = await getJobsite(id)

        setForm({
          name: jobsite.name,
          location: jobsite.location || '',
          status: jobsite.status,
          start_date: jobsite.start_date
            ? jobsite.start_date.substring(0, 10)
            : '',
          end_date: jobsite.end_date
            ? jobsite.end_date.substring(0, 10)
            : '',
          description: jobsite.description || ''
        })
      } catch {
        setError('Unable to load jobsite.')
      } finally {
        setLoading(false)
      }
    }

    loadJobsite()
  }, [id])

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

    if (!id) return

    try {
      await updateJobsite(id, form)
      navigate(`/jobsites/${id}`)
    } catch {
      setError('Unable to update jobsite.')
    }
  }

  if (loading) return <p>Loading jobsite...</p>

  return (
    <div>
      <h1>Edit Jobsite</h1>

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
          Save Changes
        </button>
      </form>
    </div>
  )
}

export default EditJobsite