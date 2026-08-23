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
| D | `GET /notifications` has no pagination, `limit` only | Fine today; a busy account will outgrow it. `PLT-007` should not build paging against it |
| F | The permit has no free-text description field. The design's "Work description" has nowhere to go | `PMT-005` must not add it to the payload — it would be silently dropped |
| G | **`POST /certificates` accepts no attachment field at all.** The request body declares only `workerName, role, certType, issuedDate, expiryDate`; there is no `filePath`/`fileRef` property, no such column on the `Certificate` model, and Elysia strips unknown keys — so the field is discarded silently, with a 200. Row 18 closed the *response* side of this under `API-007` and missed the request side. | **Certificate attachment is non-functional end to end.** The client now uploads the file and sends the correct `filePath` (never the 60-second presigned `fileUrl` — REVIEW-2026-08-19 S4), but nothing is persisted: the file sits in object storage unreferenced and `CertificateCard` renders "No file attached" forever. Until the backend adds the column and the body field, the Add Certificate form warns the user that the attachment was not stored (`certificate.form.attachmentNotStored`). Needed: `filePath?: string` on `CertificateCreateModel.body`, a nullable column on `Certificate`, and the path echoed back on the certificate read shape. |
| J | **The permit has no field for step 3's Yes/No/N-A safety checklist.** `PATCH /permits/:id` declares only `title, location, foreman, workDate, workTimeStart, workTimeEnd, outdoorWork, jsaSteps, workers, safetyReading, photos`, and Elysia strips unknown keys. There is no `checklist` column on the permit model either (the only checklist on the wire is `closureChecklist`, written at close). | `PMT-006` renders the 17/13/14-row checklist the design specifies (design lines 300-311) but **cannot save it**: the answers live in `useWizard`'s own state and are lost on reload, and the Safety Officer never sees them. Deliberately kept out of `formData` so nothing type-lies about the payload. The step says so on screen (`permit.create.steps.safetyChecks.checklistNotStored`) rather than implying it was stored. Needed: a `checklist`/`preWorkChecklist` array of `{ itemKey, answer }` on the PATCH body and a column to hold it — same shape as `closureChecklist`. |
| K | **`safetyReading` has no `so2` field.** The PATCH body declares `{ lel, o2, co, wind, height }` only, while `IPermitSafetyReading` (and `SAFETY_RANGES.requiredByType.confined`) carry SO2, and the design shows an SO2 card on every Confined Space permit (design line ~273). Unknown keys are stripped, so an SO2 value 200s and vanishes. | `PMT-006` renders and validates the SO2 input but `useWizard.toWireReading()` strips it before the PATCH, so the app never claims to have stored it. Harmless to the verdict — SO2 is `blocking: false` (advisory guidance only, per `docs/modules/permit/context.md`), so it can never change a pass/fail. Needed: `so2` on the `safetyReading` PATCH body and on the `SafetyReading` model, echoed back in `latestSafetyReading`. |
| I | **Entrant NAMES are not readable by the permit owner.** (The count is served — row A closed it as `entrantCount`.) `403 ENTRANTS_STILL_INSIDE` carries them only inside the backend-authored English `message`, which clients must never render. `GET /permits/:id/entrants` exists but is inspector-facing, and the public `GET /permits/qr/:token` needs an issued token. | `PMT-011`'s blocked banner can say *that* entrants are still inside and what to do about it, and how many (from the payload's `entrantCount`), but **not** the names the design shows (design line 590). Needed: entrant names on the contractor-readable detail payload, or structured `details` on the 403 body. |

## Closed by a product ruling on 2026-08-23 (feat-022)

| Row | Was | Resolution |
|---|---|---|
| C | No organisation/company concept — `IUser.company` will never be populated | **Closed as WILL NOT EXIST, not as pending work.** The product owner ruled the system single-tenant: one domain is one company, so the deployment *is* the company and there is no `Company` entity to model (`../main/PROMPT-LOG.md`, 2026-08-23). The rejected option was a real `Company` table with a `companyId` on `User`, which would have forced a re-scope of every existing role-scoped query — permits, certificates, dashboard, notifications, audit, sync — where a single miss is a cross-company data leak. `contractorProfile.firmName`, added by `feat-022`, is the **contracting firm** a person works for: descriptive only. **Nothing may be filtered, scoped or secured by it.** Do not re-open this row to "add multi-tenancy" without a new ruling |

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
