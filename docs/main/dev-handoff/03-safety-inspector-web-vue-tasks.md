# Safety Officer + Inspector Web App — Implementation Tasks

> **Read this first, before any task below**
> 1. This repository already has a Vue.js template. Read its README/CLAUDE.md (if present) and inspect existing folder structure, router setup, state management, component conventions, and installed UI libraries before writing anything.
> 2. Read `00-SHARED-CONTEXT.md` (copied alongside this file) for roles, permit lifecycle, and business rules.
> 3. Read `01-backend-elysia-tasks.md` (or the backend repo's published API docs) for exact endpoints/payloads.
> 4. Follow the template's existing conventions rather than introducing a new state library, CSS approach, or folder pattern.
> 5. This is **one app, two roles**. Route/nav visibility is driven by the logged-in user's role (`safety_officer` or `inspector`), not a manual switch. Share layout/shell and any common components (permit cards, status badges, locale switcher) between both role sections.

## Goal

Build the Safety Officer + Inspector app: **mobile-first responsive**. Design for a 375–430px phone viewport first (this is used on the plant floor), then scale up to tablet/desktop for office use. Bottom tab bar or similarly thumb-reachable nav on mobile; can switch to a side nav above ~900px if the template already has a pattern for that.

Design reference: `SmartWorkPermit-v3.dc.html` — Safety Officer section (nav tab "Safety Officer") and Inspector section (nav tab "Inspector"). Reference only, not code to port.

## Safety Officer screens

1. **Review Queue** — pending permits list, tap into detail.
2. **Review Detail** — permit info, backend validation summary (pass/fail per safety check, pulled from the API — do not recompute client-side), Approve (issues QR) or Reject (reason required) actions with e-signature capture (a signature pad or typed-name + timestamp confirmation — match whatever the template already has for this, otherwise a simple "type full name to confirm" is acceptable).
3. **Live Facility Risk Map** — pins for active/pending/fire-monitor permits at their recorded site location; tap a pin for a mini-summary. If no mapping library exists yet in the template, a simple 2D facility-plan image with absolutely-positioned pins (as in the design reference) is an acceptable v1 — flag to product owner if a real GIS/map is wanted later.
4. **All Permits** — facility-wide register, search/filter/sort, multi-select for bulk approve / CSV export.
5. **Audit Log** — read-only, filterable by action type/date, paginated.
6. **Executive Dashboard** — activity-over-7-days chart, approved/rejected counts, expiring-soon certs list. Use whatever charting approach the template already has; a simple bar/line via a lightweight lib (e.g. Chart.js) is fine if none exists.

## Inspector screens

1. **Scan Permit QR** — **real camera access required.** Use the [`BarcodeDetector` Web API](https://developer.mozilla.org/en-US/docs/Web/API/Barcode_Detection_API) where supported, with a JS fallback decoder (e.g. `@zxing/browser` or `jsQR` against a `<video>` + `<canvas>` frame grab) for browsers without native support. Request camera permission explicitly with a clear denied-permission state and a **manual permit-ID entry fallback** (field devices sometimes have camera issues — never let scanning be a hard blocker). On successful decode, call the QR-verify endpoint and show live status (including Fire Watch countdown if applicable).
2. **Entrant Register** — per-permit list of workers with in/out state and timestamps; "Scan Worker Badge" action reuses the same camera/QR pipeline as above, decodes a worker badge, calls the entrant-scan endpoint, and shows the server's allow/deny result (deny state must be visually unmistakable — expired cert blocks entry, no override).
3. **Gas Log** — table of readings with color-coded pass/fail per column, "overdue" banner when stale, add-reading form.
4. **Offline Queue** — list of queued entrant-scan/gas-log actions pending sync, manual "Sync now" action, conflict banner when the backend reports a conflict on replay.

## Offline architecture (Inspector)

- Detect online/offline (`navigator.onLine` + `online`/`offline` events).
- Queue entrant-scan and gas-log submissions in IndexedDB (or the template's existing local-storage abstraction) with a client-generated UUID per action when offline.
- On reconnect, POST the queue to the backend's batch-sync endpoint; mark each item synced/conflicted based on the per-item response; surface conflicts rather than silently discarding.
- Consider a service worker for asset caching so the shell loads offline too — confirm with product owner if full PWA installability (manifest, add-to-home-screen) is wanted for this milestone, since it changes build tooling.

## Cross-cutting

- **i18n**: same setup as the Contractor app — `vue-i18n` (or template's existing setup), `en`/`th` locale files, switcher in top nav, default `th`.
- **Auth**: login lands on Safety Officer or Inspector home based on account role.
- **Touch targets**: minimum 44×44px on all interactive elements given the mobile-first, gloved-hands-on-a-plant-floor context.
- **API client**: shared module, same error-code-to-localized-message mapping approach as the Contractor app (keep consistent if these two frontends ever share a package; otherwise duplicate the small mapping table).

## Out of scope (confirm with product owner before building)

- Native app wrapper (this is a mobile-first *web* app, not React Native/Capacitor, unless asked).
- Multi-facility support (single facility assumed per shared context).
