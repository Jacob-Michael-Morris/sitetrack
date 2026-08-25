import {
  useEffect,
  useState
} from 'react'

import {
  useNavigate,
  useParams
} from 'react-router'

import {
  getTool,
  updateTool
} from '../services/tools.service.js'

import type {
  ToolInput
} from '../types/Tool.js'

function EditTool() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [form, setForm] =
    useState<ToolInput>({
      name: '',
      serial_number: '',
      category: '',
      status: 'Available',
      condition: 'Good',
      purchase_date: ''
    })

  const [loading, setLoading] =
    useState(true)

  const [submitting, setSubmitting] =
    useState(false)

  const [error, setError] = useState('')

  useEffect(() => {
    async function loadTool() {
      if (!id) {
        setLoading(false)
        setError('Invalid tool ID.')
        return
      }

      try {
        const tool = await getTool(id)

        setForm({
          name: tool.name,
          serial_number: tool.serial_number,
          category: tool.category || '',
          status: tool.status,
          condition: tool.condition,
          purchase_date: tool.purchase_date
            ? tool.purchase_date.substring(0, 10)
            : ''
        })
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'Unable to load tool.'
        )
      } finally {
        setLoading(false)
      }
    }

    loadTool()
  }, [id])

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement |
      HTMLSelectElement
    >
  ) {
    setForm({
      ...form,
      [event.target.name]:
        event.target.value
    })
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    if (!id) {
      return
    }

    const cleanName = form.name.trim()

    const cleanSerialNumber =
      form.serial_number.trim()

    const cleanCategory =
      form.category.trim()

    if (!cleanName) {
      setError('Tool name is required.')
      return
    }

    if (!cleanSerialNumber) {
      setError('Serial number is required.')
      return
    }

    if (!cleanCategory) {
      setError('Category is required.')
      return
    }

    if (form.purchase_date) {
      const purchaseDate = new Date(
        `${form.purchase_date}T00:00:00`
      )

      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (purchaseDate > today) {
        setError(
          'Purchase date cannot be in the future.'
        )
        return
      }
    }

    try {
      setSubmitting(true)
      setError('')

      await updateTool(
        id,
        {
          ...form,
          name: cleanName,
          serial_number: cleanSerialNumber,
          category: cleanCategory
        }
      )

      navigate(`/tools/${id}`)
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Unable to update tool.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <p>Loading tool...</p>
  }

  const today = new Date()
    .toISOString()
    .slice(0, 10)

  return (
    <div>
      <h1>Edit Tool</h1>

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
          Tool Name
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            maxLength={150}
          />
        </label>

        <label>
          Serial Number
          <input
            name="serial_number"
            value={form.serial_number}
            onChange={handleChange}
            required
            maxLength={100}
          />
        </label>

        <label>
          Category
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            maxLength={100}
          />
        </label>

        <label>
          Status
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option>Available</option>
            <option>Checked Out</option>
            <option>Maintenance</option>
            <option>Out of Service</option>
          </select>
        </label>

        <label>
          Condition
          <select
            name="condition"
            value={form.condition}
            onChange={handleChange}
          >
            <option>Good</option>
            <option>Fair</option>
            <option>Needs Repair</option>
            <option>Damaged</option>
          </select>
        </label>

        <label>
          Purchase Date
          <input
            type="date"
            name="purchase_date"
            value={form.purchase_date}
            onChange={handleChange}
            max={today}
          />
        </label>

        <button
          type="submit"
          disabled={submitting}
        >
          {submitting
            ? 'Saving...'
            : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}

export default EditTool