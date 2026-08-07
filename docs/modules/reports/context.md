# Module: reports

Module-level invariants for `src/pages/reports/**`. Read this before touching any report list
composable (`pages/<report>/composables/useList.ts`).

## Harness layout

```
docs/modules/reports/
├── context.md            ← you are here (module invariants)
├── feature_list.json     ← registry of every work item, all types
└── features/<nnn-slug>/
    ├── context.md        ← what this item is, the rule it encodes, its data flow
    └── progress.md       ← dated session log for this item only
```

## Location

- Routes: `src/router/modules/reports/*.router.ts` — 22 per-report router files merged by
  `reports/index.ts` (`/reports`)
- Pages: `src/pages/reports/pages/<report>/` — one dir per report, each with its own
  `composables/useList.ts`, `pages/<Report>ListPage.vue`, `components/`
- Providers: `report` (per-report providers under `src/resources/provider/report/`)
- Models: `src/models/modules/report/<report>/Filter.model.ts`,
  `src/models/request/report/<report>/*Req.model.ts`,
  `src/models/response/report/<report>/*Res.model.ts`

## Cross-cutting invariant — date filter formatting

**Every `startDate`/`endDate` in a report filter must be converted to an ISO string via
`useDayjs().formatDateRequest()` before it reaches the request payload.** The filter `ref` holds
a plain date string (`YYYY-MM-DD`, often straight from a date-picker or `route.query`); the API
expects ISO (`dayjs(input).toISOString()` — see `src/utils/Dayjs.ts:44`).

Reference implementation:
`src/pages/reports/pages/daily-installment-payment/composables/useList.ts` — its
`normalizeFilters()` wraps both fields with `dayjs.formatDateRequest()` before they're spread
into `paginateQuery` and before `syncQuery()`. Any new report `useList.ts` with a date range
filter should follow this exact shape:

```ts
import { useDayjs } from '@/utils/Dayjs'
const dayjs = useDayjs()

function normalizeFilters (value: TFilter): Partial<TFilter> {
  return {
    ...value,
    startDate: dayjs.formatDateRequest(value?.startDate),
    endDate: dayjs.formatDateRequest(value?.endDate)
  }
}
```

`normalizeFilters()` must be called both inside `paginateQuery` (or equivalent request-query
computed) AND inside `syncQuery({ ...normalizeFilters(filters.value) })` — `daily-installment-payment`
does both; that's the full pattern, not just the computed.

As of 2026-08-07 this was found broken (raw unformatted date sent) in 7 other report
composables — see `features/001-format-report-date-filters/`.

## Cross-cutting invariant — `onPrint` lives in the composable

Every report list has a print sibling. The list page pushes to the print route with the current
filters as query params; the print page reads `route.query` back and refetches with
`limit: 9999`. Two rules:

1. **`onPrint()` belongs in `composables/useList.ts`, not in the `*ListPage.vue`.** The function
   reads `search` / `filters` — both owned by the composable — so putting it in the page forces
   the page to destructure state it otherwise doesn't need. Only
   `daily-installment-payment/composables/useList.ts` does this today; 20 other report pages
   declare `onPrint` inline. See `features/002-onprint-in-composables/`.
2. **The same `normalizeFilters()` that formats the fetch payload must format the print query.**
   The print route's query params are fed straight into a provider request by the print page —
   verified across every `*PrintPage.vue`: none re-formats and none displays the raw query date,
   they all do `startDate: route.query.startDate as string || undefined` into the request object.
   So an unformatted date in the print URL is the same bug as an unformatted date in the fetch
   payload, one hop later. See `features/003-onprint-date-formatting/`.

Do **not** copy `daily-installment-payment`'s `query: { ...paginateQuery.value }` spread as the
standard — it leaks `page` / `limit` / `sortBy` into the print URL, which the print page ignores
(it hardcodes `limit: 9999`). The preferred shape is an explicit query of `search` plus the
normalized filters.
