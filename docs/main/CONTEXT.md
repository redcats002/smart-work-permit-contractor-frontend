# SmartWorkPermit — Cross-Repo Context

**Read this first if you are working in more than one of the three repos, or if you are about to
change anything that crosses a repo boundary (API shape, error code, role, status machine).**

Inside a single repo, that repo's own `AGENTS.md` + `feature_list.json` + `progress.md` remain
authoritative for how to work there. This file only covers what no single repo can own.

---

## 1. The three repos (read the mapping carefully — directory names mislead)

| Directory | What it actually is | Task doc | Roles served |
|---|---|---|---|
| `smart-work-permit-api/` | The single backend. Bun + Elysia + Prisma/Postgres + Better Auth. | `01-backend-elysia-tasks.md` | all three |
| `smart-work-permit-contractor-frontend/` | **Contractor** web app (Vue, desktop-first responsive) | `02-contractor-web-vue-tasks.md` | `contractor` |
| `smart-work-permit-frontend/` | **Safety Officer + Inspector** app (Vue, mobile-first, role-gated) | `03-safety-inspector-web-vue-tasks.md` | `safety_officer`, `inspector` |

> **Name trap.** `smart-work-permit-frontend` is *not* the contractor app — it is the Safety/Inspector
> app. Worse, **both** frontends declare `"name": "smart-work-permit-frontend"` in `package.json`.
> Identify a frontend by its `docs/modules/` directory, never by its name:
> Contractor → `platform, permit, history, certificate, api-integration`.
> Safety/Inspector → `platform, permit-core, safety-officer, inspector, api-integration`.

Each repo is its own git repository. The workspace root holding them (this directory,
`…/work-permit/app`) is **also** a git repo since 2026-08-23 — it versions this file,
`PROMPT-LOG.md`, `docs/main/`, `scripts/` and `.claude/agents/`, which were versioned nowhere before.
The three app repos are **gitignored there, not vendored as submodules**: how they are cloned,
branched and pushed is unchanged.

The root has **no remote**. It is the *edit origin* for the two glue files, not their distribution
channel — so both are **copied into each repo** (`docs/main/CONTEXT.md`, `docs/main/PROMPT-LOG.md`)
and each repo's `AGENTS.md` points at its own copy. **Edit the root copy, never a repo copy**, then
re-run the one-liner below. `check-contract-sync.mjs` check 4 fails if they drift.

```bash
# from the workspace root, after editing CONTEXT.md or PROMPT-LOG.md
for r in smart-work-permit-api smart-work-permit-contractor-frontend smart-work-permit-frontend; do
  cp CONTEXT.md PROMPT-LOG.md "$r/docs/main/"
done
node scripts/check-contract-sync.mjs
```

Shared source material lives in `docs/main/` and is **copied** into each repo (same relative path),
not symlinked:
`docs/main/dev-handoff/00-SHARED-CONTEXT.md` (product model, roles, status machine, safety ranges),
the four task docs, and `docs/main/SmartWorkPermit-v3.dc.html` (UX/copy reference — a spec, never
code to port).

---

## 2. The API contract is the glue

`smart-work-permit-api/docs/openapi.json` is the **single source of truth** for every wire shape.
It is generated from a live boot of the backend by `smart-work-permit-api/scripts/dump-openapi.sh`.

Both frontends keep a byte-identical copy at `docs/api/openapi.json`, plus prose derived from it:

- `smart-work-permit-frontend/docs/api/CONTRACT.md` — the target contract, prose form.
- `smart-work-permit-contractor-frontend/docs/main/dev-handoff/04-api-contract.md` — same, contractor scope.
- both repos' `docs/api/GAPS.md` — where the app and the API still disagree, each row tagged
  `frontend-adapts` (that repo fixes it) or `api-adds` / `open` (the **backend** must fix it).

**Propagation rule.** Any backend change that alters a route, payload, or error code:

1. `cd smart-work-permit-api && ./scripts/dump-openapi.sh` — regenerate `docs/openapi.json`.
2. Copy it over **both** frontends' `docs/api/openapi.json`.
3. Update the affected `CONTRACT.md` / `04-api-contract.md` prose and close the matching `GAPS.md` row.
4. Run `node scripts/check-contract-sync.mjs` from the workspace root (see §5).

Never hand-edit a frontend's `openapi.json`. A frontend that needs a shape the API does not serve
files a row in its own `GAPS.md` under `api-adds` / `open` — it does not invent the shape locally.

### Wire invariants both frontends depend on

- **Base path**: every route is under `/api/v1`. The two frontends place it differently — the
  Safety/Inspector app puts it in the HTTP client's `baseURL` (`API_PREFIX`), the Contractor app in
  each provider's `urlPrefix`. Both are fine; mixing them inside one repo yields `/api/v1/api/v1`,
  which `check-contract-sync.mjs` catches.
- **Casing**: the API is camelCase end to end. Do not add `humps`/`decamelize` transforms — they
  rewrite user data inside `closureChecklist`.
- **Success envelope**: `{ message: 'success', data }` (paginated adds `count`, `page`, `totalPage`, `limit`).
- **Error envelope**: `{ code: <http status>, message, errorCode? }`. `code` is the HTTP status,
  **not** a discriminator. `message` is backend-authored English and **must never be rendered** —
  clients localize off `errorCode` (EN/TH). `errorCode` is deliberately absent on 404s, ownership
  403s and request-validation 400s; clients fall back for those.
- **Auth**: Better Auth session cookie, not a bearer header.

### Error-code vocabulary (closed set, emitted by the backend)

`LEL_MISSING`, `O2_MISSING`, `CO_MISSING`, `WIND_MISSING`, `GAS_OUT_OF_RANGE`, `WIND_OUT_OF_RANGE`,
`CERT_MISSING`, `CERT_EXPIRED`, `PERMIT_NOT_EDITABLE`, `PERMIT_NOT_SUBMITTABLE`,
`PERMIT_NOT_ACTIVE`, `PERMIT_NOT_PENDING`, `PERMIT_NOT_CLOSABLE`, `NOT_HOT_WORK`,
`ENTRANTS_STILL_INSIDE`, `FIRE_WATCH_NOT_ELAPSED`, `INVALID_QR_TOKEN`, `RATE_LIMITED`,
`UNAUTHENTICATED`, `FORBIDDEN_ROLE`, `USER_ALREADY_EXISTS`,
`FILE_TYPE_NOT_ALLOWED`, `FILE_TOO_LARGE`, `UPLOAD_FOLDER_NOT_ALLOWED`, `STORAGE_UNAVAILABLE`,
`ACCOUNT_DEACTIVATED`, `LAST_SAFETY_OFFICER`, `PERMIT_POSITION_REQUIRED`.

> `FILE_*` / `UPLOAD_*` / `STORAGE_UNAVAILABLE` were added by the backend on 2026-08-19 (upload
> hardening, `REVIEW-2026-08-19.md` S1–S3/C1). `ACCOUNT_DEACTIVATED` and `LAST_SAFETY_OFFICER` were
> added 2026-08-23 with contractor management (`feat-022`): accounts are deactivated, never deleted,
> so a switched-off account must not read as "wrong password" at sign-in or as "wrong role" on a
> request. `PERMIT_POSITION_REQUIRED` was added 2026-08-24 with the facility plan + permit position
> feature (`feat-023`): once an active facility plan exists, `POST /permits/:id/submit` refuses a
> permit with no `planId`/`planX`/`planY` set. All are declared with EN/TH strings in both apps —
> `check-contract-sync.mjs` reports **28 backend error codes all declared in both frontends**.
> `RATE_LIMITED` is unchanged but is now emitted by the four public auth routes as well as the QR
> scan route.

`CERT_BLOCKED` is an **audit action**, not an error code — an entry-denial answers `403 CERT_EXPIRED`
or `403 CERT_MISSING` and *writes* a `CERT_BLOCKED` audit row.

Adding a code is a three-repo change: emit it in the backend → add it to the contractor's
`EApiErrorCode` enum → add EN + TH strings in both frontends' locale files. `check-contract-sync.mjs`
fails if the contractor enum and the backend drift **and** if the Safety/Inspector app's
`src/utils/ApiError.ts` (its `API_ERROR_CODES` array and `ErrorCodeToI18nKey` map — it has no
equivalent enum) drifts, so a green contract-sync is evidence both apps can localize the full
vocabulary.

---

## 3. Business rules that must not drift

These are stated once in `docs/main/dev-handoff/00-SHARED-CONTEXT.md` and enforced
**server-side** — a frontend may mirror them for instant feedback, but the server response is
always authoritative and the client must surface the server's verdict when the two disagree.

- Status machine: `DRAFT → PENDING → REJECTED | ACTIVE → (hot only) FIRE_MONITOR → CLOSED`; `EXPIRED`
  from `PENDING`/`ACTIVE` when the work window lapses.
- Safety ranges: LEL `0%` (hot, confined; skippable only when `outdoorWork: true`), O₂ `19.5–23.5%`
  (hot, confined), CO `≤ 50 ppm` (confined), wind `≤ 25 km/h` (heights). No override.
- Closure blocked (`403`) while any Confined Space entrant is checked in, or while the Hot Work
  30-minute Fire Watch is still running.
- Expired/missing certificate blocks submission **and** field entry. No field override.
- **Facility plan + permit position** (`feat-023`, 2026-08-24). A **facility plan** is the
  uploaded, cropped floor-plan image; a **plan version** is immutable and retained forever —
  replacing the plan creates a new version, never overwrites one. A **position** is
  `planId`/`planX`/`planY` (0–100, percentages of the plan frame) on a `Permit`. The **contractor**
  sets the position while the permit is DRAFT or REJECTED (the same editable window every other
  field gets — REJECTED stays in scope so reject-with-reason can fix a wrong pin); it is **frozen
  from PENDING onward** for everyone, officers included — no route accepts a position change
  outside that window. `planId` records the plan VERSION a pin was placed on, not necessarily the
  active one, so a client can detect **stale-plan** (`planId` ≠ the active plan's id) instead of
  silently mis-plotting it; **unplaced** means no position at all. Position is required to submit
  **only once an active plan exists** — refused with `400 PERMIT_POSITION_REQUIRED` (§2);
  permits predating the first activated plan are grandfathered unplaced, no backfill. Writing the
  plan image is gated far more tightly than the generic upload route: `POST
  /v1/facility-plans/upload` is `safety_officer`-only, and the generic `POST /v1/upload` route
  cannot target the `facility-plans` prefix even if asked (defense in depth at both the schema
  and the service layer — see `upload.service.ts`). Cropping happens only before activation; once
  a version is activated its frame is frozen (there is no edit route at all, by design).
- Audit log is append-only with a server-signed hash chain. Never expose an edit or delete path.
- Timestamps stored UTC; displayed `Asia/Bangkok`. Default UI locale is **Thai**; every string is
  translated EN + TH.

The Safety/Inspector app must **not** recompute validation client-side on the review screen — it
renders the backend's pass/fail summary. Since 2026-08-19 that summary is on the wire as
`validationSummary` on every permit-detail payload:
`{ scope: 'safety_readings', passed: boolean, failures: Array<{ field, errorCode, message }> }`.
Its scope is **safety readings only** — certificate gating is enforced at submit and is not in it.

---

## 4. Running all three locally

```bash
# backend — needs Postgres + Redis + MinIO already running. See "Infrastructure" below:
# there is NO compose file that starts them, and `docker compose up -d` here does not do it.
cd smart-work-permit-api && bun install && bun run prisma:migrate && bun run seed && bun run dev   # :3000

cd smart-work-permit-contractor-frontend && bun install && bun run dev   # vite :8080
cd smart-work-permit-frontend            && bun install && bun run dev   # vite :8080 — COLLIDES
```

**Infrastructure — you must provide it yourself.** The backend needs Postgres, Redis and MinIO.
`smart-work-permit-api/docker-compose.yml` does **not** start them: it defines a single `api`
service that builds and runs the backend's own image, and it references `NODE_ENV`, `ENV_FILE` and
`HOST_PORT`, none of which are set by default. Running `docker compose up -d` there gets you a
failed build, not a database. This document previously told you to run it — that was wrong, and it
is worth knowing that **Redis is a hard load-time dependency**: `libs/plugins/redis.plugin.ts`
constructs its client at module scope, so a missing Redis is not a degraded QR endpoint, it is a
boot-time connection error that reads like a code bug. Point `DATABASE_URL`, the Redis URL and the
MinIO credentials at instances you started yourself. *Follow-up worth doing: add a real infra
compose file, so this paragraph can be deleted.*

**Port collision:** both frontends default to vite port 8080 with `strictPort: false`, so the second
one started silently lands on 8081 and any absolute-URL/CORS assumption made for 8080 breaks. Start
one at a time, or pin the second with `bun run dev --port 8081`.

**CORS + cookies:** auth is a credentialed cookie, so `CORS_ORIGIN=*` cannot work — the backend must
name the exact frontend origin(s) it is serving. If login "succeeds" but every later call is 401,
this is why.

Build order: **the backend ships first.** Both frontends have a mock gateway and can run without it,
but a green frontend `./init.sh` only proves the app agrees with its own mock — it is not evidence
against the real API. Real-API evidence means a live smoke run against a booted backend.

---

## 5. Deployment — the settled cross-repo rulings

Full runbooks live per repo at `deploy/RUNBOOK.md`. Only what crosses a repo boundary is here.

- **Topology.** API + Postgres + Redis + MinIO + nginx + cloudflared on one VM (Oracle
  `E2.1.Micro`, x86_64, **1 OCPU / 1 GB, unresizable**); both SPAs on Cloudflare Pages. Nothing
  on the VM listens publicly — `cloudflared` dials out, inbound is SSH only.
- **One apex domain, four subdomains:** `api.` `storage.` `app.` `safety.`. This is a hard
  requirement — the session cookie is issued on the apex, so `*.pages.dev` frontends would make
  it cross-site and Safari ITP would drop it.
- **`COOKIE_DOMAIN=.<domain>` is what makes that work**, and it was *not* implemented until
  2026-08-23: `user-auth.plugin.ts` now enables better-auth `crossSubDomainCookies` when the var
  is set, and drops back to `SameSite=Lax` because apex subdomains are same-site.
  `smart-work-permit-api/scripts/check-cookie-domain.sh` asserts the issued cookie.
- **`MINIO_ENDPOINT` is the PUBLIC host** (`storage.<domain>:443`, SSL on), never the compose
  service name. `uploadOne` hands its presigned URL straight to the browser and the host is part
  of the SigV4 signature. Cost: server-side puts hairpin out through the tunnel. Bucket CORS is
  **not** needed as things stand — those URLs are only ever bound to `<img :src>`, which is not
  CORS-gated. It becomes needed the day anything fetches the storage origin with `fetch`/XHR.
- **`dev` is the deploy branch** in all three repos. `origin/main` is stale.
- **`check-contract-sync.mjs` is not in frontend CI.** It lives in this workspace root, which is a
  separate repo that gitignores the three app repos, so their pipelines cannot run it. It stays a
  local pre-push check — run it yourself before pushing a contract change.
- **Offline is not deployed.** `13-safety-inspector-web-deployment.md` §6–§7 describe a service
  worker, an IndexedDB queue and `POST /sync/batch`; `vite-plugin-pwa` is installed in neither
  frontend and the endpoint does not exist. That doc describes an intended feature, not the
  shipped app.
- **Password-reset links have one destination.** `MANAGEMENT_URL` is a single value, so reset
  emails point at one app while both have a `/reset-password` route. Open product decision, not
  a deploy step — see the backend runbook §3.
- The handoff docs `10`–`13` predate the current code — env var names, entrypoint, Docker build
  shape and CI branch all differ. Each repo's `deploy/RUNBOOK.md` ends with a deviation table;
  **the runbook wins**.

---

## 6. Cross-repo verification

```bash
./init.sh                              # from the workspace root: all three repos + the glue check
node scripts/check-contract-sync.mjs   # just the glue check
```

`check-contract-sync.mjs` is the only check that can catch a break no single repo can see:

1. all three `openapi.json` copies are byte-identical;
2. every `errorCode` the backend emits is declared in the contractor app's `EApiErrorCode` enum
   **and** in the Safety/Inspector app's `API_ERROR_CODES` array + `ErrorCodeToI18nKey` map
   (one-way: a declared-but-unemitted code is legal, an emitted-but-undeclared one is not);
3. each frontend applies the `/api/v1` prefix exactly once — in the client or in the providers,
   never both;
4. `CONTEXT.md` and `PROMPT-LOG.md` are byte-identical between the workspace root and all three
   repos' `docs/main/` copies — an agent reading a stale copy is how a settled ruling gets
   re-litigated.

A red row here means a repo boundary has drifted — fix the drift, do not relax the check.

---

## 7. Working across repos

- **One repo at a time.** A change spanning repos lands backend-first, then the openapi copy +
  contract prose, then each frontend. Record the cross-repo half in each repo's own `progress.md`.
- Per-repo state files (`feature_list.json`, `progress.md`, `session-handoff.md`,
  `docs/modules/<module>/`) are the record of work. This file deliberately holds **no** feature
  registry — do not add one here, it would go stale against three live registries.
- Open backend work requested by the frontends lives in their `GAPS.md` (`api-adds` / `open` rows)
  and is mirrored as open items in `smart-work-permit-api/feature_list.json`. Closing one means
  editing both.
