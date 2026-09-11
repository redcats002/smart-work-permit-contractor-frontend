# Suite CT-CERTS — Certificates: validity badges and the add form

App: Contractor (`:8080`) · Master plan: `../../../../../docs/e2e/E2E-TEST-PLAN.md`
Format reference: `CT-PERMITS.md`.

**This module is built** (`feat-004` / `CRT-001`…`CRT-003`): `/certificates` is registered, the list, the
card badges and the add-certificate modal all exist.

**Executable today:** no — every case is `blocked` on `E2E-000` (no contractor account).

**`CRT-004`, the certificate gate on permit submission, is NOT built.** So the thing certificates
actually *do* — block a submit when a registered worker's certificate is missing or expired — **cannot
be verified from this suite**, and not from anywhere in this app today (submit itself is `PMT-009`, also
not built). `CT-CERTS-009` records that boundary; the gate's own acceptance case lives in
`CT-WIZARD.md` as `CT-WIZARD-011`.

**Fixtures:** F0 (contractor account) and F3 (workers with a valid certificate and workers with an
expired one). The boundary cases below need three specific rows that `E2E-000` must seed, because they
cannot be created reliably by hand on the day of a run:

| Needed row | Why |
|---|---|
| a certificate expiring **today** (Bangkok) | the `EXPIRING_SOON` / `EXPIRED` boundary |
| a certificate that expired **yesterday** (Bangkok) | the other side of it |
| a certificate expiring in exactly **30** and in **31** days | the `EXPIRING_SOON` window edge |

**Grounded in:** `src/pages/certificate/**`, `src/utils/CertificateStatus.ts`,
`src/pages/certificate/schema/AddCertificate.schema.ts`.

**Two source-grounded notes before you start** (neither is a documented gap; do not write them up as
`Known gap` lines):
- **Expiry is the backend's call.** Every certificate row carries a server-computed `expired` flag, and
  when it is present it **wins outright**. The client only adds the "expiring soon" window on top.
- **The 30-day "expiring soon" window is a defaulted product decision**, not a specified one — neither
  `00-SHARED-CONTEXT.md` nor the backend task doc states it. A disagreement at that boundary is a
  product question for the owner, not automatically a defect.

**Result values:** `pass` · `fail` · `blocked` (a dependency or fixture is missing) · `not-built` (the
feature does not exist yet) · `skip` (with a reason). Never leave a case blank.

---

### CT-CERTS-001 — The list loads and each card carries its fields

Priority: P0 · Role: contractor · Viewport: 1280 / 375 · Locale: th, en
Preconditions: logged in as the F0 contractor; F3 certificates exist

1. Open the sidebar and press "Certificates".
2. Watch the network tab.
3. Read one card in full.
4. Repeat at 375px.

Expected:
- The route is `/certificates` and exactly one `GET /api/v1/certificates` fires on mount, with
  `page=1&limit=50`.
- Each card shows worker name, role, certificate type, issued date, expiry date and a status badge.
- Issued and expiry dates render in the mono face as `YYYY-MM-DD` — they are identifiers/data, not prose.
- While loading, skeleton cards render.
- At 1280 the cards sit two per row; at 375 they stack to one column, and the page body does not scroll
  horizontally. Long worker names ellipsize inside the card rather than pushing it wide.
- Both locales are translated; no raw `certificate.*` key renders.

Source note: every card's attachment row renders the same "no file" placeholder, unconditionally —
`CertificateCard.vue` has no branch that could render a file even if one arrived, and the list response
carries no file reference either. So no card shows an attachment, including one uploaded moments earlier
(`CT-CERTS-008`). Expected; record it, do not file it.

---

### CT-CERTS-002 — A comfortably valid certificate badges Valid

Priority: P0 · Role: contractor · Viewport: 1280 · Locale: th, en
Preconditions: F3 — a certificate expiring **more than 30 days** from today

1. Open Certificates and find that card.
2. Read the badge, the card border and the expiry-date colour.

Expected:
- The badge reads the localized "Valid" string.
- Card border, badge and expiry text are all in the success/green treatment — one status drives all
  three; a green badge on a red border is a `fail`.
- The status is distinguishable by more than colour alone (the badge carries text).

---

### CT-CERTS-003 — Boundary: a certificate expiring **today**

Priority: P0 · Role: contractor · Viewport: 1280 · Locale: th
Preconditions: a certificate whose `expiryDate` is **today's date in Asia/Bangkok**, and whose
server-computed `expired` is `false`

1. Confirm the machine timezone is `Asia/Bangkok` before doing anything else.
2. Open Certificates and find that card.
3. Capture the row from the `GET /certificates` response — specifically its `expiryDate` and `expired`.

Expected:
- The badge is **"Expiring soon"** (amber), **not** "Expired". A certificate is valid through the whole
  of its expiry day; the 30-day window is inclusive of day zero.
- Border, badge and expiry text are all in the pending/amber treatment.
- If the server says `expired: true` for today, the card correctly shows **Expired** — the server wins.
  In that case this is not a client defect; record it and raise the day-boundary question with the
  backend owner, attaching the response body.

Why this is P0: a tester in another timezone will see this card flip, and file the wrong app. Step 1 is
not optional.

---

### CT-CERTS-004 — Boundary: a certificate that expired **yesterday**

Priority: P0 · Role: contractor · Viewport: 1280 · Locale: th
Preconditions: a certificate whose `expiryDate` was **yesterday in Asia/Bangkok**

1. Open Certificates and find that card.
2. Capture its row from the `GET /certificates` response.

Expected:
- The badge reads the localized **"Expired"** string; border, badge and expiry text are all in the
  rejected/red treatment.
- The response's `expired` is `true` and that is what drives the badge.
- The card still renders — an expired certificate is not hidden from the list. It is a record, and the
  contractor needs to see it to know what to renew.

---

### CT-CERTS-005 — Boundary: the 30-day "expiring soon" window edge

Priority: P1 · Role: contractor · Viewport: 1280 · Locale: th
Preconditions: two certificates, one expiring in exactly **30** days and one in **31** days (Bangkok)

1. Open Certificates and read both badges.

Expected:
- 30 days out → **"Expiring soon"** (the window is inclusive).
- 31 days out → **"Valid"**.
- A mismatch at exactly 30/31 is a **product question first**: the window is a defaulted decision with no
  spec behind it. Record the observed boundary and raise it before filing a defect.

---

### CT-CERTS-006 — When the server and the client disagree about expiry

Priority: P1 · Role: contractor · Viewport: 1280 · Locale: th
Preconditions: a certificate with a **past** `expiryDate` but `expired: false` on the wire. `E2E-000`
must seed this deliberately; if it cannot, record `blocked` rather than inventing it with devtools.

1. Open Certificates and find that card.
2. Capture the row from the response.

Expected:
- The card shows **"Expiring soon"**, not "Expired" — because the server said it is not expired, and the
  server is authoritative. The client only applies its own past-date rule when the server sends no
  `expired` flag at all.
- This is **by design**, not a bug: the backend enforces the gate server-side with no client override.
  Record it and move on.

Why this matters: without this case, a tester seeing a past date badged amber files a false defect. And
if the app ever "corrects" the server here, that is a real regression — the client would be
second-guessing an authority it is forbidden from recomputing.

---

### CT-CERTS-007 — The add-certificate form validates before it sends

Priority: P0 · Role: contractor · Viewport: 1280 / 375 · Locale: th, en
Preconditions: logged in as the F0 contractor

1. Press "Add certificate". Read the modal.
2. Submit it empty.
3. Fill worker name, role and certificate type; leave both dates empty. Submit.
4. Set issued `2026-06-01` and expiry `2026-05-01` (expiry **before** issued). Submit.
5. Set issued and expiry to the **same** date. Submit.
6. Attach a `.txt` file. Submit.
7. Fix everything: valid text fields, issued in the past, expiry in the future, no file. Submit.
8. Watch the network tab throughout.

Expected:
- The modal has: worker name, role, certificate type, issued date, expiry date, an optional file picker,
  and a submit button. The first five are marked required.
- Steps 2, 3 and 6 block **client-side**: inline localized messages render, the view scrolls to the first
  error, and **no request fires**.
- **Steps 4 and 5 do NOT block (wayfinder 117, 2026-09-11) — this reverses the line this suite used to
  state.** An expiry-before-issued (or same-date) client check existed in `AddCertificate.schema.ts` but
  had never actually run since this schema's `workerId` field existed — tracing `@primevue/forms`'s
  source found that a hidden `<input>` never registers with the Form, so the schema's base object parse
  always failed and no cross-field `.refine()` chained after it ever executed, in either direction. Fixing
  that registration would have made the rule start firing for the first time; checked instead against the
  api (`certificate/commands/{create,update}/*.model.ts` and `.service.ts`) and found **no ordering check
  on these two dates server-side at all**. Reviving the rule client-side would therefore refuse a
  PATCH/POST the server accepts — the standing "never gate beyond the server" invariant — so it was
  removed rather than fixed. Steps 4 and 5 now both fire `POST /certificates` and succeed, same as step 7.
- Step 6 rejects the file type; only PNG, JPEG, GIF and PDF are accepted.
- Step 7 fires exactly one `POST /api/v1/certificates`, the modal closes, the list refetches
  (`GET /certificates`), and the new certificate appears with the correct badge.
- Reopening the modal shows a **cleared** form — no values left over from the previous submission.
- At 375px the modal scrolls and every control, including the date pickers, stays reachable.

---

### CT-CERTS-008 — Adding a certificate that is already expired

Priority: P1 · Role: contractor · Viewport: 1280 · Locale: th
Preconditions: logged in as the F0 contractor

1. Add a certificate with issued `2020-01-01` and expiry `2021-01-01` — valid relative to each other,
   but long past.
2. Submit.
3. Find the new card in the list.
4. Repeat, this time attaching a valid PDF, and watch the network tab.

Expected:
- The form **accepts** it. A past expiry is deliberately not rejected on entry — the record is the truth,
  and the badge is what communicates the problem. A client-side block here would be a `fail`.
- The new card renders with the **"Expired"** badge.
- Step 4: a file upload fires **before** the create call, and the create payload carries the uploaded
  file reference. The upload failing must surface a **localized** error toast and must not leave a
  half-created certificate — record what actually happens.
- The card still shows the "no file" placeholder afterwards, because the list response carries no file
  reference (see `CT-CERTS-001`). Expected; do not file it.

---

### CT-CERTS-009 — The certificate gate on permit submission

Priority: P0 · Role: contractor · Viewport: 1280 · Locale: th
Preconditions: F3 — a worker with a valid certificate and one with an expired certificate

1. Register the worker with the **expired** certificate on a permit and try to submit it.

Expected:
- **`not-built`.** The gate is `CRT-004` (not started), and submit itself is `PMT-009` (not started), so
  there is nothing in this app that can be blocked. **The blocking behaviour is not verifiable from this
  suite today** — record `not-built`, not `pass`, and never `fail`.
- When both land, the case is: the **server** refuses the submit with `400` and `errorCode`
  `CERT_EXPIRED` (or `CERT_MISSING` where none is on file), and the screen renders the **localized**
  string for that code, with no override. Its full script is `CT-WIZARD-011`.

Do not infer the gate from this screen. A card badged red proves the badge works; it proves nothing
about what happens on submit.

---

### CT-CERTS-010 — The empty state

Priority: P2 · Role: contractor · Viewport: 1280 / 375 · Locale: th, en
Preconditions: a contractor account with **no** certificates. `E2E-000` should provide one, or run this
before seeding F3.

1. Open Certificates.

Expected:
- A localized empty state renders with a title and a description — not a blank area and not an endless
  skeleton.
- The "Add certificate" button stays available so the user can get out of the empty state.
- Both locales translated; no raw `certificate.list.empty.*` key.

---

### CT-CERTS-011 — Errors on this screen are localized

Priority: P1 · Role: contractor · Viewport: 1280 · Locale: th
Preconditions: logged in as the F0 contractor

1. Stop the backend. Open Certificates.
2. Read the error toast.
3. Restart the backend, open the add modal, stop the backend again, and submit a valid certificate.
4. Read that toast.

Expected:
- Both toasts render the app's own localized message. Under `th` they are Thai.
- **No backend-authored English sentence reaches the screen**, however sensible it reads — that is a
  `fail` every time.
- No raw `errorCode` value renders as user-facing copy.
- The console carries the underlying error for the tester to capture.
- The screen recovers on the next successful load; it does not stay stuck in an error state.

---

### CT-CERTS-012 — Pagination

Priority: P2 · Role: contractor · Viewport: 1280 · Locale: th
Preconditions: **more than 50** certificates on the account

1. Open Certificates and count the cards.

Expected:
- **There is no paginator on this screen by design** — the design shows the full set with no pager, and
  the list requests `limit=50` to stand in for one. With fewer than 50 certificates nothing is hidden.
- With **more than 50**, cards beyond the first 50 are silently unreachable. Record that as a
  **finding to raise, not a fail** — no item specifies paging here, and the fixture set is far below the
  limit. Note the account's real certificate count so the owner can judge whether it will ever matter.

---

## Run record

Copy this table into `docs/testing/runs/<YYYY-MM-DD>-CT-CERTS.md`, fill it, and record the build under
test (`git rev-parse --short HEAD`), the tester, and the environment.

| Case | Result | Notes / defect id |
|---|---|---|
| CT-CERTS-001 | | |
| CT-CERTS-002 | | |
| CT-CERTS-003 | | |
| CT-CERTS-004 | | |
| CT-CERTS-005 | | |
| CT-CERTS-006 | | |
| CT-CERTS-007 | | |
| CT-CERTS-008 | | |
| CT-CERTS-009 | | |
| CT-CERTS-010 | | |
| CT-CERTS-011 | | |
| CT-CERTS-012 | | |

Every `fail` needs: steps to reproduce, expected vs actual, a screenshot, the browser console output and
the failing network request. A `fail` without a repro is a rumour.
