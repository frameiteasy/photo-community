# Blog

## Purpose

The blog is where the photographer publishes longer-form stories tied to a photo session or adventure. Each post combines several photos with narrative text — more like a photo essay than a social post. Readers can navigate between posts linearly (prev/next) or jump directly from an index list.

---

## URL Structure

| Path | Description |
|---|---|
| `/blog` | Blog index — featured latest post + list of all posts |
| `/blog/:slug` | Single post — full photo essay |

---

## Blog Post Data Model

```typescript
interface BlogPost {
  id: string;
  slug: string;                 // URL-safe, e.g. "morning-fog-mazury-2025"
  title: string;
  excerpt: string;              // 1–2 sentences, shown in the index list
  coverPhotoUrl: string;        // first or chosen photo, used in index cards
  publishedAt: string;          // ISO date
  blocks: ContentBlock[];       // ordered content — text and photos interleaved
}

type ContentBlock =
  | { type: 'text';   content: string }
  | { type: 'photo';  url: string; caption?: string }
  | { type: 'photos'; urls: string[]; layout: 'grid' | 'strip' }
  | { type: 'map';    lat: number; lng: number; zoom?: number; label?: string }  // future
```

Content blocks allow flexible composition: text, then a photo, then more text, then a 3-photo grid, etc. The photographer controls the order.

---

## Blog Index Page (`/blog`)

### Layout

```
┌──────────────────────────────────────────────┐
│  FEATURED POST (most recent)                 │
│  Large cover photo + title + excerpt + CTA   │
└──────────────────────────────────────────────┘

  ┌──────────┐  ┌──────────┐  ┌──────────┐
  │  post 2  │  │  post 3  │  │  post 4  │   ← always visible
  └──────────┘  └──────────┘  └──────────┘

              [ More posts ▾ ]               ← toggles list below

  ┌────────────────────────────────────────┐
  │ thumb │ Title                 date     │  ← compact rows,
  │ thumb │ Title                 date     │    all remaining posts,
  │ thumb │ Title                 date     │    newest first
  └────────────────────────────────────────┘
```

- **Featured block** — full-width card, cover photo on the right (desktop) / top (mobile), title + excerpt + date + "Read more →"
- **Preview grid** — always shows posts 2–4 (3 cards max), 3-col desktop / 2-col tablet / 1-col mobile
- **"More posts" toggle** — only shown when there are more than 4 posts total. Expands a compact scrollable list of all remaining posts (post 5 onward), sorted newest first
- **Compact list row** — small thumbnail (56×56px), title (bold), date (right-aligned), whole row clickable
- If total posts ≤ 4 — no "More posts" button shown
- If only 1 post — featured only, no grid

### Featured post card
- Cover photo takes ~55% of the card width on desktop
- Left side: label "Latest post", title (large), excerpt, date, "Read more →" link
- Subtle hover shadow on the whole card

### Preview grid cards
- Aspect-ratio 4/3 cover photo
- Title (2 lines max, truncate)
- Date
- Excerpt (1 line, truncate)
- Whole card is clickable

### Compact list rows (inside "More posts")
- Small square thumbnail (56×56px, rounded-lg, object-cover)
- Title — bold, single line truncated
- Date — right-aligned, small grey
- Divider between rows
- Smooth expand/collapse animation (Framer Motion)

---

## Blog Post Page (`/blog/:slug`)

### Layout (top to bottom)

1. **Post header** — title, date, reading time estimate
2. **Content blocks** — rendered in order, alternating text and photos
3. **Post navigation** — prev / next at the bottom
4. **Back to blog** — link back to `/blog`

### Content block rendering

| Block type | Rendering |
|---|---|
| `text` | Prose paragraph, max-width `65ch` (readable line length), centered |
| `photo` | Full-width image (up to `800px`), optional caption below in small grey italic |
| `photos` with `grid` | Responsive grid: 2 or 3 columns, all same height, click opens lightbox |
| `photos` with `strip` | Horizontal scrollable strip (mobile), fixed-height row (desktop) |
| `map` | Embedded map showing a route or location (future — Leaflet or Mapbox) |

Text blocks and photo blocks are interleaved — text wraps around the narrative, photos break the flow at natural pauses.

### Post navigation (bottom of post)

```
← Previous post title          Next post title →
```

- Left: link to older post (if exists)
- Right: link to newer post (if exists)
- Separated by a divider line
- On mobile: stack vertically

### Reading time

Estimated from total word count of `text` blocks: `Math.ceil(words / 200)` minutes.

---

## Lightbox on blog photos

Clicking a photo inside a blog post opens the existing `PhotoLightbox`. For `photos` blocks (multi-photo), the lightbox includes navigation between the photos in that block.

Single `photo` blocks open a simple zoom overlay (same `PhotoZoom` used in posts).

---

## Empty State

If no posts exist: centered message "No posts yet." — no placeholder cards.

---

## Mock Data (client, for now)

2–3 blog posts with:
- Real photos from the existing manifest (landscape + nature)
- Multi-paragraph text in Polish
- Mixed content blocks: text → photo → text → photo grid → text
- Different dates so prev/next navigation works

---

## Internationalization

New keys under `blog.*` in both locale files:

- `blog.title` — "Blog"
- `blog.latestPost` — "Latest post"
- `blog.previousPosts` — "Previous posts"
- `blog.readMore` — "Read more"
- `blog.backToBlog` — "← Back to blog"
- `blog.readingTime` — "{{count}} min read"
- `blog.noPostsYet` — "No posts yet."
- `blog.prevPost` — "Previous"
- `blog.nextPost` — "Next"

---

## Out of Scope

- Comments on blog posts (may add later — lower priority than posts feed)
- Tags or categories for blog posts
- Search
- RSS feed (useful later for the store/newsletter)
- Draft / preview mode (backend feature)
