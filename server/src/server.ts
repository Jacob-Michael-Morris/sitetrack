import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import toolsRouter from './routes/tools.routes.js'
import jobsitesRouter from './routes/jobsites.routes.js'
import assignmentsRouter from './routes/assignments.routes.js'
import inspectionsRouter from './routes/inspections.routes.js'
import damageReportsRouter from './routes/damage-reports.routes.js'
import workOrdersRouter from './routes/work-orders.routes.js'
import alertsRouter from './routes/alerts.routes.js'
import auditLogsRouter from './routes/audit-logs.routes.js'
import authRouter from './routes/auth.routes.js'
import usersRouter from './routes/users.routes.js'
import rolesRouter from './routes/roles.routes.js'
import dashboardRouter from './routes/dashboard.routes.js'
import reportsRouter from './routes/reports.routes.js'

const app = express()
const PORT = 3000

app.use(
  cors({
    origin: 'http://localhost:5173',
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

app.listen(PORT, () => {
  console.log(
    `SiteTrack API running at http://localhost:${PORT}`
  )
})