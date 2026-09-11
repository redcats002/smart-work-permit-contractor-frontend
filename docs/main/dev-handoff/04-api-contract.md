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
| PATCH | `/:id` | ✅ | The wizard's save. All fields optional — see §4. Works on your own `DRAFT`/`REJECTED` permit, and — **since 2026-08-31** — your own `PENDING` permit too: editing a `PENDING` permit atomically withdraws it back to `DRAFT` in the same request (it is never an in-place edit that leaves it `PENDING`), so you must resubmit afterward |
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

### Areas — `/api/v1/areas`

An **Area** is a named place in the facility the work is located in — flat, no nesting (wayfinder
034/036). You propose one; it is `PENDING` and **unusable by any permit** until a safety officer
approves it. There is no edit route by design: a corrected proposal is a fresh `POST`.

| Method | Path | Contractor | Notes |
|---|---|---|---|
| GET | `/` | \* | Paginated; `status` filter. `AreaPicker.vue` asks for `status=APPROVED` — see the scoping note below |
| POST | `/` | ✅ | `{name, position?}` → `PENDING` |
| GET | `/:id` | \* | One area, **any status, never scoped**. This is what lets a permit always display its own area, including one you cannot see in the list |
| POST | `/:id/approve` \| `/:id/reject` | ⛔ | safety_officer |
| POST/DELETE/GET | `/:id/grants…` | ⛔ | safety_officer — visibility grants, below |

`Permit.areaId` is nullable and may reference only an `APPROVED` area (`400 AREA_NOT_APPROVED`
otherwise — and the guard fires on the **key's presence**, not on whether the value changed, which
is why the picker emits `areaId: undefined` rather than `null` for a stale reference). It is
optional at submit unless the deployment sets `PERMIT_AREA_REQUIRED=TRUE` (`400 AREA_REQUIRED`).

**Visibility scoping — `AREA_VISIBILITY_SCOPED`** (wayfinder 044, API half landed 2026-09-08).
Off by default; unset is today's behaviour, every approved area visible. When a deployment sets it
to `TRUE`, `GET /areas` returns, for a contractor, `status = APPROVED AND createdById = me` UNION
the areas a safety officer has granted to you. It composes with the `status` filter rather than
replacing it.

What this repo has to get right, and it is exactly wayfinder 037's autosave trap made **common
rather than exceptional**:

- A permit may reference an area that is no longer in your list. `GET /areas/:id` still resolves
  it (that route is deliberately unscoped), so **show it as a read-only value** rather than
  silently dropping it — the contractor should be able to see what their own permit references.
- Keep emitting `areaId: undefined` (omit the key) for such a permit, never `null`. `undefined`
  means "leave unchanged"; `null` is a deliberate clear and is a different, destructive statement.
- **The permit still saves.** The `AREA_NOT_APPROVED` guard tests an area's status, never its
  visibility, so a permit referencing an ungranted-but-approved area saves and autosaves normally.
  If a permit ever becomes unsaveable because this flag was switched on, that is a bug, not the
  design.

### Facility Plans & Pins — `/api/v1/facility-plans`, `/api/v1/pins` (wayfinder 104/107)

Replaces the old `GET /facility-plans/active?areaId=` (feat-023/069) — plans are now a **flat set
of named places** with immutable images, no group, no area scoping. A `Pin` is a named position on
a plan, placed by safety; the contractor only ever selects one via `Permit.pinId`.

| Method | Path | Contractor | Notes |
|---|---|---|---|
| GET | `/facility-plans/` | \* | Paginated; `?active=true\|false` filter, omit for everything |
| GET | `/facility-plans/:id` | \* | One plan, any status — never scoped, so a pin on a retired plan still resolves its image |
| POST/POST(activate)/POST(deactivate) | `/facility-plans/…` | ⛔ | safety_officer |
| GET | `/pins/` | \* | Paginated; `?planId=` and/or `?active=`. `?active=true` is the contractor's picker: only pins that are themselves active AND on a currently-active plan |
| GET | `/pins/:id` | \* | One pin, any status — resolves a retired pin so a permit that already references it still displays |
| POST/PATCH/POST(deactivate) | `/pins/…` | ⛔ | safety_officer — place/rename/deactivate |

`Permit.pinId` is nullable; `null` clears it, omitted leaves it unchanged. `PERMIT_POSITION_REQUIRED`
gates submit once an active pin on an active plan exists anywhere (a global fact, not scoped to the
permit's own area) — grandfathered permits from before the first pin was ever placed submit unpinned.

### Everything else

| Method | Path | Contractor | Notes |
|---|---|---|---|
| GET | `/api/v1/notifications` | \* | paginated (feat-011c) — `page`/`limit`/`sortBy`/`sortOrder`/`search`, same envelope as `/certificates`; unread first within the page |
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

  // wayfinder 105/107 — `null` clears a pin; omitted leaves it unchanged. Replaces the old
  // `position`/`planId`/`planX`/`planY` (feat-023) AND the old `mapUrl`/`latitude`/`longitude`
  // (wayfinder 068, reversed) — the pin knows its own plan, so this is the only position field
  // `PATCH`/`POST /permits` accept now. `areaId` is unaffected and rides alongside it, independently.
  "pinId": 12,
  "areaId": 5,

  // REPLACED WHOLESALE — send the full list every time, not a delta
  "jsaSteps": [{ "phase": "pre", "step": "…", "hazard": "…", "control": "…", "sortOrder": 0 }],
  "workers":  [{ "workerName": "…", "roleOnPermit": "…", "bloodPressure": "…", "alcoholReading": "…" }],

  // APPENDS a new reading row; the permit exposes only the latest one back
  "safetyReading": { "lel": 0, "o2": 20.9, "co": 3, "wind": 12, "height": 8 },

  // UPSERT per slotKey. fileRef is the `filePath` returned by POST /upload
  "photos": [{ "slotKey": "before", "fileRef": "permits/abc.jpg", "originalName": "…", "fileType": "image/jpeg" }]
}
```

> **`workDate`/`workTimeStart`/`workTimeEnd` above predate wayfinder 067** (replaced on the wire by
> `startDate`/`endDate`/`dailyStart`/`dailyEnd`/`scheduleNote`) and this snippet was not updated
> for that change before now — flagged here rather than silently left wrong, but a full rewrite of
> this doc's date fields is a separate piece of work from wayfinder 107 (`docs/api/openapi.json`
> is the authority in the meantime, per this file's own preface).

Allowed while the permit is `DRAFT`, `REJECTED`, or (since 2026-08-31, wayfinder 012) your own
`PENDING` permit — editing a `PENDING` permit atomically returns it to `DRAFT` in the same request,
so you must resubmit afterward. `PERMIT_POSITION_REQUIRED` still gates that resubmit exactly as it
would for a fresh `DRAFT`. 403 `PERMIT_NOT_EDITABLE` once the permit is `ACTIVE`, `FIRE_MONITOR`,
`CLOSED`, or `EXPIRED`.

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

  "pinId": null,                // wayfinder 105/107. null until safety-placed pin is picked
  "areaId": null,                // wayfinder 037. null, or an APPROVED area's id

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
ACCOUNT_DEACTIVATED  LAST_SAFETY_OFFICER  PERMIT_POSITION_REQUIRED  CLOSURE_REASON_REQUIRED
PERMIT_UPDATE_EMPTY  AREA_NOT_APPROVED  AREA_NOT_PENDING  AREA_REQUIRED
```

**33 codes.** This line said 25 until 2026-09-08 and was eight behind reality; the authoritative
count is whatever `node scripts/check-contract-sync.mjs` reports from the workspace root, which
machine-checks `EApiErrorCode` against what the backend actually emits. The last eight came from
`feat-022` (contractor management), `feat-023` (permit position), wayfinder 020/022 and wayfinder
036 (the Area entity). Wayfinder 042, 043 and 044 added **no** new code.

The first four of the upload group were added by the backend's 2026-08-19 upload-hardening pass
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

- ~~`GET /notifications` has no pagination — `limit` only.~~ Fixed 2026-08-23 (feat-011c): real `page`/`limit` pagination, same `CommonPaginationModel`/`CommonPaginationResponseModel` envelope as `/certificates`.
- Notification ids are numeric; permit ids are strings (`WP-…`); certificate ids are numeric.
- The audit log is hash-chained (`hash`, `prevHash`) and append-only; there is no mutation endpoint.
