# Suite CT-HISTORY — Permit history: search, filters, CSV export, pagination

App: Contractor (`:8080`) · Master plan: `../../../../../docs/e2e/E2E-TEST-PLAN.md`
Format reference: `CT-PERMITS.md`.

**This module is built.** `src/router/modules/History.router.ts` is registered in
`src/router/index.ts`, `/history` resolves, `HistoryListPage` / `HistoryTable` / `HistoryDetailDrawer`
and `useHistory` all exist, and `feat-003` is `done`.

**Ignore the repo's own `CLAUDE.md`** where it says the history module is "Not built — its route is not
registered". That line is stale documentation drift (master plan § 4 flags it). Do not skip this suite
on the strength of it, and do not file it as a product defect.

**Executable today:** no — every case is `blocked` on `E2E-000`, because there is no contractor account
to sign in with. Once F0 and F2 exist, this is one of the most testable suites in the app.

**Fixtures:** F0 (contractor account) and F2 (one permit per status). History only ever shows the two
terminal statuses, **`CLOSED` and `EXPIRED`**, so F2 must include at least one of each — plus at least
one non-terminal permit (`DRAFT` / `PENDING` / `ACTIVE`) so `CT-HISTORY-002` and `CT-HISTORY-007` have
something to exclude.

**Grounded in:** `src/pages/history/**` (`useHistory.ts`, `HistoryListPage.vue`, `HistoryTable.vue`,
`HistoryDetailDrawer.vue`) and `src/composables/usePagination.ts`.

**Two things the plan gets wrong about this screen**, so a tester does not file them:
- **Drill-in opens a side drawer, not a route.** `openDetail(id)` calls `GET /permits/:id` and fills
  `HistoryDetailDrawer`. It does **not** navigate to `/permits/:id`. The plan's suite table and
  `CLAUDE.md`'s flow diagram both say otherwise; the drawer is what exists and what these cases assert.
- The status filter offers only **All / Closed / Expired** by design — history is a read-only archive,
  and live permits stay on My Permits.

**Result values:** `pass` · `fail` · `blocked` (a dependency or fixture is missing) · `not-built` (the
feature does not exist yet) · `skip` (with a reason). Never leave a case blank.

---

### CT-HISTORY-001 — The screen loads and the nav item works

Priority: P0 · Role: contractor · Viewport: 1280 · Locale: th
Preconditions: logged in as the F0 contractor; F2 permits exist

1. Open the sidebar and press "History".
2. Watch the network tab.
3. Read the page.

Expected:
- The nav item is a **real link**, not an inert greyed row. (`AppDrawer` renders an inert `<span>` for
  unregistered routes; if History renders inert, the route is missing — that is a `fail` against this
  suite's premise, so capture `router.hasRoute('HistoryListPage')` from the console.)
- The route is `/history` and the browser tab title changes.
- Exactly one `GET /api/v1/permits` fires on mount, with `page=1` and `limit=10`.
- Title, subtitle, the toolbar (search, type select, status select, two date pickers, clear), a result
  count, the table and the export button all render. Nothing shows a raw i18n key.
- While loading, skeleton rows render — not a blank area and not an infinite spinner.

---

### CT-HISTORY-002 — Only terminal permits appear

Priority: P0 · Role: contractor · Viewport: 1280 · Locale: th
Preconditions: F2 — at least one `CLOSED`, one `EXPIRED`, and at least one `DRAFT`/`PENDING`/`ACTIVE`

1. Open History with the status filter on "All".
2. List every permit id rendered in the table.
3. Compare against the `GET /permits` response body in the network tab.

Expected:
- Only `CLOSED` and `EXPIRED` permits render. No draft, pending or active permit appears.
- The API response will contain the non-terminal permits too — they are filtered out client-side. That
  difference between the response and the table is **expected**, not a defect.
- Every row belongs to the signed-in contractor.

Known gap: the API's `status` query takes a **single** value, so "All" fetches unfiltered and the
archive set (`CLOSED` + `EXPIRED`) is narrowed client-side. The paginated total therefore counts every
status, so the result count can exceed the rows shown and a page can render short
(`docs/api/GAPS.md` row B). Note the numbers you saw; do not re-file it.

---

### CT-HISTORY-003 — Search narrows the list, from the server

Priority: P1 · Role: contractor · Viewport: 1280 · Locale: th, en
Preconditions: F2 with at least two closed permits whose titles differ

1. Type a fragment of one permit's title into the search box, one character at a time, quickly.
2. Watch the network tab while typing.
3. Wait for the results.
4. Clear the search.
5. Type a string that matches nothing.

Expected:
- Search is **debounced** (~400 ms): a burst of keystrokes produces one request, not one per character.
- The request carries `search=<the text>` and `page=1` — searching resets to the first page.
- The table shows only matching permits, and the result count updates.
- Clearing restores the full archive list.
- Step 5 renders the localized empty state with its "clear filters" button, not a blank table.

---

### CT-HISTORY-004 — The type filter

Priority: P1 · Role: contractor · Viewport: 1280 · Locale: th, en
Preconditions: F2 with closed permits of more than one type

1. Set the type filter to Hot Work. Then Confined Space. Then Working at Heights. Then All.
2. Watch the network tab for each change.

Expected:
- Each change fires one `GET /permits` carrying `type=hot|confined|heights`, and resets to `page=1`.
- The table shows only that type; each row's type chip matches.
- "All" omits the `type` param and restores the archive list.
- The type labels are localized in both locales.

---

### CT-HISTORY-005 — The status filter

Priority: P1 · Role: contractor · Viewport: 1280 · Locale: th
Preconditions: F2 with at least one `CLOSED` and one `EXPIRED`

1. Set the status filter to "Closed".
2. Set it to "Expired".
3. Set it back to "All".

Expected:
- "Closed" fires `status=CLOSED` and shows only closed permits; "Expired" fires `status=EXPIRED`.
- With a single status selected, the client-side archive narrowing does **not** apply — the server
  already filtered, so the row count and the result count should agree here (unlike on "All").
- "All" omits `status` and re-applies the client-side archive narrowing.
- The dropdown offers exactly three options: All, Closed, Expired. Anything else is a `fail`.

---

### CT-HISTORY-006 — The date range

Priority: P1 · Role: contractor · Viewport: 1280 · Locale: th
Preconditions: F2 with closed permits on at least two different work dates

1. Set "from" to a date that excludes the oldest permit. Watch the request.
2. Set "to" to a date that excludes the newest permit.
3. Set a range that contains nothing.
4. Set "from" **after** "to" and record what happens.
5. Use each picker's clear control.

Expected:
- Each change fires one request carrying `dateFrom` / `dateTo` as `YYYY-MM-DD`, and resets to `page=1`.
- Boundary dates are **inclusive** — a permit dated exactly on `dateFrom` or `dateTo` is included.
- Step 3 renders the localized empty state.
- Step 4 is a **finding, not a fail**: nothing validates the ordering client-side, so the request goes
  out and the server answers with whatever it answers. Record it and raise it; there is no item
  specifying an inverted-range guard.
- Step 5 removes the param and restores the wider list.
- Dates are interpreted in `Asia/Bangkok`. A tester in another timezone will see off-by-one boundaries —
  set the machine timezone before filing anything.

---

### CT-HISTORY-007 — Clear filters resets everything at once

Priority: P2 · Role: contractor · Viewport: 1280 · Locale: th
Preconditions: F2

1. Set a search term, a type, a status **and** both dates. Note the result count.
2. Press "Clear".
3. Watch the network tab carefully.

Expected:
- All five controls reset, and the table returns to the unfiltered archive list.
- **Exactly one** `GET /permits` fires. Clearing the search box also schedules a debounced fetch
  internally; that one is cancelled, so a second request landing ~400 ms later is a `fail` (it can race
  the first and render stale rows).
- The page resets to 1.

---

### CT-HISTORY-008 — Pagination

Priority: P1 · Role: contractor · Viewport: 1280 · Locale: th
Preconditions: **more than 10** closed/expired permits, so there are at least two pages. `E2E-000`'s
seed must produce this or the case is `blocked` — say so rather than passing it on one page.

1. Note the rows on page 1 and the result count.
2. Go to page 2. Watch the request.
3. Go back to page 1.
4. Apply a filter while on page 2.

Expected:
- Page size is 10. Page 2's request carries `page=2&limit=10` and renders a different set of ids.
- No permit appears on both pages.
- Step 4 resets to page 1 — a filter change must never leave the user on a page that no longer exists.
- The paginator's total page count is consistent with the result count.

Known gap: with the status filter on "All", the paginated total counts **every** status, not just the
archive set, because the narrowing happens client-side (`docs/api/GAPS.md` row B). So the paginator can
claim more pages than the archive really has, and a page can render short or even empty. Record the
numbers; it is expected, not a defect.

---

### CT-HISTORY-009 — CSV export matches the filtered view

Priority: P0 · Role: contractor · Viewport: 1280 · Locale: th, en
Preconditions: F2; a spreadsheet or text editor to open the downloaded file

1. Set the status filter to **"Closed"** and a type filter. Note every row in the table and the result
   count.
2. Press "Export CSV".
3. Open the downloaded file and compare it, row by row, against the table.
4. Now set the status filter to **"All"**. Note every row in the table.
5. Export again and open the file.
6. Switch the locale to `en` and export once more.

Expected:
- The file downloads with a timestamped name (`history-YYYYMMDD-HHmmss.csv`), the timestamp in
  `Asia/Bangkok`.
- Six columns, headers localized in the active locale: id, type, title · location, closed date,
  duration, status.
- **Step 3: the file contains exactly the permits the table showed** — and it exports **every** matching
  row, not just the visible page. With more than 10 matches, the CSV must be longer than the table page.
  That is correct.
- **Step 5 is the one to watch.** The export re-queries with the same filters but does **not** re-apply
  the client-side archive narrowing that the table applies when the status filter is "All". Source
  reading says the file will therefore contain `DRAFT` / `PENDING` / `ACTIVE` rows that the table hides.
  **If the CSV contains any permit the table did not show, that is a `fail`** — attach the file, the
  table screenshot, and the export request. Do not excuse it with row B: row B explains why client-side
  narrowing exists, it does not license the export to skip it.
- Step 6: the headers and the type/status values are translated; the ids, dates and durations are not.
- Values containing a comma or a quote are properly escaped — the file opens with its columns aligned.

---

### CT-HISTORY-010 — Drill-in opens the detail drawer

Priority: P0 · Role: contractor · Viewport: 1280 / 375 · Locale: th, en
Preconditions: F2 with at least one closed permit

1. Note a row's permit id.
2. Click the row.
3. Watch the network tab.
4. Read the drawer.
5. Close it, then open a **different** row.
6. At 375px, repeat steps 2 and 4.

Expected:
- A **side drawer** opens over the table. The route does **not** change — this screen does not navigate
  to `/permits/:id`, despite what the plan's suite table says.
- Exactly one `GET /api/v1/permits/:id` fires, for the id from step 1.
- While it is in flight the drawer shows a loading state, not empty fields.
- The drawer's values match that permit and that permit only.
- Closing clears the drawer; opening a second row shows the second permit's data, with no leftover
  values from the first.
- At 375px the drawer is usable and scrollable, and the page body does not scroll horizontally.
- If the detail call fails (stop the backend and retry), the drawer closes and a **localized** error
  toast renders. A backend-authored English sentence on screen is a defect.

---

### CT-HISTORY-011 — The table scrolls rather than truncating

Priority: P1 · Role: contractor · Viewport: 1280 / 768 / 375 · Locale: th
Preconditions: F2 with several closed permits, at least one with a long title and location

1. Open History at 1280 and read the full table.
2. Resize to 768. Check every column.
3. Resize to 375. Check every column.
4. At 375, scroll the table horizontally.

Expected:
- At 375 and 768 the table **scrolls horizontally inside its own container** — all six columns remain
  reachable. No column is dropped and no header is clipped away.
- **The page body itself never scrolls horizontally** at any width. Only the table container does.
- The toolbar controls wrap rather than overflowing.
- A long title/location is allowed to ellipsize inside its cell, but the row must still be clickable and
  the full value must be visible in the drawer.

---

### CT-HISTORY-012 — The empty state

Priority: P2 · Role: contractor · Viewport: 1280 / 375 · Locale: th, en
Preconditions: a filter combination with no matches

1. Apply a filter combination that matches nothing (e.g. a nonsense search term).
2. Read the screen.
3. Press the empty state's "clear filters" button.

Expected:
- A localized empty state renders with a title and a description — not a bare table header, not a
  spinner that never resolves.
- Both locales are translated; no raw `history.empty.*` key renders.
- The clear button restores the full list and re-enables the toolbar.

---

## Run record

Copy this table into `docs/testing/runs/<YYYY-MM-DD>-CT-HISTORY.md`, fill it, and record the build under
test (`git rev-parse --short HEAD`), the tester, and the environment.

| Case | Result | Notes / defect id |
|---|---|---|
| CT-HISTORY-001 | | |
| CT-HISTORY-002 | | |
| CT-HISTORY-003 | | |
| CT-HISTORY-004 | | |
| CT-HISTORY-005 | | |
| CT-HISTORY-006 | | |
| CT-HISTORY-007 | | |
| CT-HISTORY-008 | | |
| CT-HISTORY-009 | | |
| CT-HISTORY-010 | | |
| CT-HISTORY-011 | | |
| CT-HISTORY-012 | | |

Every `fail` needs: steps to reproduce, expected vs actual, a screenshot, the browser console output and
the failing network request. A `fail` without a repro is a rumour.
