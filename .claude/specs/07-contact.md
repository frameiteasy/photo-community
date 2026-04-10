# Contact Page

## Overview

A simple contact page at `/contact` with a form: name, email, message. No backend yet — form submission is mocked (shows a success state). Will be wired to a real endpoint or Resend when the backend exists.

## Route

`/contact` — accessible from the header navigation.

## Form Fields

| Field | Type | Required | Validation |
|---|---|---|---|
| Name | text input | yes | non-empty |
| Email | email input | yes | valid email format |
| Message | textarea | yes | non-empty |

## States

- **Idle** — form is empty and ready
- **Submitting** — button shows spinner, inputs disabled
- **Success** — form replaced by a thank-you message
- **Error** — inline error message shown below the form (for future real errors)

## Mock behavior

On submit: 800ms fake delay → success state. No actual network call.

## i18n keys

`contact.*` namespace in both `en.json` and `pl.json`.

## Out of scope

- File attachment
- CAPTCHA / spam protection (add when real backend exists)
- Email sending (Resend integration is a backend concern)
