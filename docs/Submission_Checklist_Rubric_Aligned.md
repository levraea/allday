**Submission Checklist (Rubric-Mapped)**

**1) Frontend -- React (60 pts)**

-  **Routing:** Demo navigation
  across /, /tasks, /tasks/new, /tasks/:id, /projects, /projects/:id.

-  **Axios usage:** Mention that all API requests go
  through client/src/api/client.js (Axios wrapper).

-  **UI/UX:** Show clean layout, form validation/error messages,
  filters, and readable task/project views.

-  **Hooks/state:** In presentation, point to examples
  using useState/useEffect (Dashboard, TasksPage, TaskFormPage, etc.).

**2) Backend -- Node.js & Express (50 pts)**

-  **Server runs cleanly:** Start server with npm run dev and show no
  startup errors.

-  **Routes coverage:** Demo CRUD for /api/tasks and /api/projects,
  plus /api/stats, /api/health, /api/ai/plan-goal.

-  **Validation/error handling:** Show one invalid request case (e.g.,
  bad projectId) returning proper error.

-  **Mongo integration:** Confirm data persists in Mongo and appears in
  UI after refresh.

**3) Database -- MongoDB + Mongoose (40 pts)**

-  **Two models:** Show Task and Project schemas.

-  **Full CRUD:** Create/read/update/delete both tasks and projects from
  UI.

-  **Seed data:** Run cd server && npm run seed, then refresh UI to show
  sample data loaded.

**4) Integration & Functionality (30 pts)**

-  **End-to-end flow:** Demonstrate UI action -\> API call -\> Mongo
  update -\> UI refresh.

-  **3+ distinct features:** Highlight:

  - Tasks management

  - Projects management

  - Dashboard stats

  - AI goal planner (/api/ai/plan-goal)

**5) Documentation & Video Presentation (20 pts)**

-  **Video (5--10 min):** Include walkthrough + stack explanation + how
  each rubric item is met.

-  **All members speak:** Ensure each teammate has a speaking segment.

-  **Slide deck included:** Reference slides during recording and
  include file in submission zip.

-  **README completeness:** Ensure README includes setup, run steps, env
  notes, API overview, seed command.

**6) Peer Review (50 pts individual)**

-  Every team member submits confidential peer review.

-  Nobody skips (missing submission = automatic zero for that section).

**Bonus (up to 10)**

-  Optional deployment (Render/Vercel/etc.) if you want extra credit.

------------------------------------------------------------------------

**Final Packaging Checklist (avoid deductions)**

-  Remove both client/node_modules and server/node_modules

-  Zip project folder + slide deck

-  Include YouTube link + team names/roles (README or separate text
  file)

-  One team member submits zip; each member submits peer review
  separately

If you want, I can draft a **2--3 minute speaking script per
teammate** so your presentation cleanly covers every rubric point.
