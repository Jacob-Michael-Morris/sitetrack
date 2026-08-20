import express from 'express'

const app = express()
const PORT = 3000

app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'SiteTrack API is running'
  })
})

app.listen(PORT, () => {
  console.log(`SiteTrack API running at http://localhost:${PORT}`)
})