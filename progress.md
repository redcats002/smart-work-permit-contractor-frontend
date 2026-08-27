# Session Progress Log

## Current State

**Last Updated:** 2026-08-17
**Project:** SmartWorkPermit — Contractor Web App
**Active Feature:** none in flight. Next up: `PMT-006` (wizard step 3 — Safety Checks).

**Baseline: GREEN** — `./init.sh` → typecheck PASS, lint PASS, **323 tests PASS**, live smoke 16/16 PASS.
Progress: **30 of 40 items done** (root registry, module counts), 0 blocked.
`feat-003` (history) and `feat-004` (certificates) are **complete**.

**The app is reachable by a human end to end.** Orchestrator-verified live:
unauthenticated `/permits` → `/auth/login` → real form submit → lands on `/permits`,
token cookie set, revisiting login bounces back, all four screens render, zero page errors.

---

## 2026-08-27 — Pages deploy unblocked

`cloudflare/wrangler-action@v3` failed twice on the first real deploy, for two different reasons:

1. It installs wrangler itself using the package manager it detects. It found bun and ran
   `bun install wrangler` against this repo's frozen lockfile, which dies with a bare
   `exit code 1`. Forced `packageManager: npm` — wrangler is a CI-only tool that never reaches
   the bundle, so which manager fetches it is irrelevant.
2. With that fixed it installed 3.90.0 (the action's default) and then failed `pages deploy`
   with no message whatsoever. Pinned `wranglerVersion: 4.127.0`, which reports the real cause.

Remaining prerequisite, not a code change: the Pages project must exist as a **direct upload**
project before the first run — `wrangler pages deploy` does not create one in CI. Create with
`wrangler pages project create esw-contractor --production-branch=dev`. Do **not** connect the
project to Git: the workflow deploys it, and a Git-connected project would build in parallel
without `VITE_APP_API_URL`.

## 2026-08-15 (wave 3) — wizard shell, auth, history, cleanup

Four more agents. `PMT-004` ran **alone** rather than fanning the wizard steps out — `PMT-005`–`008`
all write the same page tree *and* the same locale file, a collision class the per-namespace
locale split does not cover.

Two agents died to infrastructure again (machine sleep, watchdog stall) — both on the history
module. The second died ~80% done, so the orchestrator finished it rather than gambling a third
respawn: removed a dangling `onSearchInput` export, wrote `HistoryListPage.vue`, fixed two lint errors.

### Corrections agents made to this harness

- **My `PLT-009` scope was too narrow.** Filed as "`schema.date()` hardcodes Thai"; the audit found
  `id()`, `enum()`, `date()`, `richText()` and all four `media` messages did too. Every form in the
  app would have shown Thai validation text in English.
- **My vue-router claim was too broad.** I wrote that an unregistered route name blanks the page.
  True for `<RouterLink :to="{name}">` (resolved at setup); a runtime `router.push()` instead rejects
  as an unhandled error while the page keeps rendering. `AGENTS.md` now distinguishes the two.
- **I passed a bad fact into an agent brief.** I listed `ForgotPasswordPage` as registered; it is
  commented out in `Auth.router.ts` and my grep matched the comment. The agent read the file and
  caught it.

### Things found that nobody was looking for

- `BasePrintPage.vue` hardcoded **the previous lending client's company name, address, and tax ID**.
  Zero importers, so invisible — but any permit-printing feature built on it would have printed
  another company's legal details on a Thai facility's safety document. Deleted.
- The design system has **no blue/info family** at all, so `AutoCompleteInput`'s selected-chip blue
  has no token. The agent reported it rather than mapping blue onto `accent` (orange) or
  `status-active` (green). Filed as `PLT-011`; it recurs in `PMT-006`.
- **Pinia test gotcha:** `pinia.use(plugin)` only *queues* a plugin until `app.use(pinia)` installs
  it. A bare `setActivePinia(pinia)` with no Vue app silently no-ops every plugin, including
  `persistedstate`. Documented in the Auth test's `beforeEach`.

### Recurring operational hazards, fixed at the source

Root-level `__*.mjs` scratch files broke the gate three separate times — now gitignored **and**
eslint-ignored. One agent ran `pkill -f vite` and killed three siblings' dev servers. Both are
now written into `AGENTS.md` under **"Running several agents in parallel"**.

---

---

## 2026-08-15 — two parallel implementation waves

Ran 7 sonnet subagents across two waves with disjoint file ownership. `src/router/index.ts`
was deliberately withheld from every agent — it is the one file all of them would have
collided on — and the route modules were registered by the orchestrator after each wave.

**Wave 1** (`PLT-001` baseline repair · `PLT-002` design tokens · `PLT-004` i18n + `PMT-001` permit domain)
**Wave 2** (`PLT-003` app shell · `PLT-006` API errors · `PMT-002`/`003` permit provider + list · `CRT-001`–`003` certificates)

Three agents died mid-run (one API connection drop, one machine sleep, one 600s watchdog stall).
Two had written nothing and were respawned clean; one had finished its work and only lost its
final verification, which was redone by the orchestrator. Partial output from the stalled agent
(2 files) was reviewed and kept rather than discarded.

### Verified, not assumed

`./init.sh` was re-run by the orchestrator after every agent — no agent's self-report was taken
at face value. Routes were then probed live with headless Playwright (cookie-seeded auth):

| Route | Result |
|---|---|
| `/permits` | renders list + stub cards (1416 chars) |
| `/permits/create`, `/permits/:id` | placeholders, intentional |
| `/certificates` | renders cert cards (929 chars) |
| `/nope-404` | 404 page |
| protected routes without a token | redirect to `/auth/login` |

No horizontal overflow at 375 / 768 / 1280. No page errors on any route.

### Corrections made to this harness by agent findings

- **My design token table was wrong.** I had pending-status amber as `#B8860B`; the design's own
  `apStatusStyle()` uses `#B26A00` — `#B8860B` is the Working-at-Heights *type* color. Two
  different things I had collapsed into one row. Fixed in `AGENTS.md`.
- **My routing guidance was wrong.** I told three agents to expect soft dev warnings for
  unregistered route names. On vue-router 5 a `RouterLink` to an unregistered name *throws and
  blanks the page*. Proven empirically by the shell agent, then written into `AGENTS.md`.

### New items filed from agent findings

- `PLT-008` — sweep components orphaned by the shell rewrite (`PageTitle`, `Breadcrumb`, `ProfileCard`, `useBackChain`)
- `PLT-009` — `schema.date()` hardcodes its required-message in Thai regardless of locale; affects every form with a date field, and the wizard adds several

---

## Recorded baseline (2026-08-14) — RED

Measured on a clean `bun install` at commit `bf55560a`, **before any implementation work**.
Compare `./init.sh` output against this before assuming you broke something.

| Check | Result |
|---|---|
| `bun run typecheck` | **FAIL — 72 errors**, all `TS2307 Cannot find module` |
| `bun run lint` | **FAIL — 3169 problems (3140 errors, 29 warnings)** |
| `bunx vitest run` | **PASS — 16 files, 217 tests passed** (2.10s) |

### Typecheck failures by directory (72 total)

```
  14 src/router
   7 src/models/request/pre-contract
   6 src/components/selection/modules/api/employee
   6 src/components/selection/modules/api/customer
   3 src/models/modules/pre-contract
   2 src/models/request/document-storage
   2 src/composables
   2 src/components/selection/modules/api/customer-group
   2 src/components/selection/modules/api/branch
   1 src/stores
   1 src/models/response/contract
   ... 24 more single-error dirs, all under
       src/models/request/* and src/components/selection/modules/{api,static}/*
```

Cause: the lending domain was deleted from `src/pages/`, `src/router/modules/`, and
`src/resources/provider/`, but models, dropdown components, `src/router/index.ts`,
`src/stores/Notification.ts`, and two composables still import the deleted files.

### Lint failures by file

```
   docs/main/support.js                                  ← vendored design asset
   docs/main/image-slot.js                               ← vendored design asset
   .agents/skills/harness-creator/scripts/*.mjs   (5)    ← vendored skill scripts
   lint-staged.config.mjs                                ← missing return type
   src/composables/useSocket.ts                          ← 1 warning (console.log)
```

**All 3140 errors are outside `src/`.** `eslint.config.js` `ignores` does not cover
`docs/**`, `.agents/**`, `.claude/**`, or `lint-staged.config.mjs`. Only one real
finding lives in `src/` (a `no-console` warning in `useSocket.ts`).

`PLT-001` turns this baseline green. Once it lands, `./init.sh` must pass **clean** —
a red check after that point is yours.

---

## Status

### What's Done

- [x] Harness rebuilt for SmartWorkPermit Contractor (was still describing the deleted lending app)
  - `AGENTS.md` — module map, permit lifecycle, safety ranges, design palette, startup path
  - `feature_list.json` — 4 module-level root features
  - `docs/modules/{platform,permit,history,certificate}/` — per-module `context.md` + `feature_list.json` (26 items)
  - `init.sh` — now runs typecheck + lint + tests, reports all three, exits 1 on any failure
  - `docs/GUIDE.md` — module table corrected to contractor-app modules
  - `session-handoff.md` — created

### What's In Progress

- Nothing. Implementation is gated on the user's review of this harness.

### What's Next

1. User reviews the harness.
2. Start `feat-001` → `docs/modules/platform/feature_list.json` → `PLT-001` (baseline repair).

---

## Blockers / Risks

- [ ] **Baseline is red.** 72 typecheck errors + 3140 lint errors. `PLT-001` must land before any feature can be verified. Impact: no item can be marked `done` until then.
- [ ] **New dependency needed — `vue-i18n`.** The task doc requires i18n; the template has no i18n setup. `PLT-004` is blocked on user approval to add it.
- [ ] **Font mismatch.** The design uses `IBM Plex Sans` / `IBM Plex Sans Thai` / `IBM Plex Mono`; the template ships `LINE_Seed_Sans_TH`. Resolve in `PLT-002` — this is a product decision, flag it.
- [ ] **Backend not reachable.** `01-backend-elysia-tasks.md` describes endpoints that may not exist yet. `PLT-006` stubs the API client so swapping in the real base URL is a one-line change.
- [ ] **Map pin.** No mapping library is installed. `02-contractor-web-vue-tasks.md` says a placeholder is acceptable — the design already renders one (grid background + pin marker). Do not add a mapping dependency.

---

## Decisions Made

- **Four modules, not one flat list.** `platform` / `permit` / `history` / `certificate`.
  - Context: 26 work items in one registry would blow an agent's context budget on every session.
  - Discriminator: route prefix + pages tree (the repo's own convention).
- **`history` is its own module despite reusing the `permit` provider.**
  - Context: it owns `/history` and a pages tree; its filters/CSV/table work is independent of the wizard.
  - Alternative considered: folding it under `permit` — rejected, would have made `permit` a 15-item module.
- **Safety ranges and the design palette are duplicated into the harness.**
  - Context: `docs/GUIDE.md` requires an item be actionable "from the registry alone". A 226KB HTML prototype and a shared-context doc are not registry-readable.
  - Alternative considered: pointing at the source files — rejected, costs every session a large read.
- **Baseline repair is a first-class feature (`PLT-001`), not a chore folded into other work.**
  - Context: it is the difference between "done" meaning something and meaning nothing.
- **`init.sh` runs all three checks instead of `set -e` failing fast.**
  - Context: with fail-fast, a red typecheck permanently hides the lint and test state.

---

## Files Modified This Session

- `AGENTS.md` — full rewrite (lending app → SmartWorkPermit Contractor)
- `feature_list.json` — replaced placeholder scaffold with 4 module-level features
- `progress.md` — reset; recorded the red baseline
- `init.sh` — added typecheck; run-all-and-summarize instead of fail-fast
- `session-handoff.md` — created
- `docs/GUIDE.md` — module table corrected (removed `safety-officer` / `inspector`, which belong to a different repo)
- `docs/modules/platform/{context.md,feature_list.json}` — created
- `docs/modules/permit/{context.md,feature_list.json}` — created
- `docs/modules/history/{context.md,feature_list.json}` — created
- `docs/modules/certificate/{context.md,feature_list.json}` — created

**No `src/` file was touched.** Implementation is gated on user review.

---

## Evidence of Completion

Harness structure validated:

```
$ node ~/.claude/skills/harness-creator/scripts/validate-harness.mjs --target .
Overall: 96/100 → re-run after this session
instructions 5/5 · state 5/5 · verification 5/5 · scope 5/5 · lifecycle 4/5 (handoff template) → 5/5
```

Product verification (`./init.sh`) is red by design — see the recorded baseline above.

---

## Notes for Next Session

- Read `AGENTS.md` first. Its Modules table and the "Business rules that must not drift" section are the two things you must not contradict.
- `PLT-001` is intentionally large but purely subtractive — delete dangling files, widen eslint `ignores`. Do not "fix" a dangling lending model by rewriting it; delete it.
- Reusable infrastructure that survives the strip and should be kept: `src/components/{base,button,input,modal,table,display,nav,paper,loader,transition}`, `src/volt/`, `src/utils/`, `src/composables/`, `src/resources/HttpRequest.ts` + `Interceptors.ts`, `src/stores/{Auth,Loading}.ts`, and the 217 passing util tests.
- `src/components/selection/modules/api/*` (16 dirs) and most of `static/*` (25 files) are lending-specific dropdowns — they account for ~28 of the typecheck errors and are deletion candidates in `PLT-001`.

## 2026-08-17 — feat-005 Real API integration (done)

The backend is built and running; this app was written against an assumed contract that disagreed
with it on the path prefix, the casing, the error body, the auth mechanism, the role model, and
most permit field names. All 10 `API-*` items in `docs/modules/api-integration/` are done.

Landed: transport (humps deleted in both directions, error envelope, no logout on a failed
sign-in), auth against the real `/auth/user/**` paths with a contractor-only login gate, the
21-code error map keyed off `errorCode` (it had been reading `code`, so every coded failure
rendered `error.unknown`), permit + certificate models rewritten to the wire shape, all four
providers off their stubs with both `*.mock.ts` files deleted, notifications pointed at endpoints
that exist, and `scripts/smoke-api.mjs` wired into `./init.sh`.

The pre-existing red baseline (a drifting stub fixture, recorded in `API-001`) is green again.

`./init.sh`: typecheck PASS, lint PASS, vitest 26 files / 309 tests PASS, live smoke 16/16 PASS.

## 2026-08-17 — PMT-005 Wizard step 1-2 (Permit Type + Basic Information) (done)

Filled the first two real wizard step bodies on top of the PMT-004 shell: `Step1Type.vue` (3
selectable type cards, reusing `--color-permit-type-*` tokens the same way `PermitCard.vue` does)
and `Step2BasicInfo.vue` (title/foreman/location/date/start/end + readonly contractor + a static
map-pin placeholder — no `project` or `workDescription` field, neither exists on the API).

`Step1TypeSchema` and `Step2BasicInfoSchema` (wire-shaped, string fields, `.refine` for
end-after-start) replace the two `z.object({})` placeholders and are the single source of truth
`useWizard` uses to gate Next — deliberately kept as strict as `hasCreatableDraft()`, which is
covered by two new schema test files. Only the free-text fields (title/foreman/location) run
through `@primevue/forms` + `zodResolver`, per the project's mandatory form pattern; the three
date/time pickers are plain `v-model` computed proxies onto the wizard's shared `formData` because
a `DatePicker`'s `Date` value can't share one resolver schema with the wire-string shape
`useWizard.formData` needs without real complexity for only 3 fields.

Verified against the live backend beyond the generic `smoke-api.mjs`: a throwaway probe script
logged in as the seeded contractor and POSTed the exact payload these two steps emit, got a real
`WP-HOT-…` id back, then PATCHed it successfully — the first live run of this create-then-PATCH
path. Not verified: an actual interactive click-through of the rendered UI — the Claude-in-Chrome
browser tool was unavailable in this sandbox, so the components are unseen-but-code-reviewed,
typechecked, and linted, not screenshot-checked. See this item's own `progress.md` for detail.

`./init.sh`: typecheck PASS, lint PASS, vitest 28 files / 323 tests PASS, live smoke 16/16 PASS.

## 2026-08-19 — Cross-repo fix pass (C1–C6, no feature item; six defects + doc drift)

Not a feature item — a fix pass against `../docs/e2e/PRE-RUN-FINDINGS.md` (findings 5, 6) and
`../docs/REVIEW-2026-08-19.md` (Q2), plus the four `errorCode`s the backend added the same day.
No item status was changed; evidence was **appended** to `PLT-006`, `HST-003`, `CRT-003`.

**C1 — root contract check was red, now green.** Added `FILE_TYPE_NOT_ALLOWED`, `FILE_TOO_LARGE`,
`UPLOAD_FOLDER_NOT_ALLOWED`, `STORAGE_UNAVAILABLE` to `EApiErrorCode` (25 codes) with distinct
EN + TH copy, and updated `04-api-contract.md` §5. `RATE_LIMITED` needed no work — `LoginPage`
already passes `mapError` and the code already had copy; only `login` and `user-reset-password`
of the four newly rate-limited public auth routes exist in this app (there is no register screen
and `ForgotPasswordPage` is still commented out).

**C2 — certificate attachment. Confirmed, half-fixable here.** `AddCertificateModal` sent the
presigned `fileUrl` (60-second TTL) instead of `filePath`; that half is fixed and the payload field
renamed. But `POST /certificates` declares **no** attachment field and Elysia strips unknown keys,
so nothing is persisted either way — filed as `docs/api/GAPS.md` row **G** (`api-adds`). The form
no longer implies otherwise: a hint under the picker and a warning toast after save say the
attachment was not stored. **The feature stays broken end to end until the backend adds the column.**

**C3 — CSV export bypassed the table's filter** (finding 5 / `CT-HISTORY-009` step 5). The
`ARCHIVE_STATUSES` narrowing is now a single `narrowToArchive()` helper used by both
`useFetchHistory` and `exportCsv`.

**C4 — backend English on screen** (finding 6). Root cause was not the three call sites but
`handleLoading`'s *default* error callback, which toasted `error.response.data.message` and fell
back to a hardcoded Thai string. It now goes through `useApiError().mapError()`, so an
un-customized call site is safe by default; the three sites (`useLogout`, `ResetPasswordPage`'s
`useResetPassword` / `useCheckToken`) also pass `mapError` explicitly. A full sweep of every
`handleLoading` call found no others missing a callback.

**C5 — `CLAUDE.md` corrected.** `./init.sh` is green, not red; `history` is built and registered;
25 error codes not 21; `PermitCreatePage` is partly built (steps 1–2 real, 3–6 `z.object({})`
stubs — stated explicitly so nobody "fixes" them); `PermitDetailPage` is the only placeholder;
the `AppDrawer.isRegistered()` guard is dead code that is still present (it was described both as
removable and as still needed); `humps` is gone from the interceptors; `docs/**`/`.agents/**`/
`.claude/**` **are** eslint-ignored; `PLT-005` is done; a new **Tests** section records that
`vitest.config.ts` excludes `src/pages/**/tests/**` so tests must live under `src/tests/`.

**C6 — first page-level tests in this repo** (Q2). Bounded to three pages, per instruction:
`src/tests/pages/auth/login/LoginPage.test.ts` (5 cases — including a rate-limited login proving
the localized string renders and the backend `message` does not),
`src/tests/pages/history/list/HistoryListPage.test.ts` (5 cases — the CSV-matches-table case was
verified to fail against the pre-C3 line), and
`src/tests/pages/permit/detail/PermitDetailPage.test.ts` (3 cases pinning the placeholder
contract, incl. "fetches nothing", the tripwire for whoever builds `PMT-010`). Pattern copied from
the sibling Safety/Inspector app. 28 → 31 test files, 323 → 336 tests.

**Next:** `PMT-006` (wizard step 3) is the next unblocked item. Backend follow-up owed:
`GAPS.md` row G. Not touched, deliberately: findings 7 and 13 (wizard stubs / draft resume).

`./init.sh`: typecheck PASS, lint PASS, vitest 31 files / 336 tests PASS, live smoke 16/16 PASS.
`node ../scripts/check-contract-sync.mjs`: `contract-sync: OK — openapi in sync, 25 backend error
codes all declared, /api/v1 prefix present.`

## 2026-08-22 — `PMT-010` + `PMT-011` + `PMT-012` (Permit Detail, closure, Fire Watch)

Replaced the 33-line `PermitDetailPage` placeholder with the real screen and both of its action
flows. Ran concurrently with another agent working `PMT-006`–`009` in `src/pages/permit/pages/create/**`;
file ownership held — the only shared files touched were `src/locales/{en,th}/permit.ts` (targeted
edits inside `permit.detail.*` only, deleting `placeholderBadge`/`comingSoon`),
`src/models/{request,response}/permit/`, `src/resources/provider/permit/Permit.provider.ts`,
`docs/api/GAPS.md` and this file.

**`PMT-010` — Permit Detail.** `usePermitDetail` fetches the permit, then its audit trail and (only
for `ACTIVE`/`FIRE_MONITOR`) its QR token — asking for a token on a DRAFT is a guaranteed
403 `PERMIT_NOT_ACTIVE`, so it is not asked. Four components under `detail/components/`:
`PermitStatusBanner` (DRAFT / REJECTED / just-submitted / ACTIVE / ACTIVE-hot / CLOSED),
`PermitInfoCard`, `PermitAuditTimeline` and `PermitQrPanel`. The 268px rail is `lg:w-67` beside the
main column and stacks **below** it under `lg`. The QR is rendered from `QRCode.create()`'s module
matrix as plain `<rect>` elements — `toDataURL` needs a canvas jsdom does not implement, and
`toString({type:'svg'})` would have to be injected as raw markup. No new dependency.

Two acceptance sub-clauses are **not** fully satisfied, both for missing dependencies, not effort:

- DRAFT's `Edit Permit →` and REJECTED's `Duplicate & Edit` render **disabled** with a localized
  hint. There is no edit or duplicate route (`Permit.router.ts` is list / create / detail) and no
  draft resume, and on vue-router 5 a `RouterLink` to an unregistered name throws at render and
  blanks the whole page. The banner variants themselves are built; only the targets are missing.
- The just-submitted success banner is driven by `?submitted=1`. Nothing sets that query today —
  `PMT-009`'s Submit is still a `console.info` — so the variant is reachable only by URL.

**`PMT-011` — Closure checklist modal.** `ClosureChecklistModal` on `BaseModal`: per-type checklist
(5 rows confined / 4 heights / 4 hot), Confirm disabled until every row is answered **and** the
e-signature pad — revealed only once the checklist is complete — has been tapped. The wire takes
`signature` as a plain string, so the pad records an attested Foreman name plus the tap timestamp
rather than pretending to capture strokes.

The invariant that matters: **the client never pre-empts the backend.** Every confirm POSTs to
`/permits/:id/close` and renders whatever comes back, localized off `errorCode` via
`useApiError().mapError()`. The backend's `message` never reaches the DOM — there is a test per
branch proving it. Entrant **count** now comes from the payload's server-computed `entrantCount`
(see below); entrant **names** do not exist on any contractor-readable surface.

**`PMT-012` — Mark-complete + Fire Watch.** `MarkCompleteConfirmModal` (hot work only, ACTIVE) and
`FireMonitorPanel` (FIRE_MONITOR): 80px mono `MM:SS`, progress bar, the server-side warning, and a
disabled `Close Permit — locked until MM:SS` that becomes a live Close at zero and hands off to
`PMT-011`'s modal. Confined/heights keep the green closure strip; hot work gets the orange one,
because the backend refuses a direct `ACTIVE → CLOSED` for hot work (`PERMIT_NOT_CLOSABLE`).

`useFireWatch` anchors the countdown on the **server**: `fireWatch.remainingSeconds` first (immune
to device clock skew), falling back to `fireWatch.startedAt` (identical to `fireMonitorStartedAt`)
plus the 30 minutes. Every refetch re-anchors, so a page reload cannot reset or extend the watch —
there is a test mounting the same permit twice with different server remainders to prove it.
`FIRE_WATCH_DURATION_MINUTES` is declared once and shared with the closure modal's blocked banner.

> **`PMT-012` scope question — answered by the item's own stated default, not by asking.** The
> design (lines 549-570) walks a GPS-tagged-photo verification between "timer ends" and "Close
> Permit". No endpoint models it in `00-SHARED-CONTEXT.md`, `01-backend-elysia-tasks.md` or
> `openapi.json`. Per `PMT-012`'s `notes`, the countdown is built, closure unlocks at zero, and the
> photo step is **left out** — including from the confirm dialog's copy, which deliberately does not
> promise a photo check the app cannot perform. If the product owner wants it, it is a backend item
> first (upload + GPS comparison + a `FIRE_MONITOR_PHOTO` audit action), not a client change.

**Contract work.** The backend's 2026-08-21 pass (`GAPS.md` row A) landed mid-session: `entrantCount`
and `fireWatch { startedAt, elapsedSeconds, remainingSeconds, elapsed }` are now on every permit
list row and detail payload. Both are modelled (`IPermitFireWatch`, `IPermitListItem`) and consumed
here. `PermitCard`'s "N inside" badge is **not** restored — that is the list's scope, not this
item's, and `entrantCount` is now available for whoever picks it up.

Two new **open** rows filed in `docs/api/GAPS.md`:

- **H — `POST /permits/:id/close` is `auth: ['safety_officer']`.** Verified in the backend source,
  still true today. A contractor gets `403 FORBIDDEN_ROLE` before any closure rule is evaluated, so
  `PMT-011` cannot succeed end to end even though the design, `00-SHARED-CONTEXT.md` and the item
  all model closure as the Foreman's action. Deliberately not worked around client-side. Needed:
  admit `contractor` on that route, or move closure out of the contractor scope in the shared spec.
- **I — entrant NAMES are unreadable by the permit owner.** The count is served; the names live only
  in the backend's English `message` and on the inspector-facing entrants endpoint.

`PermitProvider` gained `close()`. Its doc comment used to say close was *deliberately absent*
because it is officer-only — that is now explained rather than silently contradicted, and the
provider test's "exposes no approve/reject/close" case was inverted to match with a comment saying
why.

**Verification.** `./init.sh` is **green**: typecheck PASS, lint PASS, vitest **39 files /
409 tests PASS** — 21 of those cases are this item's (8 `PermitDetailPage`, 6 `ClosureChecklistModal`,
6 `FireWatch`, 1 net-new provider case; 3 of the 8 replaced the placeholder tripwire rather than
adding to the count) — plus a live smoke of **16/16 PASS** against the running backend on :3000.
`node ../scripts/check-contract-sync.mjs`: `OK — openapi in sync, 25 backend error codes all
declared, /api/v1 prefix present.` (Mid-session the gate was briefly red on typecheck and lint from
the concurrent agent's in-flight `permit.create.*` work — `Step4PpeWorkers.schema.ts` and
`quote-props` in the `ppeWorkers` locale block. Both were theirs and both are now fixed; nothing in
this item was ever the cause.)

**Browser verification — what was and was not seen.** The Claude-in-Chrome extension was not
connected in this sandbox, so a headless Chromium click-through was driven with the repo's own
Playwright instead: real login as the smoke contractor on the running dev server (:8081), then
`/permits/WP-HOT-20260817-001`. Confirmed **in a rendered browser**, in Thai (the default locale):
the DRAFT banner with its disabled `แก้ไขใบอนุญาต →` CTA and hint, the mono permit id, the info
card, the empty-audit + read-only copy, and the dashed "QR pending approval" placeholder. **Zero
console errors.** The right rail measured **exactly 268px** beside the main column at 1440px
(aside x=1112, level with the title) and **below** it at 375px (aside y=872 vs title y=429), full
width, with **no horizontal page scroll** — so the collapse is measured, not merely asserted by a
class list.

**Not seen in a browser:** every `ACTIVE` / `FIRE_MONITOR` / `REJECTED` / `CLOSED` state, and
therefore the live QR, the Fire Watch panel, the mark-complete dialog and the closure modal. The
seeded contractor account owns only two DRAFT permits, and moving one past DRAFT needs a Safety
Officer approval from a different app and a different role — out of scope for this session and not
something to fake by mutating shared data. Those paths are covered by unit tests against mounted
components only.

`AGENTS.md` was updated in the same pass, as the Definition of Done requires for a lifecycle change:
three fragments called `PermitDetailPage` a placeholder that "fetches nothing" (state-of-codebase
block, and the `permit` row's Pages and Built? cells). Targeted edits to those three fragments only —
the wizard clauses in the same table row belong to the concurrent agent and were left untouched.

**Next:** `PMT-007`–`009` (wizard steps 4-6) are the remaining permit items. Backend follow-ups owed:
`GAPS.md` rows G, H, I, J, K.

## 2026-08-22 — PMT-006 · PMT-007 · PMT-008 · PMT-009 — the wizard's last four steps (done)

The six-step create wizard is complete. Steps 3–6 were `z.object({})` placeholder schemas behind
~31-line stub components; all four are now real, and the Submit button is no longer a
`console.info`.

**PMT-006 — Safety Checks.** Type-specific reading cards, a blocked/safe banner that names each
failing reading, the Indoor/Outdoor bypass, instrument-photo slots, and the numbered
Yes/No/N-A checklist. Every bound, unit and required-reading list is *derived* from the single
`SAFETY_RANGES` / `validateReadings()` export (PMT-001) — including the range hints, which are
locale **templates** (`'{min} – {max}{unit}'`) with the numbers interpolated at render time, so no
number is re-typed in the component, the schema, or either locale file. The Indoor/Outdoor toggle
renders only for types that actually have a bypassable reading, which is why Working at Heights
never gets one: wind is deliberately excluded from `bypassableByOutdoor`, and offering a toggle
would imply an override that does not exist.

**PMT-007 — PPE, photo evidence & workers.** Per-type evidence slot grid on a shared
`PhotoSlot.vue`, the Thai ministerial-regulation notice verbatim in both locales, and a worker
table that scrolls horizontally rather than truncating at 375px. Removal goes through
`DeleteModal`, never an inline confirm.

**PMT-008 — Job Safety Analysis.** Phase tab pills with live per-phase counts, an editable
3-column table, and `sortOrder` recomputed per phase on every mutation so display order equals
stored order and stays stable when a middle row is deleted.

**PMT-009 — Review & Submit.** Read-only summary, three honest pre-flight rows, and a real
`POST /permits/:id/submit`. On success it navigates to `/permits/:id?submitted=1` — that query
param is what triggers PMT-010's one-shot "submitted" banner, and nothing set it before. On a 400
the wizard drives off the backend's feat-010 failure arrays: `failures[]` highlights **every**
failing reading on step 3 rather than the single code in the envelope, and `certificateFailures[]`
names and tints every refused worker on step 4.

### Decisions worth knowing

- **`safetyReading` append guard (`useWizard.doPersist`).** `safetyReading` *appends* a row on
  PATCH — it is a log, not a field — and `doPersist` sends the whole accumulated `formData`.
  Without a guard, every later edit (a title fix, a JSA row, a worker's BP) would append a
  duplicate reading forever. The reading is now sent only when it actually changed, the snapshot
  is taken **after** the PATCH resolves (so a failed request does not lose it), and the comparison
  is against what is *sent*, not what is held.
- **Two new `GAPS.md` rows, both `api-adds`.** Row **J**: the permit has no field for step 3's
  Yes/No/N-A checklist, so the answers live in `useWizard`'s own state, never in `formData`, and
  the step says on screen that they are not saved. Row **K**: `safetyReading` has no `so2` on the
  wire, so `toWireReading()` strips it before the PATCH rather than letting Elysia discard it
  silently. SO2 is `blocking: false`, so neither gap can change a pass/fail verdict.
  (Filed as J/K, not H/I — the concurrent PMT-010 agent claimed H and I while this ran.)
- **`PhotoSlot.vue` does not use `useUpload()`.** That composable swallows every failure, toasts a
  hardcoded Thai sentence about Google Cloud Storage billing, and returns a *fake success* with
  `filePath: ''` — which would both leak an un-localized string and put an empty `fileRef` on the
  wire, where PATCH declares `minLength: 1`. It goes through `Upload.provider` directly with
  `mapError()`, so `FILE_TOO_LARGE` / `FILE_TYPE_NOT_ALLOWED` / `STORAGE_UNAVAILABLE` surface
  localized and nothing is emitted unless the upload really succeeded.
- **Photo slots offer "replace", not "remove".** `photos` upserts per `slotKey` with no delete
  verb, so a remove affordance would look like it deleted something server-side and would not have.
- **Checklist rows start UNANSWERED.** The design prefills every row to `yes` (hot #13 to `na`).
  Since nothing persists them and they do not gate Next, a prefilled all-yes checklist would be
  rubber-stamp UI that proves nothing about the worksite.
- **Checklist copy is one key per row, EN in `en/` and TH in `th/`** — the repo's convention. The
  design renders both languages simultaneously on the same row; that deviation is deliberate.
  Two checklist lines quote numbers verbatim from the design ("Wind speed checked < 25 km/h",
  "Guardrails installed at 90–110 cm"). They are procedural checklist copy, not range hints, and
  are not read by any validation — paraphrasing a spec line was judged worse than repeating it.
- **The outdoor-bypass info panel uses `surface-subtle` / `border-strong`, not the design's blue
  (`#E8F5FF`).** No blue token exists in `tailwind.css`, and that file is shared across concurrent
  agents — adding one was not worth the collision risk. Add `--color-info-*` and swap it in if the
  blue matters.
- **Worker health thresholds live in `create/constants/WorkerHealth.ts`, not
  `src/utils/PermitSafety.ts`.** `SAFETY_RANGES` is the atmosphere/wind contract the backend also
  validates against; blood pressure is neither — the backend stores `bloodPressure` /
  `alcoholReading` as free-text and does not validate them at all.
- **The health check mirrors the design's asymmetry on purpose.** A blank blood pressure is
  "unrecorded", not "abnormal", and does not fail on its own; a blank or unparseable alcohol
  reading **does** fail. Net effect: a freshly added Confined Space worker reads ✗ until their
  breath test is entered, which is the correct default for a permit-to-work.
- **BP/alcohol are Confined Space only.** The design's `bpCol` hints at BP for Working at Heights
  too, but PMT-007's acceptance scopes the health check to Confined Space; acceptance won.
- **A server verdict is dropped as soon as the user edits anything.** `updateFormData` clears
  `submitError` / `submitFailures`. Without it, a reading the server rejected stayed red — banner
  and all — even after the user corrected the value, until they pressed Submit again. Cleared on
  *any* field edit rather than only the rejected one: the user is actively editing the draft the
  server refused, and Submit re-runs the check, so clearing a beat early beats a stuck red card.
- **Submit routes back by assigning `currentStepIndex`, not via `goToStep()`.** `goToStep` refuses
  a jump when any *earlier* step fails its own schema — and the entire point of that branch is
  that the server disagreed with a client gate that passed. The user must always land on the step
  that can fix it, never be stranded on Review with an error they cannot act on.

### Open question for the product owner (PMT-008)

**"At least one JSA row before Next" is not in the backend contract.** `PATCH /permits/:id`
accepts an empty `jsaSteps` array and `POST /permits/:id/submit` does not check the JSA at all.
It comes from PMT-008's acceptance list only. It is implemented as a client-side minimum in the
**weaker** reading — one row per *permit*, not one per phase — so it cannot block a submission the
server would accept. Confirm the intended rule; if it is meant to be per-phase, or enforced at
all, the backend should own it. The per-field `step`/`hazard`/`control` `minLength: 1` checks are
*not* invented — those are on the wire.

### Verification

`./init.sh`: typecheck PASS, lint PASS, vitest **41 files / 424 tests** PASS, live API smoke
16/16 PASS. `node ../scripts/check-contract-sync.mjs`: `contract-sync: OK — openapi in sync, 25
backend error codes all declared, /api/v1 prefix present.` The suite was run four times to rule
out a flake (one earlier red run coincided with the concurrent PMT-010 agent writing files
mid-run; it has not reproduced).

**NOT verified — no browser click-through.** The Claude-in-Chrome extension reported zero
connected browsers for the whole session, so nothing was clicked or screenshotted. What *was*
confirmed beyond the unit suite: all five new/changed SFCs compile and lint through the running
vite dev server on :8081 (200 + transformed JS; `vite-plugin-eslint2` runs in that pipeline), and
`PermitCreatePage.submit.test.ts` mounts the **real** page and drives the **real** wizard from
step 1 to a successful submit and to three distinct server rejections. Still unseen by a human:
the rendered reading cards and their red state, the 44-row checklist at 375px, the worker table's
horizontal scroll, the photo picker, and the JSA phase tabs. **Recommend one manual pass over
`/permits/create` before treating this UI as visually trusted.**

**Next:** every `PMT-*` item is `done`. Remaining open work in this repo is `PLT-007`
(notification polling) and the backend follow-ups in `docs/api/GAPS.md` (rows G, H, I, J, K).

---

## 2026-08-22 — PMT-013: the six permit-detail sections (items 1 / 1.1)

Implemented `docs/main/dev-handoff/05-permit-detail-sections.md` §2 on the Contractor detail page.
`PMT-010` shipped a **lite** page (banner, info card, audit timeline, QR); four of the payload's
richest keys — `workers`, `photos`, `jsaSteps`, `latestSafetyReading` — were never rendered, so a
foreman could not see the JSA or roster they had just entered. They render now.

### Layout decision: stacked, not tabbed

Six stacked cards in the main column, in contract order, each wrapped by a new
`PermitDetailSection.vue` that owns the title and the **empty state**. Tabs were rejected: this app
is desktop-first, a stacked page prints and scrolls in one pass, every section stays reachable
without a second interaction, and the whole thing collapses to one column at 375px for free. The
right rail (QR) and the `FIRE_MONITOR` panel are unchanged — they are not numbered sections.

The empty state lives in the wrapper on purpose: the contract says an empty section is **never**
hidden, so "no JSA rows" and "JSA not loaded" cannot look identical. §2 and §3 are the two
exceptions that own their own inner empty states, because §2 must still show the outdoor-work
bypass note and the server verdict on a permit with no reading yet (exactly the DRAFT case), and
§3 has two independent collections (roster, photos) that empty separately.

### Files

| File | What |
|---|---|
| `detail/components/PermitDetailSection.vue` | new — section chrome + explicit empty state |
| `detail/components/PermitSafetySection.vue` | new — §2 |
| `detail/components/PermitWorkersSection.vue` | new — §3 |
| `detail/components/PermitJsaSection.vue` | new — §4 |
| `detail/components/PermitClosureSection.vue` | new — §5 |
| `detail/components/PermitInfoCard.vue` | grown — `outdoorWork` + the lifecycle timestamps |
| `detail/components/PermitAuditTimeline.vue` | heading moved to the §6 wrapper; list untouched |
| `detail/pages/PermitDetailPage.vue` | the six sections wired in contract order |
| `models/modules/permit/Permit.model.ts` | `IPermitValidationSummary` / `IPermitValidationFailure` |
| `models/response/permit/PermitRes.model.ts` | `validationSummary` on `IPermitDetail` |
| `locales/{en,th}/permit.ts` | `permit.detail.sections.*` only |
| `src/tests/pages/permit/detail/PermitDetailSections.test.ts` | new — 9 tests |

### §1 key checklist — every key, where it renders

`type` `title` `id` `status` §1 heading strip · `location` `foreman` `workDate` `workTimeStart`
`workTimeEnd` `outdoorWork` §1 info card · `createdBy` `createdAt` `updatedAt` `submittedAt`
`approvedBy` `approvedAt` `rejectedReason` `rejectedAt` §1 status-history block (plus the status
banner) · `latestSafetyReading` `validationSummary` §2 · `workers` `photos` §3 · `jsaSteps` §4 ·
`closureChecklist` `entrantCount` `fireWatch` `fireMonitorStartedAt` `closedBy` `closedAt` §5 ·
`qrIssuedAt` the QR side panel · audit trail §6.

**Deliberately not rendered as their own UI element (3 keys):** `createdById`, `approvedById`,
`closedById` — the resolved author *object* is shown instead; a bare user id is not information a
foreman can use. **`so2` is not rendered at all** and that is the point: the wizard collects it but
it is **not on the wire** (`docs/api/GAPS.md` row K — confirmed again against the regenerated
`openapi.json`, whose `latestSafetyReading` carries `lel/o2/co/wind/height` and no `so2`).
Displaying it would be showing a value the server never stored. `PermitSafetySection` filters it
out of `SAFETY_RANGES.requiredByType` explicitly, and a test pins that.

### The rules that were easy to get wrong

- **`validationSummary` was missing from the model** even though it is in the openapi `required`
  list for `GET /permits/:id`. Added as an *optional* field so existing fixtures still typecheck.
- **The verdict is rendered, never recomputed.** Failures localize off `errorCode` by feeding the
  bare code to `useApiError().mapError()` — one localization path, not a second lookup table. The
  backend's `message` is never rendered, and a test asserts the raw string is absent from the DOM.
  The summary's scope is readings only, so the copy says so instead of "all checks passed".
- **Photos.** `fileRef` is a storage path, not a URL. It resolves through
  `UploadProvider.getFileUrl()` (`GET /api/v1/file`) **on click**, not on load — N eager requests
  for thumbnails on every page view is not worth it, and nothing else in the app renders these
  images either. A slot the permit type requires but never received renders as explicitly missing;
  instrument photos (`instrument-lel`, …) fall outside the evidence grid and are listed after it
  rather than dropped.
- **JSA** groups by `phase` in `JSA_PHASE_ORDER`, sorts by `sortOrder` inside a phase (rows with
  no `sortOrder` keep payload order, last), and shows the per-phase count. An empty phase keeps its
  heading.
- **§5 does not start a second countdown.** It renders the data and reuses the page's single
  `useFireWatch` value, which is anchored to the server's `fireWatch.remainingSeconds`. `PMT-012`'s
  panel and `PMT-011`'s modal are untouched.
- **The audit trail still has no edit or delete affordance** — `PMT-010`'s test still asserts it.

### Cross-tree imports (flagged deliberately)

`PermitSafetySection` / `PermitWorkersSection` import three **create**-side constants —
`SafetyReadingView.ts`, `PhotoEvidence.ts`, `WorkerHealth.ts` — and read three `permit.create.*`
locale namespaces (`safetyChecks.reading.*`, `ppeWorkers.slot.*`, `ppeWorkers.role.*`). Nothing
under `create/**` was **edited**. This is intentional: re-deriving the health thresholds, the slot
keys or the reading list on the detail side would let the two screens disagree about the same
permit. If those constants ever move, they should move to a shared `permit/constants/` dir rather
than being duplicated.

### Verification

`./init.sh`: **exit 0 — ALL GREEN.** typecheck PASS, lint PASS, vitest **42 files / 433 tests**
PASS, live API smoke **16/16** PASS against `localhost:3000`.
`node ../scripts/check-contract-sync.mjs`: `OK — openapi in sync, 25 backend error codes all
declared, /api/v1 prefix present.` (One earlier `lint` red was a concurrent agent's `repro.tmp.mjs`
vanishing mid-run — `ENOENT` inside eslint's file walk, not a rule violation; it did not reproduce.)

**Browser pass — done this time.** Headless Chromium (this repo's Playwright) against the running
dev server, driven as the seeded contractor. This app is the one on **:8081**; :8080 is the sibling
Safety/Inspector app — neither server was restarted.

Seen with my own eyes, at 1440px and at 375px:

- All six sections render, in contract order, in **Thai** (the default locale), no console errors.
- A bare DRAFT: `validationSummary` shows the red *failed* verdict with `LEL_MISSING` / `O2_MISSING`
  localized, and the empty states for readings / workers / JSA / closure all render.
- A populated Confined Space draft (created through the API for this purpose,
  **`WP-CONF-20260821-005` — a probe row left in the dev DB**): green *passed* verdict, LEL/O₂/CO
  cards **and no SO₂ card**, the two-worker roster with a ✓ Pass and a ✗ Fail plus the
  blood-pressure reason, three required photo slots marked missing beside the attached
  `worksite.jpg`, and the JSA grouped Pre (2, correctly reordered by `sortOrder`) / Process (0,
  empty state) / Post (1).
- 375px: `scrollWidth === clientWidth` — no horizontal page overflow; the worker and JSA tables
  scroll inside their own containers.

**Not seen, and not claimed:** `ACTIVE`, `FIRE_MONITOR` and `CLOSED` renderings, the QR code image,
the closure modal's success path and the Fire Watch countdown in a browser. The seeded contractor
owns **DRAFT** permits only, and a contractor cannot approve their own permit. Those paths are
covered by unit tests (`PermitDetailPage.test.ts`, `ClosureChecklistModal.test.ts`,
`FireWatch.test.ts`) and by the §5 fixture in the new test file, not by a click-through.

**Next:** `PLT-007` (notification polling) is the last open item in this repo. If the Safety app
diverges from these six sections, `05-permit-detail-sections.md` is the contract to fix it against.

---

## 2026-08-22 — Create wizard: the "cannot be continued" bug, the JSA minimum, and the step-2 map

Three tasks, in priority order. Scope: `src/pages/permit/pages/create/**` + `src/tests/pages/permit/create/**`.

### 1. ROOT CAUSE — permit creation could not be continued (`PMT-008`)

**Diagnosed by reproduction, not by reading.** Driven in headless Chromium against the live backend
(seeded `contractor@e2e.test` on this app's vite port `:8081`, API on `:3000`), watching console and
network on every step:

| Step | Next | Network |
|---|---|---|
| 1 Type | enabled | — |
| 2 Basic info | enabled | `POST /permits` → **200** `WP-HOT-20260821-005` |
| 3 Safety checks | enabled | `PATCH /permits/:id` → **200** (`safetyReading {lel:0, o2:21}`) |
| 4 PPE & workers | enabled | — |
| 5 **JSA** | **DISABLED — permanently** | — |

Step 5 arrives with `formData.jsaSteps` **undefined**, and nothing seeds a row. `Step5JsaSchema`
carried a `rows.length === 0` issue, so `currentStep.schema.safeParse(formData)` failed on arrival,
`isNextBlocked` was `true` before the user touched anything, and there was no way forward except an
"＋ add step" button that the footer never mentioned. Worse, the footer's blocked note renders
`permit.wizard.blockedNote` = *"Resolve the blocked reading to continue"* — which points the user
back at **step 3's readings**, a step that was already green. That is the dead end the product owner
reported. Adding one JSA row let the identical walk finish and submit
(`POST /permits/:id/submit` → 200, status `PENDING`), which isolates the cause to that one rule.

The rule was a client-side invention: `PATCH /permits/:id` accepts an empty `jsaSteps` and
`POST /permits/:id/submit` never inspects the JSA (`docs/api/openapi.json`). It therefore also
violated the standing ruling *"no client-side rule that blocks what the server would accept"* — and
the product owner had independently ruled it out in `docs/main/PROMPT-LOG.md` session 2. One fix, both
tasks.

**Fixed:**
- `schema/Step5Jsa.schema.ts` — minimum removed; header comment rewritten to record *why* it must
  not come back. The per-row `minLength: 1` checks on `step`/`hazard`/`control` **stay** — those are
  on the wire and a half-filled row would 400.
- `components/steps/Step5Jsa.vue` — dropped the matching `⛔` blocking banner.
- `src/locales/{en,th}/permit.ts` — removed the now-dead
  `permit.create.steps.jsa.validation.atLeastOne` key (targeted edits, `permit.create.*` only).

**Regression left behind, confirmed RED against the pre-fix schema:**
- `src/tests/pages/permit/create/PermitCreatePage.walk.test.ts` — mounts the **real** page and walks
  all six steps with a draft that has **no `jsaSteps` at all**, asserting `nextBlocked === false` at
  every step and `canSubmit === true` on Review. Against the old schema it fails with
  `step 5 blocked Next: expected true to be false`.
- `schema/Step5Jsa.schema.test.ts` — the case that pinned the old rule is inverted and re-commented.

**Re-verified live:** the same browser walk with **zero** JSA rows now reaches Review and submits
(`WP-HOT-20260821-006` → `PENDING`).

Ruled out along the way, with evidence rather than assertion: step 2's date/time proxies compose
correct ISO datetimes and `POST /permits` fires exactly once; the debounced `persist()` chain sets
`draftId` on the first create and PATCHes thereafter; steps 3 and 4 both unlock with the values on
screen; `checklistAnswers` staying out of `formData` blocks nothing.

### 2. `ตำแหน่งบนแผนที่` — the step-2 map pin (`PMT-005`)

Per `docs/main/PROMPT-LOG.md` session 2 ("map scope"): **no** map dependency, **no** geo field, **no**
fabricated floor-plan asset. What shipped is a zone picker over the *same vocabulary the Safety
app's risk map already plots*, so a permit lands on the same spot in both apps.

- New `create/constants/LocationZones.ts` — a deliberate **mirror** of
  `../smart-work-permit-frontend/src/pages/safety-officer/pages/risk-map/utils/LocationPosition.ts`:
  identical 8 zone keys, identical percentages, identical prefix match, identical hash fallback.
  The two repos share no package, so the copy is guarded by a test rather than by hope.
- `Step2BasicInfo.vue` — a zone chip row that writes **canonical English** (`Zone 3`, `Tank Farm`)
  into the **existing free-text `location` field**. Canonical English matters: the Safety app matches
  on `location.trim().toLowerCase().startsWith(key)`, so a Thai label would never resolve and the two
  apps would plot the same permit in two places. Chips show the Thai/EN label; the value on the wire
  stays matchable. Below it, the risk map's own placeholder-plan treatment (`aspect-[4/3]`, dashed
  border, placeholder note) with the pin absolutely positioned at the resolved percentages.
- **Free text outside the vocabulary is still fully allowed** and still falls back to the
  deterministic hash — typing by hand was never taken away.
- `mapPlaceholder` ("— เร็ว ๆ นี้") replaced by `permit.create.steps.basicInfo.map.*` in EN + TH.

**Verified in a browser** (headless Chromium, live backend, Thai UI):

| Input | Pin |
|---|---|
| chip `โซน 3` → `location` = `Zone 3` | `left: 68%; top: 32%` — the Safety app's exact `zone 3` |
| free text `Effluent plant — sump pit` | `left: 22.8%; top: 65.2%` (hash fallback, accepted) |
| free text `Zone 3 / Pipe Rack B` | back to `left: 68%; top: 32%` (prefix match) |

`src/tests/pages/permit/create/constants/LocationZones.test.ts` pins all eight mirrored positions,
the prefix narrowing, and the hash fallback's determinism and bounds.

### 3. JSA minimum-row rule — dropped

Same change as §1. See above.

### Verification

- `./init.sh` — **ALL GREEN** (typecheck PASS, lint PASS, vitest **44 files / 440 tests PASS**,
  live API smoke PASS).
- `node ../scripts/check-contract-sync.mjs` — **OK** (openapi in sync — re-read at md5
  `d7b6c5648fb99dae75d039619cffdc7e` after the backend regen — 25 error codes declared,
  `/api/v1` prefix present).
- `bunx eslint` / `bunx vue-tsc --noEmit` on every touched file — clean. `vue-tsc` covers the
  concurrent agent's new `pages/detail/**` sections, which import three of this tree's constants
  (`SafetyReadingView`, `PhotoEvidence`, `WorkerHealth`) — none of the three was changed.

### Raised, not fixed (outside this task's locale fence)

`permit.wizard.blockedNote` is the **English** string *"Resolve the blocked reading to continue"* in
**both** `src/locales/en/permit.ts` and `src/locales/th/permit.ts`, so a Thai-default UI renders
English. It is also wrong in substance — it names a *reading* regardless of which step is blocked,
which is precisely what misdirected the user in §1. It sits under `permit.wizard.*`, outside the
`permit.create.*` keys this session was scoped to edit in those shared files. Whoever owns
`permit.wizard.*` next should translate it and make it step-agnostic.

Left in the dev DB by the reproduction: draft/pending probe permits `WP-HOT-20260821-002`
through `-006`.

## 2026-08-23 — `useUpload` fake-success fix, and `CRT-004` (Certificate gate on permit submission)

Two tasks. Ran alongside a concurrent agent doing `PMT-014` (draft resume/edit/duplicate) in
`create/**` — every `create/**` file was re-read immediately before editing to pick up its
in-flight changes (`useWizard.ts` already had `hydrate()` on disk when this session started
editing it).

### 1. `useUpload()` no longer fabricates a success

`src/composables/useUpload.ts`'s `upload()` caught every failure, toasted a hardcoded Thai string
about **Google Cloud Storage** billing (wrong app — this stack is MinIO — and unlocalized), and
returned a fake `{ fileUrl: '/assets/images/logo.png', filePath: '', ... }`. Both deleted; the
function now lets the real error propagate. The one real caller,
`AddCertificateModal.vue`'s `useCreate()`, already ran inside `handleLoading`, whose default
error callback already routes through `useApiError().mapError()` — so a thrown upload error is
now localized off `errorCode` (reusing the existing `FILE_TYPE_NOT_ALLOWED` /
`FILE_TOO_LARGE` / `UPLOAD_FOLDER_NOT_ALLOWED` / `STORAGE_UNAVAILABLE` copy) with **no new code
needed to wire that up**. Because `getUploadImages` now throws before `CertificateService.create`
is reached, a failed upload no longer silently saves a certificate with no attachment. Added one
more guard on top: if `getUploadImages` resolves without throwing but still has no usable
`path` (e.g. an upload response missing `originalName`, which `useUpload`'s splice skips), `useCreate`
now throws explicitly instead of quietly sending `filePath: undefined`.

**PhotoSlot.vue decision:** left alone, per the task's default posture. It already avoids
`useUpload` for its own reasons (empty `fileRef` on the wire, `minLength: 1`) and is a different
page tree being touched by the concurrent PMT-014 agent this run. Its doc comment ("swallows every
failure... returns a FAKE success") is now stale given this fix, but editing a comment-only line in
a file the other agent may be mid-edit on isn't worth the collision risk — flagged here as a
follow-up for whoever owns that file next, not fixed.

### 2. `CRT-004` — certificate gate on permit submission

Read the acceptance list before writing anything. Bullets 3 and 4 were **already satisfied** by
`PMT-009`'s work, unchanged here — see the certificate module's `CRT-004` evidence for the exact
wiring (`useCertificatePreflight` driving Step6Review's row, `submitDraft()`/`SubmitErrorRouting.ts`
extracting `certificateFailures[]` off a rejected submit and naming the worker on step 4). Bullets 1
and 2 — a live client-side gate on step 4/6, before the user ever hits submit — were not built and
are what this session added:

- `useCertificatePreflight.ts` gained a sequence-token staleness guard (a superseded `check()` call
  can no longer overwrite a newer one's verdict) and an optional `loadingUnit` param, so a shared
  instance triggered on every worker-list edit doesn't drive the global loading spinner.
- `useWizard.ts` hoists ONE shared `useCertificatePreflight()` instance — debounced (500ms) off the
  `workers` array reference, `immediate: true` so it also covers a hydrated/resumed draft — and
  exposes `certificateState`/`certificateProblems`. `isNextBlocked` now also gates on the PPE &
  Workers step when `certificateState === 'fail'`, and `canSubmit` gates the same way — both
  **only** on a CONFIRMED `'fail'`, never `'loading'`/`'unknown'`, so an unresolved lookup can never
  be stricter than the server (the exact class of bug PROMPT-LOG's JSA entry warns against).
- `WizardSteps.ts`'s `IWizardStepProps` gained `certificateState`/`certificateProblems`, threaded
  through `PermitCreatePage.vue` to whichever step is mounted.
- `Step4PpeWorkers.vue`: a per-worker certificate badge column (checking/valid/missing/expired/
  unknown, never claiming "valid" while unresolved) and a named blocking-worker list, mirroring the
  existing server-rejected list's shape.
- `Step6Review.vue`: converted from owning its own `useCertificatePreflight()` instance to reading
  the two values as props — same displayed behavior, but now guaranteed to agree with step 4's gate
  since both read the one instance in `useWizard`.
- New locale keys (`permit.create.steps.ppeWorkers.column.certificate`, `.certificate.*`,
  `.certificatePreflight.title`) in EN + TH, added as targeted key insertions, not whole-file writes.
- Bullet 5 (Inspector-side `CERT_BLOCKED` denial) is a negative acceptance — different repo,
  correctly not built.

New test: `src/tests/pages/permit/create/composables/useWizard.certificatePreflight.test.ts` (4
cases) — blocks Next and names the worker on a missing cert, unblocks on a valid one, never blocks
on an unresolved lookup, and proves the staleness guard directly (a stale 'missing' resolving after
a newer 'pass' cannot flip Next back to blocked).

### Verification

- `bunx eslint` on every touched file — clean.
- `bunx vue-tsc --noEmit` — clean.
- `bunx vitest run` — **48 files / 450 tests PASS** (baseline before this session: 44 files / 440
  tests, all from the concurrent PMT-014 agent's own work plus this session's one new test file).
- `./init.sh` — **ALL GREEN**: typecheck PASS, lint PASS, vitest 48/450 PASS, live smoke 16/16 PASS
  against `localhost:3000`.
- `node ../scripts/check-contract-sync.mjs` — **OK**, openapi in sync, 25 backend error codes all
  declared, `/api/v1` prefix present.

### Deviations / open questions

- The acceptance list's wording ("Wizard step 4 shows each registered worker's certificate state")
  is satisfied as a per-row badge rather than a dedicated summary banner — matches the existing
  health-check column's presentation, no separate UI pattern invented.
- No conflicts hit with the concurrent PMT-014 agent — its `hydrate()` addition to `useWizard.ts`
  and its three new page/composable files were re-read fresh immediately before this session's own
  edits to the shared files (`useWizard.ts`, `WizardSteps.ts`) landed on top, cleanly.

## 2026-08-23 — `PMT-014`: draft resume, edit and Duplicate & Edit

Read the acceptance list and the resume/duplicate trap (safetyReading APPENDS, must not replay)
before writing anything. A concurrent `CRT-004` (certificate pre-flight) session landed on top of
this one's own `useWizard.ts`/`WizardSteps.ts` edits mid-session — re-read both fresh before
finishing, wired `certificateState`/`certificateProblems` through the new `PermitEditPage.vue` the
same way `PermitCreatePage.vue` does, and re-verified. No other conflicts.

### 1. Resume route (`/permits/:id/edit`, `PermitEditPage.vue`)

- `useWizard.hydrate(permit: IPermitDetail)` — new function, seeds `formData` from the base fields
  plus `safetyReading`/`workers`/`jsaSteps`/`photos`, sets `draftId = permit.id` (so the very next
  edit PATCHes instead of POSTing a second draft), primes the private `lastPersistedReading` from
  `latestSafetyReading` (so an unrelated edit never re-appends the copied/unchanged reading as a
  new row), and lands on the first step whose own schema fails `safeParse` — every step before that
  one is therefore unlocked (`maxUnlockedStepIndex` set to the same index). Never calls the API
  itself — a pure state-seed, called once by the page after it has confirmed the permit is
  editable. Does NOT touch AGENTS.md's "wizard state lives in a composable, not a store" rule:
  `/permits/create` still boots a fresh `useWizard()` with nothing hydrated.
- `useResumePermit.ts` (new) — confirms editability with the REAL operation rather than guessing
  off `status` client-side: `PATCH /permits/:id` with an **empty body** is a genuine no-op edit, so
  DRAFT succeeds and returns the current permit, while a non-DRAFT id answers the backend's own
  403 `PERMIT_NOT_EDITABLE`, mapped through `useApiError().mapError()` and rendered instead of the
  wizard. This is also the confirm PATCH the live walk below shows landing before hydration.
- `PermitEditPage.vue` (new) — loading skeleton → error card (`PERMIT_NOT_EDITABLE` or any other
  mapped verdict, never the backend `message`) → the real wizard shell (StepperHeader + step
  component + WizardFooter, same contract as `PermitCreatePage.vue`, including the
  `certificateState`/`certificateProblems` props `CRT-004` added). `onMounted` calls
  `fetchEditablePermit(id)` then `hydrate(permit)` on success.

### 2. Duplicate route (`/permits/:id/duplicate`, `PermitDuplicatePage.vue`)

No clone endpoint exists (`docs/api/openapi.json` has no such path) — client-side `GET` the source,
`POST /permits` with only the fields `ICreatePermitDraftPayload` declares (so `id`/`status`/
`submittedAt`/`rejectedReason`/`rejectedAt`/every approval/closure field are excluded **by
construction**, not by a blocklist), then one `PATCH` copying `jsaSteps`/`workers`/`photos`/the
latest `safetyReading` onto the NEW draft — sent exactly once, since this is the very first PATCH
that draft has ever seen. `useDuplicatePermit.ts` (new) owns all of it; `PermitDuplicatePage.vue` is
pure orchestration (call it, `router.replace` to `PermitEditPage` for the new id on success). The
resume route then owns confirming editability and hydrating — no logic duplicated between the two
pages.

### 3. Two real bugs found and fixed during the live walk (see Verification)

- **`workers[].bloodPressure`/`alcoholReading` are `string` on the wire, never nullable**
  (`docs/api/openapi.json`), but `GET`/PATCH-response rows return `null` for any worker that never
  had a health check — i.e. every non-Confined-Space permit, always. Hydrating that `null` straight
  into `formData` and later round-tripping it via `doPersist`'s wholesale `workers` replace, or
  copying it straight through on duplicate, both 400 (`Expected property 'workers.N.bloodPressure'
  to be string but found: null`). Fixed in both `useWizard.hydrate` (a new `toFormWorkers` sanitizer)
  and `useDuplicatePermit.toWireWorkers` — `null` is converted to `undefined` (omitted), a real
  string is passed through unchanged. Caught live against the real backend, not by a unit test —
  both composables' tests were updated afterward to pin the fix.
- **`PermitEditPage.vue` didn't pass `certificate-state`/`certificate-problems`** to the mounted
  step component — it was written before the concurrent `CRT-004` session added those two required
  props to `IWizardStepProps`. Landed on a duplicated draft's Review-adjacent step and threw
  `Cannot read properties of undefined (reading 'map')` inside `Step6Review.vue`. Fixed by wiring
  the same two props `PermitCreatePage.vue` already passes.

### 4. `PermitStatusBanner.vue` (CTA wiring only, per scope)

Replaced the disabled placeholder button + "not available yet" caption with a real button: DRAFT →
`router.push({ name: 'PermitEditPage', params: { id: permit.id } })`, REJECTED → `PermitDuplicatePage`
the same way. No other change to this file. `PermitDetailPage.test.ts` (owned by a different item,
but its two banner assertions pinned the OLD disabled state and would otherwise fail) updated in
place: still one assertion each, now asserting the button is enabled and correctly labelled, plus
the two new route names registered in that test's router so mount doesn't throw (vue-router 5).

### Verification

- `bunx eslint` on every touched file — clean.
- `bunx vue-tsc --noEmit` — clean.
- `bunx vitest run` — **48 files / 451 tests PASS**. New: `useWizard.hydrate.test.ts` (4 cases —
  seeds formData/draftId, lands on the correct first-invalid step, lands on Review when everything
  already validates, and pins the health-field null→omitted fix), `PermitEditPage.test.ts` (2 cases
  — hydrates and lands correctly; renders the server's `PERMIT_NOT_EDITABLE` verdict instead of a
  broken wizard, and never renders the backend `message`), `PermitDuplicatePage.test.ts` (1 case —
  the new-draft payload excludes every forbidden field, the collections and reading copy over
  correctly, and it lands on `PermitEditPage` for the NEW id).
- `./init.sh` — **ALL GREEN**: typecheck PASS, lint PASS, vitest 48/451 PASS, live smoke 15/15 PASS
  against `localhost:3000`.
- `node ../scripts/check-contract-sync.mjs` — **OK**, openapi in sync, 25 backend error codes all
  declared, `/api/v1` prefix present.
- **Live browser walk** (headless Chromium via Playwright, against the running dev server on
  `:8081` — confirmed by content, `:8080` serves a different repo — and the real backend on
  `:3000`; login as `contractor@e2e.test`, a separate seeded account from `scripts/smoke-api.mjs`'s
  own, kept separate specifically to dodge the login rate limiter (`10/15min` per identifier) that
  this session's own repeated debugging attempts against the `smoke.contractor@` account tripped):
  - (a) created a DRAFT (`type: heights`, no reading/workers/jsaSteps) through the app's own
    authenticated session — the same call the wizard's autosave makes — and left it there.
  - (b) the DRAFT's detail page `Edit Permit` button is visible and enabled, and navigates to
    `/permits/:id/edit`.
  - (c) landed on **Safety Checks (step 3)** — the first step that actually fails (no wind reading
    recorded) — not step 1, with steps 1–2 shown `✓` done/unlocked in the stepper.
  - (d) jumped back to step 2 via the stepper (proving it really is unlocked, not just displayed
    done), edited the title, waited past the 1500ms autosave debounce: exactly **one PATCH to the
    same id**, confirmed by intercepting the request — no second `POST /permits`.
  - (e) `Duplicate & Edit` on the seeded REJECTED permit `WP-HOT-E2E-005`: `GET` (source) → `POST
    /permits` (new draft — request body inspected directly, carries none of `id`/`status`/
    `submittedAt`/`rejectedReason`/`rejectedAt`/any approval or closure field) → `PATCH` (request
    body inspected directly: copies `jsaSteps`/`workers`/`photos`/`safetyReading` exactly once) →
    redirected to `/permits/<newId>/edit`, whose own confirm-editability PATCH request body was
    verified to be a literal empty `{}` — the reading is never replayed. Zero console errors on the
    final run (after the two fixes above).

### Deviations / open questions

- None on the acceptance list — every bullet was satisfied and verified live, including the two
  that were explicit traps (safetyReading replay, and not pre-empting the server's editability
  check with a client-side status guess).
- "Leaving and re-entering an unfinished resumed draft does not create additional drafts" was not
  re-walked as a literal navigate-away-and-back in the browser (budget), but is true by
  construction, not just by observation: the resume route only ever operates on the id already in
  its URL — nothing in `PermitEditPage.vue`, `useResumePermit.ts` or `useWizard.hydrate` calls
  `create()`/`POST /permits`, so re-entering the same URL re-runs the identical confirm-PATCH +
  hydrate sequence against the identical id every time.
- Probe drafts `WP-HT-20260823-001` through `-009` and duplicate drafts off `WP-HOT-E2E-005` are
  left in the dev DB from the live walk (same posture as prior sessions' probe permits).
- The stale doc comment on `Permit.router.ts` ("NOT yet registered in src/router/index.ts... during
  this wave") predates this repo's four-router registration and was already wrong before this
  session; left as found — out of this item's scope to correct.

## 2026-08-23 — PLT-012 self-service profile

`/profile` — a contractor's own account. Before this the app had no account screen at all: a
contractor could not see or correct anything about themselves. Backend half is
`smart-work-permit-api` `feat-022`; the officer-side account register lives in the **Safety** app.

Reached from the drawer's account card, which is now a button — this app has no header menu, so
that card is the only route in.

Two things a later session should not undo:

- **There is no role or activation control on the page, and a test enforces it.** `PATCH /users/me`
  does not declare `permitRole` or `active`; the allow-list is the privilege boundary, not a
  convenience. A control there would promise an edit the server correctly refuses.
- **An empty phone field is omitted from the payload, not sent as `''`.** The API validates
  `phoneNumber` as exactly 10 characters, so `''` would 400. Omitted means unchanged, which is what
  someone who never filled it in expects.

`GAPS.md` row C (no company concept) is **closed as "will not exist"**, not left open: the
single-tenant ruling means there is no `Company` entity to model. `contractorProfile.firmName` is
the contracting firm and is descriptive — nothing may be scoped by it.

Note for whoever writes the next error-path test here: `useApiError` localizes through the app's own
i18n plugin instance, not the one a test installs, and the app's default locale is Thai. Assert the
Thai string.

## 2026-08-23 — backend feat-011c: GET /notifications is now paginated (cross-repo, backend-owned session)

Not this repo's own feature-list item — a backend session (`feat-011`) touched this app's
notification code because both frontends' own contract checks previously asserted `GET
/notifications` is NOT paginated, so a backend-only change would have broken this repo silently.

`GET /notifications` now takes the same `CommonPaginationModel` query params
(`page`/`limit`/`sortBy`/`sortOrder`/`search`) and answers the same
`CommonPaginationResponseModel` envelope `GET /certificates` does — `count`/`page`/`limit`/
`totalPage` alongside `data` — instead of the old `limit`-only, non-paginated response.

Changed: `NotificationRes.model.ts` (`TGetNotificationListResponse` is now
`IBasePaginationResponse<INotification>`), `Notification.provider.ts` (`IGetNotificationListQuery`
gains `page`), `stores/Notification.ts` (`fetch()` now sends `{ page: 1, limit: 50 }` explicitly —
this store's own shape, a flat `notifications` array with no paging UI, is unchanged; it just reads
`response.data` off the envelope now instead of the whole thing), `scripts/smoke-api.mjs` (asserts
the paginated shape instead of its absence), `useNotificationPolling.test.ts` (`emptyList()` fixture
gained the pagination fields the type now requires). This app was already safe by construction — the
axios interceptor passes the whole envelope through and callers read `.data` — so the change here is
entirely typing/comments plus the store's explicit `page`/`limit`, not a transport fix.

`docs/api/GAPS.md` row D closed. Row F (permit `description`, feat-011a) updated: the backend now
serves a nullable `description` on create/update/every permit response, but **no frontend
consumption was wired in this session** — that is a separate item, still open here.

`./init.sh` green: typecheck PASS, lint PASS (2 pre-existing `vue/one-component-per-file` warnings,
unrelated), vitest 460 pass / 50 files, smoke 15/15 checks pass against a live backend
(`contractor@e2e.test`) including "notifications are paginated (feat-011c) — same envelope shape as
certificates".
