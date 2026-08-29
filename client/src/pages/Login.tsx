import { useState } from 'react'

import {
  Navigate,
  useNavigate
} from 'react-router'

import { useAuth } from '../context/useAuth.js'

import './CSS/Login.css'

function Login() {
  const { user, login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] =
    useState('')

  const [password, setPassword] =
    useState('')

  const [error, setError] =
    useState('')

  const [submitting, setSubmitting] =
    useState(false)

  if (user) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    )
  }

  async function handleSubmit(
    event:
      React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    try {
      setSubmitting(true)
      setError('')

      await login(
        email,
        password
      )

      navigate('/dashboard')
    } catch {
      setError(
        'Invalid email or password.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-heading">
          <h1>SiteTrack</h1>

          <p>
            Jobsite Tool and
            Maintenance Management
          </p>
        </div>

        {error && (
          <p role="alert">
            {error}
          </p>
        )}

        <form
          className="login-form"
          onSubmit={handleSubmit}
        >
          <label>
            Email

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(
                  event.target.value
                )
              }
              autoComplete="email"
              required
            />
          </label>

          <label>
            Password

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
              autoComplete="current-password"
              required
            />
          </label>

          <button
            type="submit"
            disabled={submitting}
          >
            {submitting
              ? 'Signing In...'
              : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login