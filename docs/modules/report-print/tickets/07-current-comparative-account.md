# current-comparative-account print page

- Type: wayfinder:task
- Status: closed
- Assignee: —
- Map: [MAP.md](../MAP.md)

## Question

Implement the print page for `src/pages/reports/pages/current-comparative-account/pages/list/` per the payments-for-account-closure pattern.

Deliverables:
- `pages/list/components/ComparativePrint.vue` — BasePrintPage body mirroring `ComparativeTable.vue`
- `pages/list/pages/ComparativePrintPage.vue` — route-query filters (see `pages/list/composables/useList.ts`) → fetch `limit: 9999` → `window.print()`
- Print child route in `src/router/modules/reports/Comparative.router.ts` (`layout: 'blank'`)
- Wire PrintButton in `pages/list/pages/ComparativeListPage.vue`

Watch out: comparative table likely renders period-vs-period comparison columns — check `ComparativeTable.vue`'s column model before building; the print table must mirror whatever grouping/spanning it uses.

Verify: `bunx vue-tsc --noEmit` + eslint clean.
