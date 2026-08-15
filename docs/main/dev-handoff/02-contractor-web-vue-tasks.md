# Contractor Web App — Implementation Tasks

> **Read this first, before any task below**
> 1. This repository already has a Vue.js template. Read its README/CLAUDE.md (if present) and inspect existing folder structure, router setup, state management (Pinia/Vuex/composables), component conventions, and installed UI libraries before writing anything.
> 2. Read `00-SHARED-CONTEXT.md` (copied alongside this file) for roles, permit lifecycle, and business rules — it's the source of truth for *what* the product does.
> 3. Read `01-backend-elysia-tasks.md` (or the backend repo's published API docs, if available at build time) for the exact endpoints/payloads to call. If the backend isn't reachable yet, stub calls behind a thin API client module so swapping in the real base URL later is a one-line change.
> 4. Follow the template's existing conventions rather than introducing a new state library, CSS approach, or folder pattern.

## Goal

Build the Contractor-facing app: **responsive web**, used mainly from a desktop/laptop or tablet in the field office, but must not break on a phone-width viewport (test at 375px, 768px, 1280px+).

Design reference: `SmartWorkPermit-v3.dc.html`, Contractor role section (nav tabs → "Contractor"). It's a UX/copy/flow reference, not code to port — the file is available on request from the design team if you need to check a specific layout detail.

## Screens

1. **My Permits** (list) — status filter chips (All/Active/Pending/Closed), permit cards showing id/type/title/location/date/status. Empty state when filtered list is empty.
2. **New Permit wizard** — 6 steps, back/next, cannot advance past a step that fails validation:
   1. Select Permit Type (Hot Work / Confined Space / Working at Heights)
   2. Basic Information (location, foreman, date/time, map pin for location if feasible — placeholder is fine if no mapping library is already in the template)
   3. Safety Checks — type-specific gas/wind fields; show inline pass/fail per reading against the ranges in the shared context; block "Next" on fail (client-side convenience check — **the backend re-validates on submit regardless**)
   4. PPE & Workers — required photo evidence slots (image upload), worker registration (name + role, role options vary by permit type), pre-work health check fields for Confined Space entrants
   5. Job Safety Analysis — phase tabs (Pre/Process/Post), add/edit rows (step, hazard, control)
   6. Review & Submit — read-only summary of all previous steps, submit action
3. **Permit Detail** — status banner variants (Draft/Rejected-with-reason/Active/Fire-Monitor-with-countdown/Closed), QR code display (only when `ACTIVE`/`FIRE_MONITOR`, else "pending approval" placeholder), closure checklist modal (foreman-facing, blocked with a clear message if entrants still inside or Fire Watch hasn't elapsed), audit timeline.
4. **History** — search + type/status/date-range filters, CSV export, paginated table, detail drill-in.
5. **Certificates** — personnel certificate list with valid/expiring-soon/expired badges, add certificate form.

## Cross-cutting

- **i18n**: set up `vue-i18n` (or the template's existing i18n setup) with `en` and `th` locale files; every user-facing string goes through it. Locale switcher (EN / ไทย) in the top nav; persist choice (localStorage); default `th`.
- **Auth**: login as `contractor` role; route guard redirects unauthenticated users to login.
- **API client**: one module wrapping fetch/axios with base URL + auth header injection; surface backend error `code`s (see backend doc) mapped to localized messages.
- **Responsive**: sidebar nav collapses to a top drawer/hamburger below ~900px; wizard steps stack full-width on narrow viewports; tables in History/list scroll horizontally rather than truncate on narrow screens.
- **Validation**: mirror the backend's numeric ranges for instant feedback, but always treat the submit response as authoritative (show server-returned error codes if they disagree with client checks).

## Out of scope (confirm with product owner before building)

- Payment/billing, contractor onboarding/verification, push notifications (poll `GET /notifications` on an interval instead unless the backend already has push wired up).
