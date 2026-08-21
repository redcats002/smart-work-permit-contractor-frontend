# Session Handoff

> Fill this in before ending every session. The next agent reads this file, `progress.md`,
> and the active module's `feature_list.json` — nothing else is guaranteed to be in context.

**Date:** 2026-08-22
**Session did:** `PMT-006`, `PMT-007`, `PMT-008`, `PMT-009` — the create wizard's last four steps
(Safety Checks, PPE & Workers, JSA, Review & Submit). Ran concurrently with a second agent that
finished `PMT-010`–`PMT-012` (the detail page) in the same repo.

**Every `PMT-*` item in `docs/modules/permit/feature_list.json` is now `done`.** The `permit`
module is complete: list, the full 6-step wizard, detail, closure, Fire Watch.

**Status:** `./init.sh` passes clean — typecheck PASS, lint PASS, vitest **41 files / 424 tests**
PASS, live API smoke 16/16 PASS. `node ../scripts/check-contract-sync.mjs`: OK (openapi in sync,
25 backend error codes all declared, `/api/v1` prefix present).
**Nothing is committed.** Review the working tree first.

---

## Read this before trusting the wizard UI

**No interactive browser click-through was done.** The Claude-in-Chrome extension reported zero
connected browsers for this entire session, so nothing was clicked or screenshotted. What *was*
verified beyond the unit suite:

- All five new/changed SFCs compile and lint through the running vite dev server on **:8081**
  (200 + transformed JS; `vite-plugin-eslint2` runs inside that pipeline).
- `src/tests/pages/permit/create/PermitCreatePage.submit.test.ts` mounts the **real**
  `PermitCreatePage`, drives the **real** wizard from step 1 to Review, and exercises a successful
  submit plus three distinct server rejections.

**Still unseen by a human** — recommend one manual pass over `/permits/create`:
the rendered reading cards and their red out-of-range state, the 44-row checklist at 375px, the
worker table's horizontal scroll, the photo picker and its upload states, the JSA phase tabs, and
the review step's pre-flight rows.

> The contractor app is on **:8081**, not :8080 — the Safety/Inspector app took 8080 first. Both
> are live and `CORS_ORIGIN` names only those two origins, so a third port 401s everything.
> **Never `pkill -f vite`** — kill your own PID only.

## What this session built

| Item | Landed |
|---|---|
| `PMT-006` | `Step3SafetyChecks.{vue,schema.ts}`, `constants/{SafetyChecklist,SafetyReadingView,PhotoEvidence}.ts`, `components/PhotoSlot.vue`, the `safetyReading` append guard + `checklistAnswers` state in `useWizard` |
| `PMT-007` | `Step4PpeWorkers.{vue,schema.ts}`, `constants/WorkerHealth.ts`, `EVIDENCE_SLOTS` |
| `PMT-008` | `Step5Jsa.{vue,schema.ts}` |
| `PMT-009` | `Step6Review.{vue,schema.ts}`, `composables/useCertificatePreflight.ts`, `constants/SubmitErrorRouting.ts`, `useWizard.submitDraft()`, the real Submit wiring in `PermitCreatePage.vue` |

Locale keys added under `permit.create.*` in both `src/locales/en/permit.ts` and
`src/locales/th/permit.ts` (targeted edits only — the `permit.detail.*` block belongs to the other
agent and was not touched). Every step's `marker`/`body` placeholder key is gone.

The full decision log — the append guard, why `PhotoSlot` avoids `useUpload()`, the checklist
defaults, the health-check asymmetry, why Submit assigns `currentStepIndex` instead of calling
`goToStep()` — is in `progress.md` under **2026-08-22**. Read it before changing any of them; each
one is load-bearing for a reason that is not obvious from the code alone.

## Open items owed to someone else

- **`docs/api/GAPS.md` rows J and K** (both `api-adds`, filed this session):
  **J** — the permit has no field for step 3's Yes/No/N-A checklist, so the answers are held in
  `useWizard` state, never persisted, and the step says so on screen.
  **K** — `safetyReading` has no `so2` on the wire; `toWireReading()` strips it rather than letting
  Elysia discard it silently. Neither can change a pass/fail verdict (SO2 is `blocking: false`).
  Rows **G**, **H**, **I** are still open from earlier sessions.
- **Product-owner question (`PMT-008`):** "at least one JSA row before Next" is **not** in the
  backend contract — PATCH accepts an empty `jsaSteps` and submit does not check the JSA at all.
  Implemented as a client-side minimum in the weaker reading (one row per *permit*, not per phase)
  so it cannot block a submission the server would accept. Confirm the intended rule.

## Next work

`PLT-007` (notification polling) is the only remaining unbuilt item in this repo. After that, the
open work is all backend-side: `GAPS.md` rows G, H, I, J, K.

---

# Addendum — 2026-08-22, PMT-013 (permit detail: the six sections)

Written by the detail-page agent, running concurrently with the create-wizard agent that wrote
everything above. The two sections do not contradict each other; this one is newer.

**Session did:** `PMT-013` — implemented `docs/main/dev-handoff/05-permit-detail-sections.md` §2
on `PermitDetailPage`. The page had been *lite* since `PMT-010`: `workers`, `photos`, `jsaSteps`
and `latestSafetyReading` were never rendered. All six contract sections now render, stacked, in
order, each with an explicit empty state. `PMT-010`/`011`/`012` (banners, QR, closure modal, Fire
Watch) were extended, not replaced, and their tests still pass untouched.

**Status:** `./init.sh` **exit 0 — ALL GREEN**: typecheck PASS, lint PASS, vitest **42 files /
433 tests** PASS, live smoke 16/16 PASS. `node ../scripts/check-contract-sync.mjs`: OK.
**Nothing is committed.**

**Touched:** `src/pages/permit/pages/detail/**` (5 new components, `PermitInfoCard` grown,
`PermitAuditTimeline`'s heading moved into the §6 wrapper, the page rewired),
`src/tests/pages/permit/detail/PermitDetailSections.test.ts` (new, 9 tests),
`permit.detail.sections.*` in both locale files (targeted edits — no `permit.create.*` key was
edited), and two additive model edits: `IPermitValidationSummary` in `Permit.model.ts` plus
`validationSummary` on `IPermitDetail`. That key is in the openapi `required` list for
`GET /permits/:id` and was simply missing from the model.

**Browser pass: done.** Headless Chromium against the live dev server on **:8081** as the seeded
contractor, at 1440px and 375px — six sections in Thai in order, no console errors, no horizontal
overflow at 375px. Details and the exact list of what was *not* reachable are in `progress.md`.

## Things the next agent should know

- **`WP-CONF-20260821-005` is a probe permit I created in the dev DB** to see §3/§4 with real data
  ("PMT-013 probe — tank entry", DRAFT, 2 workers, 3 JSA steps, one photo, one reading). Delete it
  whenever convenient; it is not a fixture anything depends on.
- **The detail sections read three `create/**` constants** (`SafetyReadingView`, `PhotoEvidence`,
  `WorkerHealth`) and three `permit.create.*` locale namespaces. Nothing under `create/**` was
  edited, but **renaming those constants or locale keys will break the detail page** — grep before
  you move them. The right fix, if they move, is a shared `permit/constants/` dir, not a copy.
- **`so2` must stay unrendered** (`GAPS.md` row K): it is not on the wire. A test pins this.
- **Contractor closure now really works** — the backend admits `contractor` on
  `POST /permits/:id/close` scoped to their own permit. §5 is read-only reporting; the action still
  lives in `ClosureChecklistModal`, which attempts the call and renders the server's verdict rather
  than pre-empting it. A non-owner 403 carries **no `errorCode`**, so it falls back to
  `error.unknown` — that is the intended path, not a bug.
- **Still unseen in a browser:** `ACTIVE` / `FIRE_MONITOR` / `CLOSED` renderings, the QR image, the
  closure success path. The seeded contractor owns DRAFT permits only and cannot approve their own.

## Next work

`PLT-007` (notification polling) is the last unbuilt item in this repo. Cross-repo, item 1.2 is
open: the Safety/Inspector detail page must align with these same six sections — same order, same
grouping, per `05-permit-detail-sections.md`.
