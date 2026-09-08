# Contract gaps — real API vs. this app

Snapshot 2026-08-17, taken against `docs/api/openapi.json` (generated from a live boot of
`../smart-work-permit-api`) and verified with `scripts/smoke-api.mjs` against a running server.

Each row is tagged with the `API-*` item that closed it, or **`open`** where the gap is a backend
change this repo cannot make. The sibling Safety/Inspector app made the same migration first — see
`../smart-work-permit-frontend/docs/api/GAPS.md`.

## Closed

| # | Gap | Fixed by |
|---|---|---|
| 1 | `humps.camelizeKeys` ran on every response. The API is camelCase already, and camelizing rewrites the keys inside `closureChecklist` — free-form user data | `API-002` (dependency removed) |
| 2 | The commented-out request-side `decamelizeKeys` would have renamed `workTimeStart` → `work_time_start` and broken every write | `API-002` (deleted, not re-enabled) |
| 3 | A 401 from the login endpoint triggered logout + a hard redirect, replacing the form's error with a page reload | `API-002` |
| 4 | `useApiError` required `code` to be a **string**; the backend sends the numeric HTTP status there and the machine code in `errorCode`. **Every** coded failure rendered `error.unknown` | `API-004` |
| 5 | The error vocabulary had 4 codes; the backend emits 21 | `API-004` |
| 6 | `ApiError.model` declared a `details` payload the backend never sends | `API-004` |
| 7 | Auth paths were missing the `/user` segment: `/auth/public/login`, `/auth/logout`, `/auth/check-bearer/user` — all three 404 | `API-003` |
| 8 | Login was typed as the `{ message, data }` envelope; it answers `{ success, data }` | `API-003` |
| 9 | `POST /auth/public/check-token-reset-password` does not exist; the reset page called it on mount | `API-003` |
| 10 | Password-reset endpoints were typed `IBaseSuccessResponse<boolean>`; they answer `{ message: 'success' }` with no `data` key | `API-003` |
| 11 | `TUserRole` was the single literal `'contractor'`; the backend has three roles and any of them can sign in here | `API-003` (login now refuses a non-contractor outright) |
| 12 | Four providers resolved from in-memory stubs behind `USE_STUB_DATA` | `API-006`, `API-007`, `API-003` (flags and both `*.mock.ts` deleted) |
| 13 | `IPermitBase.project` and `IPermitDetail.workDescription` do not exist on the API; the wizard sent both and the create call requires `title`, which it never sent | `API-005`, `API-006` |
| 14 | `safetyReadings` (plural) on the detail; the API returns `latestSafetyReading` and PATCH takes `safetyReading`, which **appends** | `API-005` |
| 15 | Workers nested a `healthCheck` object; the wire is flat `bloodPressure` / `alcoholReading` | `API-005` |
| 16 | Author fields were `IAuthor` with `fullName`; the API sends `{ id, email, firstName?, lastName? }` or null | `API-005` |
| 17 | `GET /permits` was called with `status` as an **array**; the endpoint takes one value | `API-005`, `API-006` |
| 18 | Certificates: `id` typed `string \| number`, a `fileRef` the API does not return, and expiry decided client-side while the API computes `expired` per row | `API-007` |
| 19 | `GET /certificates/worker/:name` was typed as an array; it answers one certificate or null | `API-007` |
| 20 | The app's only live network call was `GET /notifications/check?type=…` — an endpoint that does not exist. It 404'd on every page load, and nothing read the result | `API-008` |
| 21 | `GET /file` was typed `{ message, url }` (now `{ message, data: { url } }`) and its `filePath` — a storage key with slashes — was not URL-encoded | `API-008` |
| 22 | Stub fixtures drifted out of the 30-day window, turning the baseline red on a date with no code change | `API-007` (fixtures deleted) |

## Open — need a backend change

| # | Gap | Impact here |
|---|---|---|
| F | ~~The permit has no free-text description field.~~ **Backend half fixed 2026-08-23 (feat-011a):** `Permit.description` is now a nullable `text` column, on `POST /permits` and `PATCH /permits/:id` bodies, and on every permit-detail/list response. The frontend half is still open. | `PMT-005` may now send `description` on create/update, and the detail/review/wizard screens may render it — none of that is wired yet, and this row stays open until a frontend item does |
| G | **`POST /certificates` accepts no attachment field at all.** The request body declares only `workerName, role, certType, issuedDate, expiryDate`; there is no `filePath`/`fileRef` property, no such column on the `Certificate` model, and Elysia strips unknown keys — so the field is discarded silently, with a 200. Row 18 closed the *response* side of this under `API-007` and missed the request side. | **Certificate attachment is non-functional end to end.** The client now uploads the file and sends the correct `filePath` (never the 60-second presigned `fileUrl` — REVIEW-2026-08-19 S4), but nothing is persisted: the file sits in object storage unreferenced and `CertificateCard` renders "No file attached" forever. Until the backend adds the column and the body field, the Add Certificate form warns the user that the attachment was not stored (`certificate.form.attachmentNotStored`). Needed: `filePath?: string` on `CertificateCreateModel.body`, a nullable column on `Certificate`, and the path echoed back on the certificate read shape. |
| J | **The permit has no field for step 3's Yes/No/N-A safety checklist.** `PATCH /permits/:id` declares only `title, location, foreman, workDate, workTimeStart, workTimeEnd, outdoorWork, jsaSteps, workers, safetyReading, photos`, and Elysia strips unknown keys. There is no `checklist` column on the permit model either (the only checklist on the wire is `closureChecklist`, written at close). | `PMT-006` renders the 17/13/14-row checklist the design specifies (design lines 300-311) but **cannot save it**: the answers live in `useWizard`'s own state and are lost on reload, and the Safety Officer never sees them. Deliberately kept out of `formData` so nothing type-lies about the payload. The step says so on screen (`permit.create.steps.safetyChecks.checklistNotStored`) rather than implying it was stored. Needed: a `checklist`/`preWorkChecklist` array of `{ itemKey, answer }` on the PATCH body and a column to hold it — same shape as `closureChecklist`. |
| K | **`safetyReading` has no `so2` field.** The PATCH body declares `{ lel, o2, co, wind, height }` only, while `IPermitSafetyReading` (and `SAFETY_RANGES.requiredByType.confined`) carry SO2, and the design shows an SO2 card on every Confined Space permit (design line ~273). Unknown keys are stripped, so an SO2 value 200s and vanishes. | `PMT-006` renders and validates the SO2 input but `useWizard.toWireReading()` strips it before the PATCH, so the app never claims to have stored it. Harmless to the verdict — SO2 is `blocking: false` (advisory guidance only, per `docs/modules/permit/context.md`), so it can never change a pass/fail. Needed: `so2` on the `safetyReading` PATCH body and on the `SafetyReading` model, echoed back in `latestSafetyReading`. |
| I | **Entrant NAMES are not readable by the permit owner.** (The count is served — row A closed it as `entrantCount`.) `403 ENTRANTS_STILL_INSIDE` carries them only inside the backend-authored English `message`, which clients must never render. `GET /permits/:id/entrants` exists but is inspector-facing, and the public `GET /permits/qr/:token` needs an issued token. | `PMT-011`'s blocked banner can say *that* entrants are still inside and what to do about it, and how many (from the payload's `entrantCount`), but **not** the names the design shows (design line 590). Needed: entrant names on the contractor-readable detail payload, or structured `details` on the 403 body. |

## Closed by the API on 2026-09-08 (wayfinder 042 / 044) — new capability, not a prior gap row

Regenerated `openapi.json` in all three repos (wayfinder 044 adds three `safety_officer`-only
routes; 042 changes nothing in the document — see the note); `node scripts/check-contract-sync.mjs`
green, **33 backend error codes all declared in both frontends**. No new `errorCode`.

| # | Change | What this repo must do |
|---|---|---|
| W1 | **The server-issued demo login is DELETED** (042). `POST /api/v1/auth/demo-login`, `DEMO_LOGIN_ENABLED`, `DEMO_LOGIN_PASSWORD`, `bun run seed:demo` and the seed itself are gone; existing demo accounts are set `active: false` by migration (deactivated, never deleted). Owner ruling: no demo environment will exist, so a credential path that was only safe if the data behind it was worthless has nothing to stand on. **No openapi diff** — the route was mounted conditionally on `DEMO_LOGIN_ENABLED` and `dump-openapi.sh` boots with it unset, so the document never contained it. | Remove the trial/demo buttons and their `VITE_TRIAL_LOGIN` guard from `LoginPage.vue`, the demo-login call from `Auth.public.provider.ts` and its request model, the locale keys in `locales/en/platform.ts` / `th`, and both `LoginPage.trial.test.ts` and `LoginPage.trialFill.test.ts` (delete, do not skip). **DONE 2026-09-08** — all of the above, plus `VITE_TRIAL_LOGIN` out of `.env.example`. Absence proven against a real production build, not by reading the source: `bun run build` then `grep -rF` over `dist/` for `demo-login`, `demoLogin`, `contractor1@mail.com`, `adminadmin`, `VITE_TRIAL_LOGIN`, `Trial account` and `trialFill` — no matches for any of the seven. |
| W2 | **Per-contractor area visibility** (044). A new `AreaGrant` join table plus three `safety_officer`-only routes (`POST`/`DELETE`/`GET /api/v1/areas/:id/grants…`). Behind them, `AREA_VISIBILITY_SCOPED=TRUE` narrows **this app's** `GET /api/v1/areas` to `status = APPROVED AND createdById = me` UNION areas granted to you, composing with the existing `status` filter. **Off by default** — unset is today's behaviour, every approved area visible. Nothing in this app calls the grant routes. | `AreaPicker.vue` already does most of what 044 requires, and the flag turns wayfinder 037's stale-area path from an edge case into the **common** one. Two things must hold: keep emitting `areaId: undefined` (omit the key), never `null`, for a permit whose area is not in the list — the server's guard fires on key presence, so `null` would be a destructive clear; and **show** the permit's current area as a read-only value (resolved via `GET /api/v1/areas/:id`, which is deliberately never scoped) rather than silently dropping it, so a contractor can see what their own permit references. A permit that already names an area must never become unsaveable because the flag was switched on — the `AREA_NOT_APPROVED` guard tests **status, not visibility**, and the API asserts that in `area-visibility-scope.spec.ts`. |

> Wayfinder 043 (a change set in the `PERMIT_WITHDRAWN_FOR_EDIT` audit payload) also landed on the
> API in this pass. It is **officer-facing only** — nothing in this app reads the audit trail — so
> it carries no row here. `docs/main/dev-handoff/04-api-contract.md` gained an **Areas** section in
> the same pass, and its `errorCode` list was corrected from a stale "25 codes" to the real 33.
> Neither is a behaviour change; both were already true.

## Closed by the API on 2026-08-31 (wayfinder 012) — new capability, not a prior gap row

Regenerated `openapi.json` in all three repos (description text only — no route/payload/`errorCode`
change; still the same 28 codes); `node scripts/check-contract-sync.mjs` green.

**Editing a PENDING permit now returns it to DRAFT.** `PATCH /api/v1/permits/:id` is no longer
403 `PERMIT_NOT_EDITABLE` for your own PENDING permit — the edit is admitted and, in the same
transaction, the permit's status atomically flips back to `DRAFT` alongside the field changes.
This is deliberately **not** an in-place edit that leaves the permit PENDING: an officer must never
be able to approve a version they did not read. You must resubmit (`POST /:id/submit`) afterward
like any other DRAFT permit — `PERMIT_POSITION_REQUIRED` still gates that resubmit exactly as it
does for a fresh DRAFT. `position` is accepted in this same PATCH too, because the permit is DRAFT
by the time the write lands. The withdrawal writes a new `PERMIT_WITHDRAWN_FOR_EDIT` audit row and
broadcasts a notification to `safety_officer`/`inspector` (the same two roles submit notifies).

**Frontend-facing implication — wired 2026-08-31 (wayfinder 012, contractor half; see
`progress.md`).** `PermitStatusBanner` now shows a `pending` variant with its own "Edit Permit"
action; clicking it opens `PendingEditWarningModal` (the withdraw/resubmit warning) BEFORE
`PermitEditPage` ever opens — opening that route is itself what performs the withdrawal, via
`useResumePermit`'s existing empty-body `PATCH`. Only "Continue Editing" navigates to the resume
route; "Cancel" leaves the permit untouched and still PENDING.

## Closed by the API on 2026-08-24 (feat-023) — new capability, not a prior gap row

Regenerated `openapi.json` in all three repos; `node scripts/check-contract-sync.mjs` green (28
codes). New `errorCode`: `PERMIT_POSITION_REQUIRED`.

**Facility plan + permit position.** A new `FacilityPlan` module (`GET /v1/facility-plans`,
`GET /v1/facility-plans/active`, `GET /v1/facility-plans/:id` — all any-role; `POST
/v1/facility-plans/upload`, `POST /v1/facility-plans`, `POST /v1/facility-plans/:id/activate` —
all `safety_officer`-only) plus nullable `planId`/`planX`/`planY` (0-100 percentages of the plan
image frame) on `Permit`.

`POST /permits` and `PATCH /permits/:id` accept an optional `position: { planId, planX, planY } |
null` — **only while the permit is DRAFT or REJECTED**; sending it once the permit has left that
window answers the existing `403 PERMIT_NOT_EDITABLE`. `POST /permits/:id/submit` refuses with
`400 PERMIT_POSITION_REQUIRED` once an active plan exists and the permit has no position; before
any plan is ever activated, submit is unchanged, so this is invisible to a deployment that has not
uploaded a plan yet.

**Frontend-facing implication (not wired by this pass, stays open):** `PMT-005`'s wizard can offer
a pin-drop step against `GET /v1/facility-plans/active` while DRAFT, and the create/update forms
must be ready for `400 PERMIT_POSITION_REQUIRED` on submit once a plan exists.

## Closed by a product ruling on 2026-08-23 (feat-022)

| Row | Was | Resolution |
|---|---|---|
| C | No organisation/company concept — `IUser.company` will never be populated | **Closed as WILL NOT EXIST, not as pending work.** The product owner ruled the system single-tenant: one domain is one company, so the deployment *is* the company and there is no `Company` entity to model (`../main/PROMPT-LOG.md`, 2026-08-23). The rejected option was a real `Company` table with a `companyId` on `User`, which would have forced a re-scope of every existing role-scoped query — permits, certificates, dashboard, notifications, audit, sync — where a single miss is a cross-company data leak. `contractorProfile.firmName`, added by `feat-022`, is the **contracting firm** a person works for: descriptive only. **Nothing may be filtered, scoped or secured by it.** Do not re-open this row to "add multi-tenancy" without a new ruling |

## Closed by the API on 2026-08-23 (feat-011c)

Regenerated `openapi.json` in all three repos; `node scripts/check-contract-sync.mjs` green. No new
`errorCode` was added — the vocabulary is still the same 27 codes.

| Row | Was | Now served |
|---|---|---|
| D | `GET /notifications` has no pagination, `limit` only | `GET /notifications` now takes the same `CommonPaginationModel` query (`page`, `limit`, `sortBy`, `sortOrder`, `search`) and answers the same `CommonPaginationResponseModel` envelope (`count`/`page`/`limit`/`totalPage` alongside `data`) as `GET /certificates`. Ordering within a page is still unread-first, computed server-side (a LEFT JOIN against the actor's own `NotificationRead` rows, ordered before pagination — not a client-side re-sort after fetch, which would repeat/skip rows across pages). `Notification.provider.ts`, `NotificationRes.model.ts` and `stores/Notification.ts` were updated to match; `scripts/smoke-api.mjs` now asserts the paginated shape instead of asserting its absence. |

## Closed by the API on 2026-08-22 (feat-020 / feat-021)

Regenerated `openapi.json` in all three repos; `node scripts/check-contract-sync.mjs` green. No new
`errorCode` was added — the vocabulary is still the same 25 codes.

| # | Was | Now served | What this repo can do |
|---|---|---|---|
| H | `POST /permits/:id/close` was guarded `auth: ['safety_officer']`, so a contractor session answered `403 FORBIDDEN_ROLE` before any closure rule was evaluated — `PMT-011`'s built-and-wired modal could never succeed | **`contractor` is admitted on the route, scoped to their own permit** (product-owner ruling, `../main/PROMPT-LOG.md` 2026-08-22). A contractor closing a permit they did **not** create is refused with a `403` carrying **no** `errorCode` — the standard ownership refusal, checked before any status/fire-watch/entrant rule. `safety_officer` keeps access to every permit; `inspector` is still `403 FORBIDDEN_ROLE`. Nothing else about closure is relaxed: `403 ENTRANTS_STILL_INSIDE` and `403 FIRE_WATCH_NOT_ELAPSED` fire identically for a contractor actor, with no override, and the `PERMIT_CLOSED` audit row is still written | `PMT-011`'s closure modal now works end to end for the Foreman. Keep rendering the server's verdict — the ownership refusal has no `errorCode`, so it falls back like a 404 or a validation 400 |

> Also landed in the same pass (no row here — it is a Safety/Inspector-app concern, mirrored as row
> V5 in `../../../smart-work-permit-frontend/docs/api/GAPS.md`): **`POST /permits/:id/reject` now
> *requires* `signature`.** The body is `{ reason, signature }`, both `minLength: 1`; a reject
> without a signature is a `400` with no `errorCode`. The contractor app does not call this route.


## Closed by the API on 2026-08-21 (feat-008 / feat-009 / feat-010)

Regenerated `openapi.json` in all three repos; `node scripts/check-contract-sync.mjs` green. These
rows are **already served** — no backend work is pending on them.

| # | Was | Now served | What this repo can do |
|---|---|---|---|
| A | `GET /permits` returned no entrant count and no fire-watch remainder; only `GET /permits/qr/:token` reported them | `entrantCount: number` and `fireWatch: null \| { startedAt, elapsedSeconds, remainingSeconds, elapsed }` are on **every** list row **and** every permit-detail payload — no QR token needed. Same shapes as the public QR projection. `fireWatch` is `null` unless `status === 'FIRE_MONITOR'`; `remainingSeconds` is clamped at 0; `elapsed: false` is exactly the state in which close answers `403 FIRE_WATCH_NOT_ELAPSED` | Restore the My Permits card's "N inside" badge, and bind `PMT-010`'s countdown to `fireWatch` instead of waiting on a QR token. Render, never recompute |
| B | `status` took exactly one value, so grouped chips fetched unfiltered and narrowed client-side — pagination totals counted every status and pages rendered short | `status` accepts one value (`?status=ACTIVE`), a repeated param (`?status=ACTIVE&status=FIRE_MONITOR`) **or** a comma-joined list (`?status=ACTIVE,FIRE_MONITOR`). All three verified live | Send the whole group and drop the client-side narrowing. `count` / `totalPage` now describe the group |
| E | Submit-time validation returned only the *first* failing code | The 400 body carries `failures: Array<{ field, errorCode, message }>` (safety readings, same item shape as `validationSummary.failures`) and `certificateFailures: Array<{ workerName, errorCode, message }>`. `code` and `errorCode` are unchanged — `errorCode` is still the first failing code — so this is additive | The wizard can list every problem at once. Reuse the `validationSummary` failure component for `failures[]` |

> No new `errorCode` was added by this pass; the vocabulary is still the same 25 codes.


## Closed by the API on 2026-08-19 (backend security/contract fix pass)

Regenerated `openapi.json` in all three repos. These rows are **already served** — no backend work
is pending on them.

| # | Change | What this repo must do |
|---|---|---|
| V1 | **`validationSummary` added to the permit detail payload.** Shape: `{ scope: 'safety_readings', passed: boolean, failures: Array<{ field: 'lel'\|'o2'\|'co'\|'wind', errorCode, message }> }`. Carried by **every** endpoint that returns a permit detail: `GET /api/v1/permits/:id`, `POST /api/v1/permits`, `PATCH /api/v1/permits/:id`, and the `submit` / `approve` / `reject` / `mark-complete` / `close` commands. Computed server-side with the same `validatePermitReadings()` that gates submit and approve. **Scope is safety readings only** — worker-certificate gating (`CERT_MISSING` / `CERT_EXPIRED`) is *not* in this summary. | The Safety Officer review screen renders `validationSummary` and must never recompute a verdict client-side (`../main/CONTEXT.md` §3). Closes `PRE-RUN-FINDINGS.md` P0 #2's backend half. |
| V2 | **`latestSafetyReading` is now typed** on `GET /api/v1/permits/qr/:token` and on the permit detail (was `t.Nullable(t.Any())`, invisible to the contract). Fields: `id, permitId, lel, o2, co, wind, height, recordedById, recordedAt, createdAt` — nullable numbers, nullable object. | Type against the generated schema rather than `any`. |
| V3 | **Upload request is constrained.** `file` declares `maxSize: 10485760` (10 MB) and an accepted-type list (`image/jpeg`, `image/png`, `image/webp`, `image/heic`, `application/pdf`) — note the openapi key for that list renders as `"extension"`, which is Elysia's naming for **MIME types**, not filename extensions. `subFolder` is now an enum of `certificates \| permit-photos \| uploads` instead of a free string. Enforcement is server-side in every case (the `t.File` options are advisory only on Elysia 1.4.28's multipart path), so a violation comes back as a coded 400, not a schema validation error. | Send an allowed `subFolder` (or omit it) and an allowed content type; surface the new error codes below. |
| V4 | **New `errorCode` values emitted:** `FILE_TYPE_NOT_ALLOWED`, `FILE_TOO_LARGE`, `UPLOAD_FOLDER_NOT_ALLOWED`, `STORAGE_UNAVAILABLE`. `RATE_LIMITED` is now also emitted by `POST /auth/user/public/{login,register,user-request-password-reset,user-reset-password}` (it was previously only on the QR scan route). | Add EN + TH strings for the four new codes. The contractor app must also declare them in `EApiErrorCode` or `check-contract-sync.mjs` stays red. |
