import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import {
  getTool,
  updateTool
} from '../services/tools.service'
import type { ToolInput } from '../types/Tool'

function EditTool() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState<ToolInput>({
    name: '',
    serial_number: '',
    category: '',
    status: 'Available',
    condition: 'Good',
    purchase_date: ''
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadTool() {
      if (!id) {
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
      } catch {
        setError('Unable to load tool.')
      } finally {
        setLoading(false)
      }
    }

    loadTool()
  }, [id])

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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

    if (!id) {
      return
    }

    try {
      await updateTool(id, form)
      navigate(`/tools/${id}`)
    } catch {
      setError('Unable to update tool.')
    }
  }

  if (loading) {
    return <p>Loading tool...</p>
  }

  return (
    <div>
      <h1>Edit Tool</h1>

      {error && <p>{error}</p>}

      <form className="tool-form" onSubmit={handleSubmit}>
        <label>
          Tool Name
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Serial Number
          <input
            name="serial_number"
            value={form.serial_number}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Category
          <input
            name="category"
            value={form.category}
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
          />
        </label>

        <button type="submit">
          Save Changes
        </button>
      </form>
    </div>
  )
}

export default EditTool