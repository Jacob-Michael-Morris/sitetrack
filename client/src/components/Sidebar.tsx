import { NavLink } from 'react-router'

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>SiteTrack</h2>
        <p>Tool Management</p>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/tools">Tools</NavLink>
        <NavLink to="/jobsites">Jobsites</NavLink>
        <NavLink to="/assignments">Assignments</NavLink>
        <NavLink to="/inspections">Inspections</NavLink>
        <NavLink to="/damage-reports">Damage Reports</NavLink>
        <NavLink to="/maintenance">Maintenance</NavLink>
        <NavLink to="/alerts">Alerts</NavLink>
        <NavLink to="/audit-log">Audit Log</NavLink>
      </nav>
    </aside>
  )
}

export default Sidebar