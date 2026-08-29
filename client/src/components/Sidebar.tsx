import {
  NavLink,
  useNavigate
} from 'react-router'

import { useAuth } from '../context/useAuth.js'

import {
  ADMIN,
  ALERT_ROLES,
  ASSIGNMENT_ROLES,
  DAMAGE_REPORT_ROLES,
  INSPECTION_ROLES,
  JOBSITE_ROLES,
  MAINTENANCE_ROLES,
  REPORT_ROLES,
  SAFETY_PERSONNEL,
  hasAllowedRole
} from '../constants/roles.js'

interface SidebarProps {
  mobileOpen: boolean
  onClose: () => void
}

function Sidebar({
  mobileOpen,
  onClose
}: SidebarProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const role = user?.role

  const isAdministrator =
    role === ADMIN

  const isSafetyPersonnel =
    role === SAFETY_PERSONNEL

  const canViewJobsites =
    hasAllowedRole(
      role,
      JOBSITE_ROLES
    )

  const canViewAssignments =
    hasAllowedRole(
      role,
      ASSIGNMENT_ROLES
    )

  const canViewInspections =
    hasAllowedRole(
      role,
      INSPECTION_ROLES
    )

  const canViewDamageReports =
    hasAllowedRole(
      role,
      DAMAGE_REPORT_ROLES
    )

  const canViewMaintenance =
    hasAllowedRole(
      role,
      MAINTENANCE_ROLES
    )

  const canViewAlerts =
    hasAllowedRole(
      role,
      ALERT_ROLES
    )

  const canViewReports =
    hasAllowedRole(
      role,
      REPORT_ROLES
    )

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
        <NavLink
          to="/dashboard"
          onClick={onClose}
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/tools"
          onClick={onClose}
        >
          Tools
        </NavLink>

        {canViewJobsites && (
          <NavLink
            to="/jobsites"
            onClick={onClose}
          >
            Jobsites
          </NavLink>
        )}

        {canViewAssignments && (
          <NavLink
            to="/assignments"
            onClick={onClose}
          >
            Assignments
          </NavLink>
        )}

        {canViewInspections && (
          <NavLink
            to="/inspections"
            onClick={onClose}
          >
            Inspections
          </NavLink>
        )}

        {canViewDamageReports && (
          <NavLink
            to="/damage-reports"
            onClick={onClose}
          >
            Damage Reports
          </NavLink>
        )}

        {canViewMaintenance && (
          <NavLink
            to="/maintenance"
            onClick={onClose}
          >
            Maintenance
          </NavLink>
        )}

        {canViewAlerts && (
          <NavLink
            to="/alerts"
            onClick={onClose}
          >
            Alerts
          </NavLink>
        )}

        {canViewReports && (
          <NavLink
            to="/reports"
            onClick={onClose}
          >
            Reports
          </NavLink>
        )}

        {isAdministrator && (
          <NavLink
            to="/users"
            onClick={onClose}
          >
            Users
          </NavLink>
        )}

        {(isAdministrator ||
          isSafetyPersonnel) && (
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