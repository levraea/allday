**3-Person Casual Presentation Script (5--10 min)**

**Speaker 1 --- Luke (Intro + Frontend) (\~2--3 min)**

"Hey everyone, we're Team AllDay. I'm Luke, and with Amari and Felipe we
built a full-stack MERN productivity app called **AllDay**.

The core problem we focused on is that task apps are easy to start but
hard to keep organized. So our app combines projects, tasks, dashboard
insights, and an AI planning helper to make planning faster and clearer.

On the frontend, we built this in React with React Router.\
We have multiple routes:

- dashboard,

- task list,

- create/edit task pages,

- projects page,

- and project detail pages.

So this is not a single-page static screen --- it's a routed app with
different workflows.

For state management, we used React hooks
like useState and useEffect throughout the app. For example, dashboard
data and project/task lists are fetched and refreshed with hooks, and
forms are controlled with local state.

For backend communication, we use **Axios** through a shared API client
helper. That keeps our requests and error handling consistent across
pages.

UI-wise, we focused on a clean, simple layout that's easy to use. The
main goal was fast task/project operations without extra clutter.\
I'll now pass it to Amari to cover backend and database."

------------------------------------------------------------------------

**Speaker 2 --- Amari (Backend + Database) (\~2--3 min)**

"Thanks Luke. I'm Amari, and I'll cover the server and database side.

Our backend is built with Node and Express, and it's organized by route
modules. We have routes for:

- projects,

- tasks,

- stats,

- health checks,

- and AI planning.

Each route handles expected request/response behavior, and we added
input validation and error handling. For example, we validate required
fields, object IDs, and enum values like task priority and status. We
also use a centralized error middleware so API errors return clean JSON
responses.

For the database, we use MongoDB with Mongoose, and we defined at least
two core models:

- Project

- Task

Both models include schema rules and defaults.\
We also implemented full CRUD across both entities:

- create, read, update, delete for projects,

- and create, read, update, delete for tasks.

Plus, deleting a project cascades to its tasks, so data stays
consistent.

For testing/demo setup, we added a seed script. Running npm run
seed inserts sample projects and tasks so the app is immediately
testable.

So backend-wise, we have full Express + Mongo integration with
validation, error handling, and complete CRUD.\
Now Felipe will show integration and the AI planner feature."

------------------------------------------------------------------------

**Speaker 3 --- Felipe (Integration + Features + Close) (\~2--3 min)**

"Thanks Amari. I'm Felipe, and I'll wrap up with app functionality and
integration.

The full data flow is: **React UI -\> Axios -\> Express API -\> MongoDB
-\> back to UI**.\
You can see that in normal flows like creating tasks/projects and
immediately seeing updates on dashboard and list pages.

Our app has more than three distinct features:

1.  Full task management with status, priority, due dates, and
    filtering.

2.  Full project management with linked tasks.

3.  Dashboard stats and quick visibility for open, completed, overdue,
    and due-soon tasks.

4.  AI goal planner, where users type a goal and get a suggested project
    plus a set of actionable tasks.

That AI feature started as single-task parsing, but we improved it into
planning mode so it can break a high-level intent into a practical
project plan.

For setup/documentation, we included clear run instructions, environment
variable guidance, and API overview in the README. We also included a
seed flow so instructors can test quickly.

Overall, this project demonstrates the full MERN stack with complete
CRUD, end-to-end integration, and practical planning features for real
users.

Thanks for watching our demo."

------------------------------------------------------------------------

**Quick delivery tips (optional)**

- Keep each person near \~2.5 minutes.

- While speaking, click through the exact feature being described (don't
  just talk over one static screen).

- End with one fast recap sentence: "React + Axios frontend, Express +
  Mongo backend, full CRUD, and AI planner workflow."
