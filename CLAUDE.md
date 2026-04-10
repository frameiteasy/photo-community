# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A private photo-sharing community web app for photographers. Currently a frontend-only gallery MVP with internationalization (EN/PL). No backend exists yet — the photo service uses a static manifest serving files from `public/photos/`.

## Tech Stack

React 19 + TypeScript, Vite, Tailwind CSS 3, React Router 6, React Query (TanStack), Zustand (installed, not yet used), Framer Motion, i18next, piexifjs (EXIF extraction), Axios.

## Commands

All commands run from the `client/` directory:

```bash
npm run dev        # Dev server at http://localhost:3000
npm run build      # TypeScript check + Vite production build
npm run lint       # ESLint
npm run preview    # Preview production build
```

No testing framework is configured yet. ESLint has two config files: `eslint.config.js` (flat config) and `.eslintrc.cjs` (legacy) — both are present.

## Architecture

### Entry Flow
`client/index.html` → `src/main.tsx` (initializes i18n) → `src/App.tsx` (sets up QueryClientProvider + BrowserRouter + Layout)

### Routing (`src/App.tsx`)
- `/` → HomePage
- `/gallery` → GalleryPage
- `/gallery/:category` → GalleryCategoryPage
- `/photo-walks`, `/photo-walks/:slug` → PhotoWalkPage
- `/blog`, `/blog/:slug` → BlogPage
- `/messages` → MessagesPage (placeholder)
- `/profile` → ProfilePage (placeholder)

### Photo Service (`src/services/photoService.ts`)
Photos are served statically from `client/public/photos/{category}/`. A hardcoded `PHOTO_MANIFEST` maps category slugs (`landscape`, `nature`, `portrait`, `street`) to filename arrays. Designed to be replaced with API calls when a backend is built.

Known issue: `getPhotoById` references `SAMPLE_PHOTOS` which is not defined — it will throw at runtime.

### i18n (`src/i18n.ts`, `src/locales/`)
- Two languages: English (`en.json`) and Polish (`pl.json`)
- Uses `react-i18next` hooks: `const { t } = useTranslation()`
- Translation keys are namespaced: `navigation.*`, `gallery.*`, `home.*`, etc.
- Language switcher in header, persisted to localStorage
- **All new user-facing strings must be added to both locale files.**

### Gallery Components (`src/components/gallery/`)
- **PhotoMasonry**: Responsive grid (1-4 columns by breakpoint), click opens lightbox
- **PhotoLightbox**: Full-screen modal with keyboard nav (arrows/ESC), swipe gestures via Framer Motion, EXIF metadata display

### Key Directories
- `src/types/index.ts` — All TypeScript interfaces. `Photo` uses a `PhotoCategory` union type (`'landscape' | 'portrait' | 'street' | 'nature' | 'other'`), not a plain string.
- `src/services/api.ts` — Axios instance configured for `VITE_API_BASE_URL` (default `http://localhost:5000/api`)
- `src/utils/metadata.ts` — EXIF extraction using piexifjs
- `src/store/` — Empty, reserved for Zustand stores
- `src/hooks/` — Empty, reserved for custom hooks

### Path Aliases
`@/*` maps to `./src/*` (configured in both `tsconfig.json` and `vite.config.ts`)

### Styling
Tailwind with custom `primary` color scale (blue, 50-900). Font: Inter. Base background: `bg-gray-50`.

## Planned Backend (not yet built)

From `PROJECT_PLAN.md`: Node.js + TypeScript + Express, PostgreSQL + Redis, Prisma ORM, JWT auth, Sharp for image processing, Socket.io for real-time messaging, file storage via AWS S3 or Cloudflare R2. The API contract and data models are documented in that file.

## Constraints

- Node.js 20.19+ or 22.12+ required
- Environment variables use Vite's `VITE_` prefix convention (`import.meta.env.VITE_*`)
