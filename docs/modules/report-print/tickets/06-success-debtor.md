# success-debtor print page re-implementation

- Type: wayfinder:task
- Status: closed
- Assignee: —
- Map: [MAP.md](../MAP.md)

## Question

Re-implement `src/pages/reports/pages/success-debtor/pages/SuccessDebtorPrintPage.vue` to follow the payments-for-account-closure pattern, replacing the current A4Paper/`usePrint`/`DebtorPrintDocument` implementation.

Deliverables:
- `components/SuccessDebtorPrint.vue` (new, in success-debtor module) — BasePrintPage body mirroring `outstanding-debtor/components/OutstandingDebtorTable.vue`'s 11 columns + summary footer (data: `IOutstandingDebtorList` / `IOutStandingDebtorSummary`)
- Rewrite `pages/SuccessDebtorPrintPage.vue` — route-query filters → fetch via `useSuccessDebtorPrint()` from `outstanding-debtor/composables/useList.ts` (already fetches `limit: 9999`) → `window.print()` on mounted (drop `usePrint`)
- Router route already exists (`SuccessDebtorPrintPage` in `SuccessDebtor.router.ts`) — keep name/path, meta stays `layout: 'blank'`
- PrintButton already wired in `SuccessDebtorListPage.vue` — no change expected

Constraint: `outstanding-debtor/components/DebtorPrintDocument.vue` still serves `OutstandingDebtorPrintPage.vue` and `AllDebtorPrintPage.vue` — do NOT delete or modify it (their migration is out of scope, see map).

Verify: `bunx vue-tsc --noEmit` + eslint clean.
