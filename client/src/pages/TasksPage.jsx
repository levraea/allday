import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client.js'
import { formatDueDate } from '../utils/format.js'

export default function TasksPage() {
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [filters, setFilters] = useState({
    projectId: '',
    status: '',
    priority: '',
  })
  const [error, setError] = useState('')

  const query = useMemo(() => {
    const qs = new URLSearchParams()
    if (filters.projectId) qs.set('projectId', filters.projectId)
    if (filters.status) qs.set('status', filters.status)
    if (filters.priority) qs.set('priority', filters.priority)
    const s = qs.toString()
    return s ? `?${s}` : ''
  }, [filters.projectId, filters.status, filters.priority])

  const load = async () => {
    try {
      const [t, p] = await Promise.all([
        api(`/api/tasks${query}`),
        api('/api/projects'),
      ])
      setTasks(t)
      setProjects(p)
      setError('')
    } catch (e) {
      setError(e.message)
    }
  }

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const [t, p] = await Promise.all([
          api(`/api/tasks${query}`),
          api('/api/projects'),
        ])
        if (!cancelled) {
          setTasks(t)
          setProjects(p)
          setError('')
        }
      } catch (e) {
        if (!cancelled) setError(e.message)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [query])

  const remove = async (id) => {
    if (!confirm('Delete this task?')) return
    try {
      await api(`/api/tasks/${id}`, { method: 'DELETE' })
      await load()
    } catch (e) {
      setError(e.message)
    }
  }

  const toggleComplete = async (task) => {
    const next = task.status === 'completed' ? 'open' : 'completed'
    try {
      await api(`/api/tasks/${task._id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: next }),
      })
      await load()
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div className="page">
      <div className="page-head">
        <h1>Tasks</h1>
        <Link className="btn primary" to="/tasks/new">
          New task
        </Link>
      </div>

      <div className="filters card">
        <label>
          Project
          <select
            value={filters.projectId}
            onChange={(e) => setFilters((f) => ({ ...f, projectId: e.target.value }))}
          >
            <option value="">All</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Status
          <select
            value={filters.status}
            onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
          >
            <option value="">All</option>
            <option value="open">Open</option>
            <option value="completed">Completed</option>
          </select>
        </label>
        <label>
          Priority
          <select
            value={filters.priority}
            onChange={(e) => setFilters((f) => ({ ...f, priority: e.target.value }))}
          >
            <option value="">All</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </label>
      </div>

      {error ? <p className="error-inline">{error}</p> : null}

      <div className="table-wrap card">
        <table className="data-table">
          <thead>
            <tr>
              <th></th>
              <th>Title</th>
              <th>Project</th>
              <th>Priority</th>
              <th>Due</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan={7} className="muted">
                  No tasks match these filters.
                </td>
              </tr>
            ) : (
              tasks.map((t) => (
                <tr key={t._id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={t.status === 'completed'}
                      onChange={() => toggleComplete(t)}
                      aria-label={t.status === 'completed' ? 'Mark open' : 'Mark complete'}
                    />
                  </td>
                  <td>
                    <Link to={`/tasks/${t._id}`}>{t.title}</Link>
                  </td>
                  <td>{t.projectId?.name || '—'}</td>
                  <td>
                    <span className={`pill p-${t.priority}`}>{t.priority}</span>
                  </td>
                  <td>{formatDueDate(t.dueDate)}</td>
                  <td>{t.status}</td>
                  <td className="actions">
                    <Link className="link-btn" to={`/tasks/${t._id}`}>
                      Edit
                    </Link>
                    <button type="button" className="link-btn danger" onClick={() => remove(t._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
