# Posts Feed

## Purpose

The Posts page is the main communication channel between the photographer and invited friends. The photographer publishes a photo with a written description — a message to friends. Friends read it, react with emoji, and leave comments. When a new post is published, all subscribers receive an email with a direct link to it.

This is distinct from the Gallery:
- **Gallery** — organized by category, browsable, no description required
- **Posts** — chronological, each post is a deliberate message, photo is paired with text

---

## URL Structure

| Path | Description |
|---|---|
| `/posts` | Feed — all posts, reverse chronological |
| `/posts/:id` | Single post detail — the shareable link sent in email notifications |

---

## Post Data Model

```typescript
interface Post {
  id: string;
  photoUrl: string;
  thumbnailUrl: string;
  description: string;        // the message text, supports line breaks
  publishedAt: string;        // ISO date
  reactions: ReactionSummary; // counts per emoji type
  commentCount: number;
  comments: Comment[];        // paginated, 3 shown by default
}

interface ReactionSummary {
  love: number;    // ❤️
  wow: number;     // 😍
  fire: number;    // 🔥
  clap: number;    // 👏
  haha: number;    // 😂
  userReaction: ReactionType | null; // what the current user reacted with
}

type ReactionType = 'love' | 'wow' | 'fire' | 'clap' | 'haha';
```

---

## Feed Page (`/posts`)

### Layout
- Single-column feed, max width `640px`, centered
- Posts sorted newest first
- Each post is a `PostCard` component
- Infinite scroll or "Load more" button (start with "Load more" — simpler)
- No post → empty state with a message

### PostCard anatomy (top to bottom)

1. **Header**: author avatar + name + relative date (e.g. "3 days ago")
2. **Photo**: full-width, `aspect-[4/3]` or natural ratio, click opens lightbox
3. **Description**: text below the photo, up to 3 lines visible — "Read more" expands
4. **Reaction bar**: 5 emoji buttons with counts. Clicking one toggles your reaction (only one active at a time, like Facebook). Clicking your active reaction removes it.
5. **Comments**: see [Comments section below]
6. **Comment input**: always visible at the bottom of the card

### Reaction bar detail

```
❤️ 12   😍 4   🔥 7   👏 2   😂 1
```

- Active reaction is highlighted (filled background, colored)
- Counts update optimistically on click
- If a user hasn't reacted yet, all buttons are in neutral state

### Comments on posts

Same pattern as gallery lightbox:
- Show 3 most recent comments by default
- "View all X comments" expands the full list
- "Show less" collapses back
- Comment input with emoji picker (same component as lightbox)
- Comments sorted oldest → newest when expanded

---

## Post Detail Page (`/posts/:id`)

This is the page linked in email notifications. Must work as a standalone page.

- Same `PostCard` layout, but full-width / unconstrained
- All comments visible by default (no collapse — user arrived here to engage)
- Page title = first line of description (for browser tab / link previews)
- Open Graph meta tags for link preview in messaging apps:
  - `og:image` = post photo
  - `og:title` = first line of description
  - `og:description` = app name + "— new post"

---

## Empty State

If no posts exist, show:
- A simple centered message: "Nothing posted yet."
- No placeholder cards or fake content

---

## Admin: Creating a Post

For now (no backend): a placeholder "New Post" button visible only to the admin role. Button shows a "coming soon" state. 

When backend is ready: a form with photo upload + description textarea + preview + publish button. Publishing triggers email notification to all active subscribers.

---

## Relationship to Gallery

A photo can exist in both the Gallery and in a Post — they are independent. Posting to the feed does not automatically add to the gallery, and vice versa. The photographer chooses where each photo appears.

---

## Most Popular (future feature)

Once reactions and comments are stored, a "Most Popular" view becomes trivial:
- Sort gallery photos by total reaction count
- Show reaction counts on gallery photo cards (on hover)
- Homepage could feature the most-reacted photo of the week

This data is collected passively from day one — no extra work needed if the reaction model is in place.

---

## Notifications (on publish)

When a post is published, trigger the notification flow from `03-notifications.md`:
- Subject: first line of description
- Body: photo thumbnail + full description + "View post →" link to `/posts/:id`
- Sent to all active `friend` subscribers

---

## Mock Data (client, for now)

3 example posts with different photos, descriptions, reaction counts, and comments. Reactions and new comments work interactively in the UI even before the backend exists.

---

## Internationalization

New keys under `posts.*` namespace in both `en.json` and `pl.json`:

- `posts.title` — "Posts"
- `posts.loadMore` — "Load more"
- `posts.noPostsYet` — "Nothing posted yet."
- `posts.readMore` — "Read more"
- `posts.showLess` — "Show less"
- `posts.reactions.love` — "Love"
- `posts.reactions.wow` — "Wow"
- `posts.reactions.fire` — "Fire"
- `posts.reactions.clap` — "Clap"
- `posts.reactions.haha` — "Haha"
- `posts.newPost` — "New Post"

---

## Out of Scope

- Editing or deleting posts (admin-only, backend feature)
- Nested comment replies (flat comments only for now)
- Post scheduling
- Multiple photos per post
- Video support
