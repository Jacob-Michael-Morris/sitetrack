import {
  Navigate,
  Route,
  Routes
} from 'react-router'

import Layout from './session-navigation/components/Layout.js'
import RequireAuth from './session-navigation/components/RequireAuth.js'
import RequirePermission from './session-navigation/components/RequirePermission.js'

import { useAuth } from './session-navigation/context/useAuth.js'

import Login from './session-navigation/auth/Login.js'
import Dashboard from './administration/dashboard/DashboardPage.js'

import Tools from './jobsite-tool-operations/tools/Tools.js'
import ToolDetails from './jobsite-tool-operations/tools/ToolDetails.js'
import RegisterTool from './jobsite-tool-operations/tools/RegisterTool.js'
import EditTool from './jobsite-tool-operations/tools/EditTool.js'

import Jobsites from './jobsite-tool-operations/jobsites/Jobsites.js'
import JobsiteDetails from './jobsite-tool-operations/jobsites/JobsiteDetails.js'
import RegisterJobsite from './jobsite-tool-operations/jobsites/RegisterJobsite.js'
import EditJobsite from './jobsite-tool-operations/jobsites/EditJobsite.js'

import Assignments from './jobsite-tool-operations/assignments/Assignments.js'

import Inspections from './inspection-maintenance/inspections/Inspections.js'
import DamageReports from './inspection-maintenance/damage-reports/DamageReports.js'
import Maintenance from './inspection-maintenance/maintenance/Maintenance.js'

import Alerts from './alerts/Alerts.js'

import Reports from './administration/reports/Reports.js'

import AuditLog from './audit/AuditLogPage.js'

import Users from './administration/users/Users.js'
import RegisterUser from './administration/users/RegisterUser.js'
import UserDetails from './administration/users/UserDetails.js'
import EditUser from './administration/users/EditUser.js'

import ManageRoles from './administration/roles/ManageRoles.js'

import Forbidden from './session-navigation/pages/Forbidden.js'
import NotFound from './session-navigation/pages/NotFound.js'

function DefaultRoute() {
  const {
    hasPermission
  } = useAuth()

  const destinations = [
    {
      permission:
        'dashboard.view',
      path:
        '/dashboard'
    },
    {
      permission:
        'tools.view',
      path:
        '/tools'
    },
    {
      permission:
        'jobsites.view',
      path:
        '/jobsites'
    },
    {
      permission:
        'assignments.view',
      path:
        '/assignments'
    },
    {
      permission:
        'inspections.view',
      path:
        '/inspections'
    },
    {
      permission:
        'damage_reports.view',
      path:
        '/damage-reports'
    },
    {
      permission:
        'maintenance.view',
      path:
        '/maintenance'
    },
    {
      permission:
        'alerts.view',
      path:
        '/alerts'
    },
    {
      permission:
        'reports.view',
      path:
        '/reports'
    },
    {
      permission:
        'users.view',
      path:
        '/users'
    },
    {
      permission:
        'roles.manage',
      path:
        '/roles/manage'
    },
    {
      permission:
        'audit.view',
      path:
        '/audit-log'
    }
  ]

  const destination =
    destinations.find(
      (item) =>
        hasPermission(
          item.permission
        )
    )

  return (
    <Navigate
      to={
        destination?.path ??
        '/forbidden'
      }
      replace
    />
  )
}

function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        element={<RequireAuth />}
      >
        <Route
          element={<Layout />}
        >
          <Route
            path="/"
            element={<DefaultRoute />}
          />

          <Route
            path="/forbidden"
            element={<Forbidden />}
          />

          <Route
            element={
              <RequirePermission
                permission="dashboard.view"
              />
            }
          >
            <Route
              path="/dashboard"
              element={<Dashboard />}
            />
          </Route>

          <Route
            element={
              <RequirePermission
                permission="tools.view"
              />
            }
          >
            <Route
              path="/tools"
              element={<Tools />}
            />

            <Route
              path="/tools/:id"
              element={<ToolDetails />}
            />
          </Route>

          <Route
            element={
              <RequirePermission
                permission="tools.create"
              />
            }
          >
            <Route
              path="/tools/new"
              element={<RegisterTool />}
            />
          </Route>

          <Route
            element={
              <RequirePermission
                permission="tools.edit"
              />
            }
          >
            <Route
              path="/tools/:id/edit"
              element={<EditTool />}
            />
          </Route>

          <Route
            element={
              <RequirePermission
                permission="jobsites.view"
              />
            }
          >
            <Route
              path="/jobsites"
              element={<Jobsites />}
            />

            <Route
              path="/jobsites/:id"
              element={<JobsiteDetails />}
            />
          </Route>

          <Route
            element={
              <RequirePermission
                permission="jobsites.create"
              />
            }
          >
            <Route
              path="/jobsites/new"
              element={<RegisterJobsite />}
            />
          </Route>

          <Route
            element={
              <RequirePermission
                permission="jobsites.edit"
              />
            }
          >
            <Route
              path="/jobsites/:id/edit"
              element={<EditJobsite />}
            />
          </Route>

          <Route
            element={
              <RequirePermission
                permission="assignments.view"
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
              <RequirePermission
                permission="inspections.view"
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
              <RequirePermission
                permission="damage_reports.view"
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
              <RequirePermission
                permission="maintenance.view"
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
              <RequirePermission
                permission="alerts.view"
              />
            }
          >
            <Route
              path="/alerts"
              element={<Alerts />}
            />
          </Route>

          <Route
            element={
              <RequirePermission
                permission="reports.view"
              />
            }
          >
            <Route
              path="/reports"
              element={<Reports />}
            />
          </Route>

          <Route
            element={
              <RequirePermission
                permission="users.view"
              />
            }
          >
            <Route
              path="/users"
              element={<Users />}
            />

            <Route
              path="/users/:id"
              element={<UserDetails />}
            />
          </Route>

          <Route
            element={
              <RequirePermission
                permission="users.create"
              />
            }
          >
            <Route
              path="/users/new"
              element={<RegisterUser />}
            />
          </Route>

          <Route
            element={
              <RequirePermission
                permission="users.edit"
              />
            }
          >
            <Route
              path="/users/:id/edit"
              element={<EditUser />}
            />
          </Route>

          <Route
            element={
              <RequirePermission
                permission="roles.manage"
              />
            }
          >
            <Route
              path="/roles/manage"
              element={<ManageRoles />}
            />
          </Route>

          <Route
            element={
              <RequirePermission
                permission="audit.view"
              />
            }
          >
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