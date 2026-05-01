import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const target = location.state?.from?.pathname || '/'

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(username.trim().toLowerCase(), password)
      navigate(target, { replace: true })
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page narrow">
      <h1>Log in</h1>
      <form className="card form-stack" onSubmit={submit}>
        <label className="field">
          <span>Username</span>
          <input
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
        </label>
        <label className="field">
          <span>Password</span>
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </label>
        {error ? <p className="error-inline">{error}</p> : null}
        <div className="row auth-actions">
          <button type="submit" className="btn primary" disabled={loading}>
            {loading ? 'Logging in…' : 'Log in'}
          </button>
          <Link to="/signup">Create account</Link>
        </div>
      </form>
    </div>
  )
}
