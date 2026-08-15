# Backend Repository — Implementation Tasks

> **Read this first, before any task below**
> 1. This repository already has an Elysia.js template. Read its README/CLAUDE.md (if present), inspect the existing folder structure, installed packages, lint/format config, and any existing route/module conventions.
> 2. Read `00-SHARED-CONTEXT.md` (copied alongside this file) for the product model, roles, permit status machine, and business rules. That file is the single source of truth for *what* the system does; this file is *what to build here*.
> 3. Follow the template's existing conventions (folder layout, plugin style, DB client, validation style) rather than introducing new ones. If the template has no opinion on something below, choose the simplest option consistent with Elysia idioms and note the choice in a short ADR-style comment.
> 4. This backend is the **single API for two separate frontend repos** (Contractor web, Safety/Inspector web). Design the API to be role-agnostic at the transport layer — authorization is enforced per-endpoint based on the authenticated user's role, not by which frontend is calling.

## Goal

Implement the API, data model, and business rules described below and in `00-SHARED-CONTEXT.md`. Treat the design HTML (`SmartWorkPermit-v3.dc.html`, referenced in the shared context) purely as a spec for field names, statuses, and copy — do not attempt to render it.

## Auth & roles

- Roles: `contractor`, `safety_officer`, `inspector` (see shared context). One role per account.
- Provide login + session/token issuance (JWT or the template's existing auth pattern if one exists — use it).
- Middleware/guard that attaches `{ userId, role }` to context and rejects unauthorized role access per route (see per-route roles below).

## Data model

Design tables/collections for (adapt names to the template's existing DB/ORM conventions):

- `users` — id, name, role, contact info.
- `permits` — id (human-readable format like `WP-{TYPE}-{YYYYMMDD}-{seq}`), type (`hot|confined|heights`), title, location, foreman, work_date, work_time_start, work_time_end, status, outdoor_work (bool), created_by, created_at, submitted_at, approved_at, approved_by, rejected_reason, closed_at, closed_by, fire_monitor_started_at.
- `permit_safety_readings` — permit_id, lel, o2, co, wind, height, recorded_at, recorded_by.
- `jsa_steps` — permit_id, phase (`pre|process|post`), step, hazard, control, sort_order.
- `permit_workers` — permit_id, worker_name, role_on_permit, health_check (bp/alcohol reading, confined space only).
- `permit_photos` — permit_id, slot_key, file_ref, uploaded_at.
- `certificates` — id, worker_name, role, cert_type, issued_date, expiry_date.
- `entrant_events` — permit_id, worker_name, direction (`in|out`), at, recorded_by (inspector), offline_client_id (for dedupe).
- `gas_log_entries` — permit_id, lel, o2, co, so2, tester, recorded_at, offline_client_id.
- `audit_log` — id, permit_id (nullable), actor_id, action, payload_json, prev_hash, hash, created_at. **Insert-only** — no update/delete route ever.
- `notifications` — id, target_role, permit_id, title, created_at, read_by (map of user->bool or separate table).

## Core endpoints

Group by REST-ish resource; adapt casing/pathing to the template's existing style.

**Permits** (`contractor` writes own drafts/submissions; `safety_officer` reads all + approves/rejects/closes; `inspector` reads by QR token)
- `POST /permits` — create draft (contractor).
- `PATCH /permits/:id` — update draft (contractor, only while `DRAFT`).
- `POST /permits/:id/submit` — validate all safety-check ranges + required certs server-side (see shared context), set `PENDING`, notify safety officers.
- `GET /permits` — list, filterable by status/type/contractor/date (role-scoped: contractor sees own; safety_officer/inspector see all).
- `GET /permits/:id` — detail.
- `POST /permits/:id/approve` — safety_officer only; re-validate readings; set `ACTIVE`; issue QR; write audit entry with e-signature metadata.
- `POST /permits/:id/reject` — safety_officer only; requires `reason`; set `REJECTED`; audit entry.
- `POST /permits/:id/mark-complete` — foreman/contractor; Hot Work only; starts `FIRE_MONITOR` 30-min timer.
- `POST /permits/:id/close` — requires closure checklist answers + signature; **403 if any Confined Space entrant is still checked in**; **403 if Hot Work and Fire Watch countdown not yet elapsed**; set `CLOSED`; audit entry.
- `GET /permits/:id/qr` — returns QR payload/token for an `ACTIVE`/`FIRE_MONITOR` permit.
- `GET /permits/qr/:token` — public-ish verify endpoint used by Inspector's scanner; returns **live** status, not a cached snapshot. Rate-limit this route.
- `GET /permits/:id/audit` — audit trail for one permit.

**Certificates**
- `GET/POST /certificates` — contractor manages own workers' certs.
- `GET /certificates/worker/:name` — used by entry-check flow to validate expiry.

**Entrant register** (inspector)
- `POST /permits/:id/entrants/scan` — body includes worker identity + direction; server checks certificate expiry — if expired, deny and write `CERT_BLOCKED` audit entry (`403`); else record `entrant_events` row and return updated register.
- `GET /permits/:id/entrants` — current in/out state.

**Gas log** (inspector)
- `POST /permits/:id/gas-log` — accepts `offline_client_id` for idempotent replay.
- `GET /permits/:id/gas-log` — history, most recent first, flag `overdue` if last reading older than the facility's re-test interval (make this a config constant).

**Offline sync** (inspector)
- `POST /sync/batch` — accepts an array of queued actions (entrant scans, gas log entries), each with a client-generated UUID; process idempotently (skip if UUID already applied); return per-item success/conflict so the client can show conflict UI.

**Audit log**
- `GET /audit` — safety_officer only, facility-wide, filterable by action/date.

**Notifications**
- `GET /notifications` — role-scoped, unread-first.
- `POST /notifications/:id/dismiss`.

**Dashboard/reporting** (safety_officer)
- `GET /dashboard/summary` — counts by status, 7-day activity, expiring-soon certs — whatever aggregation is cheapest given the chosen DB; keep it a single endpoint the frontend can poll.

## Validation rules to implement server-side (authoritative — see shared context for exact ranges)

Implement as a pure, unit-tested function (e.g. `validatePermitReadings(type, readings, outdoorWork)`) called from both `submit` and `approve` so the same rule can't be bypassed by hitting either endpoint directly.

## Non-functional

- Input validation via Elysia's schema/typebox (or whatever the template already uses) on every route.
- Store all timestamps in UTC; the frontend handles `Asia/Bangkok` display.
- Rate-limit `GET /permits/qr/:token` (unauthenticated-ish, field-facing).
- Structured error responses with a machine-readable `code` (e.g. `GAS_OUT_OF_RANGE`, `ENTRANTS_STILL_INSIDE`, `CERT_EXPIRED`, `FIRE_WATCH_NOT_ELAPSED`) so both frontends can localize the message client-side (EN/TH) instead of the backend returning locale-baked strings.

## Tests to write

- Status-machine transitions (valid/invalid transitions rejected).
- Safety-reading validation boundaries (0%, 19.5/23.5%, 50ppm, 25km/h edges).
- Closure blocked while entrants inside / Fire Watch not elapsed.
- Audit hash-chain integrity (tamper detection).
- Sync batch idempotency (replay same client UUID twice → single effect).
