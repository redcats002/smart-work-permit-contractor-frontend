# REPORTS-002: Move `onPrint()` into the `useList` composables

## Goal

`onPrint()` reads `search` and `filters` — state owned by `composables/useList.ts` — but 20
report pages declare it inline in `*ListPage.vue`, forcing the page to destructure composable
state it otherwise wouldn't need and duplicating the `useRouter()` import. Move it into the
composable and expose it on the returned interface.

**Pure relocation. No behavior change. No date formatting in this item** — that is REPORTS-003,
which depends on this one. Resist fixing the dates while you are in the file; a mixed diff makes
a broken print page impossible to bisect.

Reference (already correct):
`src/pages/reports/pages/daily-installment-payment/composables/useList.ts` — `onPrint` is
declared inside `useList()`, listed on `interface IUseList`, and returned.

## The move, per file

In `composables/useList.ts`:

```ts
import { useRouter } from 'vue-router'

interface IUseList extends IUsePagination {
  // ...existing
  onPrint(): void
}

export default function useList (): IUseList {
  const router = useRouter()
  // ...
  function onPrint (): void {
    router.push({ /* body moved verbatim from the page */ })
  }

  return { /* ...existing */, onPrint }
}
```

In `*ListPage.vue`: delete the `onPrint` function, add `onPrint` to the destructure from
`useList()`, and drop `useRouter` / `useRoute` imports **only if** nothing else in the page still
uses them (several pages use `route.params` or `router.push` for row navigation — check before
deleting the import).

## Files — Group A: report owns its composable (17 files)

Each has exactly one `composables/useList.ts` and one list page. Move the body verbatim.

| Report | Page file (source) | Print route name |
|---|---|---|
| all-stock | `all-stock/pages/AllStockListPage.vue` | `AllStockPrintPage` |
| annual-finance-receipt | `annual-finance-receipt/pages/AnnualFinanceReceiptListPage.vue` | `AnnualFinanceReceiptPrintPage` |
| branch-head-summary | `branch-head-summary/pages/BranchHeadSummaryListPage.vue` | `BranchHeadSummaryPrintPage` |
| branch-income-expense | `branch-income-expense/pages/BranchIncomeExpenseListPage.vue` | `BranchIncomeExpensePrintPage` |
| branch-summary | `branch-summary/page/BranchSummaryReportListPage.vue` | `BranchSummaryPrintPage` |
| contact-security-document | `contact-security-document/pages/ContractSecurityDocumentReportListPage.vue` | `ContractSecurityDocumentPrintPage` |
| current-comparative-account | `current-comparative-account/pages/list/pages/ComparativeListPage.vue` | `ComparativePrintPage` |
| daily-branch-summary | `daily-branch-summary/pages/DailyBranchSummaryListPage.vue` | `DailyBranchSummaryPrintPage` |
| daily-loan-disbursement | `daily-loan-disbursement/pages/DailyLoanDisbursementListPage.vue` | `DailyLoanDisbursementPrintPage` |
| daily-summary (list) | `daily-summary/pages/list/page/DailySummaryListPage.vue` | `DailySummaryPrintPage` |
| loan-disbursement-summary | `loan-disbursement-summary/pages/LoanDisbursementSummaryListPage.vue` | `LoanDisbursementSummaryPrintPage` |
| overdue-customer | `overdue-customer/pages/OverdueCustomerListPage.vue` | `OverdueCustomerPrintPage` |
| payments-for-account-closure | `payments-for-account-closure/pages/PaymentsForAccountClosureListPage.vue` | `PaymentsForAccountClosurePrintPage` |
| percent-installment-payment | `percent-installment-payment/pages/PercentInstallmentListPage.vue` | `PercentInstallmentPrintPage` |
| profit-based-on-actual-payment | `profit-based-on-actual-payment/pages/ProfitBasedOnActualPaymentListPage.vue` | `ProfitBasedOnActualPaymentPrintPage` |
| ranking-lending | `ranking-lending/page/RankingLendingListPage.vue` | `RankingLendingPrintPage` |
| ranking-loan | `ranking-loan/page/RankingLoanListPage.vue` | `RankingLoanPrintPage` |

That is 17 files. Group A originally listed `financial-summary` too — it is **excluded**, see
Out of scope below.

## Files — Group B: shared composable, 3 print routes (3 pages, 1 composable)

`outstanding-debtor/composables/useList.ts` is consumed by three pages through named wrappers it
already exports:

```ts
export function useOutstandingDebtorList (): ReturnType<typeof useList>  // → OutstandingDebtorPrintPage
export function useSuccessDebtorList    (): ReturnType<typeof useList>  // → SuccessDebtorPrintPage
export function useAllDebtorList        (): ReturnType<typeof useList>  // → AllDebtorPrintPage
```

All three pages have the identical body `router.push({ name: '<X>PrintPage', query: route.query })`.

**Decision (do not re-litigate at edit time):** pass the print route name as a second argument to
the existing `useList (fixedStatus?: TContractStatus)` signature — same mechanism as
`fixedStatus`, one more arg:

```ts
export default function useList (fixedStatus?: TContractStatus, printRouteName?: string): IUseList
// wrappers:
export function useAllDebtorList (): ReturnType<typeof useList> {
  return useList(undefined /* or existing arg */, 'AllDebtorPrintPage')
}
```

Keep `query: route.query` verbatim for now — REPORTS-003 explains why these three need **no**
further change.

**Before editing, check the existing `usePrintList` / `useOutstandingDebtorPrint` /
`useSuccessDebtorPrint` / `useAllDebtorPrint` exports in the same file** (lines ~123-169). If
print route naming already lives there, reuse it instead of adding a parallel path.

## Out of scope

- **`financial-summary`** — resolved, do not re-check: its `onPrint` sends
  `type: reportType.value`, and `reportType` is **page-local** state
  (`FinancialSummaryReportListPage.vue:49` — a `ref` bound with `v-model` to a picker and passed
  to the table as `:type`). Moving `onPrint` into the composable would require hoisting
  `reportType` too, which is a real state change, not a relocation. **Leave its `onPrint` in the
  page.** Revisit only if `reportType` moves into the composable for some other reason.
- `daily-summary/pages/detail/page/DailySummaryDetailListPage.vue` — pushes
  `params: { id: route.params.id }`, not filters; it reads no composable state, so moving it buys
  nothing. Leave it in the page.
- `daily-installment-payment` — already correct, it is the reference.
- Non-report `onPrint` implementations (`src/composables/usePrint.ts`, contract / finance pages) —
  different shape, different module, not covered here.
- Any date formatting — REPORTS-003.

## Verification

1. `bunx eslint <each changed file>` — 0 errors (explicit return types on `onPrint`, inline
   `import type`, `@click="onPrint()"` inline-handler convention in templates).
2. `bunx vue-tsc --noEmit` — clean. This is the real check: it catches a page still referencing a
   deleted local `onPrint`, or a composable interface missing the new member.
3. `bunx vitest run` — no regressions. **Not** `bunx --bun vitest run`; the `--bun` runtime breaks
   `import { z } from 'zod'` repo-wide (unrelated, see `.husky/pre-commit`).
4. Manual spot-check on 2 reports (one from Group A, one from Group B): click the print button,
   confirm the print route opens with the same query string as before the refactor.

## Order of work

One report at a time, `eslint` + `vue-tsc` after each. Do Group B last — it is the only one with
a signature change.
