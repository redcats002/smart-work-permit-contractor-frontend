# branch-income-expense print page

- Type: wayfinder:task
- Status: closed
- Assignee: —
- Map: [MAP.md](../MAP.md)

## Question

Implement the print page for `src/pages/reports/pages/branch-income-expense/` per the payments-for-account-closure pattern.

Deliverables:
- `components/BranchIncomeExpensePrint.vue` — BasePrintPage body mirroring `BranchIncomeExpenseTable.vue`
- `pages/BranchIncomeExpensePrintPage.vue` — route-query filters (incl. category — see `BranchIncomeExpenseCategorySelection.vue` / `useList.ts`) → fetch `limit: 9999` → `window.print()`
- Print child route in `src/router/modules/reports/BranchIncomeExpense.router.ts` (`layout: 'blank'`)
- Wire PrintButton in `pages/BranchIncomeExpenseListPage.vue`

Note: `docs/implement-print-page/GUIDE.md` flags this module as having incomplete filter UI/integration — if the list page's filter or fetch is broken, fix only what the print path needs and note the rest in the resolution.

Verify: `bunx vue-tsc --noEmit` + eslint clean.
