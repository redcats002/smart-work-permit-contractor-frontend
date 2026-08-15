# Module: `history`

Read-only archive of closed and expired permits, at `/history`. Own route prefix and pages
tree; **reuses the `permit` provider** rather than owning one.

Root feature: `feat-003`. Depends on `permit` (`feat-002`).

## Location

| Concern | Path |
|---|---|
| Routes | `src/router/modules/History.router.ts` — `const prefix = '/history'` |
| Pages | `src/pages/history/pages/list/` |
| Provider | `src/resources/provider/permit/Permit.provider.ts` (reused — **do not create a history provider**) |

## What it is

Per the design (lines 617-727): *"Closed and expired permits · read-only archive ·
ใบอนุญาตที่ปิดหรือหมดอายุ (อ่านอย่างเดียว)"*.

Scope is narrower than "all permits" — the status filter offers only `CLOSED` and `EXPIRED`.
Live permits stay on the `/permits` list. If the product owner wants all statuses here,
that is a change to confirm, not to assume.

## Screen anatomy

- **Header** — title + subtitle, `↓ Export CSV` outline button on the right.
- **Toolbar** — search input (ID / title / location), type `<select>` (All / Hot / Confined / Heights), status `<select>` (All / Closed / Expired), from-date, to-date, and a `Clear filters` text button. Wraps on narrow widths.
- **Result count** — mono, above the table.
- **Table** — columns `ID · TYPE · TITLE/LOCATION · CLOSED · DURATION · STATUS · ›`. Each row carries a 3px left border in the permit-type color. Mono for IDs and dates.
- **Empty state** — centered `◷` glyph, headline, subline, and a dark `Clear filters` button.
- **Detail drawer** — a 520px right-hand slide-over (not a route). Header with type + status badges, title, mono ID, close ✕. Then a grey "View Only · <status> — this record is archived and cannot be edited" bar, then grouped read-only panels (location, foreman, date/time, duration, closed date, closed by; work description; a dashed placeholder row for the archived permit document).

## Invariants

- **Read-only.** No edit, no delete, no state transition is reachable from this module. The drawer says so explicitly.
- Filters drive the API query (`GET /permits?status=&type=&from=&to=&q=`), not a client-side filter over a full download.
- Pagination uses the existing `usePagination` composable and `src/components/table/Paginate.vue`.
- The table **scrolls horizontally** on narrow viewports rather than truncating columns (`02-contractor-web-vue-tasks.md`, Responsive).
- Every string goes through `t()` with the `history.*` namespace.
