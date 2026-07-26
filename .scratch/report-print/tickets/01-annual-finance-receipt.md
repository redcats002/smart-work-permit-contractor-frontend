# annual-finance-receipt print page

- Type: wayfinder:task
- Status: closed
- Assignee: —
- Map: [MAP.md](../MAP.md)

## Question

Implement the print page for `src/pages/reports/pages/annual-finance-receipt/` per the payments-for-account-closure pattern.

Deliverables:
- `components/AnnualFinanceReceiptPrint.vue` — BasePrintPage body mirroring `AnnualFinanceReceiptTable.vue` columns/totals
- `pages/AnnualFinanceReceiptPrintPage.vue` — route-query filters (see `composables/useList.ts` paginateQuery: year etc.) → fetch `limit: 9999` → `window.print()`
- Print child route in `src/router/modules/reports/AnnualFinanceReceipt.router.ts` (`layout: 'blank'`)
- Wire PrintButton `@click="onPrint()"` in `pages/AnnualFinanceReceiptListPage.vue` → `router.push({ name: 'AnnualFinanceReceiptPrintPage', query: route.query })`

Verify: `bunx vue-tsc --noEmit` + eslint clean.
