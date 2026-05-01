import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import projectsRouter from './routes/projects.js'
import tasksRouter from './routes/tasks.js'
import statsRouter from './routes/stats.js'
import aiRouter from './routes/ai.js'
import authRouter from './routes/auth.js'
import { requireAuth } from './middleware/auth.js'
import { errorHandler } from './middleware/errorHandler.js'

const app = express()
const PORT = process.env.PORT || 3001
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173'

app.use(cors({ origin: corsOrigin, credentials: true }))
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ ok: true, mongo: mongoose.connection.readyState === 1 })
})

app.use('/api/auth', authRouter)
app.use('/api/projects', requireAuth, projectsRouter)
app.use('/api/tasks', requireAuth, tasksRouter)
app.use('/api/stats', requireAuth, statsRouter)
app.use('/api/ai', requireAuth, aiRouter)

app.use(errorHandler)

const uri = process.env.MONGODB_URI
if (!uri) {
  console.error('Missing MONGODB_URI')
  process.exit(1)
}

mongoose
  .connect(uri)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API http://localhost:${PORT}`)
    })
  })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
