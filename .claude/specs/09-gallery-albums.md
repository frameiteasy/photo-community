# Gallery & Albums

## Two Distinct Concepts

| Concept | Purpose | Route |
|---|---|---|
| **Category** | Genre/type of photo (landscape, portrait, street, nature) | `/gallery`, `/gallery/:slug` |
| **Album** | Curated collection by event or trip (New York 2025, Best of 2025) | `/albums`, `/albums/:slug` |

A photo can belong to **multiple categories** and **multiple albums** (many-to-many for both).

---

## Data Model

```
Photo ──< PhotoCategory >── Category
Photo ──< AlbumPhoto    >── Album
```

- `PhotoCategory` — composite PK `(photoId, categoryId)`, cascade delete
- `AlbumPhoto` — composite PK `(photoId, albumId)` + `order Int` for manual sequencing within album

### Category fields
`id`, `slug`, `name`, `description?`, `createdAt`

### Album fields
`id`, `slug`, `name`, `description?`, `location?`, `date?`, `createdAt`

---

## Routes

### Gallery (categories)

| Path | Component | Description |
|---|---|---|
| `/gallery` | `GalleryPage` | Category grid — cover photo, name, photo count |
| `/gallery/:slug` | `GalleryCategoryPage` | Masonry grid of photos in that category + lightbox |

### Albums

| Path | Component | Description |
|---|---|---|
| `/albums` | `AlbumsPage` | Album grid — cover photo, name, location, year, photo count |
| `/albums/:slug` | `AlbumDetailPage` | Masonry grid of photos in that album + lightbox |

Both nav items appear in the main header.

---

## Manage Page (`/manage`)

Admin-only page (no auth guard yet) for assigning photos to categories and albums.

- **Photo grid** — all photos as square thumbnails. Hover shows current category tags.
- **Click photo** → assignment modal:
  - Photo thumbnail + title + date
  - Checkboxes for every category
  - Checkboxes for every album
  - Save → `PUT /api/v1/photos/:id/assignments`
- Optimistic update: photo's tags update in the grid immediately on save.

---

## API

| Method | Path | Body / Response |
|---|---|---|
| GET | `/api/v1/gallery/categories` | `GalleryCategory[]` — includes `photoCount`, `coverPhotoUrl` |
| GET | `/api/v1/gallery/categories/:slug/photos` | `Photo[]` |
| GET | `/api/v1/gallery/recent?limit=N` | `Photo[]` |
| GET | `/api/v1/albums` | `Album[]` — includes `photoCount`, `coverPhotoUrl` |
| GET | `/api/v1/albums/:slug` | `AlbumDetail` — includes `photos: Photo[]` |
| GET | `/api/v1/photos` | `PhotoWithAssignments[]` — includes `categories[]`, `albums[]` |
| GET | `/api/v1/photos/:id` | `PhotoWithAssignments` |
| PUT | `/api/v1/photos/:id/assignments` | `{ categoryIds: string[], albumIds: string[] }` |

---

## Client Services

- `photoService.ts` — `getGalleryCategories`, `getPhotosByCategory`, `getRecentPhotos`, `getAllPhotosWithAssignments`, `updatePhotoAssignments`
- `albumService.ts` — `getAlbums`, `getAlbumBySlug`

---

## Seed Data

Initial seed (`server/prisma/seed.ts`) creates:
- 4 categories: landscape, nature, portrait, street
- 3 albums: Spring in Nature 2025, Landscapes of Poland, Best of 2025
- 7 photos, several in multiple categories and albums
- `DSCF0194.jpg` tagged as both landscape and nature (demonstrates many-to-many)

---

## Out of Scope (for now)

- Album photo reordering UI (order stored in DB, no drag-and-drop yet)
- Creating/editing/deleting categories or albums via UI (seed only for now)
- Auth guard on `/manage` (added when auth is implemented)
