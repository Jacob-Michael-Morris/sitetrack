import {
  NavLink,
  useNavigate
} from 'react-router'

import { useAuth } from '../context/useAuth.js'

interface SidebarProps {
  mobileOpen: boolean
  onClose: () => void
}

function Sidebar({
  mobileOpen,
  onClose
}: SidebarProps) {
  const {
    user,
    logout,
    hasPermission
  } = useAuth()

  const navigate = useNavigate()

  async function handleLogout() {
    try {
      await logout()
      onClose()
      navigate('/login')
    } catch {
      console.error(
        'Unable to log out'
      )
    }
  }

  return (
    <aside
      className={
        mobileOpen
          ? 'sidebar sidebar--open'
          : 'sidebar'
      }
    >
      <div className="sidebar-header">
        <div>
          <h2>SiteTrack</h2>
          <p>Tool Management</p>
        </div>

        <button
          type="button"
          className="sidebar-close-button"
          aria-label="Close navigation menu"
          onClick={onClose}
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M6 6l12 12" />
            <path d="M18 6 6 18" />
          </svg>
        </button>
      </div>

      <nav className="sidebar-nav">
        {hasPermission(
          'dashboard.view'
        ) && (
          <NavLink
            to="/dashboard"
            onClick={onClose}
          >
            Dashboard
          </NavLink>
        )}

        {hasPermission(
          'tools.view'
        ) && (
          <NavLink
            to="/tools"
            onClick={onClose}
          >
            Tools
          </NavLink>
        )}

        {hasPermission(
          'jobsites.view'
        ) && (
          <NavLink
            to="/jobsites"
            onClick={onClose}
          >
            Jobsites
          </NavLink>
        )}

        {hasPermission(
          'assignments.view'
        ) && (
          <NavLink
            to="/assignments"
            onClick={onClose}
          >
            Assignments
          </NavLink>
        )}

        {hasPermission(
          'inspections.view'
        ) && (
          <NavLink
            to="/inspections"
            onClick={onClose}
          >
            Inspections
          </NavLink>
        )}

        {hasPermission(
          'damage_reports.view'
        ) && (
          <NavLink
            to="/damage-reports"
            onClick={onClose}
          >
            Damage Reports
          </NavLink>
        )}

        {hasPermission(
          'maintenance.view'
        ) && (
          <NavLink
            to="/maintenance"
            onClick={onClose}
          >
            Maintenance
          </NavLink>
        )}

        {hasPermission(
          'alerts.view'
        ) && (
          <NavLink
            to="/alerts"
            onClick={onClose}
          >
            Alerts
          </NavLink>
        )}

        {hasPermission(
          'reports.view'
        ) && (
          <NavLink
            to="/reports"
            onClick={onClose}
          >
            Reports
          </NavLink>
        )}

        {hasPermission(
          'users.view'
        ) && (
          <NavLink
            to="/users"
            onClick={onClose}
          >
            Users
          </NavLink>
        )}

        {hasPermission(
          'roles.manage'
        ) && (
          <NavLink
            to="/roles/manage"
            onClick={onClose}
          >
            Manage Roles
          </NavLink>
        )}

        {hasPermission(
          'audit.view'
        ) && (
          <NavLink
            to="/audit-log"
            onClick={onClose}
          >
            Audit Log
          </NavLink>
        )}
      </nav>

      <div className="sidebar-user">
        <p>
          <strong>
            {user?.name}
          </strong>
        </p>

        <p>{user?.role}</p>

        <button
          type="button"
          onClick={handleLogout}
        >
          Log Out
        </button>
      </div>
    </aside>
  )
}

export default Sidebar