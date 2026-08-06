# financial-summary print page

- Type: wayfinder:task
- Status: closed
- Assignee: —
- Map: [MAP.md](../MAP.md)

## Question

Implement the print page for `src/pages/reports/pages/financial-summary/` per the payments-for-account-closure pattern.

Deliverables:
- `components/FinancialSummaryReportPrint.vue` — BasePrintPage body mirroring `FinancialSummaryReportTable.vue`
- `pages/FinancialSummaryReportPrintPage.vue` — route-query filters → fetch `limit: 9999` → `window.print()`
- Print child route in `src/router/modules/reports/FinancialSummary.router.ts` (`layout: 'blank'`)
- Wire PrintButton in `pages/FinancialSummaryReportListPage.vue`

Watch out: module has `SelectFinancialSummaryType.vue` — the summary *type* switches the table shape. The print page must carry the selected type through the query and render the matching column set (check `useList.ts` + table component for how type drives columns before building).

Verify: `bunx vue-tsc --noEmit` + eslint clean.
