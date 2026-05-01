import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'

export default function Layout() {
  const { user, logout } = useAuth()

  return (
    <div className="app-shell">
      <header className="app-header">
        <NavLink to="/" className="brand" end>
          AllDay
        </NavLink>
        <nav className="app-nav">
          <NavLink to="/" end>
            Dashboard
          </NavLink>
          <NavLink to="/tasks">Tasks</NavLink>
          <NavLink to="/projects">Projects</NavLink>
        </nav>
        <div className="auth-chip">
          <span className="muted">Signed in as {user?.username}</span>
          <button type="button" className="btn" onClick={logout}>
            Log out
          </button>
        </div>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}
