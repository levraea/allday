import { Router } from 'express'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import { requireAuth, signAuthToken } from '../middleware/auth.js'

const router = Router()

function sanitizeUser(user) {
  return {
    id: String(user._id),
    username: user.username,
  }
}

router.post('/signup', async (req, res, next) => {
  try {
    const username = String(req.body?.username || '')
      .trim()
      .toLowerCase()
    const password = String(req.body?.password || '')

    if (username.length < 3) {
      const err = new Error('username must be at least 3 characters')
      err.status = 400
      throw err
    }
    if (password.length < 8) {
      const err = new Error('password must be at least 8 characters')
      err.status = 400
      throw err
    }

    const existing = await User.findOne({ username })
    if (existing) {
      const err = new Error('username already exists')
      err.status = 409
      throw err
    }

    const passwordHash = await bcrypt.hash(password, 12)
    const user = await User.create({ username, passwordHash })
    const token = signAuthToken(user)
    res.status(201).json({ user: sanitizeUser(user), token })
  } catch (e) {
    next(e)
  }
})

router.post('/login', async (req, res, next) => {
  try {
    const username = String(req.body?.username || '')
      .trim()
      .toLowerCase()
    const password = String(req.body?.password || '')
    if (!username || !password) {
      const err = new Error('username and password are required')
      err.status = 400
      throw err
    }
    const user = await User.findOne({ username })
    const ok = user ? await bcrypt.compare(password, user.passwordHash) : false
    if (!ok || !user) {
      const err = new Error('invalid credentials')
      err.status = 401
      throw err
    }
    const token = signAuthToken(user)
    res.json({ user: sanitizeUser(user), token })
  } catch (e) {
    next(e)
  }
})

router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) {
      const err = new Error('Unauthorized')
      err.status = 401
      throw err
    }
    res.json({ user: sanitizeUser(user) })
  } catch (e) {
    next(e)
  }
})

export default router
