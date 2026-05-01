import jwt from 'jsonwebtoken'

function getBearerToken(req) {
  const auth = req.headers.authorization
  if (!auth || typeof auth !== 'string') return ''
  const [scheme, token] = auth.split(' ')
  if (!scheme || !token) return ''
  if (scheme.toLowerCase() !== 'bearer') return ''
  return token
}

export function requireAuth(req, res, next) {
  try {
    const token = getBearerToken(req)
    if (!token) {
      const err = new Error('Unauthorized')
      err.status = 401
      throw err
    }
    const secret = process.env.JWT_SECRET
    if (!secret) {
      const err = new Error('Missing JWT_SECRET')
      err.status = 500
      throw err
    }
    const payload = jwt.verify(token, secret)
    req.user = {
      id: payload.sub,
      username: payload.username,
    }
    next()
  } catch {
    const err = new Error('Unauthorized')
    err.status = 401
    next(err)
  }
}

export function signAuthToken(user) {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    const err = new Error('Missing JWT_SECRET')
    err.status = 500
    throw err
  }
  return jwt.sign({ sub: String(user._id), username: user.username }, secret, {
    expiresIn: '7d',
  })
}
