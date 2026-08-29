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

  const [error, setError] =
    useState('')

  const [message, setMessage] =
    useState('')

  async function loadAlerts() {
    const data = await getAlerts()
    setAlerts(data)
  }

  useEffect(() => {
    getAlerts()
      .then(setAlerts)
      .catch(() => {
        setError(
          'Unable to load alerts.'
        )
      })
  }, [])

  async function handleRead(
    id: number
  ) {
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

  const unreadCount =
    alerts.filter(
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
          type="button"
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

      {message && (
        <p>{message}</p>
      )}

      <div className="responsive-table-view">
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
              <tr
                key={alert.alert_id}
              >
                <td>
                  {alert.alert_type}
                </td>

                <td>
                  <StatusBadge
                    value={
                      alert.severity
                    }
                  />
                </td>

                <td>
                  {alert.tool_name ||
                    'N/A'}
                </td>

                <td>
                  {alert.jobsite_name ||
                    'N/A'}
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
                      type="button"
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
      </div>

      <div className="mobile-card-list">
        {alerts.map((alert) => (
          <article
            className="mobile-data-card"
            key={alert.alert_id}
          >
            <div className="mobile-data-card-header">
              <div>
                <h2>
                  {alert.alert_type}
                </h2>
              </div>

              <StatusBadge
                value={alert.severity}
              />
            </div>

            <div className="mobile-data-card-body">
              <div className="mobile-data-row">
                <span className="mobile-data-label">
                  Status
                </span>

                <StatusBadge
                  value={
                    alert.is_read
                      ? 'Read'
                      : 'Unread'
                  }
                />
              </div>

              <div className="mobile-data-row">
                <span className="mobile-data-label">
                  Tool
                </span>

                <span>
                  {alert.tool_name ||
                    'N/A'}
                </span>
              </div>

              <div className="mobile-data-row">
                <span className="mobile-data-label">
                  Jobsite
                </span>

                <span>
                  {alert.jobsite_name ||
                    'N/A'}
                </span>
              </div>

              <div className="mobile-data-row">
                <span className="mobile-data-label">
                  Date
                </span>

                <span>
                  {new Date(
                    alert.created_at
                  ).toLocaleString()}
                </span>
              </div>

              <div className="mobile-data-row">
                <span className="mobile-data-label">
                  Message
                </span>

                <span>
                  {alert.message}
                </span>
              </div>
            </div>

            {!alert.is_read && (
              <button
                type="button"
                className="mobile-card-action"
                onClick={() =>
                  handleRead(
                    alert.alert_id
                  )
                }
              >
                Mark Read
              </button>
            )}
          </article>
        ))}
      </div>

      {alerts.length === 0 && (
        <p>No alerts found.</p>
      )}
    </div>
  )
}

export default Alerts