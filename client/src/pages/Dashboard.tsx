import { useEffect, useState } from 'react'
import { Link } from 'react-router'

import StatusBadge from '../components/StatusBadge.js'
import { useAuth } from '../context/useAuth.js'
import { getDashboard } from '../services/dashboard.service.js'

import type { DashboardData } from '../types/Dashboard.js'

import './CSS/Dashboard.css'

function Dashboard() {
  const { user } = useAuth()

  const [dashboard, setDashboard] =
    useState<DashboardData | null>(null)

  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    getDashboard()
      .then((data) => {
        if (!cancelled) {
          setDashboard(data)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(
            'Unable to load dashboard.'
          )
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  if (error) {
    return (
      <p role="alert">
        {error}
      </p>
    )
  }

  if (!dashboard) {
    return <p>Loading dashboard...</p>
  }

  const {
    summary,
    recent_alerts
  } = dashboard

  const role = user?.role

  const isAdministrator =
    role === 'Administrator'

  const isEquipmentManager =
    role === 'Equipment Manager'

  const isMaintenanceTechnician =
    role === 'Maintenance Technician'

  const isWorker =
    role === 'Worker'

  const isSafetyPersonnel =
    role === 'Safety Personnel'

  const canViewAlerts =
    isAdministrator ||
    isEquipmentManager ||
    isMaintenanceTechnician ||
    isSafetyPersonnel

  return (
    <div className="dashboard-page">
      <div className="dashboard-heading">
        <div>
          <h1>Dashboard</h1>

          <p>
            Welcome back, {user?.name}.
          </p>
        </div>

        <div className="dashboard-role">
          {role}
        </div>
      </div>

      <section>
        <h2>Tool Status</h2>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <span>Total Tools</span>

            <strong>
              {summary.total_tools}
            </strong>
          </div>

          <div className="dashboard-card">
            <span>Available</span>

            <strong>
              {summary.available_tools}
            </strong>
          </div>

          {(isAdministrator ||
            isEquipmentManager ||
            isWorker) && (
            <div className="dashboard-card">
              <span>Checked Out</span>

              <strong>
                {
                  summary.checked_out_tools
                }
              </strong>
            </div>
          )}

          {(isAdministrator ||
            isMaintenanceTechnician) && (
            <div className="dashboard-card">
              <span>Maintenance</span>

              <strong>
                {
                  summary.maintenance_tools
                }
              </strong>
            </div>
          )}

          {(isAdministrator ||
            isMaintenanceTechnician ||
            isWorker ||
            isSafetyPersonnel) && (
            <div className="dashboard-card">
              <span>
                Out of Service
              </span>

              <strong>
                {
                  summary.out_of_service_tools
                }
              </strong>
            </div>
          )}
        </div>
      </section>

      <section>
        <h2>Operations</h2>

        <div className="dashboard-grid">
          {(isAdministrator ||
            isEquipmentManager) && (
            <div className="dashboard-card">
              <span>
                Active Jobsites
              </span>

              <strong>
                {
                  summary.active_jobsites
                }
              </strong>
            </div>
          )}

          {(isAdministrator ||
            isMaintenanceTechnician ||
            isWorker ||
            isSafetyPersonnel) && (
            <div className="dashboard-card">
              <span>
                Open Damage Reports
              </span>

              <strong>
                {
                  summary.open_damage_reports
                }
              </strong>
            </div>
          )}

          {(isAdministrator ||
            isMaintenanceTechnician) && (
            <div className="dashboard-card">
              <span>
                Open Work Orders
              </span>

              <strong>
                {
                  summary.open_work_orders
                }
              </strong>
            </div>
          )}

          {(isAdministrator ||
            isMaintenanceTechnician ||
            isSafetyPersonnel) && (
            <div className="dashboard-card">
              <span>
                Overdue Inspections
              </span>

              <strong>
                {
                  summary.overdue_inspections
                }
              </strong>
            </div>
          )}

          {canViewAlerts && (
            <div className="dashboard-card">
              <span>Unread Alerts</span>

              <strong>
                {
                  summary.unread_alerts
                }
              </strong>
            </div>
          )}
        </div>
      </section>

      <section>
        <h2>Quick Actions</h2>

        <div className="dashboard-actions">
          <Link
            className="dashboard-action"
            to="/tools"
          >
            View Tools
          </Link>

          {(isAdministrator ||
            isEquipmentManager) && (
            <Link
              className="dashboard-action"
              to="/jobsites"
            >
              Manage Jobsites
            </Link>
          )}

          {(isAdministrator ||
            isEquipmentManager ||
            isWorker) && (
            <Link
              className="dashboard-action"
              to="/assignments"
            >
              Tool Assignments
            </Link>
          )}

          {(isAdministrator ||
            isMaintenanceTechnician ||
            isSafetyPersonnel) && (
            <Link
              className="dashboard-action"
              to="/inspections"
            >
              Perform Inspection
            </Link>
          )}

          {(isAdministrator ||
            isMaintenanceTechnician ||
            isWorker ||
            isSafetyPersonnel) && (
            <Link
              className="dashboard-action"
              to="/damage-reports"
            >
              Report Damage
            </Link>
          )}

          {(isAdministrator ||
            isMaintenanceTechnician) && (
            <Link
              className="dashboard-action"
              to="/maintenance"
            >
              Maintenance
            </Link>
          )}

          {canViewAlerts && (
            <Link
              className="dashboard-action"
              to="/alerts"
            >
              View Alerts
            </Link>
          )}

          {isAdministrator && (
            <Link
              className="dashboard-action"
              to="/users"
            >
              Manage Users
            </Link>
          )}
        </div>
      </section>

      {canViewAlerts && (
        <section>
          <div className="dashboard-section-heading">
            <h2>Recent Alerts</h2>

            <Link to="/alerts">
              View All
            </Link>
          </div>

          {recent_alerts.length === 0 ? (
            <p>No recent alerts.</p>
          ) : (
            <>
              <div className="dashboard-table-container">
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Tool</th>
                      <th>Severity</th>
                      <th>Message</th>
                      <th>Time</th>
                    </tr>
                  </thead>

                  <tbody>
                    {recent_alerts.map(
                      (alert) => (
                        <tr
                          key={
                            alert.alert_id
                          }
                        >
                          <td>
                            {
                              alert.alert_type
                            }
                          </td>

                          <td>
                            {
                              alert.tool_name ??
                              'N/A'
                            }
                          </td>

                          <td>
                            <StatusBadge
                              value={
                                alert.severity
                              }
                            />
                          </td>

                          <td>
                            {alert.message}
                          </td>

                          <td>
                            {new Date(
                              alert.created_at
                            ).toLocaleString()}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>

              <div className="dashboard-alert-cards">
                {recent_alerts.map(
                  (alert) => (
                    <article
                      className="dashboard-alert-card"
                      key={
                        alert.alert_id
                      }
                    >
                      <div className="dashboard-alert-card-header">
                        <div>
                          <h3>
                            {
                              alert.alert_type
                            }
                          </h3>

                          <span>
                            {alert.tool_name ??
                              'No Tool'}
                          </span>
                        </div>

                        <StatusBadge
                          value={
                            alert.severity
                          }
                        />
                      </div>

                      <p className="dashboard-alert-message">
                        {alert.message}
                      </p>

                      <div className="dashboard-alert-time">
                        {new Date(
                          alert.created_at
                        ).toLocaleString()}
                      </div>
                    </article>
                  )
                )}
              </div>
            </>
          )}
        </section>
      )}
    </div>
  )
}

export default Dashboard