import {
  Navigate,
  Route,
  Routes
} from 'react-router'

import Layout from './components/Layout.js'
import RequireAuth from './components/RequireAuth.js'
import RequireRole from './components/RequireRole.js'

import {
  ADMIN,
  ALERT_ROLES,
  ASSIGNMENT_ROLES,
  DAMAGE_REPORT_ROLES,
  INSPECTION_ROLES,
  JOBSITE_ROLES,
  MAINTENANCE_ROLES
} from './constants/roles.js'

import Login from './pages/Login.js'
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
import Reports from './pages/Reports.js'
import AuditLog from './pages/AuditLog.js'

import Users from './pages/Users.js'
import RegisterUser from './pages/RegisterUser.js'
import UserDetails from './pages/UserDetails.js'
import EditUser from './pages/EditUser.js'

import Forbidden from './pages/Forbidden.js'
import NotFound from './pages/NotFound.js'

function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={<Login />}
      />

      <Route element={<RequireAuth />}>
        <Route element={<Layout />}>
          <Route
            path="/"
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/forbidden"
            element={<Forbidden />}
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
            element={
              <RequireRole
                allowedRoles={
                  JOBSITE_ROLES
                }
              />
            }
          >
            <Route
              path="/tools/new"
              element={<RegisterTool />}
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
          </Route>

          <Route
            element={
              <RequireRole
                allowedRoles={
                  ASSIGNMENT_ROLES
                }
              />
            }
          >
            <Route
              path="/assignments"
              element={<Assignments />}
            />
          </Route>

          <Route
            element={
              <RequireRole
                allowedRoles={
                  INSPECTION_ROLES
                }
              />
            }
          >
            <Route
              path="/inspections"
              element={<Inspections />}
            />
          </Route>

          <Route
            element={
              <RequireRole
                allowedRoles={
                  DAMAGE_REPORT_ROLES
                }
              />
            }
          >
            <Route
              path="/damage-reports"
              element={<DamageReports />}
            />
          </Route>

          <Route
            element={
              <RequireRole
                allowedRoles={
                  MAINTENANCE_ROLES
                }
              />
            }
          >
            <Route
              path="/maintenance"
              element={<Maintenance />}
            />
          </Route>

          <Route
            element={
              <RequireRole
                allowedRoles={
                  ALERT_ROLES
                }
              />
            }
          >
            <Route
              path="/alerts"
              element={<Alerts />}
            />

            <Route
              path="/reports"
              element={<Reports />}
            />
          </Route>

          <Route
            element={
              <RequireRole
                allowedRoles={[ADMIN]}
              />
            }
          >
            <Route
              path="/users"
              element={<Users />}
            />

            <Route
              path="/users/new"
              element={<RegisterUser />}
            />

            <Route
              path="/users/:id"
              element={<UserDetails />}
            />

            <Route
              path="/users/:id/edit"
              element={<EditUser />}
            />

            <Route
              path="/audit-log"
              element={<AuditLog />}
            />
          </Route>

          <Route
            path="*"
            element={<NotFound />}
          />
        </Route>
      </Route>
    </Routes>
  )
}

export default App