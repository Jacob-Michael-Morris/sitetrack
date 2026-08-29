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
  const { user, logout } = useAuth()
  const navigate = useNavigate()

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

  const canViewReports =
    isAdministrator ||
    isEquipmentManager ||
    isMaintenanceTechnician ||
    isSafetyPersonnel

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

        {(isAdministrator ||
          isEquipmentManager) && (
          <NavLink
            to="/jobsites"
            onClick={onClose}
          >
            Jobsites
          </NavLink>
        )}

        {(isAdministrator ||
          isEquipmentManager ||
          isWorker) && (
          <NavLink
            to="/assignments"
            onClick={onClose}
          >
            Assignments
          </NavLink>
        )}

        {(isAdministrator ||
          isMaintenanceTechnician ||
          isSafetyPersonnel) && (
          <NavLink
            to="/inspections"
            onClick={onClose}
          >
            Inspections
          </NavLink>
        )}

        {(isAdministrator ||
          isMaintenanceTechnician ||
          isWorker ||
          isSafetyPersonnel) && (
          <NavLink
            to="/damage-reports"
            onClick={onClose}
          >
            Damage Reports
          </NavLink>
        )}

        {(isAdministrator ||
          isMaintenanceTechnician) && (
          <NavLink
            to="/maintenance"
            onClick={onClose}
          >
            Maintenance
          </NavLink>
        )}

        {(isAdministrator ||
          isEquipmentManager ||
          isMaintenanceTechnician ||
          isSafetyPersonnel) && (
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
          <>
            <NavLink
              to="/users"
              onClick={onClose}
            >
              Users
            </NavLink>

            <NavLink
              to="/audit-log"
              onClick={onClose}
            >
              Audit Log
            </NavLink>
          </>
        )}
      </nav>

      <div className="sidebar-user">
        <p>
          <strong>{user?.name}</strong>
        </p>

        <p>{user?.role}</p>

        <button onClick={handleLogout}>
          Log Out
        </button>
      </div>
    </aside>
  )
}

export default Sidebar