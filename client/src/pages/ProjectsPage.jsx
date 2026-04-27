import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client.js'

export default function ProjectsPage() {
  const [projects, setProjects] = useState([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')

  const load = async () => {
    try {
      const p = await api('/api/projects')
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
        const p = await api('/api/projects')
        if (!cancelled) {
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
  }, [])

  const create = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await api('/api/projects', {
        method: 'POST',
        body: JSON.stringify({ name: name.trim(), description }),
      })
      setName('')
      setDescription('')
      await load()
    } catch (err) {
      setError(err.message)
    }
  }

  const remove = async (id) => {
    if (!confirm('Delete this project and all of its tasks?')) return
    try {
      await api(`/api/projects/${id}`, { method: 'DELETE' })
      await load()
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div className="page">
      <h1>Projects</h1>
      <p className="lede">Group tasks under projects. Deleting a project removes its tasks.</p>

      <form className="card form-stack" onSubmit={create}>
        <h2>New project</h2>
        <label className="field">
          <span>Name</span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Work"
          />
        </label>
        <label className="field">
          <span>Description</span>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        {error ? <p className="error-inline">{error}</p> : null}
        <button type="submit" className="btn primary">
          Create project
        </button>
      </form>

      <section className="card">
        <h2>All projects</h2>
        {projects.length === 0 ? (
          <p className="muted">No projects yet.</p>
        ) : (
          <ul className="project-list">
            {projects.map((p) => (
              <li key={p._id} className="project-row">
                <div>
                  <Link to={`/projects/${p._id}`}>{p.name}</Link>
                  {p.description ? <p className="muted small">{p.description}</p> : null}
                </div>
                <button type="button" className="link-btn danger" onClick={() => remove(p._id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
