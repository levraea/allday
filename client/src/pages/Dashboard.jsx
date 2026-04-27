import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client.js'
import { formatDueDate } from '../utils/format.js'

function TaskMiniList({ title, tasks }) {
  if (!tasks?.length) {
    return (
      <section className="card">
        <h2>{title}</h2>
        <p className="muted">None right now.</p>
      </section>
    )
  }
  return (
    <section className="card">
      <h2>{title}</h2>
      <ul className="mini-list">
        {tasks.map((t) => (
          <li key={t._id}>
            <Link to={`/tasks/${t._id}`}>{t.title}</Link>
            <span className="muted">
              {' '}
              · due {formatDueDate(t.dueDate)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [projects, setProjects] = useState([])
  const [aiText, setAiText] = useState('')
  const [parsed, setParsed] = useState(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState('')
  const [projectIdForAi, setProjectIdForAi] = useState('')

  const load = async () => {
    const [s, p] = await Promise.all([api('/api/stats'), api('/api/projects')])
    setStats(s)
    setProjects(p)
  }

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const [s, p] = await Promise.all([api('/api/stats'), api('/api/projects')])
        if (!cancelled) {
          setStats(s)
          setProjects(p)
        }
      } catch {
        if (!cancelled) setStats(null)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const runParse = async () => {
    setAiError('')
    setParsed(null)
    setAiLoading(true)
    try {
      const body = {
        text: aiText,
        defaultProjectId: projectIdForAi || undefined,
      }
      const result = await api('/api/ai/parse-task', {
        method: 'POST',
        body: JSON.stringify(body),
      })
      setParsed(result)
    } catch (e) {
      setAiError(e.message || 'Parse failed')
    } finally {
      setAiLoading(false)
    }
  }

  const createFromParsed = async () => {
    if (!parsed) return
    setAiError('')
    try {
      let pid = parsed.defaultProjectId || projectIdForAi || null
      if (!pid && parsed.suggestedProjectName) {
        const match = projects.find(
          (x) =>
            x.name.toLowerCase() === String(parsed.suggestedProjectName).toLowerCase()
        )
        if (match) pid = match._id
      }
      await api('/api/tasks', {
        method: 'POST',
        body: JSON.stringify({
          title: parsed.title,
          description: parsed.description,
          priority: parsed.priority,
          dueDate: parsed.dueDate || null,
          projectId: pid,
        }),
      })
      setAiText('')
      setParsed(null)
      await load()
    } catch (e) {
      setAiError(e.message || 'Could not create task')
    }
  }

  if (!stats) {
    return (
      <div className="page">
        <h1>Dashboard</h1>
        <p className="error-banner">
          Could not load stats. Is the API running and <code>MONGODB_URI</code> set?
        </p>
      </div>
    )
  }

  return (
    <div className="page">
      <h1>Dashboard</h1>
      <p className="lede">Overview of your tasks and quick AI capture.</p>

      <div className="stat-grid">
        <div className="stat-card">
          <span className="stat-value">{stats.counts.open}</span>
          <span className="stat-label">Open</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.counts.completed}</span>
          <span className="stat-label">Completed</span>
        </div>
        <div className="stat-card warn">
          <span className="stat-value">{stats.counts.overdue}</span>
          <span className="stat-label">Overdue</span>
        </div>
      </div>

      <div className="grid-2">
        <TaskMiniList title="High priority (open)" tasks={stats.highPriorityOpen} />
        <TaskMiniList title="Due in the next 7 days" tasks={stats.dueSoonTasks} />
      </div>
      <TaskMiniList title="Overdue" tasks={stats.overdueTasks} />

      <section className="card ai-card">
        <h2>AI-assisted task</h2>
        <p className="muted">
          Describe what you need to do in plain language. Parse, review, then save.
          Requires <code>GEMINI_API_KEY</code> on the server (default). Use{' '}
          <code>AI_PROVIDER=openai</code> and <code>OPENAI_API_KEY</code> for OpenAI instead.
        </p>
        <label className="field">
          <span>Default project (optional)</span>
          <select
            value={projectIdForAi}
            onChange={(e) => setProjectIdForAi(e.target.value)}
          >
            <option value="">No project</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Natural language</span>
          <textarea
            rows={4}
            value={aiText}
            onChange={(e) => setAiText(e.target.value)}
            placeholder="e.g. Call dentist tomorrow high priority"
          />
        </label>
        <div className="row">
          <button type="button" className="btn" onClick={runParse} disabled={aiLoading}>
            {aiLoading ? 'Parsing…' : 'Parse with AI'}
          </button>
        </div>
        {aiError ? <p className="error-inline">{aiError}</p> : null}
        {parsed ? (
          <div className="parsed-preview">
            <h3>Preview</h3>
            <dl className="kv">
              <dt>Title</dt>
              <dd>{parsed.title}</dd>
              <dt>Description</dt>
              <dd>{parsed.description || '—'}</dd>
              <dt>Priority</dt>
              <dd>{parsed.priority}</dd>
              <dt>Due</dt>
              <dd>{parsed.dueDate || '—'}</dd>
              {parsed.suggestedProjectName ? (
                <>
                  <dt>Suggested project</dt>
                  <dd>{parsed.suggestedProjectName}</dd>
                </>
              ) : null}
            </dl>
            <button type="button" className="btn primary" onClick={createFromParsed}>
              Save task
            </button>
          </div>
        ) : null}
      </section>

      <p className="actions-row">
        <Link className="btn primary" to="/tasks/new">
          New task
        </Link>
        <Link className="btn" to="/tasks">
          All tasks
        </Link>
      </p>
    </div>
  )
}
