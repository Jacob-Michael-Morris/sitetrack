import { useState } from 'react'
import { useNavigate } from 'react-router'
import { createTool } from '../services/tools.service'
import type { ToolInput } from '../types/Tool'

function RegisterTool() {
  const navigate = useNavigate()

  const [form, setForm] = useState<ToolInput>({
    name: '',
    serial_number: '',
    category: '',
    status: 'Available',
    condition: 'Good',
    purchase_date: ''
  })

  const [error, setError] = useState('')

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

    try {
      const tool = await createTool(form)
      navigate(`/tools/${tool.tool_id}`)
    } catch {
      setError('Unable to register tool.')
    }
  }

  return (
    <div>
      <h1>Register Tool</h1>

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
          Register Tool
        </button>
      </form>
    </div>
  )
}

export default RegisterTool