# Take With You

A full-stack web application connecting trips and requests for items or assistance, with matching and communication features. The repository contains a React frontend and a Node.js/Express backend backed by CouchDB.

## Features represented in the codebase

- User registration/authentication endpoints.
- Trips and needs/requests management.
- Matching endpoints connecting trips with needs.
- Messaging endpoints and a WebSocket chat server.
- Trip-completion and rating endpoints.
- Upload handling and background cleanup of expired data.

> Features are listed from the inspected routes and server structure; deployment readiness and end-to-end behavior have not yet been verified.

## Technology

| Layer | Technologies |
| --- | --- |
| Frontend | React, React Router, Vite, CSS |
| Backend | Node.js, Express |
| Database | CouchDB, accessed using `nano` |
| Real-time communication | WebSocket (`ws`) |
| Other backend packages | `bcryptjs`, `cors`, `formidable` |

## Repository layout

```text
frontend/
  src/             React UI, pages, components and services
  package.json     Frontend scripts and dependencies
backend/
  server.js        Express application and HTTP/WebSocket server
  routes/          API routes for users, trips, needs, matches, messages, ratings, etc.
  services/        Backend services and cleanup tasks
  repositories/    Data-access related modules
  database/        CouchDB setup and indexes
  config/          Backend configuration
  websocket/       Chat server
  uploads/         Uploaded content
package.json       Root/backend dependencies
```

## Local development (current code structure)

1. Install Node.js and CouchDB.
2. Clone the repository and install root dependencies with `npm install`.
3. Install frontend dependencies with `cd frontend && npm install`.
4. Configure CouchDB for local development. **Do not reuse the credentials currently committed in `backend/config/databaseConfig.js`.** Move database credentials into environment variables and rotate the exposed password before publishing or deploying.
5. Start the backend from the repository root with `node backend/server.js`. The source currently listens on port `3000`.
6. In another terminal, run `cd frontend && npm run dev`. Vite's default development URL is typically `http://localhost:5173`; the backend currently allows this origin.

The database is initialized, indexes are created and expired-data cleanup runs as part of backend startup.

> **Not yet verified:** These steps are based on the committed configuration and scripts; the full application has not been run or tested in this review. Check file-upload paths and environment-specific settings before relying on the setup.

## Current repository limitations / security checklist

- **Credential exposure:** `backend/config/databaseConfig.js` currently contains a hard-coded CouchDB username and password. Rotate credentials, remove them from source, and review Git history before changing repository visibility.
- **Dependencies:** A root `node_modules/` directory is committed. Remove generated dependencies from version control and add an appropriate root `.gitignore` in a separate cleanup change.
- The frontend has a template README, while this root README documents the whole application.
- Review CORS settings, authentication, authorization, validation, uploads, and WebSocket access before public deployment.
- Add screenshots, architecture diagrams, tested installation steps, and automated tests.

## Portfolio focus

This project demonstrates integration of a React client, an Express API, CouchDB persistence and real-time communication into one full-stack application.
