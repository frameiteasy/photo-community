# Home Page

## Purpose

The home page is the front door for invited friends. It must immediately communicate the beauty of the photography, make the app feel personal and warm (not clinical), and guide visitors toward their most natural next action: browsing the gallery or reading a photo walk.

It is not a marketing page. Everyone who lands here was personally invited — so there is no need to "sell" the app. Instead, it should feel like walking into a beautiful, curated space.

---

## Layout (top to bottom)

### 1. Hero Section

- **Full-viewport-height** (`min-h-screen`) panel with a single, large featured photo as the background
- Photo is darkened slightly with a gradient overlay (bottom fade to black) to keep text readable
- Centered overlay content:
  - Short personal tagline (e.g. "My photos. My walks. For the people I know.")
  - One primary CTA button: **Browse Gallery** → `/gallery`
  - One secondary text link: **Latest Photo Walk** → `/photo-walks`
- Photo rotates randomly from a curated set on each load (no animation needed — just pick one)
- On mobile: same layout, button stacks vertically

### 2. Gallery Preview Strip

- Heading: "Recent Photos"
- A horizontal scrollable row (mobile) or responsive masonry grid (desktop, 3–4 columns) showing the 8–12 most recent photos across all categories
- Uses the existing `PhotoMasonry` component or a simplified version
- Clicking a photo opens the lightbox (`PhotoLightbox`)
- "See all photos" link → `/gallery`

### 3. Categories Row

- Heading: "Browse by Category"
- 4 cards in a horizontal row (wraps to 2×2 on mobile): Landscape, Nature, Portrait, Street
- Each card: full-bleed cover photo from that category + category name as an overlay label
- Clicking → `/gallery/:category`
- Cards have a subtle hover scale effect (`scale-105`, Framer Motion)

### 4. Recent Blog Posts

- Heading: "From the Blog"
- Shows the 3 most recent blog posts as horizontal cards (desktop) / stacked (mobile)
- Each card:
  - Cover photo (left, fixed width ~120px, aspect square, rounded)
  - Right side: title (bold, 2 lines max), date, excerpt (2 lines, truncated)
  - Whole card links to `/blog/:slug`
- "Read all posts →" link below the list → `/blog`
- If no blog posts exist, this section is hidden

### 5. Footer

- Minimal: copyright line + language switcher (EN / PL)
- No nav duplication — the header already handles navigation

---

## Navigation / Header Behavior

- Transparent header over the hero (white logo/links)
- Becomes solid (`bg-white` with shadow) after scrolling past the hero
- Uses `position: sticky` so it remains accessible while scrolling

---

## Content Rules

- **No placeholder content** — if a section has no real data, hide it entirely
- **No generic stock imagery** — all photos come from the real photo manifest
- Featured hero photo must come from the existing `PHOTO_MANIFEST`

---

## Responsive Behavior

| Breakpoint | Gallery grid | Category cards | Walk card |
|------------|-------------|----------------|-----------|
| Mobile (<640px) | Horizontal scroll strip | 2×2 grid | Full width |
| Tablet (640–1024px) | 2-col masonry | 4-col row | 70% width |
| Desktop (>1024px) | 3–4 col masonry | 4-col row | 60% centered |

---

## Interactions & Animation

- Hero photo fades in on mount (Framer Motion `opacity: 0 → 1`, 600ms)
- Gallery photo cards animate in as they enter the viewport (staggered `y: 20 → 0`)
- Category card hover: `scale(1.05)` with `transition-transform duration-200`
- Header background transition: smooth `transition-colors duration-300` on scroll

---

## Internationalization

All visible strings must be added to both `en.json` and `pl.json` under the `home.*` namespace:

- `home.hero.tagline`
- `home.hero.ctaGallery`
- `home.hero.ctaWalks`
- `home.sections.recentPhotos`
- `home.sections.seeAll`
- `home.sections.browseByCategory`
- `home.sections.latestWalk`
- `home.sections.readMore`

---

## Out of Scope

- Like / comment interactions on the home page (belongs in gallery/photo-walk detail views)
- User profile or login UI (auth is not built yet)
- Infinite scroll or pagination on the preview strip
- Any analytics or tracking
