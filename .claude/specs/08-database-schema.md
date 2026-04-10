# Database Schema

## Design Decisions

- **ORM**: Prisma
- **Database**: PostgreSQL 16
- **ID strategy**: `cuid()` on all models
- **Polymorphic associations**: nullable FK columns (not enum+string) — preserves referential integrity
- **Categories**: stored in a `Category` table (slug, name, description); `Photo` has a FK `categoryId` → `Category`. Categories exist independently of photos (portrait/street show up with 0 photos).
- **Blog content**: stored as `Json` (ContentBlock[]) on the `BlogPost` row; parsed from Markdown files at publish time
- **Post photos**: stored as URL string, not a FK — posts can include images not in the gallery
- **Comment nesting**: unlimited depth via self-referencing `parentId`
- **Reactions**: one emoji per user per target, enforced by `@@unique` per FK column; PostgreSQL UNIQUE allows multiple NULLs so the constraint only fires when the FK is set

---

## Schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── Users ────────────────────────────────────────────────────────────────────

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  role      Role     @default(FRIEND)
  createdAt DateTime @default(now())
  active    Boolean  @default(true)

  comments  Comment[]
  reactions Reaction[]
  posts     Post[]
}

enum Role {
  ADMIN
  FRIEND
  CUSTOMER
}

// ─── Photos ───────────────────────────────────────────────────────────────────

model Photo {
  id          String    @id @default(cuid())
  filename    String
  storageKey  String    @unique
  url         String
  category    String
  title       String?
  captureDate DateTime?
  camera      String?
  lens        String?
  exifRaw     Json?
  createdAt   DateTime  @default(now())

  comments    Comment[]
  reactions   Reaction[]
}

// ─── Posts (social feed) ──────────────────────────────────────────────────────

model Post {
  id          String   @id @default(cuid())
  authorId    String
  author      User     @relation(fields: [authorId], references: [id])
  description String
  photoUrl    String?             // URL of the attached image (not necessarily in gallery)
  createdAt   DateTime @default(now())

  comments    Comment[]
  reactions   Reaction[]
}

// ─── Blog ─────────────────────────────────────────────────────────────────────

model BlogPost {
  id            String   @id @default(cuid())
  slug          String   @unique
  title         String
  excerpt       String
  coverPhotoUrl String
  publishedAt   DateTime
  readingTime   Int               // pre-computed, in minutes
  content       Json              // ContentBlock[] — parsed from source .md at publish time
  sourceFile    String?           // original .md filename, for reference
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  comments      Comment[]
  reactions     Reaction[]
}

// ─── Comments (polymorphic + unlimited nesting) ───────────────────────────────
//
// Top-level comment: one of postId / photoId / blogPostId is set, parentId is null.
// Reply: parentId is set, the target FK columns are null.
// To find all comments for a piece of content: WHERE postId = ? (or photoId, blogPostId).
// To find replies to a comment: WHERE parentId = ?.

model Comment {
  id        String   @id @default(cuid())
  authorId  String
  author    User     @relation(fields: [authorId], references: [id])
  body      String
  createdAt DateTime @default(now())

  // Threading
  parentId  String?
  parent    Comment?  @relation("CommentReplies", fields: [parentId], references: [id])
  replies   Comment[] @relation("CommentReplies")

  // Target (top-level comments only — one of these is set)
  postId     String?
  post       Post?     @relation(fields: [postId], references: [id])
  photoId    String?
  photo      Photo?    @relation(fields: [photoId], references: [id])
  blogPostId String?
  blogPost   BlogPost? @relation(fields: [blogPostId], references: [id])

  reactions  Reaction[]
}

// ─── Reactions ────────────────────────────────────────────────────────────────
//
// One reaction (one emoji) per user per target.
// @@unique per FK: fires only when the FK is not null (Postgres UNIQUE ignores NULLs).

model Reaction {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  emoji     String
  createdAt DateTime @default(now())

  postId     String?
  post       Post?     @relation(fields: [postId], references: [id])
  photoId    String?
  photo      Photo?    @relation(fields: [photoId], references: [id])
  blogPostId String?
  blogPost   BlogPost? @relation(fields: [blogPostId], references: [id])
  commentId  String?
  comment    Comment?  @relation(fields: [commentId], references: [id])

  @@unique([userId, postId])
  @@unique([userId, photoId])
  @@unique([userId, blogPostId])
  @@unique([userId, commentId])
}

// ─── Subscribers (email list, separate from user accounts) ───────────────────

model Subscriber {
  id           String   @id @default(cuid())
  email        String   @unique
  name         String
  subscribedAt DateTime @default(now())
  active       Boolean  @default(true)
}
```

---

## ContentBlock types (stored in BlogPost.content)

```typescript
type ContentBlock =
  | { type: 'text';    content: string }
  | { type: 'photo';   url: string; caption?: string }          // gallery ref or standalone
  | { type: 'photos';  urls: string[]; layout: 'grid' | 'strip' }
  | { type: 'map';     lat: number; lng: number; zoom?: number; label?: string }
  | { type: 'link';    url: string; title: string; description?: string }
  | { type: 'quote';   content: string; attribution?: string }
  | { type: 'video';   url: string; caption?: string }          // YouTube/Vimeo embed URL
  | { type: 'divider' }
```

---

## Markdown authoring format

Blog posts are written as `.md` files with YAML frontmatter. The server parses them into `ContentBlock[]` at publish time.

```markdown
---
title: Morning fog on Mazury
slug: morning-fog-mazury-2025
excerpt: A short description shown in the index.
coverPhotoUrl: gallery:abc123
publishedAt: 2025-08-10
---

Regular paragraph text becomes a `text` block.

:::photo gallery:abc123 "Caption here"

:::photo ./sunset.jpg "Caption here"

:::photos grid
gallery:abc123
gallery:def456
:::

:::map 54.123 18.456 "Mazury trail"

:::link https://example.com "Title" "Optional description"

:::quote "Attribution (optional)"
Quote text here.
:::

:::video https://youtube.com/watch?v=... "Optional caption"

:::divider
```

---

## Out of scope (not in this schema)

- Auth tokens / sessions (tracked in `06-auth.md`)
- Notifications (tracked in `03-notifications.md`)
- Print store / payments
- Full-text search indexes
