import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'

export default function SignupPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signup } = useAuth()
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      await signup(username.trim().toLowerCase(), password)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page narrow">
      <h1>Create account</h1>
      <form className="card form-stack" onSubmit={submit}>
        <label className="field">
          <span>Username</span>
          <input
            required
            minLength={3}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
        </label>
        <label className="field">
          <span>Password</span>
          <input
            required
            minLength={8}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
        </label>
        <label className="field">
          <span>Confirm password</span>
          <input
            required
            minLength={8}
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
          />
        </label>
        {error ? <p className="error-inline">{error}</p> : null}
        <div className="row auth-actions">
          <button type="submit" className="btn primary" disabled={loading}>
            {loading ? 'Creating…' : 'Sign up'}
          </button>
          <Link to="/login">Already have an account?</Link>
        </div>
      </form>
    </div>
  )
}
