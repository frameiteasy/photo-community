# Backend Architecture

## Guiding Principles

- **Repository pattern** — all data access goes through interfaces; the database is a swappable implementation detail
- **Start cheap, scale when needed** — no over-engineering upfront
- **Specs before code** — define contracts first, mock on the client, build real implementations later

---

## Hosting

| Layer | Service | Cost |
|---|---|---|
| Server | Hetzner CAX11 (ARM, 2 vCPU, 4GB RAM) | ~€4/month |
| Photos / file storage | Cloudflare R2 | ~$0 at current scale |
| DNS + CDN | Cloudflare (free tier) | Free |
| SSL | Let's Encrypt via Caddy or Nginx | Free |

Single VPS running everything initially. Resize in place when needed — no migration required.

---

## Tech Stack

- **Runtime**: Node.js 22 + TypeScript
- **Framework**: Express
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Cache**: Redis (session storage, optional query cache)
- **File storage**: Cloudflare R2 (S3-compatible)
- **Email**: Resend (transactional email, generous free tier)
- **Image processing**: Sharp (resize, optimize, generate thumbnails)
- **Auth**: JWT (access token) + refresh token in httpOnly cookie
- **Real-time**: Socket.io (messaging, later)

---

## Project Structure

```
server/
  src/
    repositories/
      interfaces/          ← contracts only, no implementation
        IPhotoRepository.ts
        ISubscriberRepository.ts
        IUserRepository.ts
        IStorageRepository.ts
      prisma/              ← PostgreSQL implementations
        PhotoRepository.ts
        SubscriberRepository.ts
        UserRepository.ts
      storage/             ← R2 / local filesystem implementations
        R2StorageRepository.ts
        LocalStorageRepository.ts
    services/              ← business logic, depends on interfaces only
      PhotoService.ts
      SubscriberService.ts
      NotificationService.ts
    routes/                ← Express route handlers (thin, delegate to services)
    middleware/
    container.ts           ← dependency injection wiring
    app.ts
    server.ts
  prisma/
    schema.prisma
```

---

## Repository Pattern

### Interface example

```typescript
// repositories/interfaces/IPhotoRepository.ts
export interface IPhotoRepository {
  findAll(options?: { category?: string; limit?: number }): Promise<Photo[]>;
  findById(id: string): Promise<Photo | null>;
  findRecent(limit: number): Promise<Photo[]>;
  create(data: CreatePhotoInput): Promise<Photo>;
  delete(id: string): Promise<void>;
}
```

### Implementation example

```typescript
// repositories/prisma/PhotoRepository.ts
export class PhotoRepository implements IPhotoRepository {
  constructor(private prisma: PrismaClient) {}

  async findRecent(limit: number): Promise<Photo[]> {
    return this.prisma.photo.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
  // ...
}
```

### Wiring (container.ts)

```typescript
const prisma = new PrismaClient();
export const photoRepository: IPhotoRepository = new PhotoRepository(prisma);
export const photoService = new PhotoService(photoRepository);
```

Swapping to a different database = replace the implementation in `container.ts`. Nothing else changes.

---

## Storage Repository

Photos live in two places: metadata in PostgreSQL, files in R2. Separate interfaces for each.

```typescript
export interface IStorageRepository {
  upload(key: string, buffer: Buffer, contentType: string): Promise<string>; // returns public URL
  delete(key: string): Promise<void>;
  getSignedUrl(key: string, expiresIn: number): Promise<string>;
}
```

Local filesystem implementation used in development, R2 in production. Toggled via environment variable.

---

## Database Schema

See `08-database-schema.md` for the full Prisma schema. Summary of models:

- `User`, `Subscriber`, `Role` — identity and email list
- `Photo` — file metadata, no category FK (many-to-many)
- `Category` — gallery genre (landscape, nature, portrait, street); managed in DB
- `PhotoCategory` — join table Photo ↔ Category
- `Album` — curated collection (trip, event); has slug, name, location, date
- `AlbumPhoto` — join table Photo ↔ Album with `order` field
- `Post` — social feed post with optional photoUrl (not FK)
- `BlogPost` — blog essay; `content Json` stores `ContentBlock[]`
- `Comment` — polymorphic + unlimited nesting via `parentId`
- `Reaction` — polymorphic emoji reaction

`Subscriber` is intentionally separate from `User` — a subscriber is just an email address. A user has an account. They can be linked later when auth is built.

---

## API Design

REST. All endpoints under `/api/v1/`.

Versioned from day one — `/v1/` costs nothing now and prevents breaking changes later.

Authentication: JWT Bearer token in `Authorization` header. Refresh token in httpOnly cookie.

---

## Live API Endpoints (implemented)

| Method | Path | Description |
|---|---|---|
| GET | `/api/v1/gallery/categories` | Category list with photo count + cover |
| GET | `/api/v1/gallery/categories/:slug/photos` | Photos in a category |
| GET | `/api/v1/gallery/recent` | Recent photos (default 12) |
| GET | `/api/v1/albums` | Album list with photo count + cover |
| GET | `/api/v1/albums/:slug` | Album detail with photos |
| GET | `/api/v1/photos` | All photos with category + album assignments |
| GET | `/api/v1/photos/:id` | Single photo with assignments |
| PUT | `/api/v1/photos/:id/assignments` | Update categories + albums for a photo |
| GET | `/api/v1/blog/*` | Blog posts (mock) |
| GET | `/api/v1/posts/*` | Social feed posts (mock) |
| GET | `/api/v1/health` | Health check |

## Still Mocked

- Blog (MockBlogRepository)
- Posts/feed (MockPostRepository)

---

## Out of Scope (for now)

- Payment processing (future: Stripe, for the print store)
- Social features (likes, comments — defined in types but not prioritized)
- Full-text search
- CDN image optimization pipeline (Sharp + R2 is enough initially)
