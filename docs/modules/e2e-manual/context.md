# Module: e2e-manual (Contractor app)

Root feature: `feat-006 Manual E2E Test Pass`. Prefix: `E2E`.

Master plan: `../../../../docs/e2e/E2E-TEST-PLAN.md` (workspace level — it owns the environment,
fixtures, journeys and the case format). This file only covers what is specific to **this** app.

## What this module is

Human-executed, scripted end-to-end testing of every contractor screen against a real backend. Suite
scripts live in `docs/testing/suites/`, dated results in `docs/testing/runs/`.

It is **not** automated testing. If these suites are ever automated, that is a separate feature.

## Blocking reality — read before writing or running anything

**This app cannot be logged into today.** The only seeded account is `systemadmin@email.com`, role
`safety_officer`, and this app's login **refuses a non-contractor outright** (`API-003`). There is no
contractor account, and `POST /auth/user/public/register` accepts no `role` field, so one cannot be made
through the UI. Every suite here is blocked on `E2E-000` (a backend seed) — including `CT-AUTH`.

**Roughly half the permit feature does not exist yet.** From `docs/modules/permit/feature_list.json`:

| Item | Status | Effect on testing |
|---|---|---|
| `PMT-006` Wizard step 3 — Safety Checks | not-started | stub with a `z.object({})` schema — **always validates, never blocks Next** |
| `PMT-007` step 4 — PPE, photos, workers | not-started | stub, same |
| `PMT-008` step 5 — JSA | not-started | stub, same |
| `PMT-009` step 6 — Review & Submit | not-started | reachable; Submit enables, then writes a `console.info`. **Nothing can be submitted from the UI** |
| `PMT-010` Permit Detail | not-started | no detail screen, no QR, no audit timeline |
| `PMT-011` Closure checklist | not-started | closure guards unverifiable from this app |
| `PMT-012` Mark-complete + Fire Watch | not-started | — |
| `PLT-007` Notification polling | not-started | — |
| `CRT-004` Cert gate on submission | not-started | — |

The empty stub schemas are the trap: a tester walks the whole wizard, sees no validation anywhere, and
files "step 3 should have blocked my out-of-range LEL". It should — once `PMT-006` exists. Today there is
nothing there to block. Cases covering these are marked **`not-built`**, never `fail`. Conflating "missing" with "broken" is how
a manual pass stops being believed. As each item lands, its cases flip from `not-built` to a real result
— which makes these suites double as the acceptance script for `PMT-006`…`012`.

Executable once `E2E-000` provides a contractor account: `CT-PERMITS`, `CT-HISTORY`, `CT-CERTS`,
`XX-SHELL`, `CT-AUTH`, and steps 1–2 of `CT-WIZARD`.

## What this app must prove

- **The wizard's client-side range checks are convenience, not a gate.** The backend re-validates on
  submit and its answer wins. A case that passes only because the client blocked it has proved nothing —
  check the submit response.
- **Backend error codes are localized client-side.** If a backend-authored English sentence ever reaches
  the screen, that is a defect regardless of how sensible it reads (`../CONTEXT.md` § 2).
- **Draft persistence.** A half-filled wizard must survive a reload — this is the single most annoying
  thing to get wrong for a real contractor on a tablet in a site office.
- **Responsive**: desktop/tablet first, but must not break at 375px. Tables scroll rather than truncate.
- **Thai is the default locale.** Run each suite in `th` at least once.

## Where things live

- `docs/testing/suites/<SUITE>.md` — scripts. `CT-PERMITS.md` is the written reference; match its format.
- `docs/testing/runs/<YYYY-MM-DD>-<suite>.md` — results: environment, build (`git rev-parse --short HEAD`),
  tester, one row per case with `pass`/`fail`/`blocked`/`not-built`/`skip`.
- Defects go in the run file with a repro, screenshot, console output and the failing request.

## Do not

- Mark a case `fail` when the feature does not exist (`not-built`) or a fixture is missing (`blocked`).
- Re-file a documented gap — `docs/api/GAPS.md` § Open lists backend limitations that make correct
  behaviour look wrong (no entrant count on the list, single-value status filter, submit returning only
  the first failing reading). Cases carry a `Known gap` line where these bite.
- Fix product code from this module. A fix belongs to the owning module's registry.
- Edit fixtures by hand mid-run. Fix the seed and re-run.
