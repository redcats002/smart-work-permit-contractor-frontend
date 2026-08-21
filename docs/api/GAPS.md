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
| A | `GET /permits` returns no entrant count and no fire-watch remainder. Only the public `GET /permits/qr/:token` reports `entrantCount` / `fireWatch` | The My Permits card's "N inside" badge was removed — it cannot be populated. `PMT-010`'s detail screen can only show fire-watch state once a QR token exists |
| B | `status` takes a single value | The grouped filter chips ("Active" = ACTIVE + FIRE_MONITOR, "Closed" = CLOSED + REJECTED, History's archive set) fetch unfiltered and narrow client-side, so their pagination totals count every status and a page can render short |
| C | No organisation/company concept | `IUser.company` — shown on the sidebar account card — will never be populated |
| D | `GET /notifications` has no pagination, `limit` only | Fine today; a busy account will outgrow it. `PLT-007` should not build paging against it |
| F | The permit has no free-text description field. The design's "Work description" has nowhere to go | `PMT-005` must not add it to the payload — it would be silently dropped |
| E | Submit-time validation returns only the *first* failing code | The wizard cannot list every problem at once; it surfaces one, the user fixes it, and resubmits |
| G | **`POST /certificates` accepts no attachment field at all.** The request body declares only `workerName, role, certType, issuedDate, expiryDate`; there is no `filePath`/`fileRef` property, no such column on the `Certificate` model, and Elysia strips unknown keys — so the field is discarded silently, with a 200. Row 18 closed the *response* side of this under `API-007` and missed the request side. | **Certificate attachment is non-functional end to end.** The client now uploads the file and sends the correct `filePath` (never the 60-second presigned `fileUrl` — REVIEW-2026-08-19 S4), but nothing is persisted: the file sits in object storage unreferenced and `CertificateCard` renders "No file attached" forever. Until the backend adds the column and the body field, the Add Certificate form warns the user that the attachment was not stored (`certificate.form.attachmentNotStored`). Needed: `filePath?: string` on `CertificateCreateModel.body`, a nullable column on `Certificate`, and the path echoed back on the certificate read shape. |

## Closed by the API on 2026-08-19 (backend security/contract fix pass)

Regenerated `openapi.json` in all three repos. These rows are **already served** — no backend work
is pending on them.

| # | Change | What this repo must do |
|---|---|---|
| V1 | **`validationSummary` added to the permit detail payload.** Shape: `{ scope: 'safety_readings', passed: boolean, failures: Array<{ field: 'lel'\|'o2'\|'co'\|'wind', errorCode, message }> }`. Carried by **every** endpoint that returns a permit detail: `GET /api/v1/permits/:id`, `POST /api/v1/permits`, `PATCH /api/v1/permits/:id`, and the `submit` / `approve` / `reject` / `mark-complete` / `close` commands. Computed server-side with the same `validatePermitReadings()` that gates submit and approve. **Scope is safety readings only** — worker-certificate gating (`CERT_MISSING` / `CERT_EXPIRED`) is *not* in this summary. | The Safety Officer review screen renders `validationSummary` and must never recompute a verdict client-side (`../CONTEXT.md` §3). Closes `PRE-RUN-FINDINGS.md` P0 #2's backend half. |
| V2 | **`latestSafetyReading` is now typed** on `GET /api/v1/permits/qr/:token` and on the permit detail (was `t.Nullable(t.Any())`, invisible to the contract). Fields: `id, permitId, lel, o2, co, wind, height, recordedById, recordedAt, createdAt` — nullable numbers, nullable object. | Type against the generated schema rather than `any`. |
| V3 | **Upload request is constrained.** `file` declares `maxSize: 10485760` (10 MB) and an accepted-type list (`image/jpeg`, `image/png`, `image/webp`, `image/heic`, `application/pdf`) — note the openapi key for that list renders as `"extension"`, which is Elysia's naming for **MIME types**, not filename extensions. `subFolder` is now an enum of `certificates \| permit-photos \| uploads` instead of a free string. Enforcement is server-side in every case (the `t.File` options are advisory only on Elysia 1.4.28's multipart path), so a violation comes back as a coded 400, not a schema validation error. | Send an allowed `subFolder` (or omit it) and an allowed content type; surface the new error codes below. |
| V4 | **New `errorCode` values emitted:** `FILE_TYPE_NOT_ALLOWED`, `FILE_TOO_LARGE`, `UPLOAD_FOLDER_NOT_ALLOWED`, `STORAGE_UNAVAILABLE`. `RATE_LIMITED` is now also emitted by `POST /auth/user/public/{login,register,user-request-password-reset,user-reset-password}` (it was previously only on the QR scan route). | Add EN + TH strings for the four new codes. The contractor app must also declare them in `EApiErrorCode` or `check-contract-sync.mjs` stays red. |
