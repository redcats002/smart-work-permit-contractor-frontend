# 04 — Real API contract & integration guide (Contractor web app)

The backend (`smart-work-permit-api`, Elysia + Prisma + better-auth) is **built and running**. This
document replaces the assumptions in `01-backend-elysia-tasks.md` wherever the two disagree: that file
was the plan, this is what the server actually does.

**Source of truth is `docs/api/openapi.json`** in this repo — generated from a live boot, never
hand-edited. Regenerate it after any backend change:

```bash
cd ../smart-work-permit-api && ./scripts/dump-openapi.sh     # writes docs/openapi.json
cp ../smart-work-permit-api/docs/openapi.json docs/api/openapi.json
```

Prose below summarizes; on any conflict the JSON wins. Every statement here was verified against a
running server on 2026-08-17, not read off the source.

---

## 1. Invariants

| Thing | Value |
|---|---|
| Base path | `/api/v1` — app prefix `/api` + module prefix `/v1/<module>` |
| Casing | camelCase in **both** directions. Do **not** run humps over requests or responses |
| Success body | `{ "message": "success", "data": … }` |
| Paginated body | `{ "message", "data": [], "count", "page", "limit", "totalPage" }` |
| Pagination query | `page=1`, `limit=10`, `sortBy=createdAt`, `sortOrder=desc`, `search=''` |
| Error body | `{ "code": <http status>, "message": string, "errorCode"?: string }` |
| Dates out | ISO-8601 UTC strings |
| Dates in | `workDate`, `issuedDate`, `expiryDate`, `dateFrom`, `dateTo` → `YYYY-MM-DD`; `workTimeStart`, `workTimeEnd` → full ISO datetime |

Two responses deliberately break the success envelope: **login** answers `{success, data:{token,user}}`
and the health route `GET /` (outside `/api`) answers a bare object. Everything else is enveloped.

`workDate` is asymmetric — you **send** `2026-08-18`, you **get back** `2026-08-18T00:00:00.000Z`.
Format it for display; do not feed the response value straight back into a `<input type="date">`.

Enums, exactly:

| Enum | Values |
|---|---|
| `PermitType` | `hot` `confined` `heights` |
| `PermitStatus` | `DRAFT` `PENDING` `REJECTED` `ACTIVE` `FIRE_MONITOR` `CLOSED` `EXPIRED` |
| `UserRole` | `contractor` `safety_officer` `inspector` — **there is no `admin`** |
| `JsaPhase` | `pre` `process` `post` |
| `EntrantDirection` | `IN` `OUT` (uppercase) |

---

## 2. Auth — session cookie, not bearer

`Authorization: Bearer <token>` returns **401**. Verified: no better-auth bearer plugin is mounted.
The session lives in a cookie.

```
POST /api/v1/auth/user/public/login   { email, password }        # password min length 8
  → 200 { success: true, data: { token, user: { id, name, firstName, lastName, email, image, role } } }
  → Set-Cookie: better-auth.session_token=…            (dev:  SameSite=Lax, no Secure)
  → Set-Cookie: __Secure-better-auth.session_token=…   (prod: SameSite=None; Secure)
```

- `user.role` is the domain role (`permitRole` in the DB). Route by it; a contractor account always
  reports `contractor`.
- The returned `token` is **not** an API credential here. Keep it only as a client-side "is logged in"
  marker if your router guard wants one.
- The cookie **name** changes between dev and prod — better-auth adds the `__Secure-` prefix when
  `useSecureCookies` is on, which is `NODE_ENV === 'production'`. Never hardcode the name.

Client requirements:

1. `withCredentials: true` on the axios instance (already set in this repo's `HttpRequest.ts`).
2. The API's `CORS_ORIGIN` must name this app's exact origin — credentialed CORS refuses `*`. Ask for
   your dev origin to be added; the API's `.env.example` ships
   `CORS_ORIGIN="http://localhost:8080,http://localhost:8081"`.

Other auth routes: `POST /auth/user/logout`, `POST /auth/user/public/user-request-password-reset`
`{email}`, `POST /auth/user/public/user-reset-password` `{newPassword, token}`,
`GET /auth/user/check-bearer/user` (session probe).

Two things that do **not** exist, despite appearing in older docs or in this repo's provider:
`pre-login`, `check-token-reset-password`, and every `*-branch` endpoint (`active-branches`,
`select-active-branch`, `approve-branch`, `reject-branch`) — those are lending-app leftovers. Also,
better-auth's own `/api/auth/*` routes are **not mounted**; only the routes listed here exist.

Self-registration is disabled in this deployment (`USER_DISABLE_SIGNUP`). Contractor accounts are
provisioned by a safety officer via `POST /api/v1/users`.

---

## 3. What a contractor account may call

Role column below: **✅** allowed for `contractor`, **⛔** 403 `FORBIDDEN_ROLE`, **\*** any signed-in user.

### Permits — `/api/v1/permits`

| Method | Path | Contractor | Notes |
|---|---|---|---|
| GET | `/` | \* | Paginated. **Scoped to your own permits automatically** — the `contractorId` filter is ignored for contractor accounts. Filters: `status` (**multi-value**, see §4), `type`, `dateFrom`, `dateTo`; `search` matches id/title/location/foreman. Every row carries the live `entrantCount` / `fireWatch` fields |
| POST | `/` | ✅ | `{type, title, location, foreman, workDate, workTimeStart, workTimeEnd, outdoorWork?}` → `DRAFT`, id `WP-{HOT\|CONF\|HT}-{YYYYMMDD}-{NNN}` |
| GET | `/:id` | \* | Full detail, including live `entrantCount` / `fireWatch`. 403 on someone else's permit |
| PATCH | `/:id` | ✅ | The wizard's save. All fields optional — see §4 |
| POST | `/:id/submit` | ✅ | → `PENDING`. This is where server-side validation bites — see §5 |
| POST | `/:id/mark-complete` | ✅ | **Hot work only** → `FIRE_MONITOR`, starts the 30-minute fire watch. 403 `NOT_HOT_WORK`, 403 `PERMIT_NOT_ACTIVE` |
| POST | `/:id/approve` | ⛔ | safety_officer |
| POST | `/:id/reject` | ⛔ | safety_officer — body is `{reason, signature}`; **both required** since 2026-08-22 (`signature` was optional, now matches approve). The typed e-signature lands on the `PERMIT_REJECTED` audit row |
| POST | `/:id/close` | ✅ | **Foreman closure — admitted for `contractor` since 2026-08-22**, scoped to a permit you created (someone else's answers 403 with **no** `errorCode`; safety_officer may close any). Body `{checklist, signature}` → `CLOSED`. Nothing else relaxed: 403 `PERMIT_NOT_CLOSABLE`, 403 `FIRE_WATCH_NOT_ELAPSED` until the 30-minute countdown finishes, 403 `ENTRANTS_STILL_INSIDE` while a Confined Space entrant is checked in. No override |
| GET | `/:id/qr` | \* | `{ token }`. 403 `PERMIT_NOT_ACTIVE` until approved |
| GET | `/qr/:token` | public | Live status projection: `{id,type,title,location,status,entrantCount,fireWatch,latestSafetyReading}`. Rate-limited 30 req/60 s → 429 `RATE_LIMITED` |
| GET | `/:id/entrants` | \* | `[{workerName, checkedInAt}]` — who is currently inside |
| GET | `/:id/gas-log` | \* | `{ data: entries, overdue: boolean }` — note `overdue` sits **beside** `data` |
| POST | `/:id/gas-log` | ⛔ | inspector |
| POST | `/:id/entrants/scan` | ⛔ | inspector |
| GET | `/:id/audit` | \* | Hash-chained audit rows for your permit |

### Certificates — `/api/v1/certificates`

| Method | Path | Contractor | Notes |
|---|---|---|---|
| GET | `/` | \* | Paginated, scoped to your own. Rows carry a **computed `expired`** — do not recompute it |
| POST | `/` | ✅ | `{workerName, role, certType, issuedDate, expiryDate}` |
| GET | `/worker/:name` | \* | One cert or `null` |

### Everything else

| Method | Path | Contractor | Notes |
|---|---|---|---|
| GET | `/api/v1/notifications` | \* | `limit` only (default 50), **no pagination envelope**, unread first |
| POST | `/api/v1/notifications/:id/dismiss` | \* | id is **numeric** |
| POST | `/api/v1/upload` | \* | multipart `file`, optional `subFolder` → `{fileUrl, filePath, fileType, originalName}` |
| GET/DELETE | `/api/v1/file?filePath=` | \* | signed URL / delete |
| GET | `/api/v1/audit` | ⛔ | safety_officer — facility-wide log |
| GET | `/api/v1/dashboard/summary` | ⛔ | safety_officer |
| POST | `/api/v1/sync/batch` | ⛔ | inspector — offline replay |
| POST | `/api/v1/users` | ⛔ | safety_officer — account provisioning |

---

## 4. The permit wizard against `PATCH /api/v1/permits/:id`

One endpoint backs every step. All fields optional; send only what the step changed.

```jsonc
{
  "title": "…", "location": "…", "foreman": "…",
  "workDate": "2026-08-18",
  "workTimeStart": "2026-08-18T01:00:00.000Z",
  "workTimeEnd": "2026-08-18T09:00:00.000Z",
  "outdoorWork": false,

  // REPLACED WHOLESALE — send the full list every time, not a delta
  "jsaSteps": [{ "phase": "pre", "step": "…", "hazard": "…", "control": "…", "sortOrder": 0 }],
  "workers":  [{ "workerName": "…", "roleOnPermit": "…", "bloodPressure": "…", "alcoholReading": "…" }],

  // APPENDS a new reading row; the permit exposes only the latest one back
  "safetyReading": { "lel": 0, "o2": 20.9, "co": 3, "wind": 12, "height": 8 },

  // UPSERT per slotKey. fileRef is the `filePath` returned by POST /upload
  "photos": [{ "slotKey": "before", "fileRef": "permits/abc.jpg", "originalName": "…", "fileType": "image/jpeg" }]
}
```

403 `PERMIT_NOT_EDITABLE` once the permit leaves `DRAFT`.

The permit detail response shape (what you render):

```jsonc
{
  "id": "WP-HOT-20260817-001", "type": "hot", "status": "DRAFT",
  "title": "…", "location": "…", "foreman": "…",
  "workDate": "…", "workTimeStart": "…", "workTimeEnd": "…", "outdoorWork": false,
  "createdById": "…", "createdBy": { "id", "email", "firstName", "lastName" } | null,
  "createdAt": "…", "updatedAt": "…",
  "submittedAt": null, "approvedById": null, "approvedBy": null, "approvedAt": null,
  "rejectedReason": null, "rejectedAt": null,
  "closedById": null, "closedBy": null, "closedAt": null, "closureChecklist": {…},
  "fireMonitorStartedAt": null, "qrIssuedAt": null,

  "entrantCount": 0,            // live: workers whose latest entrant event is IN
  "fireWatch": null,            // live: null unless status === 'FIRE_MONITOR' — see below

  "jsaSteps": [ … ],            // FLAT, each with a `phase` — group client-side
  "workers":  [ … ],            // `workerName`, not `name`
  "photos":   [ … ],
  "latestSafetyReading": { … } | null   // singular, and named this — not `safetyReading`
}
```

Author fields (`createdBy`, `approvedBy`, `closedBy`) are **objects or null**, never name strings.

### Live fields — `entrantCount` and `fireWatch`

On the **list** and on **every permit-detail payload**, no QR token required. The public
`GET /permits/qr/:token` reports the same two fields in the same shapes.

```jsonc
"entrantCount": 3,            // workers whose most recent entrant event is IN
"fireWatch": {                // null unless status === 'FIRE_MONITOR'
  "startedAt": "2026-08-21T04:00:00.000Z",   // ISO-8601 UTC
  "elapsedSeconds": 600,
  "remainingSeconds": 1200,   // clamped at 0, never negative
  "elapsed": false            // false === close answers 403 FIRE_WATCH_NOT_ELAPSED
}
```

Both are server-computed. Render them; never recompute the verdict — `fireWatch.elapsed` is the
closure guard's own answer. This is what the My Permits card's "N inside" badge and the detail
screen's countdown bind to.

### Multi-value `status` filter on `GET /permits`

Three accepted forms, all equivalent: `?status=ACTIVE`,
`?status=ACTIVE&status=FIRE_MONITOR`, `?status=ACTIVE,FIRE_MONITOR`. Grouped chips
("Active" = `ACTIVE` + `FIRE_MONITOR`, "Closed" = `CLOSED` + `REJECTED`, History's archive set)
must filter **server-side** — `count` / `totalPage` then describe the group rather than every
status, so pages stop rendering short. An unrecognised value is a plain `400` with no `errorCode`.

---

## 5. Errors — map the code, never render the message

Complete `errorCode` vocabulary:

```
GAS_OUT_OF_RANGE  LEL_MISSING  O2_MISSING  CO_MISSING  WIND_MISSING  WIND_OUT_OF_RANGE
CERT_EXPIRED  CERT_MISSING  ENTRANTS_STILL_INSIDE  FIRE_WATCH_NOT_ELAPSED
PERMIT_NOT_ACTIVE  PERMIT_NOT_PENDING  PERMIT_NOT_EDITABLE  PERMIT_NOT_SUBMITTABLE
PERMIT_NOT_CLOSABLE  NOT_HOT_WORK  INVALID_QR_TOKEN  RATE_LIMITED  USER_ALREADY_EXISTS
UNAUTHENTICATED  FORBIDDEN_ROLE
FILE_TYPE_NOT_ALLOWED  FILE_TOO_LARGE  UPLOAD_FOLDER_NOT_ALLOWED  STORAGE_UNAVAILABLE
```

25 codes. The last four were added by the backend's 2026-08-19 upload-hardening pass
(`docs/api/GAPS.md` rows V3/V4). `RATE_LIMITED` is unchanged but is now emitted by the public auth
routes (`login`, `register`, `user-request-password-reset`, `user-reset-password`) as well as the
QR scan route — of those, only `login` and `user-reset-password` are called from this app.

404s, ownership 403s and request-validation 400s carry **no** `errorCode` — its absence is normal.
Map what you get to localized EN/TH copy and fall back to a generic string; the backend's `message` is
English developer text and must never reach a user.

The codes the contractor app will actually hit, and where:

| Flow | Codes |
|---|---|
| `POST /:id/submit` | `LEL_MISSING` `O2_MISSING` `CO_MISSING` `WIND_MISSING` `GAS_OUT_OF_RANGE` `WIND_OUT_OF_RANGE` `CERT_MISSING` `CERT_EXPIRED` (HTTP **400** — the body now lists **every** failure, see below), `PERMIT_NOT_SUBMITTABLE` (403) |
| `PATCH /:id` | `PERMIT_NOT_EDITABLE` |
| `POST /:id/mark-complete` | `NOT_HOT_WORK`, `PERMIT_NOT_ACTIVE` |
| `GET /:id/qr` | `PERMIT_NOT_ACTIVE` |
| any guarded route | `UNAUTHENTICATED` (401), `FORBIDDEN_ROLE` (403) |

Which readings are **required** depends on the permit type (server-enforced at submit): `lel` for
hot/confined when `outdoorWork` is false, `o2` for hot/confined, `co` for confined, `wind` for heights.
Thresholds are LEL `0%`, O₂ `19.5–23.5%`, CO `≤50 ppm`, wind `≤25 km/h`; fire watch 30 min; gas
re-test 30 min; cert warning 30 days.

### Submit failure body — every failure, not just the first

`POST /permits/:id/submit` answers 400 with the standard envelope plus two arrays, so the wizard can
list all problems in one pass instead of one-fix-one-resubmit:

```jsonc
{ "code": 400,
  "message": "…",                 // every failure message joined with '; ' — never rendered
  "errorCode": "LEL_MISSING",     // the FIRST failing code, unchanged — still the discriminator
  "failures": [                   // safety readings
    { "field": "lel", "errorCode": "LEL_MISSING", "message": "…" },
    { "field": "o2",  "errorCode": "O2_MISSING",  "message": "…" }
  ],
  "certificateFailures": [        // blocking worker certificates, keyed by worker
    { "workerName": "Krit Boonmee", "errorCode": "CERT_MISSING", "message": "…" }
  ] }
```

`failures[]` items are the **same shape** as `validationSummary.failures` on the detail payload, so
one component renders both. Certificate failures are keyed by worker rather than by reading field,
which is why they are a separate array and not part of that closed `field` union. Both arrays are
always present on a submit 400 (possibly empty); `code` and `errorCode` are unchanged, so an older
client that only reads `errorCode` keeps working.

**Validation is server-authoritative.** Show the server's verdict. Client-side range hints are fine as
UI affordance, but the submit result is the truth.

---

## 6. Integration recipe

This repo's `HttpRequest.ts` / `Interceptors.ts` came from the same template as the safety/inspector
app, so it has the same four mismatches. The equivalent changes there are done and green; mirror them.

**1. Put the prefix in the baseURL, not in each provider.**

```ts
export const API_PREFIX = '/api/v1'
this.url = `${url ?? import.meta.env.VITE_APP_API_URL ?? ''}${API_PREFIX}`
```

Then a provider's `urlPrefix` is just `/permits`, `/certificates`, … Strip any hardcoded `/api/v1`.

**2. Unwrap the envelope once, in `onResponse`.**

```ts
const body: any = response.data
const isEnvelope = typeof body === 'object' && !Array.isArray(body)
  && body.message === 'success' && 'data' in body

if (isEnvelope) {
  const rest = { ...body }
  delete rest.message
  // Siblings (pagination's count/page/limit/totalPage, the gas log's `overdue`) must survive —
  // unwrapping straight to `data` silently drops the field the screen exists to show.
  return Promise.resolve(Object.keys(rest).length > 1 ? rest : rest.data)
}
return Promise.resolve(body)   // login's { success, data }, blobs, xlsx
```

Providers then type the payload directly (`Promise<IPermitDetail>`), and list providers type
`Promise<IBasePaginationResponse<T>>` = `{ data, count, page, limit, totalPage }`.

**3. Delete the humps conversion, both directions.** The API is camelCase. Camelizing responses is not
merely redundant — it rewrites the keys inside `closureChecklist` and any free-form payload object,
corrupting user data. (The request-side `decamelizeKeys` is commented out in this repo today; delete it
rather than ever re-enabling it — it would rename `workTimeStart` to `work_time_start` and break every
write.)

**4. Error handling.** Reject with the raw `{code, message, errorCode}`; key your i18n off `errorCode`.
401 still means "log out and go to login" — the session cookie is gone or expired.

**Smoke check.** The safety/inspector repo ships `scripts/smoke-api.mjs`, which logs in against a
running API and asserts these shapes (envelope, pagination, error bodies, permit detail keys). It skips
cleanly when no API is reachable. Copying it is cheaper than discovering a shape drift in a page test.

---

## 7. Known gaps

- `GET /notifications` has no pagination — `limit` only.
- Notification ids are numeric; permit ids are strings (`WP-…`); certificate ids are numeric.
- The audit log is hash-chained (`hash`, `prevHash`) and append-only; there is no mutation endpoint.
