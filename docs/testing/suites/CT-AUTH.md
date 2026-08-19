# Suite CT-AUTH — Login, route guard, password reset, logout, session expiry

App: Contractor (`:8080`) · Master plan: `../../../../../docs/e2e/E2E-TEST-PLAN.md`
Format reference: `CT-PERMITS.md`.

**Executable today:** almost none of it. There is no contractor account, so every case that needs a
signed-in session is `blocked` on `E2E-000`.

**The one exception is `CT-AUTH-002`** — the role-refusal case. It is the *only* case in this repo that
runs today, because the fixture it needs is the account that already exists: `systemadmin@email.com`
(`safety_officer`). Run it first; it is also the rule that explains why nothing else here can run.

**Fixtures:** F0 (one account per role: `contractor`, `safety_officer`, `inspector`).

**Grounded in:** `src/pages/auth/**`, `src/router/index.ts`, `src/router/modules/Auth.router.ts`,
`src/resources/Interceptors.ts`, `src/composables/useApiError.ts`, `src/utils/HandleLoading.ts`.

**Not built in this area:** the forgot-password entry point. `ForgotPasswordPage` is **commented out** in
`src/router/modules/Auth.router.ts`, so `POST /auth/user/public/user-request-password-reset` has no UI
to call it (`CT-AUTH-005`, `not-built`). `/auth/reset-password` itself exists and is reachable, but only
with a hand-built `?token=` query.

**Result values:** `pass` · `fail` · `blocked` (a dependency or fixture is missing) · `not-built` (the
feature does not exist yet) · `skip` (with a reason). Never leave a case blank.

---

### CT-AUTH-001 — A contractor can sign in and lands on My Permits

Priority: P0 · Role: contractor · Viewport: 1280 / 375 · Locale: th, en
Preconditions: backend up on `:3000`; the F0 contractor credentials are documented and known to the
tester; browser has no existing session (use a fresh profile or clear cookies + localStorage first)

1. Open `http://localhost:8080/auth/login`.
2. **Before typing anything, note what the fields already contain.** A dev build pre-fills
   `smoke.contractor@example.com` / `password123` (`src/pages/auth/pages/login/composables/useInit.ts`).
   These are the smoke-test credentials, not necessarily the F0 ones — clear both fields.
3. Enter the F0 contractor email and password. Submit.
4. Watch the network tab for `POST /api/v1/auth/user/public/login`.

Expected:
- The login call answers `200` with `{ success, data: { token, user } }` — note that it is **not** the
  `{ message, data }` envelope every other endpoint uses; that is correct, not a defect.
- A success toast renders in the active locale, and the app navigates to `/permits` (My Permits).
- The sidebar account card shows the user's name or email.
- A session **cookie** is set (better-auth). The `Authorization: Bearer` header is *not* used — the
  returned token is stored client-side for the route guard only. Record the cookie name and its flags.
- At 375px the login card fits without horizontal scrolling.

Known gap: the sidebar account card renders a static account-type label and can never show an
organisation — the backend has no company concept (`docs/api/GAPS.md` row C). Absence is expected.

---

### CT-AUTH-002 — A safety officer or inspector is refused by this app's login

Priority: P0 · Role: safety_officer (and inspector, when F0 exists) · Viewport: 1280 · Locale: th, en
Preconditions: **none beyond a running backend.** Use the seeded `systemadmin@email.com` /
`password123` (`safety_officer`). Repeat with the F0 inspector account once `E2E-000` lands.

1. Open `/auth/login`.
2. Enter the safety-officer credentials. Submit.
3. Watch `POST /api/v1/auth/user/public/login` in the network tab.
4. Check `localStorage` / the persisted Pinia auth state, and the cookie jar.
5. Try to navigate directly to `/permits`.

Expected:
- The **login request succeeds (`200`)** — the refusal is client-side, in `LoginPage.vue`: the response's
  `user.role` is compared against `CONTRACTOR_ROLE` and a non-contractor is rejected before anything is
  stored. A `200` here is correct; do not file it.
- An error toast renders the localized `error.FORBIDDEN_ROLE` string. In `th` it must be Thai. **Any
  English sentence authored by the backend appearing here is a defect** — this app localizes from
  `errorCode` only.
- The app **stays on the login page**. No navigation to `/permits`.
- No auth token is persisted; step 5 bounces back to `/auth/login` via the route guard.
- Step 4 is a **finding, not a pass/fail**: the login succeeded server-side, so a better-auth session
  cookie may have been left in the jar even though the client refused the session. Record whether one
  is present and raise it with the product owner — it is not currently specified either way.

Why this is P0: this rule is the reason the whole contractor app is untestable today (master plan § 1,
B1). If it ever silently stops refusing, a safety officer gets signed into an app whose every screen
then 403s.

---

### CT-AUTH-003 — Wrong password is refused without wrecking the form

Priority: P1 · Role: contractor · Viewport: 1280 · Locale: th
Preconditions: F0 contractor account exists

1. Open `/auth/login`.
2. Enter the F0 contractor email with a deliberately wrong password. Submit.

Expected:
- `POST .../login` answers `401`.
- An error toast renders. The page does **not** reload and does **not** redirect — a 401 from an
  `/auth/` URL is deliberately exempted from the interceptor's logout-and-redirect branch
  (`src/resources/Interceptors.ts`). A page reload here would be a regression of closed gap 3.
- The email field keeps what was typed; the user can correct the password and retry.
- The toast text is localized. The login 401 carries no `errorCode`, so the expected string is the
  generic `error.unknown` in the active locale — **not** a backend-authored English sentence.

---

### CT-AUTH-004 — The route guard blocks every authenticated route

Priority: P0 · Role: anonymous · Viewport: 1280 · Locale: th
Preconditions: no session (fresh profile, or cleared cookies + localStorage)

1. Navigate directly to `/permits`.
2. Navigate directly to `/permits/create`.
3. Navigate directly to `/history`.
4. Navigate directly to `/certificates`.
5. Navigate directly to `/permits/some-nonexistent-id`.
6. Navigate to `/definitely-not-a-route`.

Expected:
- Steps 1–5 all redirect to `/auth/login`. None of them render a shell with empty data, and none flash
  the page content before redirecting.
- Step 6 renders the 404 page (blank layout), not the login page — the catch-all route has no
  `meta.auth`.
- No API call fires from a guarded page before the redirect.

Note for the tester: the guard tests `useAuthStore().userToken.accessToken`, which is *not* the real
credential (the credential is the session cookie). That split is what `CT-AUTH-007` and `CT-AUTH-008`
pull apart — do not conflate them here.

---

### CT-AUTH-005 — Requesting a password reset

Priority: P2 · Role: contractor · Viewport: 1280 · Locale: th
Preconditions: F0 contractor account exists

1. Open `/auth/login`.
2. Look for a "forgot password" link.

Expected:
- **`not-built`.** There is no forgot-password link and no forgot-password page: `ForgotPasswordPage` is
  commented out in `src/router/modules/Auth.router.ts`, so `requestPasswordReset()` on the auth provider
  has no caller. Record `not-built`; do not file it as a missing link defect.
- When it lands, this case becomes: submit the account email → the request returns
  `{ message: 'success' }` with **no `data` key** (that shape is correct, per closed gap 10) → a
  localized confirmation renders → the same confirmation renders for an unknown email, so the screen
  does not disclose which addresses exist.

Also record here how a tester is expected to obtain a real reset token — `E2E-000`'s fixtures F0–F6 do
not cover one, and `CT-AUTH-006` needs it. Until then that case runs only against an invalid token.

---

### CT-AUTH-006 — The reset-password screen, and its error surface

Priority: P1 · Role: contractor · Viewport: 1280 · Locale: th
Preconditions: none for steps 1–2. Steps 3–4 need a genuine reset token; there is no supported way to
get one today (see `CT-AUTH-005`) — record them `blocked` until `E2E-000` documents one.

1. Open `/auth/reset-password` with **no** `?token=` in the URL.
2. Open `/auth/reset-password?token=obviously-invalid-token`, enter a new password twice, submit.
3. With a genuine token, enter two passwords that do not match. Submit.
4. With a genuine token, enter a valid matching pair. Submit.

Expected:
- Step 1: an empty-state panel renders ("token invalid"), not the form, plus an error toast. The app
  does not crash on the missing query param.
- Step 2: the form **does** render (there is no token-probe endpoint — the token is only ever validated
  by the reset call itself; closed gap 9). The submit answers `400`.
- **Step 2 is the sharp one.** That `400` carries no `errorCode`, and `ResetPasswordPage.vue` calls
  `handleLoading(useResetPassword)` **without an error callback**, so it falls through to
  `HandleLoading.ts`'s default, which toasts `getErrorMessage(error)` — the **backend's own `message`
  string**. Every other screen in this app (`LoginPage`, `useWizard`, `useHistory`, `useCertificates`)
  passes `mapError` instead. **If a backend-authored English sentence appears in the toast, that is a
  `fail`** — record the exact toast text, the response body, and the network entry. Expected correct
  behaviour is the localized `error.unknown`.
- Step 3: the mismatch is caught client-side by the schema; no request fires.
- Step 4: the reset succeeds, a localized success toast renders, and the app routes to `/auth/login`.
  The new password then works in `CT-AUTH-001` and the old one does not.

The same defect shape applies to `useLogout` (`src/pages/auth/composables/useLogout.ts`), which also
passes no error callback — see `CT-AUTH-009`.

---

### CT-AUTH-007 — Session expiry: the cookie dies mid-session

Priority: P0 · Role: contractor · Viewport: 1280 · Locale: th
Preconditions: signed in as the F0 contractor, sitting on `/permits`

1. In devtools → Application → Cookies, delete the better-auth session cookie. **Leave localStorage
   alone** — the persisted auth token must stay.
2. Do not reload. Navigate in-app to `/history`.
3. Watch the network tab.

Expected:
- The route guard **admits** the navigation (it only checks the stored token, which is still there).
- The first API call from `/history` answers `401`.
- The interceptor logs out and performs a **hard** redirect (`window.location.href`) to `/auth/login` —
  a full page load, not an in-app route change. The persisted auth state is cleared.
- The user is not left on a page showing an infinite skeleton or an empty table.
- Record whether any return path is preserved. It is not today (the redirect is a bare
  `/auth/login`), so after signing back in the user lands on `/permits`, not on `/history`. That is a
  **finding to raise, not a fail** — nothing specifies deep-link restoration.

---

### CT-AUTH-008 — Session expiry: the stored token dies

Priority: P1 · Role: contractor · Viewport: 1280 · Locale: th
Preconditions: signed in as the F0 contractor

1. Clear the persisted auth entry from `localStorage` (leave the cookie).
2. Navigate in-app to `/certificates`.

Expected:
- The guard bounces straight to `/auth/login` — no API call fires at all.
- The two mechanics are visibly different from `CT-AUTH-007`: this one never reaches the network.

Record both results together; a tester who runs only one of these will misdescribe how this app expires.

---

### CT-AUTH-009 — Logout

Priority: P1 · Role: contractor · Viewport: 1280 / 375 · Locale: th, en
Preconditions: signed in as the F0 contractor

1. Open the sidebar (at 375px, via the topbar hamburger).
2. Press the logout control on the account card.
3. Watch the network tab.
4. After landing on the login page, press the browser Back button.
5. Navigate directly to `/permits`.

Expected:
- `POST /api/v1/auth/user/logout` fires and succeeds.
- The persisted auth state is cleared, the cookie is cleared, and the app routes to `/auth/login`.
- Step 4 does **not** restore a working session — the guard bounces back to login.
- Step 5 bounces to login.
- If the logout request **fails** (stop the backend first to force it), record what the toast says.
  `useLogout` passes no error callback, so the default handler toasts the backend's raw `message` —
  same defect shape as `CT-AUTH-006` step 2. A backend-authored English sentence on screen is a `fail`.
  Note also that a failed logout call means `authStore.logout()` never runs, so the user stays signed
  in; record whether that is what you observe.

---

### CT-AUTH-010 — An already-signed-in user cannot see the login form

Priority: P2 · Role: contractor · Viewport: 1280 · Locale: th
Preconditions: signed in as the F0 contractor

1. Navigate directly to `/auth/login` (address bar, or a bookmark).

Expected:
- The app immediately replaces the route with `/permits`. The login form does not render, not even
  briefly enough to type into.
- `history.back()` from there does not return to the login form.

---

### CT-AUTH-011 — Both locales, on every auth screen

Priority: P1 · Role: contractor / anonymous · Viewport: 1280 · Locale: th, en
Preconditions: none

1. On `/auth/login` with locale `th`, read every visible string: title, subtitle, both field labels,
   the submit button, and the validation errors from submitting an empty form.
2. Switch the locale to `en` (the switcher is in the topbar; on the blank auth layout, set it from
   another page first, or set `localStorage['smart-work-permit:locale']` and reload).
3. Repeat on `/auth/reset-password` (with and without a token).
4. Trigger the role refusal from `CT-AUTH-002` in each locale.

Expected:
- No raw i18n key (`platform.auth.*`, `error.*`) renders anywhere.
- No English string renders while the locale is `th`, and vice versa.
- The `error.FORBIDDEN_ROLE` toast is translated in both.
- Nothing shifts layout enough to clip a label — Thai strings are frequently longer.

---

## Run record

Copy this table into `docs/testing/runs/<YYYY-MM-DD>-CT-AUTH.md`, fill it, and record the build under
test (`git rev-parse --short HEAD`), the tester, and the environment.

| Case | Result | Notes / defect id |
|---|---|---|
| CT-AUTH-001 | | |
| CT-AUTH-002 | | |
| CT-AUTH-003 | | |
| CT-AUTH-004 | | |
| CT-AUTH-005 | | |
| CT-AUTH-006 | | |
| CT-AUTH-007 | | |
| CT-AUTH-008 | | |
| CT-AUTH-009 | | |
| CT-AUTH-010 | | |
| CT-AUTH-011 | | |

Every `fail` needs: steps to reproduce, expected vs actual, a screenshot, the browser console output and
the failing network request. A `fail` without a repro is a rumour.
