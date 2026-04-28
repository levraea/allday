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
      const result = await api('/api/ai/plan-goal', {
        method: 'POST',
        body: JSON.stringify({ text: aiText }),
      })
      setParsed(result)
    } catch (e) {
      setAiError(e.message || 'Planning failed')
    } finally {
      setAiLoading(false)
    }
  }

  const createFromParsed = async () => {
    if (!parsed) return
    setAiError('')
    try {
      let pid = projectIdForAi || null
      if (!pid) {
        const match = projects.find(
          (x) => x.name.toLowerCase() === String(parsed.projectName).toLowerCase()
        )
        if (match) {
          pid = match._id
        } else {
          const createdProject = await api('/api/projects', {
            method: 'POST',
            body: JSON.stringify({
              name: parsed.projectName,
              description: parsed.projectDescription || '',
            }),
          })
          pid = createdProject._id
        }
      }

      await Promise.all(
        parsed.tasks.map((task) =>
          api('/api/tasks', {
            method: 'POST',
            body: JSON.stringify({
              title: task.title,
              description: task.description || '',
              priority: task.priority || 'medium',
              dueDate: task.dueDate || null,
              projectId: pid,
            }),
          })
        )
      )

      setProjectIdForAi('')
      setAiText('')
      setParsed(null)
      await load()
    } catch (e) {
      setAiError(e.message || 'Could not create plan')
    }
  }

  const hasValidGoal = aiText.trim().length > 0

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
      <p className="lede">Overview of your tasks and quick AI planning.</p>

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
        <h2>AI goal planner</h2>
        <p className="muted">
          Describe a goal in plain language. AI generates a project and a task plan you
          can review before saving. Requires <code>GEMINI_API_KEY</code> on the server
          (default). Use <code>AI_PROVIDER=openai</code> and{' '}
          <code>OPENAI_API_KEY</code> for OpenAI instead.
        </p>
        <label className="field">
          <span>Save into existing project (optional)</span>
          <select
            value={projectIdForAi}
            onChange={(e) => setProjectIdForAi(e.target.value)}
          >
            <option value="">Create or match by AI project name</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Goal or intent</span>
          <textarea
            rows={4}
            value={aiText}
            onChange={(e) => setAiText(e.target.value)}
            placeholder="e.g. Prepare for my final exam in 3 weeks and keep stress low"
          />
        </label>
        <div className="row">
          <button
            type="button"
            className="btn"
            onClick={runParse}
            disabled={aiLoading || !hasValidGoal}
          >
            {aiLoading ? 'Planning…' : 'Plan with AI'}
          </button>
        </div>
        {aiError ? <p className="error-inline">{aiError}</p> : null}
        {parsed ? (
          <div className="parsed-preview">
            <h3>Plan preview</h3>
            <dl className="kv">
              <dt>Project</dt>
              <dd>{parsed.projectName}</dd>
              <dt>Description</dt>
              <dd>{parsed.projectDescription || '—'}</dd>
              <dt>Tasks</dt>
              <dd>{parsed.tasks?.length || 0}</dd>
            </dl>
            <ul className="mini-list">
              {parsed.tasks.map((task, idx) => (
                <li key={`${task.title}-${idx}`}>
                  <strong>{task.title}</strong>
                  <span className="muted">
                    {' '}
                    · {task.priority}
                    {task.dueDate ? ` · due ${formatDueDate(task.dueDate)}` : ''}
                  </span>
                  {task.description ? <div className="muted">{task.description}</div> : null}
                </li>
              ))}
            </ul>
            <button type="button" className="btn primary" onClick={createFromParsed}>
              Save project and tasks
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
