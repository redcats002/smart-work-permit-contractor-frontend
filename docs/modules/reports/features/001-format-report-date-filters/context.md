# REPORTS-001: Format startDate/endDate in report list filters

## Goal

`filters.value.startDate` / `filters.value.endDate` are plain date strings from the date-picker
(or `route.query`). They must be converted to ISO via `useDayjs().formatDateRequest()` before
they reach `paginateQuery` (the request payload) and before `syncQuery()` (the URL). Today only
`daily-installment-payment/composables/useList.ts` does this correctly. 7 other report
composables send the raw string instead.

Reference (already correct, do not touch):
```ts
// src/pages/reports/pages/daily-installment-payment/composables/useList.ts
import { useDayjs } from '@/utils/Dayjs'
const dayjs = useDayjs()

function normalizeFilters (value: IDailyInstallmentPaymentFilter): Partial<IDailyInstallmentPaymentFilter> {
  return {
    ...value,
    startDate: dayjs.formatDateRequest(value?.startDate),
    endDate: dayjs.formatDateRequest(value?.endDate)
  }
}
```
Used both inside `paginateQuery` and inside `syncQuery({ ...normalizeFilters(filters.value) })`.

## Files to change — Group A (has `normalizeFilters`, just needs the two date lines added)

These already scaffold a `normalizeFilters()` function that's called correctly in both places —
only the function body needs the `useDayjs` import + the two formatted fields added.

| File | Current `normalizeFilters` body |
|---|---|
| `src/pages/reports/pages/outstanding-debtor/composables/useList.ts` | `{ ...value }` with `status` deleted — keep the delete, add date formatting |
| `src/pages/reports/pages/daily-loan-disbursement/composables/useList.ts` | `{ ...value }` |
| `src/pages/reports/pages/profit-based-on-actual-payment/composables/useList.ts` | `{ ...value }` |
| `src/pages/reports/pages/loan-disbursement-summary/composables/useList.ts` | `{ ...value }` |

Fix for each (example; outstanding-debtor keeps its `delete result.status`):
```ts
import { useDayjs } from '@/utils/Dayjs'
// ...
const dayjs = useDayjs()
// ...
function normalizeFilters (value: TFilter): Partial<TFilter> {
  return {
    ...value,
    startDate: dayjs.formatDateRequest(value?.startDate),
    endDate: dayjs.formatDateRequest(value?.endDate)
  }
}
```

## Files to change — Group B (no `normalizeFilters`, spreads/lists filters raw)

| File | Current shape |
|---|---|
| `src/pages/reports/pages/daily-branch-summary/composables/useList.ts` | `paginateQuery` computed lists `startDate: filters.value.startDate, endDate: filters.value.endDate` inline (lines 32-33). `syncQuery({ ...paginateQuery.value })` already reuses the same computed, so fixing the computed fixes both call sites in one place. |
| `src/pages/reports/pages/contact-security-document/composables/useList.ts` | `paginateQuery` spreads `...filters.value` raw; `syncQuery({ ...filters.value })` separately spreads raw too — needs a `normalizeFilters()` added and used in both places |
| `src/pages/reports/pages/daily-summary/pages/list/composables/useList.ts` | same shape as contact-security-document — `paginateQuery` and `syncQuery` both spread `...filters.value` raw |

For `daily-branch-summary` specifically (no separate `normalizeFilters` — the computed already
does what's needed, just needs its two lines formatted):
```ts
const paginateQuery = computed((): IGetDailyBranchSummaryList => ({
  search: search.value,
  page: pagination.value.page,
  limit: pagination.value.limit,
  sortBy: sortBy.value || undefined,
  sortOrder: sortOrder.value,
  branchId: filters.value.branchId,
  startDate: dayjs.formatDateRequest(filters.value.startDate),
  endDate: dayjs.formatDateRequest(filters.value.endDate)
}))
```
Add `import { useDayjs } from '@/utils/Dayjs'` and `const dayjs = useDayjs()` inside `useList()`.

For `contact-security-document` and `daily-summary` (need a new `normalizeFilters()`, then use it
in both `paginateQuery` and `syncQuery`, mirroring the reference exactly):
```ts
import { useDayjs } from '@/utils/Dayjs'
// ...
const dayjs = useDayjs()
// ...
const paginateQuery = computed((): TReq => {
  const normalizedFilters = normalizeFilters(filters.value)
  return {
    page: pagination.value.page,
    limit: pagination.value.limit,
    sortBy: sortBy.value || undefined,
    sortOrder: sortOrder.value,
    search: search.value || undefined,
    ...normalizedFilters
  }
})
// ...
syncQuery({ ...normalizeFilters(filters.value) })
// ...
function normalizeFilters (value: TFilter): Partial<TFilter> {
  return {
    ...value,
    startDate: dayjs.formatDateRequest(value?.startDate),
    endDate: dayjs.formatDateRequest(value?.endDate)
  }
}
```

## Explicitly out of scope

- `ranking-loan/composables/useList.ts` and `ranking-lending/composables/useList.ts` — different
  pattern (no pagination, no `normalizeFilters`), default filter values are pre-formatted
  `'YYYY-MM-DD'` via the raw `dayjs` plugin (`@/plugins/dayjs.plugin`), not `useDayjs()`. Whether
  their API wants `'YYYY-MM-DD'` or ISO is unknown — the open question now lives in the **Blocker**
  section of `features/003-onprint-date-formatting/context.md` and needs backend confirmation
  before any change. (It was briefly a standalone `blocked` REPORTS-002; that id is now the
  `onPrint` relocation refactor.)
- Any report composable whose filter model has no `startDate`/`endDate` field (confirmed via
  `grep -rl startDate src/models/request/report/` — 10 hits total; `daily-installment-payment`
  is the reference, the other 7 are listed above, the remaining 2 are ranking-loan/ranking-lending).
- Do not touch `daily-installment-payment` — it's already correct, it's the reference.
- Do not change any Filter/Req model types — `startDate`/`endDate` stay `string | undefined` on
  the model; only the value flowing through `normalizeFilters` changes.
- The print path (`onPrint`) — that is REPORTS-002 (relocation) and REPORTS-003 (formatting).
  Note that fixing `syncQuery` here transitively fixes the three `query: route.query` passthrough
  print pages; see REPORTS-003 Category A.

## Verification (per file, after each edit)

1. `bunx eslint <file>` — 0 errors (note: explicit return types required on `normalizeFilters`,
   inline `import type` for type-only imports per project convention).
2. `bunx vue-tsc --noEmit` — clean.
3. `bunx vitest run` — no regressions (`bunx vitest run`, not `bunx --bun vitest run` — the
   `--bun` runtime breaks `import { z } from 'zod'` named imports repo-wide, unrelated to this
   change, see `.husky/pre-commit`).
4. Manual, per report page: open the list page, set a date range filter, submit — confirm the
   network request payload's `startDate`/`endDate` are ISO strings (e.g.
   `2026-08-01T00:00:00.000Z`) not raw `2026-08-01`, and that the URL query (`syncQuery`)
   reflects the same ISO value. Check the row count too — a rejected date format usually returns
   an empty or full-range result rather than an error.

## Order of work

Do one file at a time, run eslint + vue-tsc after each; don't batch all 7 edits before checking
any of them — these are mechanical but each touches a different Filter type, and a typo in one
doesn't block the others.
