# my-facebook

A private photo-sharing community app for photographers. Gallery, albums, social feed, and blog — all in one place.

## Stack

| Layer    | Tech                                              |
|----------|---------------------------------------------------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, Framer Motion |
| Backend  | Node.js 22, Express, TypeScript, tsx              |
| Database | PostgreSQL 16 (Docker), Prisma ORM                |
| i18n     | i18next — English and Polish                      |

---

## Prerequisites

- **Node.js 22.12+** — use [fnm](https://github.com/Schniz/fnm) or [nvm](https://github.com/nvm-sh/nvm)
- **Docker Desktop** — for the PostgreSQL container

---

## 1. Database

Start PostgreSQL via Docker Compose (from the repo root):

```bash
docker compose up -d
```

This starts a `postgres:16` container named `my-facebook-db` on port `5432` with:

| Setting  | Value        |
|----------|--------------|
| Database | `myfacebook` |
| User     | `myfacebook` |
| Password | `secret`     |

---

## 2. Server

### Install dependencies

```bash
cd server
npm install
```

### Configure environment

Create `server/.env`:

```env
DATABASE_URL="postgresql://myfacebook:secret@localhost:5432/myfacebook"
PORT=5001
```

### Run migrations

```bash
cd server
npx prisma migrate deploy
```

### Seed the database

Populates users, posts, blog posts, categories, albums, and photos:

```bash
npm run db:seed
```

### Start the dev server

```bash
npm run dev
```

Server runs at `http://localhost:5001`.

---

## 3. Client

### Install dependencies

```bash
cd client
npm install
```

### Configure environment (optional)

The client defaults to `http://localhost:5001/api`. To override, create `client/.env.local`:

```env
VITE_API_BASE_URL=http://localhost:5001/api
```

### Add photos

Place photo files under `client/public/photos/` matching the category structure used in the seed:

```
client/public/photos/
  landscape/
    20220214-_KMS9994.jpg
    20221112-_KMS4056.jpg
    20251027-KMS07249.jpg
    DSCF0194.jpg
  nature/
    20250427-_KMS5167.jpg
    20250427-_KMS5419.jpg
    20250721-KMS02711.jpg
```

### Start the dev server

```bash
npm run dev
```

Client runs at `http://localhost:3000`.

---

## Quick start (all together)

```bash
# Terminal 1 — database
docker compose up -d

# Terminal 2 — server
cd server && npm install && npx prisma migrate deploy && npm run db:seed && npm run dev

# Terminal 3 — client
cd client && npm install && npm run dev
```

---

## Other commands

### Server

```bash
npm run build       # TypeScript compile
npm start           # Run compiled output (production)
npm run lint        # ESLint
npx prisma studio   # Visual DB browser at http://localhost:5555
```

### Client

```bash
npm run build       # TypeScript check + Vite production build
npm run preview     # Preview production build
npm run lint        # ESLint
```

---

## Project structure

```
my-facebook/
  docker-compose.yml        # PostgreSQL service
  client/                   # React frontend (Vite)
    public/photos/          # Static photo files served directly
    src/
      pages/                # Route-level components
      components/           # Shared UI components
      services/             # API client functions
      locales/              # en.json, pl.json
  server/                   # Express backend
    prisma/
      schema.prisma         # Database schema
      migrations/           # SQL migration history
      seed.ts               # Seed data
    src/
      routes/               # Express route handlers
      services/             # Business logic
      repositories/         # Data access (Prisma implementations)
      types.ts              # Shared TypeScript types
```
