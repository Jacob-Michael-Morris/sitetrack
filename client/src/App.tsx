import { Navigate, Route, Routes } from 'react-router'

import Layout from './components/Layout.js'

import Dashboard from './pages/Dashboard.js'

import Tools from './pages/Tools.js'
import ToolDetails from './pages/ToolDetails.js'
import RegisterTool from './pages/RegisterTool.js'
import EditTool from './pages/EditTool.js'

import Jobsites from './pages/Jobsites.js'
import JobsiteDetails from './pages/JobsiteDetails.js'
import RegisterJobsite from './pages/RegisterJobsite.js'
import EditJobsite from './pages/EditJobsite.js'

import Assignments from './pages/Assignments.js'
import Inspections from './pages/Inspections.js'
import DamageReports from './pages/DamageReports.js'
import Maintenance from './pages/Maintenance.js'
import Alerts from './pages/Alerts.js'
import AuditLog from './pages/AuditLog.js'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/tools"
          element={<Tools />}
        />

        <Route
          path="/tools/new"
          element={<RegisterTool />}
        />

        <Route
          path="/tools/:id"
          element={<ToolDetails />}
        />

        <Route
          path="/tools/:id/edit"
          element={<EditTool />}
        />

        <Route
          path="/jobsites"
          element={<Jobsites />}
        />

        <Route
          path="/jobsites/new"
          element={<RegisterJobsite />}
        />

        <Route
          path="/jobsites/:id"
          element={<JobsiteDetails />}
        />

        <Route
          path="/jobsites/:id/edit"
          element={<EditJobsite />}
        />

        <Route
          path="/assignments"
          element={<Assignments />}
        />

        <Route
          path="/inspections"
          element={<Inspections />}
        />

        <Route
          path="/damage-reports"
          element={<DamageReports />}
        />

        <Route
          path="/maintenance"
          element={<Maintenance />}
        />

        <Route
          path="/alerts"
          element={<Alerts />}
        />

        <Route
          path="/audit-log"
          element={<AuditLog />}
        />
      </Route>
    </Routes>
  )
}

export default App