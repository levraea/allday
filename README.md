# AllDay

AI-assisted personal task management (MERN coursework stack): **Vite + React** client, **Express + MongoDB** API, optional **Google Gemini** (default) or **OpenAI** parsing for natural-language tasks.

## Prerequisites

- Node.js 18+ (uses `node --watch` for the API in dev)
- MongoDB reachable via `MONGODB_URI`
- Optional: **Gemini** (`GEMINI_API_KEY` from [Google AI Studio](https://aistudio.google.com/apikey)), or set `AI_PROVIDER=openai` and use `OPENAI_API_KEY` for `POST /api/ai/parse-task`

## Setup

### 1. API (`server/`)

```bash
cd server
cp .env.example .env
# Edit .env — set MONGODB_URI (and GEMINI_API_KEY if you use AI; default provider is Gemini)
npm install
npm run dev
```

API defaults to **http://localhost:3001**. Health check: `GET /api/health`.

### 2. Client (`client/`)

In development, Vite proxies `/api` to the server (see `client/vite.config.js`).

```bash
cd client
cp .env.example .env   # optional; leave VITE_API_URL empty for proxy
npm install
npm run dev
```

Open **http://localhost:5173**.

For `npm run preview` or a deployed static build, set `VITE_API_URL` to your API origin (no trailing slash).

## API overview

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/health` | Liveness + Mongo connection |
| CRUD | `/api/projects` | Projects |
| CRUD | `/api/tasks` | Tasks (`?projectId=&status=&priority=`) |
| GET | `/api/stats` | Dashboard counts and lists |
| POST | `/api/ai/parse-task` | `{ "text": "..." }` → structured fields (default: Gemini + `GEMINI_API_KEY`; or `AI_PROVIDER=openai` + `OPENAI_API_KEY`) |

Deleting a **project** deletes its **tasks** as well.

## Docs

Proposal and related materials live in `docs/`.
