# Map: Report print pages (wayfinder:map)

## Destination

Every module listed in `docs/report-print/GUIDE.md` has a working print page following the payments-for-account-closure pattern: `<Module>Print.vue` body component (BasePrintPage + chunked rows + last-page totals), `<Module>PrintPage.vue` page (route-query filters → fetch `limit: 9999` → `window.print()`), a `print` child route, and the list page's PrintButton wired to it. `vue-tsc` + `eslint` clean.

## Notes

- **Execution-in-map override**: tickets here are `wayfinder:task` execution tickets, not decisions — the GUIDE fixes the pattern; each ticket implements one module.
- Reference implementation: `src/pages/reports/pages/payments-for-account-closure/` — read `PaymentsForAccountClosurePrint.vue` (body: `BasePrintPage`, `ROWS_PER_PAGE = 20`, `pages` chunking computed, `<tfoot v-if="page === totalPages - 1">` totals), `page/PaymentsForAccountClosurePrintPage.vue` (query → fetch → print), `page/PaymentsForAccountClosureListPage.vue` (`onPrint()` → `router.push({ name: ..., query })`), and `src/router/modules/reports/PaymentsForAccountClosure.router.ts` (print child route, `layout: 'blank'`).
- Shared base: `src/components/base/BasePrintPage.vue`.
- Skills each session must load: `project-conventions` (+ `vue-best-practices`). Lint gates: explicit return types, typed arrow params, inline `import type`, no semicolons/trailing commas.
- Per ticket: mirror the module's on-screen `<Module>Table.vue` columns/footers into the print table; carry the list page's filter query keys (see the module's `useList.ts` `paginateQuery`) into the print fetch.
- Verify per ticket: `bunx vue-tsc --noEmit` + `bunx eslint <touched paths>`.

## Decisions so far

- [annual-finance-receipt print page](tickets/01-annual-finance-receipt.md) — `AnnualFinanceReceiptPrint.vue` (12-month + sumMonth columns) + print route + button wired
- [contact-security-document print page](tickets/02-contact-security-document.md) — `ContractSecurityDocumentReportPrint.vue`, no footer (on-screen table has none) + print route + button wired
- [financial-summary print page](tickets/03-financial-summary.md) — `FinancialSummaryReportPrint.vue` shows/hides income/principal/expenses columns by `type` query param, mirroring the on-screen type selector
- [branch-income-expense print page](tickets/04-branch-income-expense.md) — `BranchIncomeExpensePrint.vue` replicates reportType-driven col1/col2 + financeCategory client-side filtering from `useList.ts`
- [daily-summary (list) print page](tickets/05-daily-summary.md) — list page had **no** PrintButton at all; added one + `DailySummaryPrint.vue` + print route; detail page left untouched
- [success-debtor print page re-implementation](tickets/06-success-debtor.md) — replaced A4Paper/`usePrint`/`DebtorPrintDocument` with `SuccessDebtorPrint.vue` (BasePrintPage pattern), reused existing `useSuccessDebtorPrint()`; `DebtorPrintDocument.vue` left untouched for outstanding-debtor/all-debtor
- [current-comparative-account print page](tickets/07-current-comparative-account.md) — `ComparativePrint.vue` mirrors `ComparativeTable.vue`'s flat column set (no actual period comparison/spanning found)
- [daily-loan-disbursement print page](tickets/08-daily-loan-disbursement.md) — `DailyLoanDisbursementPrint.vue`, straightforward column mirror

## Not yet specified

- Whether `BasePrintPage`'s fixed `ROWS_PER_PAGE`-style chunking suits modules with non-uniform row heights or two-level tables (daily-summary has `DailySummaryTable` + `DailySummaryDetailItemTable`; financial-summary has a type selector switching table shape). Each ticket decides locally; if a shared solution emerges (dynamic rows-per-page, sub-tables), extract then.

## Out of scope

- Print pages for report modules **not** in the GUIDE list (all-stock, overdue-customer, ranking-loan, branch-summary, branch-head-summary, daily-installment-payment, percent-installment-payment, profit-based-on-actual-payment, loan-disbursement-summary, all-debtor).
- Migrating `all-debtor`'s print page (old A4Paper/`DebtorPrintDocument` pattern) — `outstanding-debtor` was since migrated by explicit user request (see Decisions so far); `all-debtor` remains on the old pattern and is `DebtorPrintDocument.vue`'s one remaining consumer.

## Post-map additions (requested after "destination reached")

- [outstanding-debtor print page re-implementation] — user explicitly asked to migrate this off the old A4Paper/`usePrint`/`DebtorPrintDocument` pattern (previously listed as out of scope). Added `OutstandingDebtorPrint.vue` (BasePrintPage pattern, same 11-column layout as `SuccessDebtorPrint.vue`) and rewrote `OutstandingDebtorPrintPage.vue`; reused existing `useOutstandingDebtorPrint()`. Route/list-page wiring unchanged (name/path same). `DebtorPrintDocument.vue` left in place — still used by `AllDebtorPrintPage.vue`.
- [daily-branch-summary print page] — new module (not in original GUIDE list), user explicitly requested. `DailyBranchSummaryPrint.vue` (client-computed footer totals, matching `DailyBranchSummaryTable.vue`'s local `summary` computed since the API has no summary field) + `DailyBranchSummaryPrintPage.vue` + print route + button wired.
- [daily-installment-payment print page] — `DailyInstallmentPaymentPrint.vue` (14 columns incl. payment-type/contract-status label mirrors), removed from "out of scope" list per explicit request.
- [loan-disbursement-summary print page] — `LoanDisbursementSummaryPrint.vue`, straightforward column mirror with branch-count footer label.
- [all-stock print page] — `AllStockPrint.vue`; module has **no filters sent to backend at all** (`useLocalPagination`, `getSummaryStock()` takes no query args) — print page fetches with zero params too, no route-query passthrough needed.
- [branch-summary print page] — `BranchSummaryReportPrint.vue`; module directory uses singular `page/` (not `pages/`), no footer (on-screen table has none).
- [overdue-customer print page] — `OverdueCustomerPrint.vue`, 11-column mirror with summary footer.
- [branch-head-summary print page] — `BranchHeadSummaryPrint.vue`; no footer (on-screen table has none); provider actually uses `IGetLeaderBranchReportList`/`LeaderBranchReportProvider` under the hood despite the module's own `BranchHeadSummaryReq.model.ts` naming.
- [ranking-loan print page] — `RankingLoanPrint.vue`; `type` (RECEIPT_AMOUNT vs PERCENTAGE) is a client-side-only display toggle never sent to the backend query — carried through the print route's query and re-applied client-side in the print component, matching `RankingLoanTable.vue`'s `isPercent` logic. No pagination model on this list page (`hide-pagination` on `BaseTable`) — print just prints everything returned.

All 7 modules verified: full-project `vue-tsc --noEmit` clean, `eslint` clean.

## Tickets

| # | Ticket | Type | Status | Blocked by |
|---|--------|------|--------|------------|
| 01 | [annual-finance-receipt print page](tickets/01-annual-finance-receipt.md) | task | closed | — |
| 02 | [contact-security-document print page](tickets/02-contact-security-document.md) | task | closed | — |
| 03 | [financial-summary print page](tickets/03-financial-summary.md) | task | closed | — |
| 04 | [branch-income-expense print page](tickets/04-branch-income-expense.md) | task | closed | — |
| 05 | [daily-summary (list) print page](tickets/05-daily-summary.md) | task | closed | — |
| 06 | [success-debtor print page re-implementation](tickets/06-success-debtor.md) | task | closed | — |
| 07 | [current-comparative-account print page](tickets/07-current-comparative-account.md) | task | closed | — |
| 08 | [daily-loan-disbursement print page](tickets/08-daily-loan-disbursement.md) | task | closed | — |

All tickets resolved — map complete, destination reached.
