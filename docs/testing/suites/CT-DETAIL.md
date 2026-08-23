# Suite CT-DETAIL — Permit Detail: banners, QR, closure, audit timeline

App: Contractor (`:8080`) · Master plan: `../../../../../docs/e2e/E2E-TEST-PLAN.md`
Format reference: `CT-PERMITS.md`.

**Executable today: no — this entire suite is `not-built`.** `/permits/:id` resolves, but
`src/pages/permit/pages/detail/pages/PermitDetailPage.vue` is a deliberate placeholder: it renders a
"coming soon" panel and the raw permit id in the mono face, and nothing else. There is no banner, no QR,
no closure modal and no timeline to test.

Record **every case here as `not-built`, never `fail`.** This file is the acceptance script for
`PMT-010` (detail, banners, QR, timeline), `PMT-011` (closure checklist modal) and `PMT-012`
(mark-complete + Fire Watch countdown). As each item lands, its cases flip to a real result.

**Written from:** the design prototype `docs/main/SmartWorkPermit-v3.dc.html` (contractor detail view,
the closure modal and its per-type checklist item lists, the Fire Monitor panel) and
`docs/main/dev-handoff/02-contractor-web-vue-tasks.md` § Screens 3. The business rules asserted come
from `CLAUDE.md` § Business rules that must not drift and
`src/enums/modules/error/ApiErrorCode.enum.ts`. Where the implementation diverges from the prototype,
the item's own acceptance criteria win — raise the divergence rather than filing it.

**Fixtures:** F1 (one draft per type), F2 (one permit per status: `PENDING`, `ACTIVE`, `FIRE_MONITOR`,
`CLOSED`, `REJECTED`, `EXPIRED`), F4 (a Confined Space permit with an entrant checked **in**), F5 (a Hot
Work permit in `FIRE_MONITOR` with the countdown still running).

**Result values:** `pass` · `fail` · `blocked` (a dependency or fixture is missing) · `not-built` (the
feature does not exist yet) · `skip` (with a reason). Never leave a case blank.

---

### CT-DETAIL-001 — The header identifies the permit

Priority: P0 · Role: contractor · Viewport: 1280 / 375 · Locale: th, en
Preconditions: F2 permits exist; logged in as their owning contractor

1. Open a permit from My Permits.
2. Read the header block.
3. Compare each value against `GET /api/v1/permits/:id` in the network tab.

Expected:
- Type chip, status badge, title, permit id, location, foreman, work date and work time all render.
- The permit id renders in the mono face — it is an identifier (design system rule).
- Date and time display in `Asia/Bangkok`. The API transports UTC; a tester in another timezone sees a
  shifted value on every permit. Set the machine timezone before filing anything.
- Every rendered value matches the API response.
- A back link returns to My Permits.
- At 375px the header stacks; the page body does not scroll horizontally.

---

### CT-DETAIL-002 — Status banner: DRAFT

Priority: P1 · Role: contractor · Viewport: 1280 · Locale: th, en
Preconditions: F1 — a permit in `DRAFT`

1. Open the draft.

Expected:
- A draft banner renders, saying the permit has not been submitted and inviting the contractor to
  complete and submit it, with an edit action.
- The edit action reopens this draft **in the wizard**, prefilled. (Today nothing does — see
  `CT-WIZARD-005`. That is part of what this case accepts.)
- **No QR** — see `CT-DETAIL-006`.
- No closure action.

---

### CT-DETAIL-003 — Status banner: REJECTED, with the reason

Priority: P0 · Role: contractor · Viewport: 1280 / 375 · Locale: th, en
Preconditions: F2 — a permit in `REJECTED`, rejected with a non-empty reason

1. Open the rejected permit.
2. Read the banner.
3. Check the reason text against the API response.

Expected:
- A rejection banner renders in the rejected/danger colour, carrying **the safety officer's actual
  reason text**, plus who rejected it and when.
- The reason is the server's value verbatim. It is contractor-facing content, not an error code — this
  is the one place where server-authored text is correct on screen. Do not confuse it with the
  `errorCode` rule.
- A long reason wraps rather than truncating, at 1280 and at 375.
- No QR, no closure action.
- The banner's own chrome (labels, headings) is localized in both locales.

Why this is P0: the reason is the only thing telling the contractor what to fix. A rejected permit with
an empty or truncated reason wastes a site visit.

---

### CT-DETAIL-004 — Status banner: PENDING

Priority: P1 · Role: contractor · Viewport: 1280 · Locale: th
Preconditions: F2 — a permit in `PENDING`

1. Open the pending permit.

Expected:
- A banner states the permit is awaiting Safety Officer review.
- **No QR** — the QR placeholder renders instead (`CT-DETAIL-006`).
- No closure action, no mark-complete action.

---

### CT-DETAIL-005 — Status banner: ACTIVE, and CLOSED

Priority: P1 · Role: contractor · Viewport: 1280 · Locale: th, en
Preconditions: F2 — one permit `ACTIVE`, one `CLOSED`, one `EXPIRED`

1. Open the ACTIVE permit. Read the banner and the available actions.
2. Open the CLOSED permit.
3. Open the EXPIRED permit.

Expected:
- ACTIVE: a success-coloured banner; the QR renders; a closure action is offered (for Confined Space and
  Heights) or a **Mark Work Complete** action (for Hot Work — see `CT-DETAIL-009`).
- CLOSED: a terminal banner. **No** closure action, **no** mark-complete, and no QR.
- EXPIRED: a terminal banner, clearly distinct from CLOSED. No actions, no QR.
- Each status badge is distinguishable by more than colour alone.

---

### CT-DETAIL-006 — The QR appears only when ACTIVE or FIRE_MONITOR

Priority: P0 · Role: contractor · Viewport: 1280 / 375 · Locale: th, en
Preconditions: F2 — one permit in each of `DRAFT`, `PENDING`, `ACTIVE`, `FIRE_MONITOR`, `CLOSED`,
`REJECTED`, `EXPIRED`

1. Open each of the seven permits in turn.
2. For each, record whether a QR image renders or a placeholder does.
3. On the ACTIVE permit, check the network tab for where the QR token comes from.

Expected:
- A QR renders **only** on `ACTIVE` and `FIRE_MONITOR`. On all five other statuses a "QR pending
  approval" placeholder renders instead, explaining that the code is generated once the Safety Officer
  approves.
- The placeholder is a real, localized empty state — not a blank box and not a broken image.
- The QR on the ACTIVE permit resolves to that permit's verify token, and scanning/opening it shows that
  permit's live status.
- At 375px the QR panel stacks below the header and stays large enough to scan from a phone.

Why this is P0: a QR shown on a non-approved permit is a permit that can be presented at the worksite
without approval. This is a safety boundary, not a display detail.

---

### CT-DETAIL-007 — The audit timeline

Priority: P1 · Role: contractor · Viewport: 1280 / 375 · Locale: th, en
Preconditions: F2 — a permit that has been created, submitted, approved and closed (so it has ≥4 entries)

1. Open the permit.
2. Read the timeline.
3. Compare against the API response's audit entries.

Expected:
- Entries render **who / what / when**, in chronological order, with no gaps against the API response.
- Timestamps display in `Asia/Bangkok`.
- Action labels are localized; no raw enum value and no raw i18n key renders.
- The timeline is read-only — nothing in it can be edited or deleted from this screen.
- A permit with a single entry renders that one entry, not an empty state.
- At 375px the timeline stacks and stays readable.

---

### CT-DETAIL-008 — The closure checklist modal opens and gates itself

Priority: P0 · Role: contractor · Viewport: 1280 / 375 · Locale: th, en
Preconditions: F2 — an `ACTIVE` Confined Space permit with **no** entrant inside, and an `ACTIVE`
Working at Heights permit

1. Open the Confined Space permit and start the closure.
2. Count the checklist items and read them.
3. Leave one item unanswered. Look at the e-signature area and the confirm button.
4. Answer every item. Look again.
5. Sign.
6. Confirm the closure, and capture the request and response.
7. Repeat 1–6 on the Working at Heights permit.

Expected:
- The modal lists the per-type checklist. From the prototype: **Confined Space has 5 items** (all
  entrants exited / worksite restored / equipment removed / entry point sealed / documentation
  complete), **Working at Heights has 4** (all workers descended / scaffolding secured / area below
  re-opened / documentation complete), **Hot Work has 4** (worksite restored / equipment removed /
  barricades and signs removed / documentation complete). Each item is answered Yes or No.
- With any item unanswered, the e-signature is not offered and the confirm button is disabled with a
  "complete all items" label.
- With every item answered, the e-signature becomes available; after signing, a signed label and a
  timestamp render.
- Confirm only enables when **all items are answered and the signature is captured**.
- On success the permit becomes `CLOSED`, the banner switches, the QR disappears, and a closure entry
  appears in the audit timeline.
- Cancel closes the modal and changes nothing.
- At 375px the modal is scrollable and every control stays reachable.

---

### CT-DETAIL-009 — Hot Work: mark complete starts the Fire Watch

Priority: P0 · Role: contractor · Viewport: 1280 · Locale: th, en
Preconditions: F2 — an `ACTIVE` **Hot Work** permit

1. Open it. Note that the primary action is **Mark Work Complete**, not a closure checklist.
2. Press it and read the confirmation dialog.
3. Confirm, and capture the request and response.
4. Watch the permit's status and banner.
5. Try the same action on a Confined Space permit.

Expected:
- The confirmation says plainly that this starts a **30-minute server-side countdown** and that closure
  is locked until it ends.
- On confirm, the permit moves `ACTIVE → FIRE_MONITOR` and the Fire Monitor panel replaces the action.
- The QR **remains** visible (`FIRE_MONITOR` is one of the two QR statuses).
- Step 5: the server refuses with `errorCode` `NOT_HOT_WORK` — and the control should not have been
  offered in the first place. Record both.

---

### CT-DETAIL-010 — The Fire Watch countdown, and closing before it elapses

Priority: P0 · Role: contractor · Viewport: 1280 / 375 · Locale: th, en
Preconditions: F5 — a Hot Work permit in `FIRE_MONITOR` with the countdown **still running**. Nothing in
the database is in `FIRE_MONITOR` today and no fixture exists yet; `E2E-000` must seed F5 *and* a way to
re-seed it, since the timer elapses and cannot be reset from any client.

1. Open the permit. Read the countdown.
2. Leave the page open for 60 seconds and watch the countdown.
3. Reload the page and check the countdown is consistent with the elapsed real time.
4. Attempt to close the permit before the countdown reaches zero. Capture the response.
5. Wait for the countdown to reach zero (or use F5 seeded with a nearly-elapsed timer) and attempt
   closure again.

Expected:
- A prominent countdown renders with a warning that the timer is **server-side and cannot be bypassed or
  reset from any client**.
- The countdown decreases in real time and survives a reload — a reload must not restart it.
- Step 4: closure is refused with `403` and `errorCode` `FIRE_WATCH_NOT_ELAPSED`. The screen renders the
  **localized** string for that code and never the backend's `message`. There is no override.
- Step 5: closure proceeds through the checklist modal (`CT-DETAIL-008`).

Known gap: `GET /permits` returns neither the fire-watch remainder nor an entrant count — only the
public `GET /permits/qr/:token` reports them (`docs/api/GAPS.md` row A). So the countdown on this screen
can only be populated once a QR token exists, or from whatever the detail endpoint adds when `PMT-012`
lands. **How the remainder is sourced is part of this case**: record which request supplies it. If it is
computed purely client-side from a start timestamp, raise it — the rule is that the server's timer is
authoritative.

---

### CT-DETAIL-011 — Closure is refused while an entrant is still inside

Priority: P0 · Role: contractor · Viewport: 1280 · Locale: th, en
Preconditions: F4 — a Confined Space permit with at least one entrant currently checked **in**

1. Open the permit and start the closure.
2. Read the modal before answering anything.
3. Answer every checklist item and try to sign and confirm.
4. If the UI lets the request through, capture the response.
5. Have the entrant checked out (Inspector app, or directly against the API), reload, and retry.

Expected:
- The modal renders a **blocked** banner in the danger colour naming the number of entrants still
  inside, and their names where available.
- The e-signature and confirm are **disabled** while the block stands, even with every item answered.
- If a confirm does reach the server it is refused with `403` and `errorCode`
  `ENTRANTS_STILL_INSIDE`, rendered as the **localized** string.
- After the entrant checks out, the block clears and closure proceeds.
- The permit's status does not change at any point while the block stands.

Known gap: the entrant count is not on `GET /permits` (`docs/api/GAPS.md` row A), so this screen cannot
show "N inside" from the list payload. Record where the modal's count comes from; if this screen cannot
source one at all, the blocked banner must still render the server's refusal rather than nothing.

---

### CT-DETAIL-012 — A contractor cannot open someone else's permit

Priority: P0 · Role: contractor · Viewport: 1280 · Locale: th
Preconditions: F0 + F2 — a permit owned by a **different** account, and its id

1. Signed in as the F0 contractor, navigate directly to `/permits/<the other account's permit id>`.
2. Capture the response.

Expected:
- The server answers `403` and no permit data renders. The screen shows a localized not-permitted or
  error state, not a half-rendered detail page and not a spinner that never resolves.
- The `403` carries **no `errorCode`** (ownership 403s deliberately do not) — so the expected message is
  the generic localized fallback. That absence is normal, not a defect.
- Nothing from the other permit (title, location, QR) appears anywhere on screen.

---

### CT-DETAIL-013 — Every error surface on this screen is localized

Priority: P1 · Role: contractor · Viewport: 1280 · Locale: th
Preconditions: F2, F4, F5

1. With locale `th`, trigger each refusal reachable from this screen: `FIRE_WATCH_NOT_ELAPSED`
   (`CT-DETAIL-010`), `ENTRANTS_STILL_INSIDE` (`CT-DETAIL-011`), `NOT_HOT_WORK` (`CT-DETAIL-009`),
   `PERMIT_NOT_CLOSABLE` and `PERMIT_NOT_ACTIVE` (attempt an action on a `CLOSED` permit).
2. Record the exact toast/banner text for each.
3. Switch to `en` and repeat one of them.

Expected:
- Every message is the app's own localized string for that `errorCode` — Thai under `th`, English under
  `en`.
- **No backend-authored English sentence ever reaches the screen**, however sensible it reads. That is a
  `fail` every time, regardless of status code.
- No raw `errorCode` value (e.g. the literal text `FIRE_WATCH_NOT_ELAPSED`) renders as user-facing copy.
- Anything the app cannot map falls back to the localized generic message, and the raw error is written
  to the console for the tester to capture.

---

## Run record

Copy this table into `docs/testing/runs/<YYYY-MM-DD>-CT-DETAIL.md`, fill it, and record the build under
test (`git rev-parse --short HEAD`), the tester, and the environment. Until `PMT-010`…`PMT-012` land,
every row reads `not-built`.

| Case | Result | Notes / defect id |
|---|---|---|
| CT-DETAIL-001 | | |
| CT-DETAIL-002 | | |
| CT-DETAIL-003 | | |
| CT-DETAIL-004 | | |
| CT-DETAIL-005 | | |
| CT-DETAIL-006 | | |
| CT-DETAIL-007 | | |
| CT-DETAIL-008 | | |
| CT-DETAIL-009 | | |
| CT-DETAIL-010 | | |
| CT-DETAIL-011 | | |
| CT-DETAIL-012 | | |
| CT-DETAIL-013 | | |

Every `fail` needs: steps to reproduce, expected vs actual, a screenshot, the browser console output and
the failing network request. A `fail` without a repro is a rumour.
