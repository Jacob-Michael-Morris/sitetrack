import { Navigate, Route, Routes } from 'react-router'

import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Tools from './pages/Tools'
import ToolDetails from './pages/ToolDetails'
import Jobsites from './pages/Jobsites'
import JobsiteDetails from './pages/JobsiteDetails'
import Assignments from './pages/Assignments'
import Inspections from './pages/Inspections'
import Maintenance from './pages/Maintenance'
import Alerts from './pages/Alerts'

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
          path="/tools/:id"
          element={<ToolDetails />}
        />

        <Route
          path="/jobsites"
          element={<Jobsites />}
        />

        <Route
          path="/jobsites/:id"
          element={<JobsiteDetails />}
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
          path="/maintenance"
          element={<Maintenance />}
        />

        <Route
          path="/alerts"
          element={<Alerts />}
        />
      </Route>
    </Routes>
  )
}

export default App