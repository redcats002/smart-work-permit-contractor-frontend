# daily-loan-disbursement print page

- Type: wayfinder:task
- Status: closed
- Assignee: —
- Map: [MAP.md](../MAP.md)

## Question

Implement the print page for `src/pages/reports/pages/daily-loan-disbursement/` per the payments-for-account-closure pattern.

Deliverables:
- `components/DailyLoanDisbursementPrint.vue` — BasePrintPage body mirroring `DailyLoanDisbursementTable.vue`
- `pages/DailyLoanDisbursementPrintPage.vue` — route-query filters (see `composables/useList.ts`; includes search + date range) → fetch `limit: 9999` → `window.print()`
- Print child route in `src/router/modules/reports/DailyLoanDisbursement.router.ts` (`layout: 'blank'`)
- Wire PrintButton in `pages/DailyLoanDisbursementListPage.vue`

Verify: `bunx vue-tsc --noEmit` + eslint clean.
