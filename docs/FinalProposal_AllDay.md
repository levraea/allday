**MERN Stack Final Project Proposal\
AllDay -- AI-Assisted Personal Task Management**

## 1. Project Title and Description

**Project Title:**

AllDay -- AI-Assisted Personal Task Management

**Description:**

AllDay is a web-based application designed to help individuals manage
their daily tasks and stay organized. It acts like a personal assistant
that keeps track of what needs to be done, helps prioritize work, and
makes it easier to stay focused throughout the day.\
\
The application includes an AI-assisted feature that allows users to
enter tasks using natural language. Instead of filling out multiple
fields, users can describe what they need to do, and the system will
generate the task details automatically.

**Problem / Use Case:**

Many people rely on a mix of notes, reminders, and memory to manage
their responsibilities. This often leads to missed tasks, unclear
priorities, and disorganized work. AllDay provides a single place to
manage tasks so users can stay organized and keep track of what matters.

## 2. Planned Features

**Task Management**

- Create, edit, and delete tasks

- Assign priority levels (High, Medium, Low)

- Set due dates

- Mark tasks as complete

**Project Organization**

- Create and manage multiple projects

- Assign tasks to projects

- View tasks grouped by project

**Dashboard Overview**

- View all tasks in one place

- See summary metrics (open, completed, overdue tasks)

- Identify high-priority and upcoming work

**\**

**AI-Assisted Task Creation**

- Enter tasks using natural language

- Automatically generate structured task fields

- Reduce manual data entry

**Calendar View (Optional)**

- View tasks by due date

- Track upcoming deadlines visually

## 3. Technical Implementation Plan

**Frontend (React)**

The frontend will be built using React and will handle all user
interface rendering and interactions. Key components include a dashboard
view, task management forms, project pages, and navigation elements.
React state management will allow the UI to update dynamically as users
interact with the system.

*Pages*

- Dashboard page

- Task form

- Project page

- Navigation/sidebar

**Backend (Node.js / Express)**

The backend will be built using Node.js and Express and will handle
business logic and communication between the frontend and database. API
routes will support CRUD operations for tasks and projects, as well as
an AI endpoint for task parsing.

*Routes*

- /tasks CRUD routes

- /projects CRUD routes

- /ai/plan-goal route

**\**

**Database (MongoDB)**

MongoDB will store application data using collections for tasks and
projects. Tasks will include fields such as title, description,
priority, due date, status, and project reference. Projects will include
a name and description.

*Collections*

- Tasks collection

- Projects collection

**AI Integration**

AllDay will integrate a lightweight language model (such as GPT-4o mini
or Gemini Flash) through an API. The backend will send user input to the
model and receive structured JSON output, which will be used to create
tasks automatically.

**CRUD Operations**

- Create: Add new tasks and projects

- Read: Retrieve and display data

- Update: Modify task details and status

- Delete: Remove tasks and projects

## 4. Team Member Roles

**Frontend Developer**

Responsible for building the user interface using React, including
dashboards, forms, and navigation components.

**Backend Developer**

Responsible for implementing API routes, handling business logic, and
managing server-side functionality.

**Database Developer**

Responsible for designing database schemas, managing MongoDB
collections, and ensuring efficient data storage and retrieval.

**Integration & AI Developer**

Responsible for connecting frontend and backend systems, implementing
AI-assisted features, testing workflows, and supporting documentation.

## 5. Timeline & Milestones

**Week 1: Planning & Setup**

- Finalize project scope and features

- Set up development environment

- Design database schema

**Week 2: Core Development**

- Build backend API routes

- Develop frontend components

- Implement CRUD functionality

**Week 3: Integration & Testing**

- Connect frontend and backend

- Implement AI feature

- Test and debug application

**Final Days**

- Finalize UI and polish features

- Prepare presentation and demo

- Submit project
