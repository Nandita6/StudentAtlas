# StudentAtlas — Part 1 Backend Starter

This starter adds only the backend foundation and connects Vite's development proxy. It does not implement a database or application business logic.

## Requirements

- Node.js 22.12 or newer (for the current Vite frontend; Express itself supports older Node versions)
- npm

## Setup (Mac Terminal, starting in the StudentAtlas project root)

Terminal 1:
```sh
cd backend
npm install
npm run dev
```
Open `http://localhost:3001/api/health` in your browser. Expected output:
```json
{"status":"ok","service":"StudentAtlas API"}
```

Terminal 2 (keep the backend running):
```sh
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` for the React site. Then open `http://localhost:5173/api/health` to confirm Vite forwards API requests to the backend.

Run a basic backend test from `backend/`:
```sh
npm test
```

## Folder responsibilities

- `src/server.js`: starts the server on port 3001
- `src/app.js`: configures Express and mounts API routes
- `src/routes/`: HTTP endpoints
- `src/controllers/`: request handlers — to be added by feature teammate
- `src/services/`: business rules — to be added by feature teammate
- `src/repositories/`: database access — to be added by database teammate
- `frontend/vite.config.js`: sends `/api` requests from Vite to the backend during development

## Team handoff

Part 1 is complete when the backend responds at `/api/health`, the Vite proxy works, and the code is committed to a GitHub branch.

Before teammates write feature routes, agree on API names and request/response data. Suggested paths (not implemented here):
- `GET /api/applications`
- `POST /api/applications`
- `PATCH /api/applications/:id`

No application is saved by this starter. Parts 2–5 will implement that functionality.
