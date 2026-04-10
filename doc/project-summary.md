# Project: Private Photo Community Web App

A **frontend-only MVP** for a private photo-sharing community, aimed at photographers. There is no backend yet — photos are served statically from `client/public/photos/`.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 + TypeScript |
| **Build tool** | Vite 5 |
| **Styling** | Tailwind CSS 3 (custom blue `primary` color scale, Inter font) |
| **Routing** | React Router 6 |
| **Server state** | TanStack React Query 5 |
| **Client state** | Zustand 5 (installed but unused) |
| **Animations** | Framer Motion 11 |
| **i18n** | i18next + react-i18next (English & Polish) |
| **EXIF parsing** | piexifjs |
| **HTTP client** | Axios (configured but largely unused without a backend) |

---

## Architecture

**Entry flow:** `index.html` → `main.tsx` (initializes i18n) → `App.tsx` (wraps everything in `QueryClientProvider` + `BrowserRouter` + `Layout`).

**Routing** — 8 routes defined in `App.tsx`:

| Route | Page | Status |
|---|---|---|
| `/` | Home | Implemented |
| `/gallery` | Gallery categories | Implemented |
| `/gallery/:category` | Category photos | Implemented |
| `/photo-walks`, `/photo-walks/:slug` | Photo walks | Placeholder |
| `/blog`, `/blog/:slug` | Blog | Placeholder |
| `/messages` | Messaging | Placeholder |
| `/profile` | User profile | Placeholder |

**Photo service** (`photoService.ts`) — A hardcoded `PHOTO_MANIFEST` maps category slugs (`landscape`, `nature`, `portrait`, `street`) to filenames. Photos are loaded from `public/photos/{category}/`. Designed to be swapped for real API calls later.

---

## Main Features (Implemented)

1. **Photo Gallery** — Responsive masonry layout (1-4 columns by breakpoint) with a full-screen lightbox that supports keyboard navigation (arrow keys, ESC) and swipe gestures via Framer Motion.

2. **EXIF Metadata Display** — `utils/metadata.ts` fetches image binaries, extracts EXIF data (camera, lens, focal length, aperture, ISO, shutter speed, date, dimensions) using piexifjs, and formats it for the lightbox overlay.

3. **Internationalization** — Full EN/PL support with `i18next-browser-languagedetector` (localStorage-backed). Language switcher in the header.

4. **Layout** — Shared `Header` + `Footer` wrapping all pages.

---

## Planned / Stubbed Features (Types exist, pages are placeholders)

- **Social feed** with posts, likes/dislikes, and comments (types: `Post`, `Comment`, `Reaction`)
- **Photo walks** — event-style photo outings (`PhotoWalk` type)
- **Blog** with draft/published status (`BlogPost` type)
- **Direct messaging** with conversations and unread counts (`Message`, `Conversation` types)
- **User profiles** with roles: `admin`, `photographer`, `friend` (`User` type)
- **Paginated API responses** (`PaginatedResponse<T>` type ready)

---

## Key Observations

- **No backend** — everything runs client-side. An Axios instance is pre-configured for `localhost:5000/api` but isn't used yet.
- **No tests** — no testing framework is set up.
- **No auth** — user/session management hasn't been built.
- **Zustand store directory** (`src/store/`) and **hooks directory** (`src/hooks/`) are empty, reserved for future use.
- Path alias `@/*` → `./src/*` is configured in both TypeScript and Vite configs.
