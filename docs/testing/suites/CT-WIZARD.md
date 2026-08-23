# Suite CT-WIZARD — The 6-step New Permit wizard

App: Contractor (`:8080`) · Master plan: `../../../../../docs/e2e/E2E-TEST-PLAN.md`
Format reference: `CT-PERMITS.md`.

**Executable today:** no — every case is `blocked` on `E2E-000` (no contractor account). Once F0 exists,
**steps 1 and 2 are real**, and so is draft creation/autosave.

**Read this before recording anything.** Both the master plan (§ 2) and this repo's
`docs/modules/e2e-manual/context.md` say "the wizard cannot get past step 2." **That is not what the
code does.** Steps 3–6 ship as stub components with placeholder schemas (`z.object({})`, always valid) —
see `src/pages/permit/pages/create/wizard/WizardSteps.ts` and each `schema/Step[3-6]*.schema.ts`. So:

- Next is **never** blocked on steps 3, 4 or 5. A tester will walk straight through to step 6.
- Each of steps 3–6 renders a centred stub: the step title, an uppercase marker line, and a short
  "lands in PMT-00x" body. That is the expected screen today, not a broken render.
- On step 6 the **Submit button enables** once a draft id exists — and does nothing but write a
  `console.info`. It is wired for `PMT-009` and inert until then.

Cases covering steps 3–6 are `not-built` and are written from the design prototype
(`docs/main/SmartWorkPermit-v3.dc.html`) and `docs/main/dev-handoff/02-contractor-web-vue-tasks.md`.
They double as the acceptance script for `PMT-006`…`PMT-009`.

**Fixtures:** F0 (contractor account). `CT-WIZARD-011` additionally needs F3 (a worker with an expired
certificate) once `CRT-004` lands.

**Grounded in:** `src/pages/permit/pages/create/**`, `src/utils/PermitSafety.ts`,
`src/models/request/permit/PermitReq.model.ts`, and `CLAUDE.md` § Business rules that must not drift.

**Result values:** `pass` · `fail` · `blocked` (a dependency or fixture is missing) · `not-built` (the
feature does not exist yet) · `skip` (with a reason). Never leave a case blank.

---

### CT-WIZARD-001 — Step 1 offers exactly three permit types and gates Next

Priority: P0 · Role: contractor · Viewport: 1280 / 375 · Locale: th, en
Preconditions: logged in as the F0 contractor

1. Open My Permits and start a new permit (sidebar "New Permit", or `/permits/create`).
2. Without selecting anything, look at the Next button and the stepper.
3. Select "Hot Work". Then "Confined Space". Then "Working at Heights".
4. Press Next.
5. Repeat step 3 at 375px.

Expected:
- Exactly three type cards render: Hot Work, Confined Space, Working at Heights — each with its own
  icon, its own colour chip and a one-line blurb, all localized.
- With nothing selected, Next is **disabled** and a blocked note renders beside it.
- Selecting a card visibly selects it (border + background change), and selecting a different card
  moves the selection — the choice is single-select, not additive.
- Next enables as soon as a type is chosen, and step 4 advances to step 2.
- At 375px the three cards stack to one column and stay tappable.
- **No API call fires yet.** A draft cannot be created from step 1 alone — `POST /permits` requires
  title, location, foreman, date and both times as well. An empty network tab here is correct.

---

### CT-WIZARD-002 — Step 2 requires every field the API requires

Priority: P0 · Role: contractor · Viewport: 1280 · Locale: th
Preconditions: logged in as the F0 contractor; step 1 completed with any type

1. On step 2, leave everything empty and look at Next.
2. Fill only Work title. Check Next.
3. Fill Foreman, Location, Work date, start time and end time — one at a time, checking Next after each.
4. Read the read-only Contractor field.

Expected:
- Next stays disabled until **all six** of title, foreman, location, work date, start time and end time
  are filled. Nothing less unlocks it.
- Required fields carry a required marker; blanking one after filling it re-blocks Next.
- The Contractor field is read-only and shows the signed-in account's name (or email) — it is not
  editable and is not sent as a field.
- Validation messages are localized; no raw i18n key renders.

Known gap: the design shows a free-text "Work description" and the permit has nowhere to put it — the
API has no such field (`docs/api/GAPS.md` row F). Its absence from this step is correct, not an
oversight. Do not file it.

---

### CT-WIZARD-003 — End time must be after start time

Priority: P1 · Role: contractor · Viewport: 1280 · Locale: th
Preconditions: on step 2 with all other fields filled

1. Set work date to today, start time `13:00`, end time `09:00`.
2. Read the end-time field and the Next button.
3. Change end time to `17:00`.
4. Set start `22:00` and end `02:00` (an overnight span) and record what happens.

Expected:
- Step 2: the end-time field is marked invalid, an inline "end after start" message renders, and Next is
  **disabled**. Equal times are also rejected — the rule is strictly after.
- Step 3: the field clears and Next enables.
- Step 4 is a **finding, not a fail**: both times are composed onto the same calendar date, so an
  overnight span parses as end-before-start and is refused. Nothing specifies overnight permits; record
  what you saw and raise it with the product owner rather than filing a defect.

---

### CT-WIZARD-004 — The draft is created once, then patched — never duplicated

Priority: P0 · Role: contractor · Viewport: 1280 · Locale: th
Preconditions: logged in as the F0 contractor; network tab open and recording from before the wizard opens

1. Complete step 1 and every field of step 2, typing quickly (do not pause between fields).
2. Wait ~2 seconds after the last keystroke and read the network tab.
3. Edit the title. Wait 2 seconds. Read the network tab again.
4. Edit two more fields in quick succession. Wait. Read again.
5. Open My Permits in a second tab.

Expected:
- Exactly **one** `POST /api/v1/permits` fires, and only after the last of the seven required fields is
  present. Not one per keystroke, and never two.
- Every later edit fires `PATCH /api/v1/permits/:id` against that same id.
- Writes are debounced (~1.5 s), so a burst of edits collapses into one request.
- Step 5 shows exactly one new `DRAFT` permit in the list, with the values typed.
- A failed write surfaces a **localized** error toast (stop the backend and repeat step 3 to check).
  A backend-authored English sentence on screen is a defect.

Why this is P0: two drafts from one wizard session is the single worst outcome here — the contractor
submits one and edits the other.

---

### CT-WIZARD-005 — A half-filled wizard and a browser reload

Priority: P0 · Role: contractor · Viewport: 1280 · Locale: th
Preconditions: logged in as the F0 contractor

1. Complete step 1 and every field of step 2. Wait for the `POST /permits` to land (network tab).
2. Advance to step 3.
3. Reload the browser (F5).
4. Read what the wizard shows.
5. Navigate to My Permits and look for the permit created in step 1.
6. Open the draft from the list and record what happens.

Expected:
- **The saved draft exists on the server**: step 5 shows it in My Permits as `DRAFT` with the values
  entered. The data was not lost — this is the part that matters for a contractor on a site tablet.
- **The wizard itself comes back empty**, at step 1. Wizard state is a page-scoped composable
  (`useWizard`) with no load-on-mount and no draft id in the route, so a reload starts a fresh wizard.
  Continuing from here would create a **second** draft. Record this exactly as observed.
- Whether the wizard *should* resume the draft is **not specified by any item**. Record it as a
  **finding to raise, not a fail** — decide with the product owner before filing.
- Step 6: there is no draft-edit entry point today. Opening a draft goes to Permit Detail, which is a
  placeholder (`PMT-010`, `not-built`), and nothing routes an existing draft back into the wizard.

---

### CT-WIZARD-006 — Navigating away flushes the last edit

Priority: P1 · Role: contractor · Viewport: 1280 · Locale: th
Preconditions: a draft already created in this wizard session (`CT-WIZARD-004` completed)

1. Change the location field.
2. **Immediately** — inside one second, before the debounce fires — use the in-app "← My Permits" link.
3. Watch the network tab.
4. Check the permit's location, via the list or `GET /permits`.

Expected:
- A `PATCH /permits/:id` fires as the page unmounts, carrying the new location. The pending edit is
  flushed, not dropped.
- No second `POST /permits` fires on teardown.
- Step 4 shows the edited value.

---

### CT-WIZARD-007 — The stepper cannot jump ahead

Priority: P1 · Role: contractor · Viewport: 1280 · Locale: th
Preconditions: a fresh wizard, nothing selected

1. On step 1, click the step-3, step-4 and step-6 headers in the stepper.
2. Select a type, press Next to reach step 2, then click the step-1 header.
3. From step 1, click the step-2 header.
4. From step 2, clear the title, then press Back and try to jump forward again.

Expected:
- Step 1: none of the forward jumps move the wizard. Only steps already unlocked by pressing Next are
  reachable.
- Step 2: going back to step 1 always works — Back never validates.
- Step 3: jumping forward to an already-unlocked step works.
- Step 4: with step 2 invalid, the stepper refuses to jump past it even though it was unlocked earlier.
- Back is hidden on step 1.

---

### CT-WIZARD-008 — Step 3, Safety Checks: the per-type ranges

Priority: P0 · Role: contractor · Viewport: 1280 / 375 · Locale: th, en
Preconditions: F1 (one draft per type), or create one per type through steps 1–2

**`not-built`** — `PMT-006`. Written from the prototype and `02-contractor-web-vue-tasks.md` § Screens 2.3.
Today step 3 renders a centred stub and Next is not blocked by anything. Record `not-built`.

Today's observable expectation (record this, do not file it):
- A stub panel with the step title, an uppercase marker and a "lands in PMT-006" body. Next is enabled.

When `PMT-006` lands, this case runs as:

1. On a **Hot Work** draft, open step 3. Note which reading fields render.
2. Enter LEL `0`, O₂ `20.9`. Read the inline pass/fail and the Next button.
3. Change LEL to `1`. Then back to `0`. Then O₂ to `18.0`, then `24.0`, then `19.5`, then `23.5`.
4. Repeat on a **Confined Space** draft: LEL, O₂, **CO** and SO₂.
5. Set CO to `50`, then `51`.
6. Repeat on a **Working at Heights** draft: Wind (and the informational height field).
7. Set wind to `25`, then `25.1`.

Expected:
- Hot Work asks for **LEL and O₂** only. Confined Space asks for **LEL, O₂, CO and SO₂**. Working at
  Heights asks for **wind** (plus height, informational).
- Blocking ranges, per `src/utils/PermitSafety.ts` and `CLAUDE.md`: LEL **must be 0%**; O₂ **19.5–23.5%**
  inclusive; CO **≤ 50 ppm**; wind **≤ 25 km/h**. Boundary values (`19.5`, `23.5`, `50`, `25`) **pass**;
  one step outside fails.
- SO₂ and height are **advisory only** — out of range they may warn, but they must never block Next.
- A failing reading blocks Next **with no override**, and the message names the specific failing
  reading, not a generic "safety check failed".
- A missing required reading blocks Next the same way as an out-of-range one.
- At 375px the reading cards stack and the values stay readable.

**The client check is convenience only.** Passing this case proves the client agrees with the ranges; it
proves nothing about the permit being submittable. `CT-WIZARD-012` is the case that matters.

---

### CT-WIZARD-009 — `outdoorWork: true` skips the gas readings, and only those

Priority: P0 · Role: contractor · Viewport: 1280 · Locale: th
Preconditions: F1 drafts, one per type

**`not-built`** — `PMT-006` (the toggle lives on step 3; the `outdoorWork` field itself already exists on
the create payload). Written from `CLAUDE.md` § Business rules and `src/utils/PermitSafety.ts`.

1. On a **Hot Work** draft, set the permit to outdoor work. Leave LEL and O₂ empty. Check Next.
2. On a **Confined Space** draft, do the same with LEL, O₂ and CO empty.
3. On a **Working at Heights** draft, set outdoor work and leave **wind** empty. Check Next.
4. Turn outdoor work back off on the Hot Work draft with the fields still empty.
5. Check the `PATCH /permits/:id` payload carries `outdoorWork: true`.

Expected:
- Steps 1–2: LEL, O₂ and CO are skipped entirely — neither missing nor out-of-range — and Next unlocks
  with them empty.
- Step 3: **wind is still required.** It is deliberately not bypassable — Working at Heights is outdoors
  by definition. Next stays blocked.
- Step 4: the readings become required again immediately.
- Step 5: the flag reaches the server; it is not a client-only display toggle.

---

### CT-WIZARD-010 — Step 4, PPE / photos / workers

Priority: P1 · Role: contractor · Viewport: 1280 / 375 · Locale: th
Preconditions: F0; a draft at step 4

**`not-built`** — `PMT-007`. Written from the prototype and `02-contractor-web-vue-tasks.md` § 2.4.
Today: a centred stub, Next enabled. Record `not-built`.

When it lands:

1. Tick the PPE items required for the permit type.
2. Upload a photo into each required evidence slot; replace one of them.
3. Add a worker (name + role). Add a second. Remove the first.
4. On a **Confined Space** draft, fill the pre-work health-check fields for an entrant.
5. Watch each `PATCH /permits/:id` payload in the network tab.

Expected:
- Role options vary by permit type.
- A replaced photo **upserts by `slotKey`** — it replaces that slot's image and does not add a second
  photo to the permit.
- Worker health-check values go on the wire **flat** (`bloodPressure`, `alcoholReading`), not nested
  under a `healthCheck` object.
- Each `PATCH` sends the **complete** worker list, because `workers` is replaced wholesale server-side.
  See `CT-WIZARD-013`.

---

### CT-WIZARD-011 — Certificates gate submission

Priority: P0 · Role: contractor · Viewport: 1280 · Locale: th
Preconditions: F3 — one worker with a valid certificate and one whose certificate has expired

**`not-built`** — `CRT-004` (the cert gate) plus `PMT-007`/`PMT-009`. Record `not-built`.

When it lands:

1. Register the worker whose certificate is **valid**. Complete the wizard and submit.
2. Register the worker whose certificate has **expired**. Submit.
3. Register a worker with **no** certificate on file. Submit.

Expected:
- Step 1 submits.
- Steps 2 and 3 are refused by the **server** with `400` and `errorCode` `CERT_EXPIRED` / `CERT_MISSING`
  respectively, and the screen renders the **localized** string for that code.
- The refusal is not overridable from the UI.
- Any client-side pre-warning is advisory; the case passes only on the submit response.

---

### CT-WIZARD-012 — The backend re-validates on submit, and its answer wins

Priority: P0 · Role: contractor · Viewport: 1280 · Locale: th
Preconditions: F0; a draft that the client considers complete and valid

**`not-built`** — `PMT-009`. **Not verifiable from the UI today at all**: step 6's Submit button enables
once a draft exists but only writes a `console.info` (`PermitCreatePage.vue`'s `onSubmitClick`). There is
no `POST /permits/:id/submit` call to inspect. Record `not-built` — and record that the button *looks*
functional, so nobody files "submit does nothing" as a `fail`.

When `PMT-009` lands, this case runs as:

1. Fill a Hot Work draft with readings the client accepts (LEL `0`, O₂ `20.9`).
2. Press Submit on step 6. **Capture the `POST /api/v1/permits/:id/submit` request and its response.**
3. Repeat with an out-of-range reading forced past the client — set a valid reading, advance to step 6,
   then use devtools to `PATCH` the permit with LEL `5` before submitting (or ask the backend owner to
   seed such a draft).
4. Repeat with a required reading missing entirely.

Expected:
- Step 2: the response is `200`, the permit moves `DRAFT → PENDING`, and the app routes to the permit
  detail.
- Step 3: the response is **`400`** with an `errorCode` of `GAS_OUT_OF_RANGE`. The permit stays `DRAFT`.
- Step 4: `400` with `LEL_MISSING` / `O2_MISSING` / `CO_MISSING` / `WIND_MISSING` as applicable.
- In every failing case the screen renders the **localized** string for that `errorCode` and **never**
  the backend's `message`.
- **A pass requires the submit response, not the button state.** A case recorded `pass` because the
  client disabled the button has proved nothing — the client check is convenience only and the server's
  verdict is the product rule.

Known gap: submit-time validation returns only the **first** failing code, and its `message` joins every
failure with `; `. The screen can therefore show one problem at a time — the user fixes it and resubmits
(`docs/api/GAPS.md` row E). That is expected, not a defect. The joined `message` string must never be
rendered.

---

### CT-WIZARD-013 — Editing a draft must not silently drop rows

Priority: P0 · Role: contractor · Viewport: 1280 · Locale: th
Preconditions: a draft with **three** JSA steps and **three** registered workers. **No fixture supplies
this** — F1/F2/F3 do not cover a populated draft, so `E2E-000` must seed one (or the wizard must be able
to create it, which needs `PMT-007`/`PMT-008`). Until then record `not-built`, not `blocked`.

**`not-built`** — needs `PMT-007` (workers) and `PMT-008` (JSA), and there is no way to reopen an
existing draft in the wizard today (see `CT-WIZARD-005` step 6). Record `not-built`. This is the
acceptance script for the `PATCH` collection semantics in `CLAUDE.md`.

1. Open the draft. Edit the **second** JSA step's control text only. Save.
2. Capture the `PATCH /permits/:id` payload.
3. Reload and count the JSA steps.
4. Edit the **third** worker's role only. Capture the payload. Reload and count the workers.
5. Add one safety reading. Capture the payload. Reload and count the readings.
6. Replace the photo in one slot. Capture the payload. Reload and count the photos.

Expected:
- Steps 1–3: the payload's `jsaSteps` contains **all three** steps, not just the edited one — the server
  **replaces the collection wholesale**. After reload there are still three steps, with the edit applied.
  **Two steps after a reload is a `fail`, and a data-loss one.**
- Step 4: same rule for `workers` — the full list, all three still present afterwards.
- Step 5: `safetyReading` is **singular and appends**. Sending it must add one reading, not replace the
  history. The count goes up by exactly one.
- Step 6: `photos` **upsert by `slotKey`** — the slot's image changes and the photo count does not grow.

Why this is P0: this is the one drift in the whole app that destroys data the contractor already entered,
and it is invisible until a reload.

---

### CT-WIZARD-014 — Step 5, JSA phases

Priority: P2 · Role: contractor · Viewport: 1280 · Locale: th
Preconditions: a draft at step 5

**`not-built`** — `PMT-008`. Written from the prototype (`jsaByPhase`, three phases) and
`02-contractor-web-vue-tasks.md` § 2.5. Today: a centred stub, Next enabled. Record `not-built`.

When it lands: three phase tabs (Pre / Process / Post); rows of step + hazard + control that can be
added, edited and removed within each phase; switching tabs preserves the other phases' rows; and each
save sends the complete `jsaSteps` list (see `CT-WIZARD-013`).

---

### CT-WIZARD-015 — Step 6 review shows what will actually be submitted

Priority: P1 · Role: contractor · Viewport: 1280 · Locale: th
Preconditions: a fully completed draft

**`not-built`** — `PMT-009`. Today: a centred stub with an enabled but inert Submit button. Record
`not-built`.

When it lands: a read-only summary of steps 1–5 whose every value matches what was entered; work date
and times rendered in `Asia/Bangkok`; the type and title as chosen; a way back to any step to correct
something; and Submit as the only action that mutates anything.

Note the timezone trap: `workDate` goes out as `YYYY-MM-DD` and comes back as a full ISO timestamp. A
tester whose machine is not on `Asia/Bangkok` will see a shifted date on every screen in this app. Set
the machine timezone before filing anything.

---

### CT-WIZARD-016 — The wizard at 375px

Priority: P1 · Role: contractor · Viewport: 375 · Locale: th
Preconditions: logged in as the F0 contractor

1. Open `/permits/create` at 375px width.
2. Walk steps 1 → 6.
3. At each step, check for horizontal page scrolling.

Expected:
- Step 1's type cards stack to a single column. Step 2's field grid collapses to one column.
- The stepper header stays usable — it may scroll or condense, but it must not clip the current step
  out of view.
- The footer's Back / Next / Submit stay reachable without horizontal scrolling of the page body.
- **The page body never scrolls horizontally.** Any element wider than the viewport must scroll inside
  its own container.
- Steps 3–6 render their stubs centred and legible (`not-built` for their real content).

---

## Run record

Copy this table into `docs/testing/runs/<YYYY-MM-DD>-CT-WIZARD.md`, fill it, and record the build under
test (`git rev-parse --short HEAD`), the tester, and the environment.

| Case | Result | Notes / defect id |
|---|---|---|
| CT-WIZARD-001 | | |
| CT-WIZARD-002 | | |
| CT-WIZARD-003 | | |
| CT-WIZARD-004 | | |
| CT-WIZARD-005 | | |
| CT-WIZARD-006 | | |
| CT-WIZARD-007 | | |
| CT-WIZARD-008 | | |
| CT-WIZARD-009 | | |
| CT-WIZARD-010 | | |
| CT-WIZARD-011 | | |
| CT-WIZARD-012 | | |
| CT-WIZARD-013 | | |
| CT-WIZARD-014 | | |
| CT-WIZARD-015 | | |
| CT-WIZARD-016 | | |

Every `fail` needs: steps to reproduce, expected vs actual, a screenshot, the browser console output and
the failing network request. A `fail` without a repro is a rumour.
