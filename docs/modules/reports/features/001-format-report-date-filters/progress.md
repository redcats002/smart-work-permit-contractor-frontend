# REPORTS-001 Progress

## 2026-08-07 — Plan created

- Grepped every report Filter/Req model for `startDate` (10 hits) and cross-checked each
  matching `composables/useList.ts` for `formatDateRequest` usage — only
  `daily-installment-payment` had it.
- Confirmed the user-reported snippet (`startDate: filters.value.startDate, endDate:
  filters.value.endDate`) is exactly `daily-branch-summary/composables/useList.ts:32-33`.
- Found 6 more composables with the same underlying defect (raw date, not ISO), split by
  whether they already scaffold a `normalizeFilters()` function (Group A: 4 files, just needs
  the two lines) or spread `filters.value` raw with no normalize step at all (Group B: 3 files,
  needs the function added).
- Excluded `ranking-loan` / `ranking-lending` — different pattern, unconfirmed whether their API
  wants `YYYY-MM-DD` or ISO.
- Status: `planned`, not yet implemented. 7 files to touch, one at a time per the order-of-work
  note in `context.md`.

## 2026-08-07 — Re-created after file loss; cross-refs updated

- This feature's `context.md` / `progress.md` went missing from disk before ever being committed
  (`docs/modules/reports/` was still untracked, so nothing to restore from git). Both files were
  rewritten from the same survey data; no plan content was lost, but **commit the docs dir** —
  it is still untracked.
- Updated the ranking-loan/ranking-lending note: that open question now lives in the Blocker
  section of `features/003-onprint-date-formatting/context.md` rather than as a standalone
  `blocked` entry. The REPORTS-002 id was reassigned to the `onPrint` relocation refactor.
- Added a pointer to REPORTS-003 Category A: fixing `syncQuery` here transitively fixes the three
  `query: route.query` passthrough print pages, so they need no edit of their own.

## 2026-08-07 — Implemented

- Applied the plan one file at a time, eslint + vue-tsc after each, per the order-of-work note.
- **Deviation from the plan template, caught before applying**: `outstanding-debtor`'s filter
  model does not have `startDate`/`endDate` — it has
  `startDateOfCreatedAt`/`endDateOfCreatedAt`/`startDateOfFinalInstallmentDate`/`endDateOfFinalInstallmentDate`
  (confirmed against `OutstandingDebtorReq.model.ts` and the filter UI's `v-model` bindings,
  all 4 are real user-facing fields). Formatted all 4 instead of the templated 2. The earlier
  `grep -rl startDate` scan that seeded the plan matched these as a substring, which is why the
  file was in scope but the field names in the plan were wrong for it specifically — every other
  Group A/B file matched the template exactly.
- Group A (4 files: outstanding-debtor, daily-loan-disbursement, profit-based-on-actual-payment,
  loan-disbursement-summary) — added `useDayjs` import + date lines inside existing
  `normalizeFilters()`.
- Group B (3 files: daily-branch-summary, contact-security-document, daily-summary list) —
  daily-branch-summary just needed its inline computed fields wrapped;
  contact-security-document and daily-summary needed a new `normalizeFilters()` added and wired
  into both `paginateQuery` and `syncQuery`.
- Hit a pre-existing unrelated failure on the full-suite run: `src/tests/utils/Dayjs.test.ts` had
  3 failing tests because uncommitted WIP already in the working tree (not from this session) had
  changed `formatDateRequest` from `dayjs(input).format('YYYY-MM-DD')` / `string | null` to
  `dayjs(input)?.toISOString()` / `string | undefined`, without updating the test. Confirmed via
  `git stash` that this predates this session and is unrelated to the 7-file diff here (with
  `--exclude Dayjs.test.ts`, 238/238 passed before touching the test). Asked the user how to
  handle it; told to update the test. Updated `Dayjs.test.ts` to assert ISO/`undefined` output
  against `dayjs(...).toISOString()` from `@/plugins/dayjs.plugin` instead of hardcoded
  `YYYY-MM-DD` strings.
- Final verification: `bunx eslint` 0 errors on all 7 files, `bunx vue-tsc --noEmit` clean,
  `bunx vitest run` — 20 files, 252/252 passed.
- Status: `done`. Next: REPORTS-002 (move `onPrint` into composables).
