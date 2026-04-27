import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { api } from '../api/client.js'

const empty = {
  title: '',
  description: '',
  priority: 'medium',
  dueDate: '',
  status: 'open',
  projectId: '',
}

function toInputDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toISOString().slice(0, 10)
}

export default function TaskFormPage() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const isNew = !id
  const projectIdFromUrl = searchParams.get('projectId') || ''
  const [projects, setProjects] = useState([])
  const [form, setForm] = useState(empty)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(!isNew)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const p = await api('/api/projects')
        if (cancelled) return
        setProjects(p)
        if (isNew) {
          if (projectIdFromUrl) {
            setForm((f) => ({ ...f, projectId: projectIdFromUrl }))
          }
          setLoading(false)
          return
        }
        const t = await api(`/api/tasks/${id}`)
        if (cancelled) return
        setForm({
          title: t.title,
          description: t.description || '',
          priority: t.priority,
          dueDate: toInputDate(t.dueDate),
          status: t.status,
          projectId: t.projectId?._id || '',
        })
      } catch (e) {
        if (!cancelled) setError(e.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [id, isNew, projectIdFromUrl])

  const save = async (e) => {
    e.preventDefault()
    setError('')
    const payload = {
      title: form.title.trim(),
      description: form.description,
      priority: form.priority,
      dueDate: form.dueDate || null,
      status: form.status,
      projectId: form.projectId || null,
    }
    try {
      if (isNew) {
        await api('/api/tasks', { method: 'POST', body: JSON.stringify(payload) })
      } else {
        await api(`/api/tasks/${id}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        })
      }
      navigate('/tasks')
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) {
    return (
      <div className="page">
        <p className="muted">Loading…</p>
      </div>
    )
  }

  return (
    <div className="page narrow">
      <h1>{isNew ? 'New task' : 'Edit task'}</h1>
      <form className="card form-stack" onSubmit={save}>
        <label className="field">
          <span>Title</span>
          <input
            required
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          />
        </label>
        <label className="field">
          <span>Description</span>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
        </label>
        <label className="field">
          <span>Project</span>
          <select
            value={form.projectId}
            onChange={(e) => setForm((f) => ({ ...f, projectId: e.target.value }))}
          >
            <option value="">None</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
        <div className="row-2">
          <label className="field">
            <span>Priority</span>
            <select
              value={form.priority}
              onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))}
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </label>
          <label className="field">
            <span>Due date</span>
            <input
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
            />
          </label>
        </div>
        <label className="field">
          <span>Status</span>
          <select
            value={form.status}
            onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
          >
            <option value="open">Open</option>
            <option value="completed">Completed</option>
          </select>
        </label>
        {error ? <p className="error-inline">{error}</p> : null}
        <div className="row">
          <button type="submit" className="btn primary">
            Save
          </button>
          <Link className="btn" to="/tasks">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
