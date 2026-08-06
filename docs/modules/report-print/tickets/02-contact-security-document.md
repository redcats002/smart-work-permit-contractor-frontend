# contact-security-document print page

- Type: wayfinder:task
- Status: closed
- Assignee: —
- Map: [MAP.md](../MAP.md)

## Question

Implement the print page for `src/pages/reports/pages/contact-security-document/` per the payments-for-account-closure pattern.

Deliverables:
- `components/ContractSecurityDocumentReportPrint.vue` — BasePrintPage body mirroring `ContractSecurityDocumentReportTable.vue`
- `pages/ContractSecurityDocumentReportPrintPage.vue` — route-query filters (see `composables/useList.ts`) → fetch `limit: 9999` → `window.print()`
- Print child route in `src/router/modules/reports/ContractSecurityDocument.router.ts` (`layout: 'blank'`)
- Wire PrintButton in `pages/ContractSecurityDocumentReportListPage.vue`

Note: module directory name is `contact-security-document` (existing typo) but components use `ContractSecurityDocument…` — follow existing naming.

Verify: `bunx vue-tsc --noEmit` + eslint clean.
