import { useEffect, useState } from 'react'

import StatusBadge from '../components/StatusBadge.js'

import {
  getAlerts,
  markAlertRead,
  markAllAlertsRead
} from '../services/alerts.service.js'

import type { Alert } from '../types/Alert.js'

function Alerts() {
  const [alerts, setAlerts] =
    useState<Alert[]>([])

  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function loadAlerts() {
    const data = await getAlerts()
    setAlerts(data)
  }

  useEffect(() => {
    getAlerts()
      .then(setAlerts)
      .catch(() => {
        setError('Unable to load alerts.')
      })
  }, [])

  async function handleRead(id: number) {
    try {
      await markAlertRead(id)
      await loadAlerts()

      setError('')
      setMessage(
        'Alert marked as read.'
      )
    } catch {
      setError(
        'Unable to update alert.'
      )
      setMessage('')
    }
  }

  async function handleReadAll() {
    try {
      await markAllAlertsRead()
      await loadAlerts()

      setError('')
      setMessage(
        'All alerts marked as read.'
      )
    } catch {
      setError(
        'Unable to update alerts.'
      )
      setMessage('')
    }
  }

  const unreadCount = alerts.filter(
    (alert) => !alert.is_read
  ).length

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Alerts</h1>

          <p>
            {unreadCount} unread alert(s)
          </p>
        </div>

        <button
          onClick={handleReadAll}
          disabled={unreadCount === 0}
        >
          Mark All Read
        </button>
      </div>

      {error && (
        <p role="alert">
          {error}
        </p>
      )}

      {message && <p>{message}</p>}

      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Severity</th>
            <th>Tool</th>
            <th>Jobsite</th>
            <th>Message</th>
            <th>Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {alerts.map((alert) => (
            <tr key={alert.alert_id}>
              <td>
                {alert.alert_type}
              </td>

              <td>
                <StatusBadge
                  value={alert.severity}
                />
              </td>

              <td>
                {alert.tool_name || 'N/A'}
              </td>

              <td>
                {alert.jobsite_name || 'N/A'}
              </td>

              <td>
                {alert.message}
              </td>

              <td>
                {new Date(
                  alert.created_at
                ).toLocaleString()}
              </td>

              <td>
                <StatusBadge
                  value={
                    alert.is_read
                      ? 'Read'
                      : 'Unread'
                  }
                />
              </td>

              <td>
                {!alert.is_read ? (
                  <button
                    onClick={() =>
                      handleRead(
                        alert.alert_id
                      )
                    }
                  >
                    Mark Read
                  </button>
                ) : (
                  <span>—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {alerts.length === 0 && (
        <p>No alerts found.</p>
      )}
    </div>
  )
}

export default Alerts