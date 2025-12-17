# Photo Community Web App - Project Plan

## Project Overview

A private photo-sharing community platform for a photographer to share work with friends, featuring photo galleries, social interactions, and messaging capabilities.

## Core Requirements

### 1. User Management & Access Control

- Private, invite-only platform
- User authentication & authorization
- Friend/community management
- Invitation system

### 2. Photo Sharing & Social Features

- Publish photos with descriptions
- Like/dislike functionality
- Comment system on photos
- Social feed of recent posts

### 3. Professional Gallery

- Categorized photo galleries (landscape, portrait, etc.)
- Photo walk collections (organized by date/destination)
- Modern, professional photo presentation
- Navigation between photos without thumbnail strips

### 4. Blog/Photo Walk Stories

- Blog posts for multi-day photo walks
- Link blog posts to photo galleries
- Rich text content with embedded photos

### 5. Messaging System

- Messenger-like real-time chat
- Direct messages between friends
- Notifications for new messages

## Technology Stack

### Frontend (Client)

- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite (fast, modern)
- **Routing**: React Router v6
- **State Management**:
  - React Query (for server state)
  - Zustand or Context API (for client state)
- **Styling**:
  - Tailwind CSS (utility-first, modern)
  - Framer Motion (animations for gallery)
- **UI Components**:
  - Headless UI or Radix UI (accessible components)
  - Custom components for photo gallery
- **Real-time**: Socket.io-client (for messaging)
- **Forms**: React Hook Form + Zod (validation)
- **Image Handling**:
  - React Image Gallery or PhotoSwipe
  - Lazy loading with Intersection Observer

### Backend (Server)

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js or Fastify
- **Database**: PostgreSQL (relational data) + Redis (caching, sessions)
- **ORM**: Prisma (type-safe database access)
- **Authentication**: JWT tokens + refresh tokens
- **File Storage**:
  - AWS S3 or Cloudflare R2 (cloud storage)
  - Alternative: Local storage with nginx
- **Image Processing**: Sharp (resizing, optimization)
- **Real-time**: Socket.io (messaging)
- **API**: RESTful + WebSocket for real-time features

### DevOps & Deployment

- **Version Control**: Git + GitHub
- **Container**: Docker & Docker Compose
- **Deployment**:
  - Frontend: Vercel, Netlify, or CloudFlare Pages
  - Backend: Railway, Render, or DigitalOcean
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry (error tracking)

## Project Structure

```
my-facebook/
├── client/                    # React frontend application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── common/      # Buttons, inputs, modals
│   │   │   ├── gallery/     # Photo gallery components
│   │   │   ├── social/      # Posts, comments, likes
│   │   │   └── messaging/   # Chat components
│   │   ├── pages/           # Route pages/views
│   │   │   ├── Home/
│   │   │   ├── Gallery/
│   │   │   ├── PhotoWalk/
│   │   │   ├── Blog/
│   │   │   ├── Messages/
│   │   │   └── Profile/
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API calls & business logic
│   │   ├── store/           # State management
│   │   ├── types/           # TypeScript interfaces
│   │   ├── utils/           # Helper functions
│   │   └── App.tsx
│   ├── public/
│   └── package.json
│
├── server/                   # Node.js backend
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── middleware/      # Auth, validation, etc.
│   │   ├── models/          # Database models (Prisma)
│   │   ├── utils/           # Helper functions
│   │   ├── socket/          # WebSocket handlers
│   │   └── index.ts
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   └── package.json
│
├── shared/                   # Shared TypeScript types
│   └── types/
│
└── docs/                     # Documentation
    └── api/                  # API documentation
```

## Data Models (Database Schema)

### Core Entities

#### User

- id, email, username, password (hashed)
- displayName, bio, avatar
- role (admin, photographer, friend)
- createdAt, updatedAt

#### Post (Social Feed)

- id, userId (author)
- photoUrl, thumbnailUrl
- description, altText
- likesCount, dislikesCount
- commentsCount
- visibility (public, friends, private)
- createdAt, updatedAt

#### Comment

- id, postId, userId
- content
- parentCommentId (for nested replies)
- createdAt, updatedAt

#### Reaction (Like/Dislike)

- id, postId, userId
- type (like, dislike)
- createdAt

#### GalleryCategory

- id, name (landscape, portrait, etc.)
- slug, description
- coverPhotoUrl
- sortOrder

#### GalleryPhoto

- id, categoryId, userId
- imageUrl, thumbnailUrl
- title, description
- captureDate, location
- camera, lens, settings (JSON)
- sortOrder
- createdAt

#### PhotoWalk

- id, userId
- title, slug
- description (rich text)
- startDate, endDate
- destination
- coverPhotoUrl
- createdAt, updatedAt

#### PhotoWalkGallery (junction)

- id, photoWalkId, photoId
- sortOrder

#### BlogPost

- id, userId, photoWalkId (optional)
- title, slug
- content (rich text/markdown)
- coverPhotoUrl
- status (draft, published)
- publishedAt, createdAt, updatedAt

#### Message

- id, senderId, receiverId
- content
- isRead
- createdAt

#### Conversation

- id, participants (array of userIds)
- lastMessageAt
- createdAt

#### Invitation

- id, invitedBy, email
- token, status (pending, accepted, expired)
- expiresAt, createdAt

## API Endpoints (Server Contract)

### Authentication

- `POST /api/auth/register` - Register with invitation token
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user

### Users

- `GET /api/users` - Get all friends
- `GET /api/users/:id` - Get user profile
- `PATCH /api/users/:id` - Update profile
- `POST /api/users/invite` - Send invitation

### Social Feed

- `GET /api/posts` - Get feed (paginated)
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create post (with photo)
- `PATCH /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

### Reactions

- `POST /api/posts/:id/reactions` - Like/dislike post
- `DELETE /api/posts/:id/reactions` - Remove reaction

### Comments

- `GET /api/posts/:id/comments` - Get comments for post
- `POST /api/posts/:id/comments` - Add comment
- `PATCH /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment

### Gallery

- `GET /api/gallery/categories` - Get all categories
- `GET /api/gallery/categories/:slug` - Get category with photos
- `POST /api/gallery/categories` - Create category (admin)
- `GET /api/gallery/photos` - Get all gallery photos
- `GET /api/gallery/photos/:id` - Get single photo
- `POST /api/gallery/photos` - Upload gallery photo
- `PATCH /api/gallery/photos/:id` - Update photo
- `DELETE /api/gallery/photos/:id` - Delete photo

### Photo Walks

- `GET /api/photo-walks` - Get all photo walks
- `GET /api/photo-walks/:slug` - Get photo walk with gallery
- `POST /api/photo-walks` - Create photo walk
- `PATCH /api/photo-walks/:id` - Update photo walk
- `DELETE /api/photo-walks/:id` - Delete photo walk

### Blog

- `GET /api/blog` - Get all blog posts
- `GET /api/blog/:slug` - Get single blog post
- `POST /api/blog` - Create blog post
- `PATCH /api/blog/:id` - Update blog post
- `DELETE /api/blog/:id` - Delete blog post

### Messages

- `GET /api/messages/conversations` - Get user conversations
- `GET /api/messages/conversations/:id` - Get conversation messages
- `POST /api/messages` - Send message
- `PATCH /api/messages/:id/read` - Mark as read

### WebSocket Events (Real-time)

- `message:new` - New message received
- `message:read` - Message marked as read
- `post:new` - New post in feed
- `comment:new` - New comment on post
- `reaction:new` - New like/dislike

## Feature Breakdown & Development Phases

### Phase 1: Foundation & Core Setup

**Client:**

- [ ] Initialize React + TypeScript + Vite project
- [ ] Setup routing structure (React Router)
- [ ] Configure Tailwind CSS
- [ ] Setup React Query for API calls
- [ ] Create basic layout components (Header, Footer, Navigation)
- [ ] Setup TypeScript types/interfaces
- [ ] Configure environment variables

**Server:**

- [ ] Initialize Node.js + TypeScript + Express project
- [ ] Setup Prisma with PostgreSQL
- [ ] Configure authentication (JWT)
- [ ] Setup file upload middleware
- [ ] Configure CORS and security middleware
- [ ] Create basic error handling
- [ ] Setup environment configuration

**Shared:**

- [ ] Define shared TypeScript interfaces
- [ ] API response types
- [ ] Validation schemas

### Phase 2: Authentication & User Management

**Client:**

- [ ] Login page
- [ ] Registration page (with invitation token)
- [ ] Protected routes
- [ ] Auth context/state management
- [ ] Token refresh logic
- [ ] Profile page

**Server:**

- [ ] User registration endpoint
- [ ] Login/logout endpoints
- [ ] JWT middleware
- [ ] Invitation system
- [ ] Password hashing
- [ ] User CRUD operations

### Phase 3: Social Feed & Interactions

**Client:**

- [ ] Home feed page
- [ ] Post creation form (with photo upload)
- [ ] Post card component
- [ ] Like/dislike buttons
- [ ] Comment section
- [ ] Image viewer/lightbox
- [ ] Feed pagination

**Server:**

- [ ] Post CRUD endpoints
- [ ] Image upload & processing
- [ ] Thumbnail generation
- [ ] Reaction endpoints
- [ ] Comment endpoints
- [ ] Feed query with pagination

### Phase 4: Professional Gallery

**Client:**

- [ ] Gallery overview page (categories grid)
- [ ] Category view (photos grid)
- [ ] Modern photo viewer component
  - Keyboard navigation (arrows)
  - Swipe gestures (mobile)
  - Full-screen mode
  - Photo metadata display
  - No thumbnail strip, alternative navigation
- [ ] Photo upload interface (bulk upload)
- [ ] Category management (admin)

**Server:**

- [ ] Gallery category endpoints
- [ ] Gallery photo endpoints
- [ ] Bulk photo upload
- [ ] Image optimization pipeline
- [ ] EXIF data extraction

### Phase 5: Photo Walks & Blog

**Client:**

- [ ] Photo walks listing page
- [ ] Photo walk detail page
- [ ] Photo walk gallery viewer
- [ ] Blog listing page
- [ ] Blog post detail page
- [ ] Rich text editor (for blog creation)
- [ ] Photo walk creation form
- [ ] Link photo walk to gallery

**Server:**

- [ ] Photo walk CRUD endpoints
- [ ] Blog post CRUD endpoints
- [ ] Rich text content storage
- [ ] Photo walk gallery association
- [ ] Slug generation

### Phase 6: Messaging System

**Client:**

- [ ] Messages page (conversations list)
- [ ] Chat interface
- [ ] Real-time message updates
- [ ] Typing indicators
- [ ] Unread message badges
- [ ] Message notifications

**Server:**

- [ ] WebSocket setup (Socket.io)
- [ ] Message endpoints
- [ ] Conversation management
- [ ] Real-time message broadcasting
- [ ] Online status tracking

### Phase 7: Polish & Optimization

**Client:**

- [ ] Image lazy loading
- [ ] Infinite scroll optimization
- [ ] Loading states & skeletons
- [ ] Error boundaries
- [ ] Toast notifications
- [ ] Responsive design refinement
- [ ] Accessibility improvements
- [ ] Performance optimization

**Server:**

- [ ] Database query optimization
- [ ] Caching strategy (Redis)
- [ ] Rate limiting
- [ ] Image CDN setup
- [ ] API documentation
- [ ] Logging & monitoring

### Phase 8: Deployment & DevOps

- [ ] Docker containerization
- [ ] Environment setup (dev, staging, prod)
- [ ] CI/CD pipeline
- [ ] Database migrations strategy
- [ ] Backup strategy
- [ ] SSL/HTTPS setup
- [ ] Domain configuration
- [ ] Monitoring & error tracking

## Modern Gallery Navigation Solutions

Since you mentioned avoiding thumbnail strips, here are modern alternatives:

### 1. **Minimal Navigation Overlay**

- Previous/Next arrows on image hover
- Keyboard navigation (arrow keys)
- Swipe gestures on mobile
- Photo counter (e.g., "5 / 24")
- Close/exit button
- Optional: Grid view toggle

### 2. **Filmstrip Hidden by Default**

- Small thumbnails appear only on hover/tap
- Appears at bottom, slides up when needed
- Auto-hides after interaction

### 3. **Smart Preloading**

- Load next/previous images in background
- Smooth transitions between photos
- No visible navigation, just gestures + arrows

### 4. **Grid → Lightbox Flow**

- Start with masonry/grid layout
- Click opens fullscreen lightbox
- Navigate with arrows/swipes
- Close returns to grid (with scroll position maintained)

### 5. **Timeline Navigation**

- Small date indicator
- Click shows other photos from same date/location
- Contextual navigation based on metadata

**Recommendation**: Grid → Lightbox with keyboard/swipe navigation + minimal overlay arrows. This is modern, intuitive, and photographer-friendly.

## Image Optimization Strategy

### Upload Pipeline

1. User uploads original photo
2. Server validates file type & size
3. Extract EXIF data (camera, date, location, settings)
4. Generate multiple sizes:
   - Thumbnail (300x300, for grids)
   - Medium (1200px wide, for feed)
   - Large (2400px wide, for lightbox)
   - Keep original (for downloads)
5. Optimize with Sharp (WebP + JPEG fallback)
6. Upload to cloud storage (S3/R2)
7. Return URLs to client

### Client-side Display

- Use `<picture>` element with multiple sources
- Lazy load with Intersection Observer
- Progressive image loading (blur-up technique)
- Responsive images with `srcset`

## Security Considerations

- [ ] Input validation (all API endpoints)
- [ ] SQL injection prevention (Prisma handles this)
- [ ] XSS prevention (sanitize user content)
- [ ] CSRF protection
- [ ] Rate limiting (prevent abuse)
- [ ] Secure file uploads (type checking, size limits)
- [ ] Content Security Policy headers
- [ ] HTTPS only in production
- [ ] Secure password storage (bcrypt)
- [ ] JWT token rotation
- [ ] Invitation token expiration
- [ ] Private photo URLs (signed URLs)

## Performance Targets

- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] Lighthouse score > 90
- [ ] Image load time < 2s (optimized)
- [ ] API response time < 200ms (average)
- [ ] Real-time message latency < 100ms

## Testing Strategy

### Client

- Unit tests: Vitest + React Testing Library
- E2E tests: Playwright or Cypress
- Visual regression: Chromatic or Percy

### Server

- Unit tests: Jest or Vitest
- Integration tests: Supertest
- Load testing: Artillery or k6

## Accessibility Goals (WCAG 2.1 AA)

- [ ] Keyboard navigation for all features
- [ ] Screen reader support
- [ ] Alt text for all images
- [ ] Proper heading hierarchy
- [ ] Color contrast ratios
- [ ] Focus indicators
- [ ] ARIA labels where needed

## Future Enhancements (Post-MVP)

- [ ] Mobile native apps (React Native)
- [ ] Photo tagging (faces, locations)
- [ ] Advanced search & filters
- [ ] Photo albums
- [ ] Sharing to external social media
- [ ] Email notifications
- [ ] Activity feed
- [ ] Photo printing integration
- [ ] Watermark options
- [ ] Collaborative photo walks
- [ ] Photo contests/voting
- [ ] Analytics dashboard

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- PostgreSQL 14+
- Redis (for production)
- AWS account (for S3) or alternative storage

### Initial Setup Commands

```bash
# Clone repository
git clone <repo-url>
cd my-facebook

# Install dependencies
cd client && npm install
cd ../server && npm install

# Setup environment variables
cp client/.env.example client/.env
cp server/.env.example server/.env

# Initialize database
cd server
npx prisma migrate dev
npx prisma generate

# Start development servers
# Terminal 1 (client)
cd client && npm run dev

# Terminal 2 (server)
cd server && npm run dev
```

## Timeline Estimate

- **Phase 1-2** (Foundation + Auth): 1-2 weeks
- **Phase 3** (Social Feed): 2-3 weeks
- **Phase 4** (Gallery): 2-3 weeks
- **Phase 5** (Photo Walks/Blog): 2 weeks
- **Phase 6** (Messaging): 2 weeks
- **Phase 7** (Polish): 1-2 weeks
- **Phase 8** (Deployment): 1 week

**Total estimated time**: 11-15 weeks (full-time development)

## Decision Log

### Key Technical Decisions

1. **React over Vue/Svelte**: You already know React/TypeScript
2. **Vite over CRA**: Faster, modern, better DX
3. **PostgreSQL over MongoDB**: Relational data structure fits better
4. **Prisma over TypeORM**: Better TypeScript support, great DX
5. **REST + WebSocket over GraphQL**: Simpler for this use case
6. **Tailwind over CSS-in-JS**: Faster development, smaller bundle
7. **React Query over Redux**: Better server state management

## Notes & Considerations

- Start with local file storage for development, migrate to S3 later
- Consider using a CDN (CloudFlare) for image delivery
- Keep originals, never delete uploaded photos
- Implement soft deletes for user content
- Consider GDPR compliance if EU users
- Backup strategy is critical (photos are irreplaceable)
- Consider costs: storage will grow with photos
- Mobile-first design approach
- Progressive Web App (PWA) could be useful

---

**Next Steps**: Review this plan, adjust priorities, then we'll start implementing Phase 1!
