# e-safework — Cross-Repo Context

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

There is a fourth repo, `smart-work-permit-landing/` — the marketing page. It is gitignored
here on the same terms, and it is deliberately **not** part of anything in this document: no
openapi copy, no error-code vocabulary, no `/api/v1` prefix, and `check-contract-sync.mjs`
stays a three-repo check. It links to the two app subdomains and nothing else. Its own
`AGENTS.md` is authoritative for work inside it.

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

### Terms from CR round 3 (2026-09-10) — built

Shipped the same day they were decided. The ruling behind each is in `PROMPT-LOG.md` session 12; the
ticket that landed it is in `docs/wayfinder/map-permit-ux-and-inspector.md`.

| Term | What it means | Ticket |
|---|---|---|
| work window | `startDate`/`endDate` + `dailyStart`/`dailyEnd` — a daily window repeating across a date range. **Replaced** the single-day `workDate` + `workTimeStart`/`workTimeEnd`, which no longer exist. `dailyStart`/`dailyEnd` are `@db.Time`: a time-of-day with **no date part**, so a per-row date component cannot make `dailyStart <= other.dailyEnd` compare nonsense. **Clients must render them through a local-time conversion**, never as a UTC wall clock — the backfill preserved each permit's instant, and a UTC render shifts every migrated permit by the deployment's offset with nothing failing. | 067 |
| schedule note | Free text for what the window cannot express ("not working Sat/Sun"). Nothing queries it. | 067 |
| ~~permit coordinate~~ | **REMOVED by wayfinder 105.** `latitude`/`longitude` and the map-URL parser are deleted; a permit's place is `pinId` alone. Left listed rather than deleted because a reader who remembers it needs to learn it is gone. | 068, 105 |
| ~~area drawing~~ | **REMOVED by wayfinder 104/106.** `FacilityPlan.areaId`, the group-scoped `active` and the `GET /facility-plans/active` fallback are all deleted — so "a plan came back" and "this area has a drawing" are no longer different facts, because there are no areas. A plan is a **named place**; its pins are `Pin` rows. | 069, 081, 104, 106 |
| `InspectorVisit` | One append-only record per scan-started inspector run, with its notes and photos. It **references** entrant events and gas logs rather than owning them, and it changes no `Permit` field — the inspector witnesses, the foreman closes. | 073, 074 |
| `noteType` | `GENERAL \| WARNING \| CORRECTIVE_ACTION \| EMERGENCY \| INCIDENT`. **Destinations differ and are explicit** (`NOTE_TYPE_ROUTING`, wayfinder 102): `EMERGENCY` and `INCIDENT` reach safety officers **and the permit's owner**; `CORRECTIVE_ACTION` reaches the owner only; `GENERAL` and `WARNING` push to nobody and are read in the timeline. **None of the five changes permit state** — the inspector witnesses, the foreman closes. | 073, 102 |
| gas interval | `GAS_LOG_RETEST_INTERVAL_MINUTES` (120) + `GAS_LOG_RETEST_GRACE_MINUTES` (30), server-owned, exposed on the permit payload as `gasReadingStatus`. **Clients render that verdict and never recompute the threshold.** Both the gas-log `overdue` flag and the alert sweep read one shared computation. | 073, 075 |
| certificate vocabulary | **`ECertType` is now 1:1 with `PermitType`** — `Gas Testing` was dropped by wayfinder 096, and with it the role→certType map, since the permit type alone decides which certificate is required. `ECertType` and `EWorkerRole` remain **compiled-in constants, not Prisma enums and not admin tables** — real `workers.role` values include `Welder` and `ช่างซ่อมบำรุง`, matching no closed set, so the vocabulary is enforceable at the **gate** and not at the column until the data is cleaned. `CERT_TYPE_REQUIRED` is off by default; with it on, a permit type requires its matching `certType` at both the submit check and the entrant scan. | 050, 086 |

**Still decided-but-not-built:** nothing from this round. Two capabilities the round proved missing
are open questions rather than queued terms — whether a contractor may read inspector visits
(wayfinder 083) and how a plan version is retired, since `activate` always leaves exactly one active
per group (wayfinder 084, `docs/api/GAPS.md` row X1).

### Terms queued by CR round 4 (2026-09-11) — decided and approved, not yet built

Approved 2026-09-11; tickets 094-114 are in flight. Listed so nobody invents a competing name while
they land, and **so nobody keeps using the terms being removed**. Rulings: `PROMPT-LOG.md` session
13. Map: `docs/wayfinder/map-round-4-pins-closure-and-the-inspector-menu.md`. **098's, 099's, 104's,
105's and 106's API halves are the exception — built 2026-09-11**, marked below; both frontend
halves and every other row in this table remain not-yet-built.

| Term | What it will mean | Ticket |
|---|---|---|
| `Pin` — **API built** | A named position on a `FacilityPlan`, **placed by safety**. Names editable, **positions frozen**, deactivated never deleted. The contractor selects one; they no longer place their own. | 104 |
| `FacilityPlan` (revised) — **API built** | A flat set of **named places** with **immutable images** — not a version chain. A new scan is a new plan; the old one is deactivated. | 104 |
| `pinId` on `Permit` — **API built** | Replaces `planId`/`planX`/`planY`. One reference instead of five columns; the pin knows its plan. | 105 |
| requested-close — **API built** | A permit whose closure has been **requested** by a contractor or inspector, awaiting safety. Safety may also close directly, with a reason. **Not a new `PermitStatus`** — a flag (`closeRequestedAt`/`By`/`Role`/`Reason`) on whatever status the permit already holds (ACTIVE or FIRE_MONITOR), decided and recorded in `close-request.service.ts`'s header comment; every status-keyed query (dashboard counts, area occupancy, expiry sweep) needed no change. `GET /permits?closeRequested=true` is the queue this flag doesn't get for free from a status filter. | 098 |
| `'system'` scan provenance — **API built** | A third value beside [017](docs/wayfinder/tickets/017-audit-log-scan-provenance.md)'s `scan`/`manual`, written only by `close.service.ts`'s auto-checkout (below), never client-asserted. | 098 |
| worker "not available" — **API built** | A worker on the permit who is **not on site** (didn't show, sent home, unfit, reassigned), with a required note. Lives on `PermitWorker` (`notAvailable`/`notAvailableNote`/`notAvailableAt`/`notAvailableById`/`notAvailableBy`), **not** an `EntrantEvent` — the entry log answers "who was inside", and a third `direction` value would invert that for every reader. `POST /permits/:id/entrants/not-available` (`inspector`, ACTIVE/FIRE_MONITOR only). A worker marked not-available can still check in later — `POST /permits/:id/entrants/scan` direction `IN` clears the flag. | 099 |
| PPE vocabulary | Seven items, **one shared constant** across the API and both frontends. The contractor declares; the inspector checks the declared subset and may flag an undeclared gap. | 097 |
| `PPE_REQUIRED` | New `errorCode` (400, wayfinder 097): a permit submitted with no PPE declared, **only when the `PPE_REQUIRED` flag is on** — off by default, like `CERT_TYPE_REQUIRED`. `EPpeItem` is a **closed** wire enum (unlike `certType`, it has no legacy data to tolerate), so an unrecognised item is a 400 at the model layer, not a silent strip. | 097 |
| `CERT_LICENCE_OR_ATTACHMENT_REQUIRED` | New `errorCode` (400): a certificate create or update whose **final** state has neither a licence number nor an attachment. The server re-checks only when the patch touches `licenceNo` or `filePath`, so pre-095 rows with neither stay editable for unrelated fields. **A form that round-trips its whole model — sending `licenceNo: ''` or `filePath: null` for untouched fields — will trip this on every pre-095 certificate.** Omit untouched fields. | 095 |
| `licenceNo` | A certificate's licence number. **A certificate needs a licence number OR an attachment** — at least one. | 095 |

**Being removed — stop writing new code against these:**

| Term | Fate | Ticket |
|---|---|---|
| `Area`, `AreaGrant`, `AREA_VISIBILITY_SCOPED` | **Deleted from the API** (2026-09-11). `Pin` carries what it carried; the overlap warning re-keys to `pinId` and survives — proven with a test both before and after removal. `PERMIT_AREA_REQUIRED` and its `AREA_REQUIRED` gate are deleted with it. Both frontends still reference `Area` — that removal is a later ticket. | 106 |
| area drawing (`FacilityPlan.areaId`) | Deleted with Area — subsumed by named plans. | 104, 106 |
| permit coordinate (`latitude`/`longitude`) | **Deleted**, with its URL parser. | 105 |
| `Worker.role` | **Deleted from the API** (2026-09-11). `PermitWorker.roleOnPermit` (template + free entry, permit-type filtered) is the surviving concept — `EWorkerRole` survives as its template list. Existing values were copied onto that worker's `PermitWorker.roleOnPermit` rows where empty, never overwriting; a worker with no `PermitWorker` rows lost the value (3 of 13 in dev — see `smart-work-permit-api/progress.md`). Both frontends are off it: contractor `319411c3`; the safety app never read it. | 103 |
| `Gas Testing` (`ECertType`) | Dropped — `certType` becomes 1:1 with `PermitType`. | 096 |

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

### Cross-repo consistency

Five repos describe one system: the workspace root, three app repos, and the landing page.
`CONTEXT.md`, `PROMPT-LOG.md` and `openapi.json` are byte-identical across the root and the three
app repos, enforced by `scripts/check-contract-sync.mjs`.

**The obligation is wider than the checker.** Any change that makes a statement in another repo
false must be corrected there in the same session — a status machine, a safety threshold, a role
list, an error-code list, a lifecycle description, or landing-page copy describing a feature. The
checker verifies four files; every other claim across the five repos is the author's
responsibility. A document describing behaviour the code no longer has is worse than no document,
because it is trusted.

Landing-page copy counts. It states shipped server-side thresholds and the real status machine
deliberately, not marketing approximations, so a rule change in the API is a landing-page change.

### Error-code vocabulary (closed set, emitted by the backend)

`LEL_MISSING`, `O2_MISSING`, `CO_MISSING`, `WIND_MISSING`, `GAS_OUT_OF_RANGE`, `WIND_OUT_OF_RANGE`,
`CERT_MISSING`, `CERT_EXPIRED`, `PERMIT_NOT_EDITABLE`, `PERMIT_NOT_SUBMITTABLE`,
`PERMIT_NOT_ACTIVE`, `PERMIT_NOT_PENDING`, `PERMIT_NOT_CLOSABLE`, `NOT_HOT_WORK`,
`ENTRANTS_STILL_INSIDE`, `FIRE_WATCH_NOT_ELAPSED`, `INVALID_QR_TOKEN`, `RATE_LIMITED`,
`UNAUTHENTICATED`, `FORBIDDEN_ROLE`, `USER_ALREADY_EXISTS`, `WORKER_ALREADY_EXISTS`,
`FILE_TYPE_NOT_ALLOWED`, `FILE_TOO_LARGE`, `UPLOAD_FOLDER_NOT_ALLOWED`, `STORAGE_UNAVAILABLE`,
`ACCOUNT_DEACTIVATED`, `LAST_SAFETY_OFFICER`, `PERMIT_POSITION_REQUIRED`,
`CLOSURE_REASON_REQUIRED`, `PERMIT_UPDATE_EMPTY`, `AREA_NOT_APPROVED`, `AREA_NOT_PENDING`,
`AREA_REQUIRED`, `PPE_ITEM_NOT_DECLARED`, `PPE_GAP_ALREADY_DECLARED`,
`PPE_GAP_REQUIRES_CORRECTIVE_ACTION`, `PPE_CHECKLIST_EMPTY`, `SCAN_WINDOW_EXPIRED`.

> `SCAN_WINDOW_EXPIRED` (403) was added 2026-09-11 (wayfinder 101, ruling 15) on
> `POST /permits/:id/inspector-visits` with `source: "history"`: this inspector has no server-recorded
> `PermitScan` of the permit, or its last one is past `min(scannedAt + 12h, workWindowEndInstant)`.
> A scan is recorded on `GET /qr/:token` for a signed-in inspector **unless `?viaHistory=true`** — a
> reopen from history must send it, or it would refresh the window forever.

> `FILE_*` / `UPLOAD_*` / `STORAGE_UNAVAILABLE` were added by the backend on 2026-08-19 (upload
> hardening, `REVIEW-2026-08-19.md` S1–S3/C1). `ACCOUNT_DEACTIVATED` and `LAST_SAFETY_OFFICER` were
> added 2026-08-23 with contractor management (`feat-022`): accounts are deactivated, never deleted,
> so a switched-off account must not read as "wrong password" at sign-in or as "wrong role" on a
> request. `PERMIT_POSITION_REQUIRED` was added 2026-08-24 with the facility plan + permit position
> feature (`feat-023`): once an active facility plan exists, `POST /permits/:id/submit` refuses a
> permit with no `planId`/`planX`/`planY` set (that gate is now keyed on `pinId` — see
> `pinId` on `Permit` in section 1; `planId`/`planX`/`planY` no longer exist). `AREA_NOT_APPROVED`,
> `AREA_NOT_PENDING` and `AREA_REQUIRED` were added 2026-09-01 with the Area entity (ticket 036).
> **All three are now dormant** (ticket 106, 2026-09-11, deleted `Area` and every gate that could
> throw them — same "declared-but-unemitted code is legal" convention this section already
> established for `ENTRANTS_STILL_INSIDE`). They stay listed and declared with EN/TH strings in
> both apps rather than being stripped out, since nothing is gained by churning two frontends'
> localization tables to remove a code that will simply never arrive over the wire again.
> **Do not quote a count here.** This line said 33 while the
> script reported 34, because the vocabulary grows and a number written into prose does not. Run
> `node scripts/check-contract-sync.mjs` — it prints the current count and is the only trustworthy
> answer.
> `RATE_LIMITED` is unchanged but is now emitted by the four public auth routes as well as the QR
> scan route.

> `PPE_ITEM_NOT_DECLARED`, `PPE_GAP_ALREADY_DECLARED`, `PPE_GAP_REQUIRES_CORRECTIVE_ACTION` and
> `PPE_CHECKLIST_EMPTY` were added 2026-09-11 (wayfinder 120, one PPE vocabulary on the inspector
> visit checklist) on `POST /permits/:id/inspector-visits/:visitId/submit`. An unrecognised PPE
> item inside `worn`/`undeclaredGaps` is still a plain request-validation 400 with no `errorCode`
> (each is a closed-enum array element, rejected per item at the wire, same as `ppeDeclared`) —
> these four codes are for the business-logic verdicts a schema cannot express: a `worn` item the
> permit never declared, an `undeclaredGaps` item that IS declared, an undeclared gap flagged with
> no `CORRECTIVE_ACTION`-or-more-severe note to carry it through the existing `CORRECTIVE_ACTION`
> routing, and a `ppeChecklist` present but carrying none of `worn`/`undeclaredGaps`/`note` — the
> shape a pre-120 client's now-unrecognised flat body strips down to, which would otherwise record
> a silent "nothing checked" success. Localized in both frontends (contractor
> `3458303a`, safety `2ae6d605`). **Deploy ordering:** the api must not ship ahead of the safety
> app's checklist — `PPE_CHECKLIST_EMPTY` makes that loud rather than silent, but it is still a
> field outage.

> `WORKER_ALREADY_EXISTS` was added 2026-09-09 with the Worker entity (wayfinder 059/060, see
> section 3). It is a `409` carrying `workerId` — the id of the worker the caller already
> registered under that name — because an inline "create worker" should select the existing one
> rather than strand the user on an error they cannot act on. Only the contractor app can provoke
> it; the safety app declares it so the shared envelope stays exhaustive.

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

### A worker is a record, not a name (wayfinder 059/060, 2026-09-09)

Until 2026-09-09 a worker was a free-text `workerName` on three tables, joined by string. The same
person could be entered under two spellings, and the two certificate gates — submit and entrant
scan — matched that name with **no contractor scope**, so one contractor's certificate satisfied
another's gate while their own suggestion list could never show it.

`Worker` is now an entity, owned by the contractor **account** that registered them
(`ContractorProfile.firmName` remains descriptive and is **not** a tenant key; this deployment is
single-tenant). `Certificate`, `PermitWorker` and `EntrantEvent` all carry `workerId NOT NULL`;
none of them has a `workerName` column any more.

What each frontend must know:

- **Identity is the id.** A permit worker row, a certificate and an entrant scan all send
  `workerId`. Names are echoed in responses for display and are never accepted as identity.
- **Uniqueness is per contractor, case- and whitespace-insensitive.** Enforced on a derived
  `nameKey`, never on `name`. Clients never send `nameKey`.
- **The worker's QR card encodes the `workerId`.** An offline scanner has nothing to resolve a
  name against; this is why the identity moved onto the card.
- **A worker is a name. `PermitWorker.roleOnPermit` is what they do on one permit** — the only
  role field left after wayfinder 103 deleted `Worker.role` (which used to be "who a person is",
  asked once at registration). `Certificate.role` was dropped earlier (059/060) for the same
  reason: it only ever copied the person's role onto every card. `EWorkerRole` survives as
  `roleOnPermit`'s template list (template + free entry, permit-type filtered) — free text,
  validated against nothing server-side, same as before.
- **Retirement is `deletedAt`.** A worker referenced by a permit is never hard-deleted.
- **Contractors read and write their own workers; safety officers and inspectors read all.** The
  same branch `GET /certificates` already applies.

These are stated once in `docs/main/dev-handoff/00-SHARED-CONTEXT.md` and enforced
**server-side** — a frontend may mirror them for instant feedback, but the server response is
always authoritative and the client must surface the server's verdict when the two disagree.

- Status machine: `DRAFT → PENDING → REJECTED | ACTIVE → (hot only) FIRE_MONITOR → CLOSED`; `EXPIRED`
  from `PENDING`/`ACTIVE` when the work window lapses — except that an **ACTIVE Hot Work permit is
  granted the Fire Watch duration as grace** past the **end of its work window** — `workWindowEndInstant()`,
  which is `endDate`'s calendar day at `dailyEnd`'s clock time, not `endDate` alone and not `dailyEnd`
  alone (wayfinder 067; this used to read `workTimeEnd`, a column that no longer exists) — because a Fire
  Watch is by definition the period *after* hot work stops, so a hot permit's safety obligation
  always outlives its work window (2026-08-31, `PROMPT-LOG.md` session 13). Expiry never *starts* a
  Fire Watch: a Fire Watch is a person, and the system must never record a control no human
  performed. A permit already in `FIRE_MONITOR` never expires. **One edge runs backwards**: a contractor
  editing their own `PENDING` permit returns it to `DRAFT` in the same transaction as the edit
  (2026-08-31, `PROMPT-LOG.md` session 11). It is not an in-place edit — an officer must never be
  able to approve a version they did not read, so the permit leaves the review queue rather than
  mutating inside it, and the contractor resubmits.
  **`requested-close` is not a machine state** (wayfinder 098, 2026-09-11): a contractor or
  inspector asking for closure sets a flag (`closeRequestedAt`/`By`/`Role`/`Reason` on `Permit`)
  without moving the permit off whatever status it already holds — ACTIVE or FIRE_MONITOR. See
  §1's round-4 terms table for the decision and why a new status was rejected. Nothing above this
  paragraph changes: the flag is orthogonal to every arrow in the diagram, including the backwards
  one.
- Safety ranges: LEL `0%` (hot, confined; skippable only when `outdoorWork: true`), O₂ `19.5–23.5%`
  (hot, confined), CO `≤ 50 ppm` (confined), wind `≤ 25 km/h` (heights). No override.
- **Closure is `safety_officer`-only** (wayfinder 098, 2026-09-11 — reverses the prior "the
  Foreman's act" ruling and round 3's own answer to the contrary). A `contractor` (own permit) or
  `inspector` (any permit) instead *requests* closure (`POST /permits/:id/close-request`, no
  status change); safety fulfils the request or closes directly via `POST /permits/:id/close`,
  which now always requires `reason` (`403 CLOSURE_REASON_REQUIRED`, unconditionally — this
  subsumes what used to be a narrower "officer-only" reason rule). `403 FIRE_WATCH_NOT_ELAPSED`
  is unchanged, still with no override. The Confined Space entrant block is **retired**:
  `ENTRANTS_STILL_INSIDE` is no longer emitted (dormant in §2's vocabulary — a declared-but-
  unemitted code is legal per this section's own convention) — closing a permit with entrants
  still checked in now **succeeds**, auto-checking every one of them out at the closure
  timestamp inside the same transaction, with `'system'` provenance (a third value beside
  wayfinder 017's `scan`/`manual`, written only here, never client-asserted). A `CLOSED` or
  `EXPIRED` permit cannot be inspected or scanned — every field action (entrant scan, gas log,
  marking a worker not-available, starting an inspector visit) refuses anything but
  `ACTIVE`/`FIRE_MONITOR` with `403 PERMIT_NOT_ACTIVE`; `GET /qr/:token` is the one deliberate
  exception, since it exists to show live status (including "this permit is closed") rather than
  to perform an action.
- Expired/missing certificate blocks submission **and** field entry. No field override.
- **Facility plan + permit position** (`feat-023`, 2026-08-24). **Superseded 2026-09-11 by
  wayfinder 105/106: `planId`/`planX`/`planY` described below no longer exist on `Permit`,
  replaced by a single `pinId` (see section 1's `pinId` on `Permit` row) — this bullet is left
  below unedited as a historical description of the feature `pinId` replaced, not a current
  claim.** A **facility plan** is the
  uploaded, cropped floor-plan **raster image** (PNG/JPEG/WebP only — the map draws it with a plain
  `<img>`, so PDF and HEIC are refused at the plan upload route even though the generic upload
  route accepts them; 2026-08-31); a **plan version** is immutable and retained forever —
  replacing the plan creates a new version, never overwrites one. A **position** is
  `planId`/`planX`/`planY` (0–100, percentages of the plan frame) on a `Permit`. The **contractor**
  sets the position while the permit is DRAFT or REJECTED (the same editable window every other
  field gets — REJECTED stays in scope so reject-with-reason can fix a wrong pin); it is **frozen
  while PENDING and beyond** for everyone, officers included — no route accepts a position change
  outside that window. Note this reads differently since the `PENDING → DRAFT` edge above: a
  permit can now *leave* PENDING backwards, and its position becomes editable again because it is
  DRAFT again. The rule is unchanged — position is editable exactly when the permit is DRAFT or
  REJECTED — but "frozen from PENDING onward" is no longer a one-way description. `planId` records the plan VERSION a pin was placed on, not necessarily the
  active one, so a client can detect **stale-plan** (`planId` ≠ the active plan's id) instead of
  silently mis-plotting it; **unplaced** means no position at all. Position is required to submit
  **only once an active plan exists** — refused with `400 PERMIT_POSITION_REQUIRED` (§2);
  permits predating the first activated plan are grandfathered unplaced, no backfill. Writing the
  plan image is gated far more tightly than the generic upload route: `POST
  /v1/facility-plans/upload` is `safety_officer`-only, and the generic `POST /v1/upload` route
  cannot target the `facility-plans` prefix even if asked (defense in depth at both the schema
  and the service layer — see `upload.service.ts`). Cropping happens only before activation; once
  a version is activated its frame is frozen (there is no edit route at all, by design).
- **Area is deleted from the API** (wayfinder 106, 2026-09-11) — this section no longer carries an
  `Area` entry because there is no surviving rule to describe: no propose/approve flow, no
  `AreaGrant`, no `Permit.areaId`, no `PERMIT_AREA_REQUIRED`/`AREA_VISIBILITY_SCOPED` flag. See
  section 1's "being removed" table for the fate of the term and section 2 for the three
  now-dormant error codes it leaves behind. `Permit.location` remains the nullable free-text note
  it was demoted to when `Area` was introduced (ticket 036) — it is not restored to a required
  field by Area's removal.
- **Overlapping-permit warning** (`smart-work-permit-api` ticket 038, 2026-09-01, decided by
  wayfinder 034's resolution 6; **re-keyed from `areaId` to `pinId` by wayfinder 105, ruling 7, and
  proven still working before wayfinder 106 deleted `Area`**). Every permit-detail response
  (detail, create, update, submit, approve, reject, mark-complete, close) carries
  `overlappingPermits: { checked: boolean, permits: OverlappingPermit[] }`: other permits on the
  **same pin** whose work window overlaps this one's, each row naming the other permit, its
  colliding date/time, and the **pin by name** (`pinName`). **Advisory only — it never gates
  submit or approve**, and adds no new `errorCode`; two crews sharing a pin is a thing a human
  reviewer may legitimately accept, per this map's standing no-silent-block rule. `checked: false`
  means this permit has no `pinId` (most permits, since a pin is set only once safety has placed
  one and the contractor has selected it) — nothing was compared — and is structurally distinct
  from `checked: true, permits: []` ("compared, nothing overlaps"), so a client cannot render one
  reassuring empty state for both. **Which statuses occupy a pin**: `PENDING`, `ACTIVE`,
  `FIRE_MONITOR` — the last deliberately, because a Fire Watch is by definition the period *after*
  hot work stops during which the area around the pin is still hazardous (the "hot permit's safety
  obligation always outlives its work window" rule two bullets up), so excluding it would tell a
  second crew a pin is clear while someone is still standing watch over it.
  `DRAFT`/`REJECTED`/`CLOSED`/`EXPIRED` do not occupy — never submitted, dead, proven clear by
  closure's own guards, or past their (graced) window respectively. **Overlap is a closed interval
  on two axes** since wayfinder 067 made the window multi-day: the **date ranges** must intersect
  (`a.startDate <= b.endDate && a.endDate >= b.startDate`) **and** the **daily windows** must
  intersect (`a.dailyStart <= b.dailyEnd && a.dailyEnd >= b.dailyStart`). Both are closed, so two
  permits touching only at a shared endpoint DO count — the wider, safer reading, deliberate for an
  advisory-only check. Two permits on the same pin on overlapping dates but **disjoint daily
  windows** (a day shift and a night shift) do **not** warn, which is the whole reason the second
  axis exists. Served by `Permit @@index([pinId, startDate, endDate])` — the index covers the
  **date** range and the daily-window comparison is a further `WHERE` the planner applies on its
  result set, declared rather than left for a reader to infer. Excludes the permit itself and
  soft-deleted rows. **The safety frontend's consumption of this field is a separate,
  not-yet-landed half of ticket 038.**
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

- **Topology.** API + Postgres + Redis + MinIO + nginx + cloudflared on one VM (a DigitalOcean
  droplet, x86_64, Ubuntu 24.04); both SPAs on Cloudflare Pages. Nothing on the VM listens
  publicly — the compose file binds **no** host ports, `cloudflared` dials out, inbound is SSH
  only. Deploy user is `esw` (non-root), read by CI from the `VM_USER` secret so the box can
  move between providers without a workflow change.
- **One apex domain, four subdomains:** `api.` `storage.` `app.` `safety.`. This is a hard
  requirement — the session cookie is issued on the apex, so `*.pages.dev` frontends would make
  it cross-site and Safari ITP would drop it.
- **`COOKIE_DOMAIN=.e-safework.com` is what makes that work**, and it was *not* implemented until
  2026-08-23: `user-auth.plugin.ts` now enables better-auth `crossSubDomainCookies` when the var
  is set, and drops back to `SameSite=Lax` because apex subdomains are same-site.
  `smart-work-permit-api/scripts/check-cookie-domain.sh` asserts the issued cookie.
- **`MINIO_ENDPOINT` is the PUBLIC host** (`storage.e-safework.com:443`, SSL on), never the compose
  service name. `uploadOne` hands its presigned URL straight to the browser and the host is part
  of the SigV4 signature. Cost: server-side puts hairpin out through the tunnel. Bucket CORS is
  **not** needed as things stand — those URLs are only ever bound to `<img :src>`, which is not
  CORS-gated. It becomes needed the day anything fetches the storage origin with `fetch`/XHR.
- **`main` is the deploy branch** in all three repos — merging into it ships to
  production. `dev` is the working branch and reaches `main` through a PR whose
  `check` job must pass. Cloudflare Pages' production branch must be `main` too,
  or the SPAs keep deploying from `dev` while the API deploys from `main`.
- **`check-contract-sync.mjs` is not in frontend CI.** It lives in this workspace root, which is a
  separate repo that gitignores the three app repos, so their pipelines cannot run it. It stays a
  local pre-push check — run it yourself before pushing a contract change.
- **Offline is not deployed — but the endpoint exists.** `13-safety-inspector-web-deployment.md`
  §6–§7 describe a service worker, an IndexedDB queue and `POST /sync/batch`. **`POST /v1/sync/batch`
  is real** (`src/modules/sync/sync.module.ts`, inspector-only) — this bullet claimed it did not
  exist, which was wrong. What is missing is `vite-plugin-pwa`, installed in **neither** frontend, so
  there is no service worker and no install prompt. The Inspector's own scan history and offline
  queue are IndexedDB and do work. Since wayfinder 111 the visit's check-in/out enqueues
  `ENTRANT_SCAN` and its gas action links to the gas-log page, which enqueues `GAS_LOG` — the only two
  types `sync/batch` can replay. Not-available, the PPE checklist and the visit submit are **not**
  queueable and say so. **Replays are stamped at sync time, not when they happened** — open as
  wayfinder 126.
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
