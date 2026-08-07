# REPORTS-003: Format date query params in `onPrint()`

**Depends on REPORTS-001** (introduces `normalizeFilters()` in each composable — this item reuses
it, do not write a second copy) **and REPORTS-002** (moves `onPrint` into the composable, where
`normalizeFilters` is in scope). Do not start this before both are `done`.

## Goal

`onPrint()` pushes `filters.value.startDate` / `endDate` / `date` raw into the print route query.
Route them through the same `normalizeFilters()` that REPORTS-001 adds to the fetch path.

## Why this is the same bug as REPORTS-001, not a cosmetic one

Verified across **every** `*PrintPage.vue` in `src/pages/reports/`: each one reads the query
params straight into a provider request and never re-formats them —

```ts
// e.g. ReportDailyInstallmentPaymentPrintPage.vue
const response = await Service.getDailyInstallmentPaymentPaginate({
  limit: 9999,
  search: route.query.search as string || undefined,
  startDate: route.query.startDate as string || undefined,
  endDate: route.query.endDate as string || undefined
})
```

No print page **displays** a raw query date (dates shown in print components come from the API
response and are formatted with `dayjs.formatDate`), and no print page passes a query date down
as a display prop — checked, zero hits. So writing ISO into the print URL is safe, and writing an
unformatted date is the same defect as REPORTS-001, one hop later.

`formatDateRequest` is `dayjs(input).toISOString()`, which is idempotent on an already-ISO
string, so the passthrough group below cannot double-convert.

## Category A — passthrough: **no edit needed** (3 reports)

| Report | `onPrint` body |
|---|---|
| all-debtor | `router.push({ name: 'AllDebtorPrintPage', query: route.query })` |
| success-debtor | `router.push({ name: 'SuccessDebtorPrintPage', query: route.query })` |
| outstanding-debtor | `router.push({ name: 'OutstandingDebtorPrintPage', query: route.query })` |

These forward `route.query`, which is written by `syncQuery()`. REPORTS-001 already makes
`syncQuery` emit normalized dates for `outstanding-debtor`'s shared composable, so all three
become correct **transitively, with zero edits**.

**Do not "fix" these.** Adding a normalize call here would be redundant. Verify instead: after
REPORTS-001 lands, run a search on one of these pages and confirm the URL already shows an ISO
date before clicking print.

**Caveat — this holds on the search path only.** `route.query` forwards whatever is in the URL,
which is ISO only once `syncQuery()` has written it. On a cold load with a bookmarked or
hand-edited URL carrying a raw `startDate`, `onPrint` forwards that raw value through. That is
unchanged from today's behaviour, so it is not a regression this item introduces — but do not
mark Category A "correct by construction". If the raw-URL path matters, it needs its own item
(normalize on read in the print page), which is deliberately **not** in scope here.

## Category B — `startDate` + `endDate` (6 reports to change)

Replace the raw fields with the composable's `normalizeFilters()` output. Current bodies are all
the same shape:

```ts
// before
query: {
  search: search.value || undefined,
  branchId: filters.value.branchId || undefined,
  startDate: filters.value.startDate || undefined,
  endDate: filters.value.endDate || undefined
}

// after
query: {
  search: search.value || undefined,
  ...normalizeFilters(filters.value)
}
```

| Report | Print route |
|---|---|
| contact-security-document | `ContractSecurityDocumentPrintPage` |
| daily-branch-summary | `DailyBranchSummaryPrintPage` |
| daily-loan-disbursement | `DailyLoanDisbursementPrintPage` |
| daily-summary (list) | `DailySummaryPrintPage` |
| loan-disbursement-summary | `LoanDisbursementSummaryPrintPage` |
| profit-based-on-actual-payment | `ProfitBasedOnActualPaymentPrintPage` |

Spreading `normalizeFilters(filters.value)` also carries `branchId` and any other filter field,
which is why the explicit `branchId` line disappears — confirm per file that the filter object
holds nothing the print route should *not* receive before collapsing it.

## Category C — single `date` field (2 reports)

`current-comparative-account` (`ComparativePrintPage`) and `branch-head-summary`
(`BranchHeadSummaryPrintPage`) have `date?: string`, not a range. The `normalizeFilters()`
signature from REPORTS-001 names `startDate`/`endDate` and does not fit.

**Do not stretch that signature.** Give these two their own one-liner in their own composable:

```ts
function normalizeFilters (value: TFilter): Partial<TFilter> {
  return {
    ...value,
    date: dayjs.formatDateRequest(value?.date)
  }
}
```

`branch-head-summary` also sends `period` (an `EReportPeriod` enum, not a date) — leave it alone.

## Category D — no date in the print query (7 reports, no edit)

all-stock, branch-income-expense, branch-summary, financial-summary, overdue-customer,
payments-for-account-closure, daily-summary-detail. REPORTS-002 moves their `onPrint`; this item
does not touch them.

## Explicitly out of scope

- **`annual-finance-receipt`** — sends `year: dayjs(filters.value.year).format('YYYY')`. That is a
  deliberate different format for a year-only param. Do **not** normalize it to ISO.
- **`percent-installment-payment`** — its request model has `date?: string` but its `onPrint`
  only sends `search` + `branchId`. That is a pre-existing discrepancy (the print page may be
  missing a filter). **Note it, do not silently add the field** — adding a param the print page
  never received changes what gets printed. Raise it separately.
- Any change to Filter/Req model types. `startDate`/`endDate`/`date` stay `string | undefined`.
- `daily-installment-payment` — already normalized. Its `query: { ...paginateQuery.value }` spread
  does leak `page`/`limit`/`sortBy` into the print URL (harmless — the print page hardcodes
  `limit: 9999` and ignores the rest), but tidying that is not part of this item.

## Blocker — ranking-loan / ranking-lending

Both push `startDate`/`endDate` to their print routes, and both default their filters to
`dayjs().startOf('month').format('YYYY-MM-DD')` using the **raw** `@/plugins/dayjs.plugin`, not
`useDayjs()`. Their list fetch has always sent `YYYY-MM-DD` and presumably works. Whether their
API endpoints accept ISO is **unknown**.

**Do not change these two files under this item.** Ask the backend owner: do
`/report/ranking-loan` and `/report/ranking-lending` accept an ISO `startDate`/`endDate`, or do
they require `YYYY-MM-DD`? If ISO — fold them into Category B and note it here. If `YYYY-MM-DD` —
record that as the deliberate exception in `docs/modules/reports/context.md` so the next session
does not re-open it.

(This blocker was previously tracked as a standalone `blocked` feature; it is folded in here
because it is the same question and nobody unblocks an orphan entry.)

## Verification

1. `bunx eslint <each changed file>` — 0 errors.
2. `bunx vue-tsc --noEmit` — clean.
3. `bunx vitest run` — no regressions (not `--bun`, see REPORTS-002 notes).
4. **Manual, per changed report — this is the check that matters.** Set a date range on the list
   page, click print, and confirm two things: the print URL's `startDate`/`endDate` are ISO
   (`2026-08-01T00:00:00.000Z`), **and the print page renders the same rows as the list page**. A
   date format the API rejects typically returns an empty or full-range result rather than an
   error, so an eyeball on the row count is the only thing that catches it.
5. For Category A (no edit), confirm the passthrough URL is already ISO after REPORTS-001.

## Order of work

One report at a time. Category B first (uniform shape), then Category C (2 files, different
shape). Verify each with step 4 before moving on — a wrong date format fails silently.
