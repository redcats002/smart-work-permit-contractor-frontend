# Session Handoff

> Fill this in before ending every session. The next agent reads this file, `progress.md`,
> and the active module's `feature_list.json` — nothing else is guaranteed to be in context.

**Date:** 2026-08-23
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
