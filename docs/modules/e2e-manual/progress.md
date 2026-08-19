# e2e-manual — Progress

Module log. Master plan: `../../../../docs/e2e/E2E-TEST-PLAN.md`.

## Current State

**Last Updated:** 2026-08-19
**Active item:** none. **The plan is awaiting review — nothing has been executed.**
Progress: **0 items done.**

## 2026-08-19 — module created, and what checking the live system changed

Harness only: suites are enumerated, one reference suite file is written to fix the format, and no test
has been run.

The plan was drafted against the running stack rather than against the repos' own optimism, and two
findings reshaped it:

- **One account exists** — `systemadmin@email.com`, role `safety_officer`. No contractor, no inspector.
  `POST /auth/user/public/register` accepts no `role`, so neither can be created through a UI. The
  Contractor app therefore cannot be logged into at all (its login refuses non-contractors), and every
  Inspector suite is unexecutable.
- **The database holds 2 permits, both `DRAFT`, both Hot Work.** No `PENDING`, `ACTIVE`, `FIRE_MONITOR`,
  `CLOSED`. So the Review Queue is legitimately empty, nothing can be approved, no QR exists to scan, and
  neither closure guard can be made to fire.

Neither is a frontend bug and neither can be fixed from a frontend repo, so `E2E-000` — an idempotent
backend seed with one account per role and fixtures F0–F6, plus a one-command reset — is the first item
and the dependency of nearly every other. Without the reset, a manual pass cannot be repeated: approving
and closing mutates the fixtures, and the second tester sees different data from the first.

The other decision worth recording: **cases for unbuilt screens are being written now**, marked
`not-built` rather than `fail`. That keeps "missing" distinct from "broken" — conflating them is how a
manual pass stops being believed — and it makes the suites double as the acceptance script for the
features when they land.

## 2026-08-19 (later) — suites written, fixtures live, nothing run yet

Four agents ran on disjoint files: Safety Officer suites, Inspector + shell suites, contractor suites,
and the backend fixture seed. Registries were deliberately kept out of their scope and reconciled here
afterwards — the contractor repo's own `CLAUDE.md` records why (every agent wants the shared file).

**`E2E-000` is done and independently verified.** Not on the agent's word: this session logged in as all
three seeded roles, confirmed 10 permits spanning all seven statuses and all three types, and drove both
closure guards to their `403`s (`ENTRANTS_STILL_INSIDE`, `FIRE_WATCH_NOT_ELAPSED`). That check closed a
fixture permit on purpose; `bun run seed:e2e:reset` restored the exact baseline and reported the audit
chain intact. Both blockers in the master plan § 1 are now resolved — the Contractor app can be logged
into for the first time.

**Every suite item is `in-progress`, not `done`.** The scripts exist; no run file does. This module's own
rule is that a suite is done when a dated run records a result for *every* case, and holding to that on
the first pass is the whole point.

**Writing the suites found more than the suites will.** Fifteen findings — three P0 — are recorded in
`../../../../docs/e2e/PRE-RUN-FINDINGS.md`, including an audit hash chain that fails verification against
the database, a review screen that cannot display the backend verdict it is required to display because
nothing fetches it, and a reject flow that captures an e-signature and discards it. None is filed as a
work item yet; that is a backlog decision, not a test-harness one.

The agents also corrected the plan itself. Its claim that "the wizard cannot get past step 2" was wrong
in the dangerous direction — steps 3–6 validate with `z.object({})`, so the wizard walks to the end with
no validation anywhere. A tester working from the old text would have filed that as a defect.
