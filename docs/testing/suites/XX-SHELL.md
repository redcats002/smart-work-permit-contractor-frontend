# Suite XX-SHELL — Shell, navigation, locale, responsive, touch targets

App: Contractor (`:8080`) · Master plan: `../../../../../docs/e2e/E2E-TEST-PLAN.md`
Format reference: `CT-PERMITS.md`.

The Safety/Inspector repo carries its own `XX-SHELL`. **This file covers the contractor app only** —
same suite name, different app, different breakpoints. Do not merge results.

**Executable today:** the locale cases (`XX-SHELL-006`…`008`) run on the login page without a session.
Everything that needs the authenticated shell — sidebar, topbar, nav, responsive layout, touch targets —
is `blocked` on `E2E-000`.

**Fixtures:** F0 (contractor account). `XX-SHELL-011` also wants F2 so the History table has rows.

**Grounded in:** `src/layouts/DefaultLayout.vue`, `src/components/app/AppTopbar.vue`,
`src/components/app/AppDrawer.vue`, `src/components/app/LocaleSwitcher.vue`,
`src/plugins/I18n.plugin.ts`, `src/router/index.ts` and each `src/router/modules/*.router.ts`.

**The breakpoint is 900px, not 768.** The sidebar is a static column at ≥900px and a slide-in overlay
with a hamburger below it. So at **768 you get the mobile shell**, at 1280 the desktop one. The plan's
`375 / 768 / 1280+` triple is still the right set to test — just do not expect a sidebar at 768.

**Result values:** `pass` · `fail` · `blocked` (a dependency or fixture is missing) · `not-built` (the
feature does not exist yet) · `skip` (with a reason). Never leave a case blank.

---

### XX-SHELL-001 — The shell renders on every authenticated screen

Priority: P0 · Role: contractor · Viewport: 1280 · Locale: th
Preconditions: logged in as the F0 contractor

1. Visit `/permits`, `/permits/create`, `/permits/<an id>`, `/history` and `/certificates` in turn.
2. On each, check the topbar, the sidebar and the main content area.
3. Visit `/auth/login` (sign out first) and `/definitely-not-a-route`.

Expected:
- All five authenticated routes render inside the default layout: a dark topbar with the orange accent
  border, the dark sidebar on the left, and the content area scrolling independently of the shell.
- The topbar is sticky — scrolling a long list does not scroll it away.
- Step 3: login and 404 render in the **blank** layout, with no sidebar and no topbar.
- No page renders two scrollbars on the body.

---

### XX-SHELL-002 — All four nav destinations are live links

Priority: P0 · Role: contractor · Viewport: 1280 · Locale: th
Preconditions: logged in as the F0 contractor

1. Read the four sidebar items: My Permits, New Permit, History, Certificates.
2. Press each in turn and note the resulting URL.
3. In the console, run `$router?.hasRoute?.('HistoryListPage')` — or check whether the item renders as a
   link at all (an unregistered route renders as an inert, non-clickable row with identical styling).

Expected:
- All four are **real links**. None renders inert. All four routes are registered
  (`AuthRouter`, `PermitRouter`, `HistoryRouter`, `CertificateRouter` in `src/router/index.ts`).
- They navigate to `/permits`, `/permits/create`, `/history`, `/certificates` respectively.
- **If any renders inert, note that a route registered after the page loaded needs a full reload to
  appear** — the drawer's registration check is read once at render and is not reactive. Reload before
  filing.

---

### XX-SHELL-003 — The active nav item tracks the route

Priority: P1 · Role: contractor · Viewport: 1280 · Locale: th
Preconditions: logged in as the F0 contractor

1. Go to `/permits`. Note which item is highlighted.
2. Go to `/permits/create`.
3. Go to `/permits/<an id>`.
4. Go to `/history`, then `/certificates`.

Expected:
- `/permits` and `/permits/<id>` highlight **My Permits**.
- `/permits/create` highlights **New Permit**, and My Permits is *not* also highlighted — the two share a
  path prefix and exactly one must be active.
- `/history` and `/certificates` highlight their own items.
- Exactly one item is highlighted at a time, with the accent left-border treatment.

---

### XX-SHELL-004 — The account card

Priority: P2 · Role: contractor · Viewport: 1280 · Locale: th, en
Preconditions: logged in as the F0 contractor

1. Read the account card at the bottom of the sidebar.

Expected:
- It shows an initials avatar, the user's name (or email if no name), and an account-type line — all
  localized.
- A long name or email truncates rather than pushing the sidebar wide.
- The logout control sits on the card (its behaviour is `CT-AUTH-009`).

Known gap: the account card can never show an organisation or company — the backend has no company
concept at all (`docs/api/GAPS.md` row C). Its absence is expected, not a defect.

---

### XX-SHELL-005 — Notifications

Priority: P2 · Role: contractor · Viewport: 1280 · Locale: th
Preconditions: logged in as the F0 contractor

1. Look for a notification bell or badge in the topbar.

Expected:
- **`not-built`.** The topbar carries the app mark and the locale switcher only; there is no notification
  UI. The notification store exists and the layout fetches once on mount, but nothing renders it and
  polling is `PLT-007`, not started. Record `not-built`.
- Do check the console on first load: the initial notification fetch swallows its own failure by design,
  so a failure there must **not** blank the layout — but it should still be logged.

---

### XX-SHELL-006 — Thai is the default locale

Priority: P0 · Role: anonymous · Viewport: 1280 · Locale: (default)
Preconditions: a browser profile with no `smart-work-permit:locale` entry in localStorage — clear it, or
use a fresh profile

1. Confirm `localStorage.getItem('smart-work-permit:locale')` is `null`.
2. Load `/auth/login`.
3. Read every string on the page and check which locale button is selected.

Expected:
- The app renders in **Thai**, and the TH button is the selected one. English is the fallback locale,
  never the default.
- No raw i18n key renders anywhere.
- Setting the key to a nonsense value (`localStorage.setItem('smart-work-permit:locale','xx')`) and
  reloading also gives Thai — an invalid stored value falls back to the default rather than breaking.

---

### XX-SHELL-007 — The EN/TH switch works without a reload

Priority: P0 · Role: contractor · Viewport: 1280 · Locale: th → en → th
Preconditions: logged in as the F0 contractor, on My Permits

1. Press EN in the topbar switcher.
2. Without reloading, read: the sidebar nav labels, the page title and subtitle, the status chips, the
   card fields, and the account card.
3. Navigate to History and Certificates and read their toolbars and empty states.
4. Press TH and repeat.

Expected:
- The whole UI switches **immediately**, with no page reload and no navigation.
- Every visible string changes: nav, headings, buttons, chips, badges, empty states, toolbar
  placeholders, validation messages.
- No English text survives in the Thai UI and no Thai survives in the English UI.
- No raw key (`permit.*`, `history.*`, `certificate.*`, `platform.*`, `error.*`) renders in either.
- The selected locale button is visibly selected in both states.
- Data values — permit ids, dates, times, numeric readings — do **not** change with the locale. Dates
  stay in `Asia/Bangkok` in both.

---

### XX-SHELL-008 — The locale choice persists

Priority: P0 · Role: contractor · Viewport: 1280 · Locale: en
Preconditions: logged in as the F0 contractor

1. Switch to EN.
2. Check `localStorage.getItem('smart-work-permit:locale')`.
3. Reload the page.
4. Navigate to another screen and reload again.
5. Sign out, and read the login page.
6. Sign back in.

Expected:
- Step 2 returns `en`.
- The app stays in English through every reload, every navigation, the sign-out **and** the sign-in.
  Language is a device preference, not a session one — reverting to Thai on logout is a `fail`.
- The browser tab's document title is a **known exception**: route titles are hardcoded Thai strings in
  the router modules and are never passed through the translator, so the tab stays Thai even in EN.
  Record it as a **finding to raise, not a fail** — no item specifies localized document titles, but the
  owner should know. (`src/router/modules/*.router.ts`, `meta.title`.)

---

### XX-SHELL-009 — 375px: the mobile shell

Priority: P0 · Role: contractor · Viewport: 375 · Locale: th
Preconditions: logged in as the F0 contractor

1. Set the viewport to 375px wide.
2. Look at the topbar and the sidebar.
3. Press the hamburger.
4. Press a nav item.
5. Reopen the drawer and press the backdrop outside it.
6. Reopen and press the drawer's own close control.
7. On each of `/permits`, `/permits/create`, `/history`, `/certificates`, scroll the page fully and check
   for horizontal movement.

Expected:
- The sidebar is **off-screen**; a hamburger appears in the topbar.
- The hamburger slides the drawer in over a dimmed backdrop.
- Selecting a nav item navigates **and** closes the drawer.
- The backdrop closes it. The close control closes it.
- The app mark and tagline in the topbar truncate rather than pushing the hamburger or the locale
  switcher off screen.
- **No page scrolls the body horizontally.** Any wide content scrolls inside its own container.

---

### XX-SHELL-010 — 768px: still the mobile shell

Priority: P1 · Role: contractor · Viewport: 768 · Locale: th
Preconditions: logged in as the F0 contractor

1. Set the viewport to 768px and repeat `XX-SHELL-009` steps 2–7.
2. Then widen slowly through 900px and watch the sidebar.

Expected:
- At 768 the shell is still the **hamburger + overlay** one. That is correct — the breakpoint is 900px,
  not 768. Do not file "the sidebar is missing on tablet".
- Crossing 900px, the sidebar becomes a static column in the normal flow, the hamburger disappears, and
  the backdrop is gone. Nothing is left half-rendered mid-transition.
- Content grids that are two-up at desktop (certificate cards, wizard step-2 fields) behave sensibly at
  768 — one or two columns, but never clipped.

---

### XX-SHELL-011 — Tables and wide content scroll, they do not truncate

Priority: P0 · Role: contractor · Viewport: 375 / 768 / 1280 · Locale: th
Preconditions: logged in as the F0 contractor; F2 permits so History has rows

1. Open `/history` at 1280 and note the six table columns.
2. Resize to 768. Count the columns still reachable.
3. Resize to 375. Count again, then scroll the table sideways.
4. Open a History row's detail drawer at 375.
5. Open `/certificates` at 375 and check a card with a long worker name.
6. Open `/permits` at 375 and check a card with a long title and location.

Expected:
- **All six History columns remain reachable at every width**, by scrolling the table container
  sideways. No column is dropped, and no header is cut off with its data still rendered below.
- The table container scrolls; **the page body does not**.
- The drawer at 375 is usable, scrollable, and closable.
- Long text inside a card ellipsizes within its own box — it must not force the card wider than the
  viewport, and the full value must remain available (in the drawer, or on the detail screen once
  `PMT-010` lands).

---

### XX-SHELL-012 — 44px touch targets

Priority: P1 · Role: contractor · Viewport: 375 · Locale: th
Preconditions: logged in as the F0 contractor

Measure each control's rendered box in devtools (the element's own box, not its icon). The commitment is
**≥44px in the smaller dimension** for anything tapped on a phone.

1. Topbar hamburger.
2. Topbar locale buttons (EN and TH).
3. Sidebar close control (inside the open drawer).
4. Sidebar nav rows.
5. Sidebar logout control on the account card.
6. My Permits status filter chips.
7. History export button, the toolbar selects, the date pickers and the "clear" text button.
8. Certificates "Add certificate" button, and the modal's submit and file-picker controls.
9. Wizard Back / Next / Submit, and the step-1 type cards.
10. Any empty-state action button.

Expected:
- Every control listed measures ≥44px tall (and ≥44px wide where it is an icon button).
- **Source reading says several will fail.** The topbar hamburger is 36px, the drawer close 32px, the
  drawer logout 28px, the locale buttons ~22–24px, the History export button 38px, the Certificates add
  button 42px. The wizard footer buttons at 46px should pass. Measure and record each individually —
  this case's value is the per-control table, not a single verdict.
- Record one row per control: name, measured height × width, pass/fail. File **one** defect listing all
  the failures, not ten.
- Adjacent tap targets have enough separation that a thumb cannot hit two at once — note any pair that
  does.

---

### XX-SHELL-013 — The 404 and the not-permitted screens

Priority: P2 · Role: contractor · Viewport: 1280 / 375 · Locale: th, en
Preconditions: logged in as the F0 contractor

1. Navigate to `/definitely-not-a-route`.
2. Navigate to `/not-permitted`.
3. Navigate to `/not-available`.

Expected:
- Each renders its own localized page in the **blank** layout — no sidebar, no topbar.
- Each offers a way back into the app; the user is not stranded.
- Both locales translated; no raw key.
- At 375px each fits without horizontal scrolling.

---

### XX-SHELL-014 — A stale chunk after a deploy recovers itself

Priority: P2 · Role: contractor · Viewport: 1280 · Locale: th
Preconditions: a **built** app served from `bun run preview` (not the dev server), and the ability to
rebuild while the tab stays open

1. Load the app and sign in. Leave the tab open on My Permits.
2. Rebuild the app so the previous chunk filenames no longer exist.
3. In the still-open tab, navigate to History.
4. Watch the console and the `sessionStorage` keys.

Expected:
- The lazy chunk fails to load, and the router recovers by reloading the target URL — the user lands on
  History rather than on a blank page or a stack trace.
- The retry happens at most twice; a third failure stops rather than looping the browser.
- A `chunk-retry:` key appears in `sessionStorage` during the recovery.
- If this cannot be arranged in the run's environment, record `skip` with that reason — do not guess.

---

## Run record

Copy this table into `docs/testing/runs/<YYYY-MM-DD>-XX-SHELL.md`, fill it, and record the build under
test (`git rev-parse --short HEAD`), the tester, and the environment. `XX-SHELL-012` additionally needs
its per-control measurement table attached.

| Case | Result | Notes / defect id |
|---|---|---|
| XX-SHELL-001 | | |
| XX-SHELL-002 | | |
| XX-SHELL-003 | | |
| XX-SHELL-004 | | |
| XX-SHELL-005 | | |
| XX-SHELL-006 | | |
| XX-SHELL-007 | | |
| XX-SHELL-008 | | |
| XX-SHELL-009 | | |
| XX-SHELL-010 | | |
| XX-SHELL-011 | | |
| XX-SHELL-012 | | |
| XX-SHELL-013 | | |
| XX-SHELL-014 | | |

Every `fail` needs: steps to reproduce, expected vs actual, a screenshot, the browser console output and
the failing network request. A `fail` without a repro is a rumour.
