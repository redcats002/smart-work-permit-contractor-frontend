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
