import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api/client.js'
import { formatDueDate } from '../utils/format.js'

export default function ProjectDetailPage() {
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')

  const load = async () => {
    try {
      const [p, t] = await Promise.all([
        api(`/api/projects/${id}`),
        api(`/api/tasks?projectId=${id}`),
      ])
      setProject(p)
      setName(p.name)
      setDescription(p.description || '')
      setTasks(t)
      setError('')
    } catch (e) {
      setError(e.message)
    }
  }

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const [p, t] = await Promise.all([
          api(`/api/projects/${id}`),
          api(`/api/tasks?projectId=${id}`),
        ])
        if (!cancelled) {
          setProject(p)
          setName(p.name)
          setDescription(p.description || '')
          setTasks(t)
          setError('')
        }
      } catch (e) {
        if (!cancelled) setError(e.message)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [id])

  const saveProject = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await api(`/api/projects/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ name: name.trim(), description }),
      })
      await load()
    } catch (err) {
      setError(err.message)
    }
  }

  if (!project && !error) {
    return (
      <div className="page">
        <p className="muted">Loading…</p>
      </div>
    )
  }

  if (error && !project) {
    return (
      <div className="page">
        <p className="error-inline">{error}</p>
        <Link to="/projects">Back to projects</Link>
      </div>
    )
  }

  return (
    <div className="page">
      <p>
        <Link to="/projects">← Projects</Link>
      </p>
      <h1>{project.name}</h1>

      <form className="card form-stack" onSubmit={saveProject}>
        <h2>Edit project</h2>
        <label className="field">
          <span>Name</span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label className="field">
          <span>Description</span>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        {error ? <p className="error-inline">{error}</p> : null}
        <button type="submit" className="btn primary">
          Save changes
        </button>
      </form>

      <section className="card">
        <div className="page-head">
          <h2>Tasks in this project</h2>
          <Link className="btn primary" to={`/tasks/new?projectId=${id}`}>
            New task
          </Link>
        </div>
        {tasks.length === 0 ? (
          <p className="muted">No tasks in this project.</p>
        ) : (
          <ul className="mini-list">
            {tasks.map((t) => (
              <li key={t._id}>
                <Link to={`/tasks/${t._id}`}>{t.title}</Link>
                <span className="muted">
                  {' '}
                  · {t.priority} · due {formatDueDate(t.dueDate)} · {t.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
