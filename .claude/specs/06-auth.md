# Auth: Invite-Only Magic Link

## Overview

The app is private by default — no one can access it without an explicit invitation. Auth uses a **magic link flow**: the admin invites someone by email, they click a link, an account is created automatically, and they are signed in. No password required unless they want to set one later.

This matches the existing `Subscriber` → `User` distinction in the backend schema: a subscriber is just an email; a user is a full account.

---

## User Roles

| Role | Who | Permissions |
|---|---|---|
| `ADMIN` | The photographer (you) | Invite users, publish photos/posts, manage content |
| `FRIEND` | Invited people | View all content, like, comment, send messages |

No self-registration. All accounts originate from an admin invitation.

---

## Auth Flow

### 1. Admin sends invite

Admin goes to `/admin/invites`, enters a name and email, clicks Send.

- Backend creates an `InviteToken` record (hashed token, 7-day expiry)
- Resend sends an email: "Konrad has invited you to join his photo community → [Open invitation]"
- The link is: `https://app.domain/auth/accept?token=<raw_token>`

### 2. Recipient clicks the link

Frontend route `/auth/accept` calls `POST /api/v1/auth/accept-invite` with the token.

Backend:
1. Looks up the token (unhashed match), checks not expired and not already used
2. Creates (or activates) the `User` record from the `InviteToken` data
3. Marks the token as `usedAt = now()`
4. Issues JWT access token + refresh token
5. Returns user profile + access token; sets refresh token in httpOnly cookie

Frontend:
- Stores access token in memory (not localStorage)
- Redirects to `/` — the user is now logged in

### 3. Subsequent visits

- On app load, frontend calls `GET /api/v1/auth/me` with the Bearer token
- If access token is expired, tries `POST /api/v1/auth/refresh` (uses httpOnly cookie)
- If refresh also fails → redirect to `/auth/login`

### 4. Login (returning user without a valid session)

Route `/auth/login`: user enters email → backend sends a new magic link (same flow as invite, but for an existing user). No password prompt unless they've set one.

Optional future: email + password login for users who prefer it.

### 5. Logout

`POST /api/v1/auth/logout` — clears the refresh token cookie, frontend drops the access token from memory.

---

## Database Schema Changes

```prisma
model User {
  id           String    @id @default(cuid())
  email        String    @unique
  name         String
  role         Role      @default(FRIEND)
  passwordHash String?   // optional, set only if user chooses password login
  active       Boolean   @default(true)
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt

  inviteTokens InviteToken[]
  refreshTokens RefreshToken[]
}

model InviteToken {
  id        String    @id @default(cuid())
  tokenHash String    @unique   // store SHA-256 of the raw token, never the raw token
  email     String
  name      String
  role      Role      @default(FRIEND)
  invitedBy String    // admin user id
  expiresAt DateTime
  usedAt    DateTime?
  createdAt DateTime  @default(now())

  inviter   User      @relation(fields: [invitedBy], references: [id])
}

model RefreshToken {
  id        String   @id @default(cuid())
  tokenHash String   @unique
  userId    String
  expiresAt DateTime
  createdAt DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

Note: `Subscriber` model (email-only, no auth) remains separate. Subscribers receive blog/post notifications but cannot log in. A subscriber can be upgraded to a `User` by sending them an invite.

---

## API Endpoints

All under `/api/v1/auth/`.

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/invite` | ADMIN | Create invite token, send email |
| `POST` | `/auth/accept-invite` | None | Validate token, create user, issue tokens |
| `POST` | `/auth/login` | None | Send magic login link to existing user |
| `POST` | `/auth/refresh` | Cookie | Issue new access token via refresh token |
| `GET` | `/api/v1/auth/me` | Bearer | Return current user profile |
| `POST` | `/auth/logout` | Bearer | Revoke refresh token, clear cookie |

### POST /auth/invite

Request:
```json
{ "email": "anna@example.com", "name": "Anna", "role": "FRIEND" }
```

Response `201`:
```json
{ "message": "Invitation sent" }
```

Errors: `400` email already has an account, `403` not admin.

### POST /auth/accept-invite

Request:
```json
{ "token": "<raw_token>" }
```

Response `200`:
```json
{
  "accessToken": "<jwt>",
  "user": { "id": "...", "name": "Anna", "email": "...", "role": "FRIEND" }
}
```

Sets `Set-Cookie: refreshToken=<token>; HttpOnly; Secure; SameSite=Strict; Path=/api/v1/auth/refresh`

Errors: `400` token invalid or expired, `409` already used.

### POST /auth/refresh

No body — reads httpOnly cookie.

Response `200`:
```json
{ "accessToken": "<new_jwt>" }
```

Rotates the refresh token (old one revoked, new one issued).

---

## Token Design

**Access token (JWT)**
- Signed with `AUTH_JWT_SECRET`
- Payload: `{ sub: userId, role, iat, exp }`
- Expiry: **15 minutes**
- Stored in memory only (React state / Zustand store)

**Refresh token**
- Cryptographically random (32 bytes, hex)
- SHA-256 hashed before storing in DB
- Expiry: **30 days**, rotating on each use
- httpOnly cookie — never accessible to JS

**Invite token**
- Cryptographically random (32 bytes, hex)
- SHA-256 hashed before storing in DB
- Expiry: **7 days**
- Single-use

---

## Middleware

```typescript
// middleware/auth.ts
export const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    req.user = jwt.verify(token, process.env.AUTH_JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Token expired or invalid' });
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });
  next();
};
```

---

## Frontend Changes

### Auth state (Zustand store)

```typescript
// src/store/authStore.ts
interface AuthState {
  user: User | null;
  accessToken: string | null;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
}
```

### Protected routes

Wrap all app routes in an `<AuthGuard>` component:
- If no valid session → redirect to `/auth/login`
- On app init → call `GET /auth/me`; if 401 → try `/auth/refresh`; if still 401 → clear auth

### New routes

| Path | Component | Purpose |
|---|---|---|
| `/auth/login` | `LoginPage` | Enter email → receive magic link |
| `/auth/accept` | `AcceptInvitePage` | Token from URL → calls API → redirects |
| `/admin/invites` | `InvitesPage` | Admin only: send invites, list pending |

### Axios interceptor

```typescript
// src/services/api.ts
api.interceptors.response.use(null, async (error) => {
  if (error.response?.status === 401 && !error.config._retry) {
    error.config._retry = true;
    const { data } = await api.post('/auth/refresh');
    useAuthStore.getState().setAuth(currentUser, data.accessToken);
    error.config.headers.Authorization = `Bearer ${data.accessToken}`;
    return api(error.config);
  }
  return Promise.reject(error);
});
```

---

## Email Templates

### Invite email (sent by admin)

**Subject:** Konrad invited you to his photo community

> Hi [Name],
>
> Konrad has invited you to join his private photo community — a place where he shares his photography work with the people closest to him.
>
> **[Accept invitation →]** *(button, links to /auth/accept?token=...)*
>
> This link expires in 7 days.

### Magic login email (for returning users)

**Subject:** Your sign-in link

> Hi [Name],
>
> Here's your sign-in link. It expires in 15 minutes and can only be used once.
>
> **[Sign in →]**

---

## Environment Variables

```
AUTH_JWT_SECRET=          # min 32 chars random string
AUTH_REFRESH_TOKEN_EXPIRY=2592000  # 30 days in seconds
AUTH_INVITE_TOKEN_EXPIRY=604800    # 7 days in seconds
RESEND_API_KEY=
EMAIL_FROM=noreply@yourdomain.com
APP_URL=https://app.yourdomain.com
```

---

## Security Notes

- Never store raw tokens — always SHA-256 hash before writing to DB
- Refresh token rotation: each use invalidates the old token and issues a new one
- Invite tokens are single-use; re-inviting the same email requires creating a new token
- All `/api/v1/*` routes except `/auth/*` require a valid Bearer token
- httpOnly + Secure + SameSite=Strict on the refresh token cookie prevents XSS and CSRF
- Rate-limit `/auth/login` and `/auth/invite` (e.g. 5 req/15min per IP)

---

## Out of Scope (for now)

- Password login (addable later without changing the core flow)
- OAuth / social login
- Two-factor authentication
- Admin UI beyond the invite page
