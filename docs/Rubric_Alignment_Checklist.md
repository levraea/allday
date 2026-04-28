**Rubric Alignment Checklist**

**Frontend -- React (60 pts)**

- **React Router across multiple pages**: Implemented
  in client/src/App.jsx using BrowserRouter, nested Routes, and route
  paths for dashboard, tasks, projects, and detail/form pages.

- **Axios for backend communication**: Implemented
  in client/src/api/client.js (centralized api() wrapper now uses
  Axios).

- **Clean/user-friendly interface**: Multi-page UI with dashboard
  summaries, task/project management flows, filters, forms, and AI
  planner interactions.

- **State/hooks usage**: Extensive useState/useEffect usage in pages
  like Dashboard, TasksPage, TaskFormPage, ProjectsPage,
  and ProjectDetailPage.

**Backend -- Node.js & Express (50 pts)**

- **Structured Express server**: Organized entrypoint and route modules
  in server/index.js + server/routes/\*.

- **Routes handle expected requests/responses**: Full endpoint coverage
  for tasks, projects, stats, health, and AI planning.

- **Error handling + input validation**: Route-level validation (IDs,
  required fields, enums) plus centralized error middleware
  in server/middleware/errorHandler.js.

- **MongoDB interaction**: Mongoose connection and model-driven CRUD in
  all resource routes.

**Database -- MongoDB/Mongoose (40 pts)**

- **At least 2 models with schema definitions**: Task and Project models
  in server/models/Task.js and server/models/Project.js.

- **Full CRUD implemented**: Create/read/update/delete for both tasks
  and projects in server/routes/tasks.js and server/routes/projects.js.

- **Seed/initial data support**: Added server/scripts/seed.js and npm
  run seed in server/package.json.

**Integration & Functionality (30 pts)**

- **End-to-end flow works (React ↔ Axios ↔ Express ↔ MongoDB)**: Client
  API wrapper calls server routes, routes use Mongoose models, and data
  is rendered across pages.

- **3+ distinct features / real-world use case**:

  - Task management (CRUD, priority/status/due date)

  - Project management (CRUD + task grouping)

  - Dashboard analytics (/api/stats)

  - AI goal planner (/api/ai/plan-goal) that generates project + tasks
    from intent

**Documentation & Submission Items (20 pts + process)**

- **Technical docs present**: README.md includes setup, API overview, AI
  config, and seeding command.

- **Still external/manual items** (not code-verified): video with all
  members speaking, slide deck, team roles + YouTube link, peer reviews,
  zip packaging without node_modules.
