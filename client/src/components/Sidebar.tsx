import {
  NavLink,
  useNavigate
} from 'react-router'

import { useAuth } from '../context/useAuth.js'

function Sidebar() {
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

  async function handleLogout() {
    try {
      await logout()
      navigate('/login')
    } catch {
      console.error('Unable to log out')
    }
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>SiteTrack</h2>
        <p>Tool Management</p>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard">
          Dashboard
        </NavLink>

        <NavLink to="/tools">
          Tools
        </NavLink>

        {(isAdministrator || isEquipmentManager) && (
          <NavLink to="/jobsites">
            Jobsites
          </NavLink>
        )}

        {(
          isAdministrator ||
          isEquipmentManager ||
          isWorker
        ) && (
          <NavLink to="/assignments">
            Assignments
          </NavLink>
        )}

        {(
          isAdministrator ||
          isMaintenanceTechnician ||
          isSafetyPersonnel
        ) && (
          <NavLink to="/inspections">
            Inspections
          </NavLink>
        )}

        {(
          isAdministrator ||
          isMaintenanceTechnician ||
          isWorker ||
          isSafetyPersonnel
        ) && (
          <NavLink to="/damage-reports">
            Damage Reports
          </NavLink>
        )}

        {(
          isAdministrator ||
          isMaintenanceTechnician
        ) && (
          <NavLink to="/maintenance">
            Maintenance
          </NavLink>
        )}

        {(
          isAdministrator ||
          isEquipmentManager ||
          isMaintenanceTechnician ||
          isSafetyPersonnel
        ) && (
          <NavLink to="/alerts">
            Alerts
          </NavLink>
        )}

        {isAdministrator && (
          <>
            <NavLink to="/users">
              Users
            </NavLink>

            <NavLink to="/audit-log">
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