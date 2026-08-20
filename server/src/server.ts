import express from 'express'
import cors from 'cors'
import toolsRouter from './routes/tools.routes.js'

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

app.listen(PORT, () => {
  console.log(`SiteTrack API running at http://localhost:${PORT}`)
})