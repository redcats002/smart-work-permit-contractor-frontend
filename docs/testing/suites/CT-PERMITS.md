# Suite CT-PERMITS — My Permits list

**Reference suite — this file fixes the format every other suite in this repo copies.**

App: Contractor (`:8080`) · Master plan: `../../../../docs/e2e/E2E-TEST-PLAN.md`

**Executable today:** no. Every case here is `blocked` on `E2E-000` — there is no contractor account and
this app's login refuses non-contractors, so the app cannot be reached at all.

**Fixtures:** F0 (contractor account), F1 (one permit per type in DRAFT), F2 (one permit per status).

**Result values:** `pass` · `fail` · `blocked` (a dependency or fixture is missing) · `not-built` (the
feature does not exist yet) · `skip` (with a reason). Never leave a case blank.

---

### CT-PL-001 — The list shows only this contractor's own permits

Priority: P0 · Role: contractor · Viewport: 1280 · Locale: th
Preconditions: logged in as the F0 contractor; F2 permits exist, at least one created by a different account

1. Open My Permits.
2. Compare the rendered permit ids against `GET /api/v1/permits` in the network tab.

Expected:
- Every card belongs to the logged-in contractor. A permit created by another account must not appear.
- The rendered ids match the API response exactly — no client-side padding or filtering discrepancy.

Why this is P0: it is the app's data-isolation boundary. The server scopes the list by role; a leak here
is either a server defect or a client requesting the wrong scope. Record which, from the network tab.

---

### CT-PL-002 — Each card carries the fields a contractor navigates by

Priority: P1 · Role: contractor · Viewport: 1280 · Locale: th
Preconditions: F1 + F2 permits exist

1. Open My Permits.
2. Inspect one card of each permit type (hot, confined, heights).

Expected:
- Each card shows permit id, type, title, location, work date and status.
- The type chip and status badge are distinguishable by more than colour alone.
- The permit id renders in the mono face (it is an identifier, per the design system).
- Dates display in `Asia/Bangkok`; the API transports UTC. A tester in another timezone will see a
  shifted date — set the machine timezone before filing anything here.

Known gap: the card cannot show an entrant count ("N inside"). `GET /permits` returns neither the entrant
count nor the fire-watch remainder — only the public QR-verify endpoint does (`docs/api/GAPS.md` row A).
Its absence is expected, not a defect.

---

### CT-PL-003 — Status filter chips narrow the list

Priority: P1 · Role: contractor · Viewport: 1280 / 390 · Locale: th, en
Preconditions: F2 permits exist — at least one ACTIVE, one PENDING, one CLOSED, one REJECTED

1. Open My Permits.
2. Tap "Active".
3. Tap "Pending".
4. Tap "Closed".
5. Tap "All".
6. Repeat step 2 at 390px width.

Expected:
- "Active" shows ACTIVE **and** FIRE_MONITOR; "Closed" shows CLOSED **and** REJECTED; "All" restores
  everything. The selected chip is visibly selected.
- The rendered card count matches the visible result count.
- At 390px the chips remain reachable and are at least 44px tall; the list stacks rather than truncating.

Known gap: the API's `status` query takes a **single** value, so grouped chips fetch unfiltered and narrow
client-side. The paginated total therefore counts every status and a page can render short
(`docs/api/GAPS.md` row B). Expected, not a defect — but note the numbers you saw.

---

### CT-PL-004 — The empty state is an empty state, not a blank screen

Priority: P2 · Role: contractor · Viewport: 1280 / 390 · Locale: th, en
Preconditions: a filter combination with no matches (e.g. "Closed" on a fresh fixture set)

1. Select a filter with no matching permits.

Expected:
- A localized empty-state message renders — not a spinner that never resolves, and not a bare white area.
- The message is translated in both locales; no key text (`permit.list.empty`) and no English in the Thai UI.
- The filter chips stay usable so the tester can get back.

---

### CT-PL-005 — Drill-in opens the right permit

Priority: P1 · Role: contractor · Viewport: 1280 · Locale: th
Preconditions: F2 permits exist

1. Note the id on a card.
2. Open it.

Expected:
- The detail route carries that permit's id and the screen shows that permit.

**`not-built`** — Permit Detail is `PMT-010`, not started. Record this case as `not-built` until it lands;
it then becomes part of that item's acceptance script.

---

### CT-PL-006 — The list survives a reload and a back-navigation

Priority: P2 · Role: contractor · Viewport: 1280 · Locale: th
Preconditions: F2 permits exist

1. Apply a filter.
2. Reload the page.
3. Navigate away and press Back.

Expected:
- The list reloads without an error and without an authentication bounce.
- Record whether the filter is preserved. If it is not, that is a **finding to raise, not a fail** — no
  item currently specifies filter persistence, so decide with the product owner before filing.

---

## Run record

Copy this table into `docs/testing/runs/<YYYY-MM-DD>-CT-PERMITS.md`, fill it, and record the build under
test (`git rev-parse --short HEAD`), the tester, and the environment.

| Case | Result | Notes / defect id |
|---|---|---|
| CT-PL-001 | | |
| CT-PL-002 | | |
| CT-PL-003 | | |
| CT-PL-004 | | |
| CT-PL-005 | | |
| CT-PL-006 | | |

Every `fail` needs: steps to reproduce, expected vs actual, a screenshot, the browser console output and
the failing network request. A `fail` without a repro is a rumour.
