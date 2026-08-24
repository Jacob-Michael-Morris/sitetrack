import express from 'express'
import cors from 'cors'
import toolsRouter from './routes/tools.routes.js'
import jobsitesRouter from './routes/jobsites.routes.js'
import assignmentsRouter from './routes/assignments.routes.js'
import inspectionsRouter from './routes/inspections.routes.js'
import damageReportsRouter from './routes/damage-reports.routes.js'
import workOrdersRouter from './routes/work-orders.routes.js'

const app = express()
const PORT = 3000

app.use(cors({
  origin: 'http://localhost:5173'
}))

app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'SiteTrack API is running'
  })
})

app.use('/api/tools', toolsRouter)
app.use('/api/jobsites', jobsitesRouter)
app.use('/api/assignments', assignmentsRouter)
app.use('/api/inspections', inspectionsRouter)
app.use('/api/damage-reports', damageReportsRouter)
app.use('/api/work-orders', workOrdersRouter)

app.listen(PORT, () => {
  console.log(`SiteTrack API running at http://localhost:${PORT}`)
})