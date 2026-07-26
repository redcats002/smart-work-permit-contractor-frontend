# daily-summary (list) print page

- Type: wayfinder:task
- Status: closed
- Assignee: —
- Map: [MAP.md](../MAP.md)

## Question

Implement the print page for the daily-summary **list** page (`src/pages/reports/pages/daily-summary/pages/list/`) per the payments-for-account-closure pattern.

Deliverables:
- `pages/list/components/DailySummaryPrint.vue` — BasePrintPage body mirroring `pages/list/components/DailySummaryTable.vue`
- `pages/list/page/DailySummaryPrintPage.vue` — route-query filters (see `pages/list/composables/useList.ts`) → fetch `limit: 9999` → `window.print()`
- Print child route in `src/router/modules/reports/DailySummary.router.ts` (`layout: 'blank'`)
- Wire PrintButton in `pages/list/page/DailySummaryListPage.vue`

Note: this module nests deeper than the others (`pages/{list,detail,create}/`) — GUIDE targets the **list** page only; the detail page (`DailySummaryDetailListPage.vue`, which also has a PrintButton) is not in scope unless the resolution finds it trivial to include; if skipped, record that in the answer.

Verify: `bunx vue-tsc --noEmit` + eslint clean.
