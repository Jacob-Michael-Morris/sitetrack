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
import RegisterTool from './pages/RegisterTool'
import EditTool from './pages/EditTool'
import RegisterJobsite from './pages/RegisterJobsite'
import EditJobsite from './pages/EditJobsite'

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