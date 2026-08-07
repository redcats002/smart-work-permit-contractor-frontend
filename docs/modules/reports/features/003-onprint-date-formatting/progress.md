# REPORTS-003 Progress

## 2026-08-07 — Plan created

- Dumped all 23 report `onPrint` bodies and categorised by what date params they push:
  passthrough (3), startDate+endDate (6 + 2 blocked), single `date` (2), no date (7), `year` (1).
- **Verified the read path before planning any change**: grepped every `*PrintPage.vue` — all of
  them feed `route.query` dates straight into a provider request with no re-format, none displays
  a raw query date, and none passes one down as a display prop (zero hits). Confirms formatting on
  write is safe and is the actual fix, not a cosmetic change.
- Established that the 3 passthrough reports (`query: route.query`) are fixed **transitively** by
  REPORTS-001 once `syncQuery` writes ISO — recorded as explicitly "do not edit" so a later
  session does not add a redundant normalize call.
- Kept the single-`date` group (current-comparative-account, branch-head-summary) on its own
  one-line shape rather than widening the `normalizeFilters` signature the user specified.
- Excluded `annual-finance-receipt` (`year` is deliberately `YYYY`) and noted
  `percent-installment-payment`'s model/onPrint discrepancy without acting on it.
- Folded the old standalone `blocked` REPORTS-002 (ranking-loan / ranking-lending date format)
  into this item's Blocker section — same question, and an orphan blocked entry never gets
  unblocked. The old REPORTS-002 id is now the `onPrint` relocation refactor.
- Status: `planned`, blocked on REPORTS-001 + REPORTS-002 landing first.

## 2026-08-07 — Implemented (Category B + C)

- REPORTS-001 and REPORTS-002 both landed first, unblocking this item.
- Category B (6 files: contact-security-document, daily-branch-summary,
  daily-loan-disbursement, daily-summary list, loan-disbursement-summary,
  profit-based-on-actual-payment): replaced raw `startDate`/`endDate` fields in `onPrint`'s query
  with `...normalizeFilters(filters.value)`. `daily-branch-summary` has no standalone
  `normalizeFilters` function (REPORTS-001 inlined the formatting directly into `paginateQuery`
  for that file) — matched its existing pattern and called `dayjs.formatDateRequest` directly in
  `onPrint` instead of introducing a new function.
- Category C (2 files: current-comparative-account, branch-head-summary): both had a no-op or
  entirely absent `normalizeFilters` (never touched by REPORTS-001 since neither has
  `startDate`/`endDate`, only a single `date` field, so REPORTS-001's `grep -rl startDate` scan
  never caught them). Added `useDayjs` + a one-line `normalizeFilters` per the plan's Category C
  shape, wired into **both** `paginateQuery`/`syncQuery` (fetch path) and `onPrint` (print path)
  since the function is shared — this incidentally also fixes a fetch-path date bug in these 2
  files that predates REPORTS-001 and was never in its scope. `branch-head-summary`'s `period`
  field (an enum, not a date) was left untouched.
- Verified completeness with a full dump of every `onPrint` body across all 20 composables after
  editing: Category A (3 passthrough) and Category D (7 no-date) files are byte-identical to
  before this item, `daily-installment-payment` (reference) untouched,
  `annual-finance-receipt`'s deliberate `year` format untouched, `percent-installment-payment`'s
  pre-existing discrepancy untouched, `ranking-loan`/`ranking-lending` still send raw dates
  (blocker, untouched).
- Final verification: `bunx eslint` 0 errors on all 8 touched files, `bunx vue-tsc --noEmit`
  clean, `bunx vitest run` — 20 files, 252/252 passed.
- Status: `done` for the Category B/C work. **Blocker still open** — ranking-loan/ranking-lending
  need a backend answer on ISO vs `YYYY-MM-DD` before they can be touched; surfaced to the user,
  not resolved in this session. `percent-installment-payment`'s model/onPrint field discrepancy
  also surfaced, not acted on (out of scope per plan).
