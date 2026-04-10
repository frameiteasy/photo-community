# Notifications & Subscriber Management

## Purpose

When a new photo or photo walk is published, all active subscribers receive an email with a link. This replaces the Facebook feed as the push mechanism. Subscribers are people personally invited — friends for now, potential customers later.

---

## Subscriber Model

A subscriber is just an email address + name + role. No account required to receive emails.

```
id, email, name, role (friend | customer), subscribed_at, active
```

- `active: false` = unsubscribed, never emailed again
- `role` distinguishes friend notifications from future store/marketing emails
- The list is owned by the app — not tied to any social platform

---

## Notification Triggers

| Event | Who gets notified | Email type |
|---|---|---|
| New photo published | All active `friend` subscribers | "New photo posted" |
| New photo walk published | All active `friend` subscribers | "New photo walk" |
| (Future) New print available | All active `customer` subscribers | "New print drop" |

Notifications are triggered manually by the admin (the photographer), not automatically on upload. Publish ≠ notify — you can upload a batch and choose when to send.

---

## Email Content

### New photo notification
- Subject: `New photo — [title or category]`
- Body: thumbnail image + short caption + "View photo →" link
- Unsubscribe link in footer (required legally, good practice)

### New photo walk notification  
- Subject: `New photo walk — [walk title]`
- Body: cover photo + walk title + excerpt + "Read more →" link
- Unsubscribe link in footer

---

## Email Service

**Resend** — transactional email API. 3,000 emails/month free. Simple API, good deliverability, supports React Email templates.

Requires a verified sending domain (your own domain, configured via Cloudflare DNS).

---

## Unsubscribe Flow

Every email contains a signed unsubscribe link:
```
https://yourdomain.com/unsubscribe?token=<signed-jwt>
```

Clicking it sets `active: false` on the subscriber record. No login required, no confirmation screen — one click, done. Required by CAN-SPAM / GDPR.

---

## Admin Interface (to be designed)

The admin needs:
1. A subscriber list view — see all emails, active/inactive status
2. Add subscriber manually (paste email + name)
3. Import from CSV (one-time migration from Facebook contacts)
4. Send notification button — appears on the published photo/walk page

No self-signup for now — invite-only, admin adds people manually.

---

## Repository Interface

```typescript
export interface ISubscriberRepository {
  findAllActive(role?: Role): Promise<Subscriber[]>;
  findByEmail(email: string): Promise<Subscriber | null>;
  create(data: CreateSubscriberInput): Promise<Subscriber>;
  deactivate(id: string): Promise<void>;
  importBatch(subscribers: CreateSubscriberInput[]): Promise<number>; // returns count inserted
}
```

---

## Notification Service Interface

```typescript
export interface INotificationService {
  notifyNewPhoto(photo: Photo): Promise<void>;
  notifyNewPhotoWalk(walk: PhotoWalk): Promise<void>;
}
```

Implementation sends emails via Resend. A mock implementation (used in development) just logs to console.

---

## What to Mock on the Client (for now)

- No subscriber UI needed yet — admin manages subscribers directly in the DB initially
- No notification triggers in the UI yet — just design the "Publish" button placeholder
- The email templates can be designed as React components independently of the backend

---

## Out of Scope

- Push notifications (browser/mobile) — email is enough for this group size
- Notification preferences per subscriber (frequency, categories) — overkill for now
- Automated drip campaigns or marketing sequences
