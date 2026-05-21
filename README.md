# StreamKit

StreamKit is a full-stack streaming catalog app for workshops about developing with AI.

It uses Vite, React, TypeScript on the frontend and an Express backend backed by PostgreSQL. Local image assets and one shared preview video are served from `dist/`.

## Prerequisites

- Node.js 18+
- PostgreSQL running locally (e.g. via [Postgres.app](https://postgresapp.com) or `brew install postgresql`)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Create a local database

```bash
createdb streamkit
```

### 3. Configure environment variables

```bash
cp backend/.env.example backend/.env
```

Teh default `backend/.env.example` points to `postgresql://localhost:5432/streamkit`. Edit `backend/.env` if your Postgres setup uses a different host, port, user, or password.

### 4. Seed the database

This creates the `series` table (if it doesn't exist) and loads all 20 shows from the catalog:

```bash
npm run db:seed -w backend
```

The seed script is idempotent — running it again will upsert existing rows without duplicating data.

### 5. Start the app

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3001`


Add the posgres mcp server like this:
````claude mcp add --scope user postgres npx -- -y @henkey/postgres-mcp-server --connection-string "postgresql://localhost:5432/streamkit"```

Add the github mcp server like this:
```claude mcp add --scope user --transport http github https://api.githubcopilot.com/mcp/ --header "Authorization: Bearer ghp_yourtokenhere"```
(make sure you use your actual token where it says `yourtokenhere`)

## Database Schema

```sql
CREATE TABLE series (
  id            TEXT PRIMARY KEY,
  title         TEXT NOT NULL,
  tagline       TEXT,
  year          INTEGER,
  seasons       INTEGER,
  rating        TEXT,
  match         INTEGER,
  description   TEXT,
  creator       TEXT,
  genres        TEXT[],
  cast_members  TEXT[],
  poster_path   TEXT,
  backdrop_path TEXT,
  video_path    TEXT
);
```

The full DDL lives in `backend/schema.sql`.

## API Routes

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/catalog` | All series, ordered by match % |
| GET | `/api/catalog/featured` | The hero/featured series |
| GET | `/api/catalog/genres` | Sorted list of unique genres |
| GET | `/api/catalog/:id` | Single series by id |
| GET | `/api/catalog/:id/more-like-this` | Genre-based recommendations |
| GET | `/api/search?q=` | Search stub (workshop exercise) |

## Workshop Feature Ideas

- Implement real full-text search against the database.
- Add filters by genre, rating, or year.
- Add a "My List" feature with a `watchlist` table.
- Add richer controls or recommendations on the watch page.
- Add pagination or infinite scroll to the catalog.

## Project Shape

```text
backend/
  schema.sql              Table DDL
  scripts/seed.js         Database seed script
  src/
    db.js                 Shared pg connection pool
    catalog.js            Database query functions
    server.js             Express API server
frontend/
  src/
    types.ts              Shared TypeScript types
    catalog.ts            API client functions
    App.tsx               Root React component
dist/
  posters/                Poster images
  backdrops/              Backdrop images
  videos/preview.mp4      Shared preview video
```
