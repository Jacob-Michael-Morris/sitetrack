import 'dotenv/config'

import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import toolsRouter from './jobsite-tool-operations/tools/tools.routes.js'
import jobsitesRouter from './jobsite-tool-operations/jobsites/jobsites.routes.js'
import assignmentsRouter from './jobsite-tool-operations/assignments/assignments.routes.js'
import inspectionsRouter from './inspection-maintenance/inspections/inspections.routes.js'
import damageReportsRouter from './inspection-maintenance/damage-reports/damage-reports.routes.js'
import workOrdersRouter from './inspection-maintenance/maintenance/work-orders.routes.js'
import alertsRouter from './alerts/alerts.routes.js'
import auditLogsRouter from './audit/audit-logs.routes.js'
import authRouter from './authentication-rbac/authentication/auth.routes.js'
import usersRouter from './authentication-rbac/users/users.routes.js'
import rolesRouter from './authentication-rbac/roles/roles.routes.js'
import dashboardRouter from './dashboard/dashboard.routes.js'
import reportsRouter from './reports/reports.routes.js'

const app = express()

const PORT = Number(process.env.PORT) || 3000

const CLIENT_URL =
  process.env.CLIENT_URL ||
  'http://localhost:5173'

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true
  })
)

app.use(express.json())
app.use(cookieParser())

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'SiteTrack API is running'
  })
})

app.use('/api/auth', authRouter)
app.use('/api/dashboard', dashboardRouter)
app.use('/api/tools', toolsRouter)
app.use('/api/jobsites', jobsitesRouter)
app.use('/api/assignments', assignmentsRouter)
app.use('/api/inspections', inspectionsRouter)
app.use('/api/damage-reports', damageReportsRouter)
app.use('/api/work-orders', workOrdersRouter)
app.use('/api/alerts', alertsRouter)
app.use('/api/audit-logs', auditLogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/roles', rolesRouter)
app.use('/api/reports', reportsRouter)

app.listen(PORT, '0.0.0.0', () => {
  console.log(
    `SiteTrack API running on port ${PORT}`
  )
})