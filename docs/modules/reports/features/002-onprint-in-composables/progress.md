# REPORTS-002 Progress

## 2026-08-07 — Plan created

- Inventoried every `function onPrint` in the repo (31 hits; 23 in `src/pages/reports/`).
- Found only `daily-installment-payment/composables/useList.ts` declares it in the composable —
  the other 20 report pages declare it inline in `*ListPage.vue` while reading `search` /
  `filters` that the composable owns.
- Mapped each report to its composable and print route name (17 own their composable; 3 share
  `outstanding-debtor`'s via `useOutstandingDebtorList` / `useSuccessDebtorList` /
  `useAllDebtorList` wrappers).
- Decided the shared-composable approach up front: pass the print route name as a second arg to
  the existing `useList(fixedStatus?)` signature, so it is not re-argued at edit time. Flagged
  the pre-existing `usePrintList` exports in the same file to check first.
- Excluded `daily-summary` detail page (pushes `params`, not filters — nothing to hoist).
- Kept date formatting out of this item deliberately — split into REPORTS-003 so a broken print
  page is bisectable.
- Status: `planned`, not implemented. 20 files.

## 2026-08-07 — Implemented

- Group A (17 files): moved `onPrint` verbatim from each `*ListPage.vue` into its
  `composables/useList.ts`, added `useRouter` (and kept `useRoute` where the page still needed
  it for unrelated navigation, e.g. `branch-income-expense`'s tab init, `daily-summary` list's
  row-click). One deliberate catch: for `annual-finance-receipt` I first wrote `onPrint` to reuse
  the existing `normalizeFilters()` instead of duplicating the inline
  `dayjs(...).format('YYYY')` logic — caught it before verifying, since `normalizeFilters`
  passes `branchId` through raw while the original `onPrint` did `filters.value.branchId ||
  undefined`, a real (if narrow) behavior difference for falsy `branchId`. Reverted to the exact
  verbatim body per the plan's "pure relocation" rule — REPORTS-002 is not the place to also
  dedupe logic.
  - Also caught one destructure mistake before it shipped: `daily-summary` list page's `onPrint`
    was removed but `filters` was needed for `v-model:filters` in the template — vue-tsc would
    have caught it, restored `filters` to the destructure before running the check.
  - `financial-summary` confirmed excluded — `reportType` is a page-local `ref`
    (`FinancialSummaryReportListPage.vue:49`), not composable state; its `onPrint` stays in the
    page as decided during planning.
- Group B (`outstanding-debtor` shared composable, 3 pages): added `printRouteName?: string` as
  a second parameter to `useList()`, alongside the existing `fixedStatus?`. `onPrint` reads
  `route.query` and `router.push`es to `printRouteName` (guarded with `if (!printRouteName)
  return` since the param is optional on the type but always supplied by the 3 named wrappers).
  Wired `useOutstandingDebtorList` → `'OutstandingDebtorPrintPage'`, `useSuccessDebtorList` →
  `'SuccessDebtorPrintPage'`, `useAllDebtorList` → `'AllDebtorPrintPage'`. Left the existing
  `usePrintList` / `useOutstandingDebtorPrint` / `useSuccessDebtorPrint` / `useAllDebtorPrint`
  exports untouched — confirmed they're a separate consumer (used by the print *page* itself to
  fetch data), not related to the list page's `onPrint` navigation.
- Verified with a repo-wide grep that only the two intended files
  (`financial-summary/pages/FinancialSummaryReportListPage.vue` and
  `daily-summary/pages/detail/page/DailySummaryDetailListPage.vue`) still declare `onPrint`
  locally; everything else now sources it from `useList()`.
- Final verification: `bunx eslint` 0 errors on all 20 touched files, `bunx vue-tsc --noEmit`
  clean, `bunx vitest run` — 20 files, 252/252 passed.
- Status: `done`. Next: REPORTS-003 (format date query params in `onPrint`).
