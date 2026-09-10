## Read this FIRST — the prompt & decision log

`docs/main/PROMPT-LOG.md` is **required reading before you implement anything in this repo.** It is the
base knowledge for this project: the product owner's instructions in their own words, and every
ruling they gave when an agent hit an ambiguity — including the option that was *rejected*, which is
what you would otherwise "fix" back. Code and `progress.md` say what was built; `PROMPT-LOG.md` says
why, and what you are not allowed to re-decide.

If your change contradicts a ruling in that file, stop and raise it — do not implement over it.

## Read this first — Project skill

Before doing any non-trivial work in this repo, read the project skill index at `{.agents, .claude}/skills/project-conventions/SKILL.md` and then load the relevant topic file under `{.agents, .claude}/skills/project-conventions/reference/`. The skill is the canonical convention set for this codebase (one H2 topic per reference file): coding style, naming, architecture, forms, providers, stores, composables, styling, testing, etc. Pull from it rather than inventing a parallel pattern.

## Working across repos

This app is one of three repos in the e-safework workspace (`../`): this one, the Safety Officer
+ Inspector app (`../smart-work-permit-frontend`), and the single backend (`../smart-work-permit-api`).
**If your change touches a route, payload, `errorCode`, role or the permit status machine, read
`docs/main/CONTEXT.md` first** — it owns the cross-repo contract rules, the openapi propagation procedure,
and the `node scripts/check-contract-sync.mjs` glue check. Everything inside this repo stays governed
by this file and `feature_list.json`.

**Cross-repo consistency obligation.** A change here that makes a statement in another repo false —
the API, the Safety Officer/Inspector app, or the landing page — must be corrected there in the same
session. See `docs/main/CONTEXT.md` §"Cross-repo consistency". `check-contract-sync.mjs` only covers
four files (`CONTEXT.md`, `PROMPT-LOG.md`, `openapi.json`, plus its own script copy); everything else
is the author's responsibility.

## What this repo is

**e-safework — Contractor web app.** Responsive web app (desktop/tablet first, must not break at 375px) where contractors draft, submit, and track their own work permits for a Thai industrial facility.

Specs live in `docs/main/`:

| File | What it is |
|---|---|
| `docs/main/dev-handoff/00-SHARED-CONTEXT.md` | Product model, roles, permit lifecycle, safety ranges, business rules. **Source of truth for *what*.** |
| `docs/main/dev-handoff/02-contractor-web-vue-tasks.md` | Scope for **this** repo. |
| `docs/main/dev-handoff/01-backend-elysia-tasks.md` | Backend endpoints + error `code`s this app calls. |
| `docs/main/SmartWorkPermit-v3.dc.html` | High-fidelity design prototype — UX, layout, copy (EN + TH). **Reference, not code to port.** |

Two sibling apps exist in **other repos** and are **out of scope here**: the Safety Officer + Inspector app (`03-safety-inspector-web-vue-tasks.md`) and the Elysia backend. Never build safety-officer or inspector screens in this repo.

> **State of the codebase (2026-08-19):** this repo started as a lending-app template; the lending domain has been fully removed and `./init.sh` is **green** (typecheck + lint + 336 tests + a live API contract check).
>
> Built: the app shell, i18n (en/th, default th), the design system, the API error-code layer, the permit domain + provider + My Permits list, the **`history` module** (`feat-003` — route registered, filters, CSV export, drill-in drawer), and the certificates module.
> Built: `PermitCreatePage` — the 6-step wizard is **complete** (`PMT-004`–`PMT-009`). Every step has a real zod schema that gates Next; there are no `z.object({})` placeholders left. Submit really calls `POST /permits/:id/submit` and navigates to `/permits/:id?submitted=1` (that query param is what triggers the detail page's one-shot "submitted" banner — nothing else sets it). On a 400 the wizard drives off the backend's `failures[]` / `certificateFailures[]` arrays and highlights **every** failing reading on step 3 and every refused worker on step 4, localized off `errorCode` — the server's verdict wins over any client-side gate. Two step-3 shapes have no wire field and are deliberately not persisted: the Yes/No/N-A checklist (`GAPS.md` row J) and `so2` (row K).
> Built 2026-08-22: `PermitDetailPage` (`PMT-010`–`PMT-013`) — per-status banners, info card, read-only audit
> timeline, QR panel (`ACTIVE`/`FIRE_MONITOR` only), the closure checklist modal and the Hot Work Fire Watch
> countdown, plus all six sections of `docs/main/dev-handoff/05-permit-detail-sections.md`. The step-2 location
> zone picker mirrors the Safety app's zone vocabulary and writes **canonical English** into the free-text
> `location` — a Thai value splits the pin across the two apps.
>
> Built 2026-08-23 (`PLT-012`): `/profile` — the contractor's own account, reached from the drawer's
> account card. Name and phone are editable via `PATCH /users/me`; email, role and the company record
> are read-only. **There is no role or activation control on that page and a test enforces it** —
> `PATCH /users/me` does not declare `permitRole` or `active`, and that allow-list is the privilege
> boundary. `GAPS.md` row C (no company concept) is closed as **will not exist**: the system is
> single-tenant, so `contractorProfile.firmName` is the contracting firm and is descriptive only —
> nothing may be scoped by it.
>
> Built 2026-08-23 (`PMT-014`, `CRT-004`): a DRAFT is resumable — `/permits/:id/edit` and
> `/permits/:id/duplicate` exist and `PMT-010`'s two banner CTAs are live, no longer disabled. Editability is
> settled by a real empty-body `PATCH` and deferred to the server, because **`REJECTED` is editable too** (a
> client-side "DRAFT only" check is wrong). There is **no clone route on the wire**, so Duplicate is client-side
> `POST` + `PATCH`; `safetyReading` **appends** a row per PATCH, so hydration seeds `lastPersistedReading` or a
> resumed edit logs a duplicate reading.
>
> Two earlier holes are **closed**, do not re-report them: `GAPS.md` row **H** — `POST /permits/:id/close` now
> admits `contractor` scoped to their own permit (`feat-020`), so `PMT-011`'s modal works end to end. Still
> open: row **I** (entrant *names* are not readable by the permit owner — the count is), and rows **G**, **J**,
> **K**, all of which need a backend field before any frontend work is possible.
>
> Built 2026-08-31 (`feat-023`, wayfinder ticket 015): the contractor position picker. The wizard's
> `position` step (7th, between JSA and Review) only appears once `GET /facility-plans/active` resolves a
> plan — the current no-plan production state is unchanged, and this is the half that had to ship before
> the Safety app could ever activate one (`PERMIT_POSITION_REQUIRED` would otherwise lock out every
> contractor). A click/tap on the plan `<img>` converts to `planX`/`planY` percentages via
> `src/utils/PlanPosition.ts` (unit-tested) from the element's rendered rect at click time, never a
> hardcoded size. `position` follows the same DRAFT/REJECTED editability window as the rest of the form —
> no separate rule — and a permit frozen against an older plan version resolves THAT version via
> `GET /facility-plans/:id`, never the active one, with an "older version" note. `usePlanPosition`
> mirrors `useCertificatePreflight`'s shared-instance pattern exactly: one fetch, gates both the step's
> Next and the Review row, never blocks on `'loading'`/`'none'` — only a confirmed `'fail'`.
>
> **The providers are live against the real backend** (`feat-005`, 2026-08-17). Every `USE_STUB_DATA` flag and both `*.mock.ts` files are gone; `VITE_APP_API_URL` points at the API and auth is a **better-auth session cookie**, not a bearer token.
>
> Before changing anything under `src/resources/` or `src/models/`, read `docs/main/dev-handoff/04-api-contract.md` — and treat `docs/api/openapi.json` (generated from a live boot, never hand-edited) as the authority over it. `01-backend-elysia-tasks.md` is the older *plan*; where the two disagree, the contract wins.

## Commands

Package manager is **bun** — do not invoke `npm`/`yarn`/`pnpm`.

```bash
bun install            # install deps
./init.sh              # FULL verification gate: typecheck + lint + tests + live API smoke (run before claiming done)
node scripts/smoke-api.mjs                 # contract check against a running API; skips (exit 0) if none
API_URL=… SMOKE_EMAIL=… node scripts/smoke-api.mjs   # point it elsewhere / use another contractor account

bun run dev            # vite dev server on 0.0.0.0:8080
bun run build          # typecheck + production build
bun run build:alpha    # vite build --mode development
bun run build:staging  # vite build --mode staging
bun run preview        # preview built bundle

bun run typecheck      # vue-tsc --noEmit -p tsconfig.app.json
bun run lint           # eslint .
bun run lint:fix       # eslint . --fix
bun run test           # vitest --watch
bun run test:run       # vitest run (CI mode)
bun run test:coverage  # vitest run --coverage
bunx vitest run path/to/file.test.ts   # single file
bun run test:playwright                # playwright e2e
```

ESLint also runs **inside Vite** via `vite-plugin-eslint2` — lint errors surface during `dev`/`build`, not only via `bun run lint`.

Husky `pre-commit` runs `lint-staged` → `eslint --fix` on staged `*.{js,jsx,ts,tsx,vue}`.

## Modules

> **Maintenance rule — this table is part of the main flow.**
> When a change adds, removes, or renames a module, changes its route prefix, or changes which provider a module talks to, **update this table in the same commit**. A stale map costs every later session more than the edit costs now.

Each module owns parallel trees: routes (`src/router/modules/<Mod>.router.ts` or `src/router/modules/<mod>/`), pages (`src/pages/<mod>/`), providers (`src/resources/provider/<feature>/`). Route prefix comes from the `const prefix` at the top of each module's router file.

| Module | Prefix | Pages (`src/pages/<mod>/pages/`) | Providers | Harness | Built? |
|---|---|---|---|---|---|
| `platform` | `/auth` | `auth/login` ✅, `auth/reset-password` ✅, layout shell, i18n, API errors | `auth/public`, `auth/private`, `notification` | `docs/modules/platform/` | shell + i18n + errors + contractor auth/route guard (`PLT-005`) ✅ · notification polling `PLT-007` ✅ |
| `permit` | `/permits` | `list` ✅, `create` (7-step wizard) ✅, `detail` ✅ | `permit`, `facility-plan` (read-only — `getActive`/`getById`, no upload/create/activate), `area` (list/getById/create — no approve/reject, safety-officer only) | `docs/modules/permit/` | provider + list ✅ · wizard complete, all seven steps real (`PMT-004`–`PMT-009`, `feat-023`) · detail built (`PMT-010`–`PMT-012`: banners, QR, audit timeline, closure modal, Fire Watch countdown) · area picker + propose-inline (wayfinder 037), read-only display of an area outside the contractor's scoped list (wayfinder 044) |
| `history` | `/history` | `list` ✅ | `permit` (reused — no own provider dir) | `docs/modules/history/` | ✅ |
| `certificate` | `/certificates` | `list` ✅, `detail` ✅, `edit` ✅ | `certificate`, `upload` (reused — `getFileUrl` for the attachment) | `docs/modules/certificate/` | ✅ list/add · detail + edit + real attachment display (`CRT-005`/`CRT-006`, wayfinder 057) |
| `worker` | `/workers` | `list` ✅, `detail` ✅ | `worker` | none yet — wayfinder 062 | ✅ paginated/searchable list with certificate status + permit count, editable identity, certificates/permits sections, QR card (`worker.id` as the bare payload string) |
| `api-integration` | — (cross-cutting) | — | every provider + the transport | `docs/modules/api-integration/` | ✅ transport, auth, errors, permit/certificate/notification/upload |

Registered in `src/router/index.ts`: `AuthRouter`, `PermitRouter`, `HistoryRouter`, `CertificateRouter`, `WorkerRouter` — all five nav destinations now exist. `AppDrawer`'s `isRegistered()` guard is **still in the file** (`AppDrawer.vue:44`, `:136`) and now guards nothing; removing it is safe but nobody has, so do not describe it as gone.

**Modules without a top-level router entry:**

- `common` — `not-found`, `not-permitted`, `not-available` at `src/pages/common/pages/`. Routes declared inline in `src/router/index.ts`, all `meta.layout: 'blank'`.

**Why `history` is its own module:** it owns a route prefix and a pages tree but reuses the `permit` provider. Split for context-budget reasons — its filters/CSV/table work is independent of the wizard.

### Main flow (permit lifecycle)

The spine most changes touch. Break a step here and the app's core path breaks:

```
DRAFT ──submit──> PENDING ──reject──> REJECTED ──(revise)──> DRAFT
                     │
                  approve
                     ▼
                  ACTIVE ─────────close────────> CLOSED
                     │                              ▲
              mark-complete (hot work only)         │
                     ▼                              │
               FIRE_MONITOR ──30 min elapsed────────┘

  PENDING / ACTIVE ──work end-time passes──> EXPIRED   (terminal)
```

Contractor-app journey across that machine:

```
/permits (list)
  → /permits/create  (7-step wizard: Type → Basic Info → Safety Checks → PPE & Workers → JSA → Plan Position → Review)
    → submit                                   [DRAFT → PENDING]
      → /permits/:id  (status banner, QR when ACTIVE/FIRE_MONITOR, audit timeline)
        → mark-complete (hot work)             [ACTIVE → FIRE_MONITOR]
        → closure checklist modal + e-signature [→ CLOSED]
/history  → filters + CSV export → drill in to /permits/:id
/certificates → cert validity gates permit submission
```

Cross-cutting on this path: `stores/Auth.ts` (token), `stores/Notification.ts` (polling), `resources/Interceptors.ts` (401 → logout), the i18n locale store, and the safety-range constants. A change to any of those is a main-flow change — re-read this section and update it if the flow moved.

### Business rules that must not drift

These are duplicated from `00-SHARED-CONTEXT.md` because they gate code, not prose. **The backend is authoritative** — client checks are convenience only; always treat the submit/approve response as truth.

| Permit type | Required readings | Pass range |
|---|---|---|
| Hot Work (`hot`) | LEL, O₂ | LEL `= 0%` · O₂ `19.5–23.5%` |
| Confined Space (`confined`) | LEL, O₂, CO | LEL `= 0%` · O₂ `19.5–23.5%` · CO `≤ 50 ppm` |
| Working at Heights (`heights`) | Wind | Wind `≤ 25 km/h` |

- LEL/O₂/CO checks are skippable **only** when the permit is flagged `outdoorWork: true`.
- Out-of-range blocks "Next" in the wizard with **no override**. Surface the specific failing reading.
- SO₂ is carried through as a field (Confined Space gas log) but has no hard block modeled.
- **Closure is blocked** (backend returns `403`) when: any Confined Space entrant is still checked in (`ENTRANTS_STILL_INSIDE`), or Hot Work Fire Watch has not elapsed 30 min (`FIRE_WATCH_NOT_ELAPSED`).
- **Certificates gate submission.** Any registered worker with a missing or expired certificate blocks submit (`CERT_EXPIRED`).
- Backend error responses are `{ code: <http status>, message, errorCode? }`. The machine-readable discriminator is **`errorCode`** — `code` is the numeric HTTP status. There are **25** codes (`src/enums/modules/error/ApiErrorCode.enum.ts`) — the last four (`FILE_TYPE_NOT_ALLOWED`, `FILE_TOO_LARGE`, `UPLOAD_FOLDER_NOT_ALLOWED`, `STORAGE_UNAVAILABLE`) were added by the backend's 2026-08-19 upload-hardening pass — and 404s / ownership 403s / validation 400s carry **none**, which is normal. **Localize off `errorCode`** — never render the backend's `message`.
- `POST /permits/:id/submit` answers **400** with the *first* failing code and a `message` that joins every failure with `; `. Render mapped codes, never that string.
- **`PATCH /permits/:id` collection semantics** (this destroys data when it drifts): `jsaSteps` and `workers` are **replaced wholesale** — always send the complete list; `safetyReading` (singular) **appends** a reading; `photos` **upsert by `slotKey`**.
- `workDate` is sent as `YYYY-MM-DD` and returned as a full ISO timestamp. Format for display; never round-trip the response value into a date input.
- A contractor is scoped to their own permits server-side; reading someone else's is a 403. Do not filter by owner client-side, and do not rely on being able to.
- Timestamps are UTC server-side; display in `Asia/Bangkok`.

## Design system

The design prototype's palette **replaces** the template's existing brand colors in `src/assets/css/tailwind.css` (`--color-primary-*` red `#BD0102`, `--color-secondary-*` navy `#4160BE`). This is a swap, not an addition — see `docs/modules/platform/` item `PLT-002`.

| Token | Hex | Used for |
|---|---|---|
| Primary / danger | `#C81E2C` | Brand primary, required-field `*`, blocked banners, "inside" alerts |
| Accent orange | `#F26B1D` | Topbar accent border, logo mark, map pin |
| Success green | `#1A7B4E`¹ (dark `#176B45`, bg `#E4F4EC`, border `#B7E0CA`) | Safe atmosphere, Active status |
| Pending amber | `#9A5C00`¹ (bg `#FFF3DC`) | `PENDING` status badge only |
| Heights amber | `#926A09`¹ (bg `#FFF8E1`) | Working-at-Heights **type** chip/icon only |
| Confined-space purple | `#7C3AED` (bg `#F1E9FE`) | Confined Space type chip/icon |
| Hot-work red bg | `#FCE9EB` | Hot Work type chip/icon |
| Shell dark | `#111418` (topbar) · `#16191D` (sidebar, headings) | App chrome |
| Sidebar text | `#C2CAD2` · muted `#6B7681` | Nav |
| Body text | `#16191D` primary · `#5B656F` secondary · `#636E79`¹ tertiary · `#65717D`¹ quaternary | Content |
| Surfaces | `#F7F8FA` main bg · `#F4F6F8` · `#EEF1F4` · `#fff` cards | Backgrounds |
| Borders | `#E1E6EB` · `#D7DCE2` · `#CBD2D9` | Dividers, card borders |

**Never hardcode a hex.** Every color above is a `@theme` token in `src/assets/css/tailwind.css`:
`--color-primary-*`, `--color-accent-*`, `--color-status-{draft,pending,active,fire-monitor,closed,rejected,expired}-{fg,bg,border}`, `--color-permit-type-{hot,confined,heights}-{fg,bg}`, `--color-shell-*`, `--color-text-*`, `--color-surface-*`, `--color-border*`. Use the token; if one is missing, add it to `tailwind.css` rather than inlining a hex.

¹ Darkened from the original brief's `#1E8E5A`/`#B26A00` (wayfinder 026, 2026-09): both measured below WCAG AA's
4.5:1 against their status backgrounds (3.64:1 and 3.86:1 respectively). The sweep also darkened
`--color-status-fire-monitor-fg` (`#F26B1D` → `#BB4B0B`), `--color-status-fire-monitor-fg-emphasis`
(`#E8590C` → `#A53F09`), `--color-status-expired-fg` (`#8B95A0` → `#5B656F`, reusing
`--color-text-secondary`'s value), and `--color-permit-type-heights-fg` (`#B8860B` → `#926A09`,
found while building the gate below, not one of the ticket's two named pairs) — none of which had
a row of their own in this table before now. `--color-text-tertiary`/`--color-text-quaternary`
were also sub-AA (`#8B95A0` was 2.86:1 on `--color-surface-app`, 4.08:1 on the darker
`--color-surface-muted`; `#A4ADB6` was 2.27:1 on white) and are real body text at dozens of call
sites, not decoration — darkened to `#636E79`/`#65717D`. Those two land only a few RGB units
apart: this app's surface set cannot hold four AA-passing text tiers below primary/secondary, so
treat tertiary and quaternary as visually near-identical going forward rather than adding a fifth,
lighter grey that would just fail again.
`scripts/check-contrast.mjs` now asserts every status/semantic pair on every build so a future
regression here fails loudly instead of waiting to be found by hand.

`--color-status-expired-fg`'s wayfinder-026 value above (`#5B656F`, reusing
`--color-text-secondary`) is now stale: wayfinder 027 (2026-09) found that it made EXPIRED share
DRAFT's exact fg (`#5B656F`) with only a 2.70 ΔE bg difference — both AA-passing individually, but
visually colliding chips. EXPIRED's fg is now `#16191D` (reusing `--color-text-primary` instead),
and CLOSED's bg moved from `#EEF1F4` to `#F4F6F8` so the DRAFT/CLOSED/EXPIRED trio reads as three
deliberately distinct neutral weights. DRAFT/CLOSED/EXPIRED chips also each render a small
non-colour glyph (pencil/check/`!`) via `PermitStatusGlyph.vue` for colour-blind/greyscale
legibility. `scripts/check-contrast.mjs` gained a CIE76 ΔE all-pairs check (threshold 6) alongside
the WCAG ratio check so a future pair that passes AA individually but collides visually with
another status also fails the build.

> Tailwind v4 only emits `@theme` variables that a scanned utility class actually references. A token that no class uses will not appear in the compiled CSS — that is expected, not a bug.

**Typography (resolved):** body face stays `LINE_Seed_Sans_TH` (already self-hosted, five weights, in `public/assets/fonts/`). `--font-mono` is currently a websafe stack (`ui-monospace, 'SF Mono', Menlo, monospace`) — the design specifies `IBM Plex Mono` for permit IDs, timestamps, and numeric readings, but its woff2 files are not in the repo. **No CDN or Google Fonts import** — this app runs inside an industrial facility. Self-host IBM Plex Mono to close the gap.

## Architecture

### Entry & plugin registration

`src/main.ts` → `registerPlugins()` in `src/plugins/index.ts`. Plugins compose onto the Vue app in order: router → pinia → PrimeVue (`unstyled: true`). Adding a global plugin means editing `plugins/index.ts`, not `main.ts`.

PrimeVue runs in **unstyled** mode — all component styling lives in `src/volt/` PassThrough (PT) wrappers using Tailwind v4 classes. Never re-enable PrimeVue's default theme.

### Volt auto-import

`unplugin-vue-components` is configured in `vite.config.ts` with `dirs: ['src/volt']` and `dts: true`. Every `.vue` file in `src/volt/` is globally available with no import statement — `components.d.ts` is regenerated automatically. To add a Volt component, scaffold into `src/volt/` (the project uses `volt add <ComponentName>` per the skill); do **not** add an explicit import.

`src/volt/**/*` is excluded from ESLint (`eslint.config.js`).

### Router

`src/router/index.ts` boots an HTML5-history router, sets `document.title` from `route.meta.title` in `afterEach`, and is wired into the app via plugins. The auth guard is **live**: `beforeEach` redirects to `LoginPage` when `meta.auth` is set and `useAuthStore().userToken.accessToken` is empty. `onError` also retries chunk-load failures up to twice (post-deploy stale-chunk recovery), tracked in `sessionStorage`.

Per-domain routes belong in `src/router/modules/<Domain>.router.ts` and merge into the top-level `routes` array. All page components must be lazy-loaded (`(): ComponentOptions => import(...)`). See skill reference `router-conventions.md` for `meta` fields (`layout`, `auth`, `title`, `menu`, `icon`, `root`).

> ⚠ **This project is on vue-router 5.x, not 4.x.** An unregistered route name fails hard, not with the soft dev-time warning vue-router 4 gave you. Both behaviours below were observed empirically, not inferred — and they differ:
>
> | Call site | What actually happens |
> |---|---|
> | `<RouterLink :to="{ name: 'Foo' }">` | Resolved at **render/setup** → **throws and blanks the entire page** |
> | `router.push({ name: 'Foo' })` | Rejects at **runtime** → uncaught page error / unhandled rejection. The page keeps rendering, but the control is dead |
>
> Consequences:
> - Never reference a route name that is not yet in `src/router/index.ts`. Build the route and the link in the same change, or guard the link.
> - **Check the router file, don't grep for the name** — a commented-out route still matches a naive grep. `ForgotPasswordPage` is still commented out in `Auth.router.ts` (verified 2026-08-19) and does **not** exist; grepping made it look registered. `LoginPage` and `ResetPasswordPage` are the only two auth routes.
> - `AppDrawer.vue` guards its nav with `isRegistered(name)` (backed by `router.hasRoute()`), rendering an inert `<span>` for routes that do not exist yet. It was added because `HistoryListPage` did not exist until `feat-003`; **all four nav routes are registered now, so the guard is dead code** — it is safe to delete and still present. Note it is not free: `router.hasRoute()` is read once at render and is **not reactive**, so registering a route needs a **full page reload**, not a Vite HMR update, before the drawer picks it up.
> - Declare static segments before dynamic ones: `/create` must come before `/:id` or `create` is captured as an id.

### Layout switching

`App.vue` reads `route.meta.layout` (`'default' | 'blank'`) and renders the matching layout from `src/layouts/`. New layouts require both a new file in `src/layouts/` and a branch in `App.vue`'s template/computed.

### HTTP layer

All API access goes through `src/resources/HttpRequest.ts` (axios wrapper) + `src/resources/Interceptors.ts`. Base URL comes from `import.meta.env.VITE_APP_API_URL`. Interceptors handle 401 → logout + redirect to `/auth/login`. There is **no** case conversion: the API is camelCase end to end and `humps` was deleted in `API-002` because camelizing rewrites the user's own keys inside `closureChecklist`. Do not reintroduce it.

New API surfaces extend `HttpRequest`, implement a typed `I<Name>Provider` interface, set a `urlPrefix`, and export as default. Provider files live under `src/resources/provider/<feature>/<Name>.provider.ts`. Request/response types live in `src/models/request/` and `src/models/response/` (plus `src/models/modules/`).

When instantiating a provider in a page or composable, always declare with the typed interface and a `Service` suffix:

```ts
// correct
const PermitService: IPermitProvider = new PermitProvider()

// wrong
const provider = new PermitProvider()
const permitProvider = new PermitProvider()
```

### State (Pinia)

Setup-store pattern only — `defineStore('name', () => { ... })`. Persist via `pinia-plugin-persistedstate` configured in `src/plugins/Pinia.plugin.ts`. Existing stores: `useAuthStore` (`stores/Auth.ts` — token), `useLoadingStore` (`stores/Loading.ts`), `useNotificationStore` (`stores/Notification.ts`).

### Path alias

`@/` → `src/`. Enforced for all src imports; relative paths beyond one level are forbidden by convention.

## TypeScript & lint rules that bite

ESLint config (`eslint.config.js`) enforces beyond defaults:

- **Explicit return types** on every function and arrow function (`@typescript-eslint/explicit-function-return-type`, `allowTypedFunctionExpressions: false`).
- **Inline `import type`** required for type-only imports (`@typescript-eslint/consistent-type-imports`, `fixStyle: 'inline-type-imports'`).
- **Typed arrow parameters** (`@typescript-eslint/typedef`, `arrowParameter: true`, `parameter: true`).
- **No `console.log`** — use `console.error` / `console.info` (project convention).
- **Single quotes, no semicolons, 2-space indent, no trailing commas** (`@stylistic/*`).
- **Vue:** block order = `template, script, style`; `defineProps`/`defineEmits` must be type-based; `vue/max-len` = 150; `v-bind` shorthand required; `v-on` handlers inline (`@click="fn($event)"`, not `@click="fn"`).
- `src/volt/**`, `vite.config.ts`, `index.html`, `dist/**`, `docs/**`, `.agents/**`, `.claude/**`, `.gemini/**`, `scripts/**` and root-level `__*` probe scripts are all ignored (`eslint.config.js`). `bun run lint` is clean — the "~3140 lint errors from unignored docs" note that used to sit here was fixed in `PLT-001` and is gone.

Satisfy these up front when writing code — Vite will fail loudly via `vite-plugin-eslint2`.

## Tests

Tests live in **`src/tests/`**, mirroring the source tree (`src/tests/pages/<module>/<page>/…`,
`src/tests/utils/…`, `src/tests/composables/…`). `vitest.config.ts` **excludes `src/pages/**/tests/**`**,
so a test written next to the page it covers silently never runs — put it under `src/tests/`.

Page-level tests mount the real page with `@vue/test-utils` and spy on the provider prototype
(`vi.spyOn(PermitProvider.prototype, 'list')`); there is no mock gateway in this repo (deleted in
`feat-005`). Three worked examples to copy: `src/tests/pages/auth/login/LoginPage.test.ts`,
`src/tests/pages/history/list/HistoryListPage.test.ts`, `src/tests/pages/permit/detail/PermitDetailPage.test.ts`.
Three things bite every time:

- **Mount `@/plugins/I18n.plugin` itself and call `setLocale('en')`** — not a fresh `createI18n`.
  `useApiError()` localizes through that singleton, so a separate instance leaves `mapError()`
  answering in Thai (the app default) while the page renders English.
- **Register every route name the page can navigate to** in the test's `createRouter`. On
  vue-router 5 an unknown name throws and blanks the mount.
- **`vi.mock('@/plugins/toast', …)`** — `toast` wraps PrimeVue's ToastService, which a bare mount
  does not register. Mocking it is also how you assert the invariant that the backend's `message`
  never reaches the user.

## Naming (file conventions)

- Components: `PascalCase.vue`
- Composables: `useName.ts` (`use` prefix, camelCase filename)
- Stores: `Name.ts` (PascalCase filename, no `Store` suffix; exported function is `useNameStore`)
- Utils: `Name.ts` (PascalCase)
- Models: `Name.model.ts` · Enums: `Name.enum.ts`
- Providers: `Name.provider.ts` · Router modules: `Name.router.ts` · Schemas: `Name.schema.ts`
- Type prefixes: `I<Name>` interfaces, `T<Name>` aliases, `E<Name>` or `<Name>Enum` enums

## When in doubt

Consult the topic file under `.claude/skills/project-conventions/reference/`. Quick map:

- Forms → `form-patterns.md` (`@primevue/forms` + `zodResolver` — never raw `safeParse`; `useCreate`/`useUpdate`/`useDelete` pattern for API actions)
- Pagination, date, copy, tabs, debounce → `composables.md`
- Formatter, keypress guards → `utility-functions.md`
- Responsive Tailwind, PT wrappers → `styling-rules.md`
- Domain page layout → `directory-structure-conventions.md` and `component-patterns.md`
- Delete confirmations → `component-patterns.md` (`DeleteModal` — never inline)
- API providers → `resources-api-layer.md` and `provider-pattern.md`
- Models → `model-conventions.md`
- TypeScript rules → `typescript-rules.md`
- Naming → `naming-conventions.md`

Use the skill rather than inventing a parallel pattern.

## Agent harness

> **Full guide:** `docs/GUIDE.md` — harness layout, startup path, definition of done, end-of-session routine.

### Startup Workflow

Before writing code:

1. Run `./init.sh` (typecheck + lint + tests + live API smoke) to see the current baseline. **It is green today** (2026-08-19: typecheck PASS, lint PASS, vitest 31 files / 336 tests PASS, smoke skips with no API reachable). Anything red is yours — compare against the latest entry in `progress.md` before assuming otherwise.
2. Read root `feature_list.json` — pick the module-level feature whose `dependencies` are all `done`.
3. Read that module's `docs/modules/<module>/context.md` and `feature_list.json`.
4. Pick ONE item from that module whose `dependencies` are all `done`. Read only that item's `context.md` + `progress.md` if they exist. Do not load sibling items.

### Stay in scope

- **One feature at a time** — implement only the active item, and only one item per session.
- Do not start an item whose dependencies are not `done`.
- Do not touch code outside the active item.
- Do not build safety-officer or inspector screens — different repo.
- Do not add a new dependency without flagging it to the user first (items that need one say so explicitly).

### Definition of Done

- The item is `done` only when `./init.sh` passes **clean** — typecheck, lint, vitest, and the live API contract check (`scripts/smoke-api.mjs`).
- The smoke step skips (exit 0) when no API is reachable, so the gate works offline. But any change to a provider, model or interceptor is **not verified** until it has run against a live backend: `cd ../smart-work-permit-api && bun run dev`. A green vitest alone only proves the app agrees with its own types.
- Record the passing command output in the item's `evidence` field in its module `feature_list.json`.
- If the change touched module wiring (new/renamed/removed module, changed route prefix, new provider dir) or the permit lifecycle, the [Modules](#modules) table and main-flow diagram must match reality before the item is `done`.

### Running several agents in parallel

Learned the hard way on 2026-08-15. If you fan work out across concurrent agents:

- **Give every agent an explicit owned-files list and an explicit must-not-touch list.** Disjoint file ownership is the whole mechanism; without it agents silently overwrite each other.
- **Never let an agent edit `src/router/index.ts`.** Every route-adding agent wants it. Have each write its own `<Domain>.router.ts` and register them yourself after the wave.
- **The same applies to any shared file** — `src/assets/css/tailwind.css`, `src/utils/Schema.ts`, `eslint.config.js`, `src/stores/Auth.ts`. One owner per wave, or nobody.
- **Locales are split per namespace** (`src/locales/{en,th}/<module>.ts`) *because* of this. That solves cross-module collisions but **not** intra-module ones: do not hand four agents the same module's locale file. The wizard steps (`PMT-005`–`009`) all write `permit.ts` and the same page tree — they must run serially or be split further first.
- **Never run `pkill -f vite`.** Agents run dev servers concurrently on different ports; a broad pkill kills everyone else's. Kill your own PID only.
- **Put throwaway probe scripts in the session scratchpad, not the repo root.** Root-level `__*.mjs`/`__*.js` are gitignored and eslint-ignored precisely because agents kept dropping them there and turning the verification gate red for reasons unrelated to the code.
- **Re-run `./init.sh` yourself after each agent reports.** Agent self-reports are a claim, not evidence — and a concurrent agent's work-in-progress will routinely make the gate red for reasons that are not the reporting agent's fault. Check *which* files are failing before believing either story.

### End of Session

Before ending:

1. Update the module `feature_list.json` status and evidence, and the root `feature_list.json` if a whole module closed.
2. Append a dated entry to `progress.md` (what changed, what's next).
3. Fill `session-handoff.md` with blockers, touched files, and the recommended next step.
