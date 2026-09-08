# Session Handoff

> Fill this in before ending every session. The next agent reads this file, `progress.md`,
> and the active module's `feature_list.json` — nothing else is guaranteed to be in context.

**Date:** 2026-09-08 (second session)
**Session did:** wayfinder **047**, **048** and **045**, in that order, one commit each, each gated
on its own green `./init.sh` before the next started. A parallel agent owned the safety repo the
whole time — nothing outside this repo was touched. **Not pushed.** Working tree is clean.

| Commit | Ticket |
|---|---|
| `f20e69e3` | 047 — Fire Watch renders only on a hot-work permit |
| `63484612` | 048 — the step-4 worker name is readable |
| `1ef1b6a8` | 045 — `areaId` goes on the wire only when a human set it |
| `162a8d4e` | (not a ticket) `useWizard.hydrate.test.ts` no longer leaks a rejected lookup past teardown |

**Status:** `./init.sh` green — typecheck PASS, lint PASS (the same 2 pre-existing
`vue/one-component-per-file` warnings), vitest **64 files / 552 tests** PASS, contrast PASS, icons
PASS, smoke SKIP (no API running). **Nothing was verified against a live backend this session** —
045 changes what a `PATCH /permits/:id` body contains, so per this repo's Definition of Done that
change is *not* fully verified until it has run against `../smart-work-permit-api`. Do that before
pushing.

## Five things to read before touching this area

1. **`useWizard` sends `areaId` only when a human set it this session — `areaIdIsUserChoice`.**
   This replaces 044's `delete` on an `undefined` value, which the previous handoff (below) told
   you was load-bearing. It was, and it was also insufficient: it only fired when `AreaPicker`
   emitted, and `AreaPicker` lives in `Step7Position`, which the wizard filters out whenever no
   facility plan is active — production today. The flag is set in `updateFormData`, where patches
   arrive, precisely so no step has to mount for it to hold. `hydrate` clears it: seeding is not
   choosing. **Four spellings, none interchangeable** — a number and `null` are sent (`null` is a
   real destructive clear), `undefined` and "key absent after a hydrate" are omitted.

2. **§5 of the permit detail page is gated on `permit.type`, not on `permit.fireWatch`.** A
   hot-work permit before its watch starts must keep the "none" state. The safety app's
   `v-if="permit.fireWatch"` is *not* the pattern to copy here — see point 5.

3. **The step-4 worker AutoComplete needs `fluid`, not just `w-full`.** Volt sizes the inner
   `<input>` through `p-fluid:w-full`, which matches only once PrimeVue stamps `data-p="fluid"`.
   Dropping the prop puts the input back at the UA default however wide the cell is, and narrows
   the suggestion overlay with it (PrimeVue derives the overlay's `min-width` from the input). A
   test asserts the stamped attribute on the rendered `<input>`.

4. **There are TWO distinct pre-existing test flakes in this repo — do not conflate them.**
   - `Error: Test timed out in 5000ms` on heavy whole-page mounts, a different set of files each
     run: CPU contention against vitest's default `testTimeout`. Still open, still not yours,
     still deserves its own ticket. Described at length in the previous handoff below.
   - `EnvironmentTeardownError: Closing rpc while "onUserConsoleLog" was pending`, always naming
     `useWizard.hydrate.test.ts`: **fixed this session** (`162a8d4e`). It failed no test — the run
     read `552 passed (552)` with `Errors 1 error` and `init.sh` printed `tests: FAIL` anyway,
     which is why it read as noise for a while. `hydrate` ends with `recheckCertificates()`, so a
     fixture with a named worker fired a real `byWorker` lookup that rejected after the test body
     returned; `useApiError`'s `console.error` then raced the worker shutdown. The provider is now
     stubbed in that file and the `afterEach` awaits `flushPromises()`. If you add a `hydrate` test
     with a named worker anywhere else, stub it there too.

5. **FR-3 is still live in the safety app, and ticket 047 says the opposite.** 047 states as a
   *verified* finding that the safety app "already gets this right". It does not: its
   `v-if="permit.fireWatch"` is on the `FireWatchCountdown` child and has a `v-else` reading
   "Fire Watch not started", and `SafetyReviewDetailPage.vue:87-92` renders §5 with no permit-type
   gate at all. That app was left untouched as 047 instructed. **It needs its own ticket** — the
   fix is the same one-line `permit.type` gate plus a heading variant.

## Open items owed to someone else

- **A safety-app ticket for FR-3** (point 5 above). Not written here to avoid colliding with the
  parallel agent's ticket numbering in the workspace repo.
- **The `Test timed out in 5000ms` contention flake** still has no ticket.
- **`permit.create.steps.position.area.empty`** ("No approved areas yet — propose one below.")
  stays mildly untrue under `AREA_VISIBILITY_SCOPED` — carried over from the previous session,
  still needs owner-approved copy, still not fixed.
- **`docs/main/PROMPT-LOG.md`'s three demo-login bullets** — retired by the parallel agent's
  `1361efcc` sync; nothing owed here any more.

## Next work

The remaining open field-report tickets for this repo are **049/050** (`certType` vocabulary —
049 is a `grilling` ticket and blocks 050) and **051/052/053** (the tabbed detail-page convention,
which also introduces a Volt tabs wrapper). 046 (nothing has deployed in twenty days) outranks all
of them and is not a code change in this repo.

Full decision log for all three tickets is in `progress.md` under
**2026-09-08 (second session)**.

---

# Addendum — 2026-09-08 (first session), wayfinder 042 + 044

**Date:** 2026-09-08
**Session did:** wayfinder **042** (remove the trial/demo logins) and **044** (per-contractor area
visibility, contractor half). Both API halves were already committed; this is the contractor-app
side only. A parallel agent owned the safety repo in the same window — nothing outside this repo
was touched.

**Two commits, deliberately separate and in this order:**

1. `feat(auth)!: remove the trial and demo logins (wayfinder 042)` — committed **alone**, at the
   requester's explicit instruction. The owner may revert it pending an unrelated question, so it
   must stay cleanly revertable. It was gated on its own `./init.sh` run before 044 was started,
   not only in combination.
2. `feat(permit): show a scoped-out area read-only, keep the permit saveable (wayfinder 044)`.

**Not pushed.** Working tree is clean; review both commits before pushing.

**Status:** `./init.sh` green — typecheck PASS, lint PASS (2 pre-existing unrelated warnings),
vitest **63 files / 542 tests** PASS, contrast PASS, icons PASS, **live API smoke 16/16 PASS**
against a real backend on `:3000`.

## Three things to read before touching this area

1. **`useWizard.doPersist` now `delete`s an `undefined` `areaId`.** This is the load-bearing line
   of 044 and it is easy to "simplify" away. `updateFormData`'s spread copies a key holding
   `undefined` rather than removing it, so the key really is present in the payload and previously
   survived to the wire only because `JSON.stringify` drops undefined properties. The server's
   `AREA_NOT_APPROVED` guard fires on the key's **presence**, so a leak there 400s every autosave
   for the rest of the session. `null` must still pass through — that is a user's deliberate clear.
   The test that pins it was falsified (reverted the line, watched it fail) before being trusted.
2. **`AreaPicker` branches on the resolved area's `status`, and that distinction is the point.**
   Still `APPROVED` but invisible to this contractor → read-only "Current area" value. Any other
   status → 037's amber "no longer approved, choose another one". Collapsing them back into one
   message re-introduces the bug 044 exists to fix: telling a contractor to replace a perfectly
   good area. `GET /v1/areas/:id` is deliberately unscoped server-side and is what makes the
   read-only display possible — verified live this session (`GET /areas/60` → 200 for an area the
   contractor's own list does not contain).
3. **There is a pre-existing full-suite flake in this repo — it is not yours.** Whole test files
   fail with `Error: Test timed out in 5000ms`, a different set each run, on heavy whole-page
   mounts (`PermitEditPage`, `ProfileDetailPage`, `PermitDetailPage`, `PermitCreatePage.*`).
   Bisected: `git stash` to bare HEAD without any 044 work and 2 of 3 full runs still failed. Each
   file passes 4/4 in isolation. Trigger is CPU contention against vitest's 5000 ms default
   `testTimeout` — it surfaced because the API dev server was running for the live verification.
   **Do not chase it as a logic bug and do not loosen an assertion to silence it.** The honest fix
   is a `testTimeout`/concurrency change in `vitest.config.ts`, which is a harness change with its
   own blast radius and was out of scope here. It deserves its own wayfinder ticket.

## Open items owed to someone else

- **`docs/main/PROMPT-LOG.md` carries three bullets that 042 makes false** and this session was
  forbidden to edit (it is byte-identical across all three repos and gated by
  `scripts/check-contract-sync.mjs`): "A demo affordance must never become a second, weaker way in"
  (including its `VITE_TRIAL_LOGIN_PASSWORD` reference, already stale since 023), and "Demo login
  is for UAT, on data whose loss costs nothing". They are **superseded** by the 2026-09-08 ruling.
  Whoever owns the next PROMPT-LOG sync should retire them.
- **`permit.create.steps.position.area.empty`** ("No approved areas yet — propose one below.")
  becomes mildly untrue once `AREA_VISIBILITY_SCOPED=TRUE`: there may be many approved areas, just
  none visible to this contractor. Left alone deliberately — not in 044's done-when, and the
  replacement copy needs an owner decision. Flagged, not fixed.
- **A pre-existing 037 hole, unchanged by 044:** the stale-area strip only runs if `AreaPicker`
  mounts, and the Position step is filtered out of the wizard entirely when no facility plan is
  active. A permit referencing a genuinely non-approved area, in a deployment with no active plan,
  would still 400 every autosave with no UI able to clear it. Scoping does not widen this (it
  changes visibility, not status) and production has no active plan today. Worth a ticket.

## Explicitly out of scope this session, still open

A field report arrived 2026-09-08 with contractor-app issues — a Fire Watch block showing on
non-hot permits, a narrow name field, a confusing `certType`. Those go through the owner's own
ticketing pipeline. `PermitClosureSection.vue`, `AddCertificateModal.vue` and the wizard's name
fields were **not** touched.

Full decision log for both tickets is in `progress.md` under **2026-09-08**.

---

# Addendum — 2026-08-23, PMT-014

**Session did:** `PMT-014` — draft resume, edit and Duplicate & Edit. Ran concurrently with a
second agent (`CRT-004`, certificate pre-flight) that also touched `useWizard.ts`/`WizardSteps.ts`
in this repo; both landed cleanly, re-verified after the other finished.

**Every `PMT-*` item in `docs/modules/permit/feature_list.json` is now `done`.** The `permit`
module is complete: list, the full 6-step wizard, resume/edit, duplicate, detail, closure, Fire
Watch, certificate pre-flight.

**Status:** `./init.sh` passes clean — typecheck PASS, lint PASS, vitest **48 files / 451 tests**
PASS, live API smoke 15/15 PASS. `node ../scripts/check-contract-sync.mjs`: OK (openapi in sync,
25 backend error codes all declared, `/api/v1` prefix present).
**Nothing is committed.** Review the working tree first.

---

## What this session built

| Piece | File(s) |
|---|---|
| Resume ("Edit Permit") | `src/pages/permit/pages/create/pages/PermitEditPage.vue` (new), `composables/useResumePermit.ts` (new), `useWizard.hydrate()` (new) |
| Duplicate ("Duplicate & Edit") | `src/pages/permit/pages/create/pages/PermitDuplicatePage.vue` (new), `composables/useDuplicatePermit.ts` (new) |
| Routes | `src/router/modules/Permit.router.ts` — `PermitEditPage` at `:id/edit`, `PermitDuplicatePage` at `:id/duplicate` |
| CTA wiring | `src/pages/permit/pages/detail/components/PermitStatusBanner.vue` — DRAFT/REJECTED buttons enabled, real navigation |
| Locale | `permit.create.editTitle/duplicateTitle/resuming/duplicating/notEditable.*` in both `en`/`th` — targeted key insertions only |

Full decision log, including the two real bugs found and fixed **live against the real backend**
(worker `bloodPressure`/`alcoholReading` `null` vs. `string` on the wire; `PermitEditPage.vue`
missing the `certificateState`/`certificateProblems` props `CRT-004` added mid-session), is in
`progress.md` under **2026-08-23 — `PMT-014`**. Read it before touching `useWizard.hydrate`,
`useDuplicatePermit`, or either new page — several choices there are load-bearing for reasons not
obvious from the diff alone (e.g. why the resume route confirms editability with a real empty-body
`PATCH` instead of checking `permit.status === 'DRAFT'` client-side).

## Read this before trusting anything about the wizard beyond what's below

**A full interactive browser walk WAS done this session** (headless Chromium via Playwright,
against the live dev server on `:8081` and the real backend on `:3000`), covering exactly the
acceptance list's manual-verification steps: create → leave → resume → correct landing step →
edit-only-PATCHes → duplicate → new draft with the excluded fields actually excluded → the reading
copied exactly once. Every claim above item 1–5 in `progress.md`'s Verification section was
observed directly (request/response bodies inspected, not inferred), not just unit-tested.

**Not done:** a literal "close the tab, come back" re-entry of an in-progress resumed draft — the
"no additional drafts on re-entry" acceptance bullet is true by construction (see `progress.md`'s
Deviations) but wasn't re-walked as a second live pass. If that's ever in doubt, it's a five-minute
check, not a redesign.

**Login rate limiting on the shared dev backend is real and stateful across sessions.** The auth
route allows only 10 attempts per 15 minutes per identifier (`../smart-work-permit-api/src/
modules/auth/lib/auth-rate-limit.util.ts`). Repeated Playwright debugging runs against
`smoke.contractor@example.com` tripped it mid-session; switching to the separately-seeded
`contractor@e2e.test` / `password123` (from `../smart-work-permit-api/prisma/seeds/
e2e-fixtures.seed.ts` — also the only account with a ready-made **REJECTED** permit,
`WP-HOT-E2E-005`, useful for testing Duplicate & Edit without seeding one yourself) unblocked it.
Don't hammer either account's login in a tight loop.

> The contractor app is on **:8081**, not :8080 — confirmed by content (this repo's `index.html`
> has no Google-Fonts preconnect; whatever's on :8080 does). **Never `pkill -f vite`** — kill your
> own PID only.

## Open items owed to someone else

Unchanged from the prior handoff below — `docs/api/GAPS.md` rows G–K are still open, all
backend-side or product-owner decisions, none touched by this session.

## Next work

`PLT-007` (notification polling) is the only remaining unbuilt item in this repo. Cross-repo, item
1.2 is open: the Safety/Inspector detail page must align with the contractor detail page's six
sections. Probe data left in the dev DB by this session: drafts `WP-HT-20260823-001` through
`-009`, and one or more duplicate drafts created off `WP-HOT-E2E-005` — none are fixtures anything
depends on, delete whenever convenient.

---

# Addendum — 2026-08-22, PMT-006–009 (create wizard steps 3-6)

**Session did:** `PMT-006`, `PMT-007`, `PMT-008`, `PMT-009` — the create wizard's last four steps
(Safety Checks, PPE & Workers, JSA, Review & Submit). Ran concurrently with a second agent that
finished `PMT-010`–`PMT-012` (the detail page) in the same repo.

**Status at the time:** `./init.sh` passed clean — typecheck PASS, lint PASS, vitest 41 files /
424 tests PASS, live API smoke 16/16 PASS.

## What this session built

| Item | Landed |
|---|---|
| `PMT-006` | `Step3SafetyChecks.{vue,schema.ts}`, `constants/{SafetyChecklist,SafetyReadingView,PhotoEvidence}.ts`, `components/PhotoSlot.vue`, the `safetyReading` append guard + `checklistAnswers` state in `useWizard` |
| `PMT-007` | `Step4PpeWorkers.{vue,schema.ts}`, `constants/WorkerHealth.ts`, `EVIDENCE_SLOTS` |
| `PMT-008` | `Step5Jsa.{vue,schema.ts}` |
| `PMT-009` | `Step6Review.{vue,schema.ts}`, `composables/useCertificatePreflight.ts`, `constants/SubmitErrorRouting.ts`, `useWizard.submitDraft()`, the real Submit wiring in `PermitCreatePage.vue` |

The full decision log — the append guard, why `PhotoSlot` avoids `useUpload()`, the checklist
defaults, the health-check asymmetry, why Submit assigns `currentStepIndex` instead of calling
`goToStep()` — is in `progress.md` under **2026-08-22**.

## Open items owed to someone else (as of that session)

- **`docs/api/GAPS.md` rows J and K** (both `api-adds`, filed this session):
  **J** — the permit has no field for step 3's Yes/No/N-A checklist, so the answers are held in
  `useWizard` state, never persisted, and the step says so on screen.
  **K** — `safetyReading` has no `so2` on the wire; `toWireReading()` strips it rather than letting
  Elysia discard it silently. Neither can change a pass/fail verdict (SO2 is `blocking: false`).
  Rows **G**, **H**, **I** are still open from earlier sessions.
- **Product-owner question (`PMT-008`):** "at least one JSA row before Next" is **not** in the
  backend contract — PATCH accepts an empty `jsaSteps` and submit does not check the JSA at all.
  This was later dropped entirely per a product-owner ruling — see `docs/main/PROMPT-LOG.md`.

---

# Addendum — 2026-08-22, PMT-013 (permit detail: the six sections)

Written by the detail-page agent, running concurrently with the create-wizard agent that wrote the
first addendum above.

**Session did:** `PMT-013` — implemented `docs/main/dev-handoff/05-permit-detail-sections.md` §2
on `PermitDetailPage`. All six contract sections now render, stacked, in order, each with an
explicit empty state.

**Status at the time:** `./init.sh` **exit 0 — ALL GREEN**: typecheck PASS, lint PASS, vitest 42
files / 433 tests PASS, live smoke 16/16 PASS.

## Things the next agent should know

- **The detail sections read three `create/**` constants** (`SafetyReadingView`, `PhotoEvidence`,
  `WorkerHealth`) and three `permit.create.*` locale namespaces. Renaming those constants or locale
  keys will break the detail page — grep before you move them.
- **`so2` must stay unrendered** (`GAPS.md` row K): it is not on the wire. A test pins this.
- **Contractor closure now really works** — the backend admits `contractor` on
  `POST /permits/:id/close` scoped to their own permit.
