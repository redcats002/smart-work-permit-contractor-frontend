# SmartWorkPermit / SafePermit — Shared Product Context

This file is shared across all three repositories. Copy it into each repo alongside that repo's own task document (`01-backend-elysia-tasks.md`, `02-contractor-web-vue-tasks.md`, or `03-safety-inspector-web-vue-tasks.md`).

## Source of truth for UX

The design reference is `SmartWorkPermit-v3.dc.html` (an HTML prototype). It is a **reference for flows, screen structure, copy (EN + TH), and business rules** — not production code. Recreate it in each repo's existing framework/conventions; do not port the HTML/inline-style markup directly.

## System overview

SmartWorkPermit is a work-permit management system for a Thai industrial facility, split into three repos:

1. **Contractor web app** — responsive web app. Contractors draft, submit, and track their own work permits.
2. **Safety Officer + Inspector web app** — one mobile-first responsive app, role-gated. Safety Officers (จป.) review/approve/close permits and monitor the site; Inspectors do field verification (QR scan, entrant register, gas readings) from a phone.
3. **Backend** — single API serving both apps above.

## Roles

| Role | App | Key powers |
|---|---|---|
| `contractor` | Contractor app | Create/edit/submit permits, view own history & certificates |
| `safety_officer` | Safety/Inspector app | Approve/reject permits, close permits, view audit log, site-wide dashboard |
| `inspector` | Safety/Inspector app | Scan permit QR for live status, run entrant register, log gas readings, works offline |

A single user account has exactly one role. The Safety/Inspector app shows nav/routes based on the logged-in user's role (not a toggle the user picks themselves).

## Permit types

- **Hot Work** (`hot`) — welding/grinding/cutting. Requires gas test + a mandatory 30-minute Fire Watch after work is marked complete, before closure.
- **Confined Space** (`confined`) — tanks/vessels. Requires atmosphere test + entrant register (per-worker check-in/out).
- **Working at Heights** (`heights`) — roofs/scaffolds. Requires wind reading + harness/PPE photo evidence.

## Permit status machine

```
DRAFT → PENDING → REJECTED
              ↘ ACTIVE → CLOSED
                    ↘ (hot work only) FIRE_MONITOR → CLOSED
        ACTIVE/PENDING → EXPIRED  (if work end-time passes without closure)
```

- `DRAFT`: contractor still editing, not submitted.
- `PENDING`: submitted, awaiting Safety Officer review.
- `REJECTED`: Safety Officer rejected with a required reason; contractor can revise and resubmit.
- `ACTIVE`: approved; QR code issued and live.
- `FIRE_MONITOR`: Hot Work only — foreman marked work complete, 30-min countdown running; closure blocked until countdown finishes.
- `CLOSED`: closure checklist completed + e-signature; terminal.
- `EXPIRED`: work window end time passed while still open; terminal unless reopened by policy (out of scope unless the user asks).

**Closure block rule:** a Confined Space permit cannot be closed while any entrant is still checked in (register must show all workers "out"). The API must return `403` for a close attempt while entrants remain inside.

## Safety-check validation (server-authoritative)

These ranges gate progression in the submission wizard and must be **re-validated server-side on submit/approve** — never trust client-submitted readings:

- **LEL (combustible gas):** must read `0%` for Hot Work and Confined Space (skippable only if the permit is flagged `outdoorWork: true`).
- **O₂:** `19.5%–23.5%` for Hot Work and Confined Space.
- **CO:** ≤ `50 ppm` for Confined Space.
- **SO₂:** logged in the Confined Space gas log (Inspector), no hard block modeled yet — carry the field through.
- **Wind:** ≤ `25 km/h` for Working at Heights.

Out-of-range values block progression with no override — surface the specific failing reading(s) in the error response.

## JSA (Job Safety Analysis)

Rows grouped by phase — `pre` (before work), `process` (during), `post` (after) — each row: `{ step, hazard, control }`. Contractor adds rows per phase during permit creation.

## PPE, workers & photo evidence

- Contractor registers workers per permit with a role (varies by permit type, e.g. Entrant/Attendant/Gas Tester for Confined Space; Fire Watcher/Operator/Helper for Hot Work).
- Required photo evidence slots vary by type (e.g. harness photo for Heights, instrument photo for gas readings).
- **Pre-work health check** required for Confined Space entrants (blood pressure + alcohol reading) per Thai ministerial safety regulation — store per worker, required before submission.

## Certificates

Personnel safety certificates: `{ name, role, certType, issuedDate, expiryDate }`. An expired or missing certificate for any registered worker:
- Blocks permit submission (wizard-side validation, re-checked server-side).
- Blocks field entry — Inspector's worker-badge scan must deny entry and write a `CERT_BLOCKED` audit entry when a scanned worker's cert is expired. This cannot be overridden in the field.

## QR codes

On approval, the backend issues a QR payload encoding the permit ID (and enough to verify signature/authenticity) linked to **live** permit status — scanning always reflects current state, not a snapshot at issuance time. Inspector's scan flow reads this to show real-time status (including Fire Watch countdown, entrant count, gas log link).

## Audit log

Append-only, immutable. Every state-changing action (submit, approve, reject, close, cert-blocked entry, closure-checklist answers) is written with actor, timestamp, and a hash chaining each entry to the previous one (server-signed hash chain) so tampering/deletion is detectable. Never expose an edit or delete path for audit rows.

## Notifications

New permit submissions notify Safety Officers and Inspectors (in-app; polling or push — implementer's choice per each repo's existing patterns).

## Offline support (Inspector only)

Inspector actions (entrant check-in/out, gas log entries) must queue locally when offline and sync on reconnect. Sync must be idempotent (client-generated action IDs) and surface conflicts to the user rather than silently overwriting.

## Internationalization

Every UI string ships in English and Thai; a locale switcher (EN / ไทย) lives in the top nav of both frontend apps, default locale Thai. Numbers/dates should localize sensibly (`Asia/Bangkok` timezone, but store all timestamps in UTC server-side).
