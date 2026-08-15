## Read this first — Project skill

Before doing any non-trivial work in this repo, read the project skill index at `{.agents, .claude}/skills/project-conventions/SKILL.md` and then load the relevant topic file under `{.agents, .claude}/skills/project-conventions/reference/`. The skill is the canonical convention set for this codebase (one H2 topic per reference file): coding style, naming, architecture, forms, providers, stores, composables, styling, testing, etc. Pull from it rather than inventing a parallel pattern.

## What this repo is

**SmartWorkPermit — Contractor web app.** Responsive web app (desktop/tablet first, must not break at 375px) where contractors draft, submit, and track their own work permits for a Thai industrial facility.

Specs live in `docs/main/`:

| File | What it is |
|---|---|
| `docs/main/dev-handoff/00-SHARED-CONTEXT.md` | Product model, roles, permit lifecycle, safety ranges, business rules. **Source of truth for *what*.** |
| `docs/main/dev-handoff/02-contractor-web-vue-tasks.md` | Scope for **this** repo. |
| `docs/main/dev-handoff/01-backend-elysia-tasks.md` | Backend endpoints + error `code`s this app calls. |
| `docs/main/SmartWorkPermit-v3.dc.html` | High-fidelity design prototype — UX, layout, copy (EN + TH). **Reference, not code to port.** |

Two sibling apps exist in **other repos** and are **out of scope here**: the Safety Officer + Inspector app (`03-safety-inspector-web-vue-tasks.md`) and the Elysia backend. Never build safety-officer or inspector screens in this repo.

> **State of the codebase (2026-08-15):** this repo started as a lending-app template; the lending domain has been fully removed and `./init.sh` is **green** (typecheck + lint + 278 tests).
>
> Built: the app shell, i18n (en/th, default th), the design system, the API error-code layer, the permit domain + provider + My Permits list, and the certificates module.
> Placeholders on purpose: `PermitCreatePage` (the wizard, `PMT-004`–`PMT-009`) and `PermitDetailPage` (`PMT-010`–`PMT-012`).
> Not built: the `history` module (`feat-003`) — its route is not registered, and `AppDrawer` renders that nav item inert until it is.
>
> **Both providers are running on stubs.** `Permit.provider.ts` and `Certificate.provider.ts` each have a `USE_STUB_DATA = true` flag at the top with real HTTP already wired underneath. Going live is: flip both booleans, delete `Permit.mock.ts` and `Certificate.mock.ts`, point `VITE_APP_API_URL` at the backend.

## Commands

Package manager is **bun** — do not invoke `npm`/`yarn`/`pnpm`.

```bash
bun install            # install deps
./init.sh              # FULL verification gate: typecheck + lint + tests (run before claiming done)

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
| `platform` | — (cross-cutting) | `auth/login`, layout shell, i18n, API errors | `auth/public`, `auth/private`, `notification` | `docs/modules/platform/` | shell + i18n + errors ✅ · auth `PLT-005` ⬜ · notifications `PLT-007` ⬜ |
| `permit` | `/permits` | `list` ✅, `create` (6-step wizard) ⬜, `detail` ⬜ | `permit` | `docs/modules/permit/` | provider + list ✅ · wizard/detail are placeholder pages |
| `history` | `/history` | `list` ✅ | `permit` (reused — no own provider dir) | `docs/modules/history/` | ✅ |
| `certificate` | `/certificates` | `list` ✅ | `certificate` | `docs/modules/certificate/` | ✅ |

Registered in `src/router/index.ts`: `AuthRouter`, `PermitRouter`, `HistoryRouter`, `CertificateRouter` — all four nav destinations now exist, so `AppDrawer`'s `isRegistered()` guard has nothing left to guard and can be removed.

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
  → /permits/create  (6-step wizard: Type → Basic Info → Safety Checks → PPE & Workers → JSA → Review)
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
- Backend error responses carry a machine-readable `code` (`GAS_OUT_OF_RANGE`, `ENTRANTS_STILL_INSIDE`, `CERT_EXPIRED`, `FIRE_WATCH_NOT_ELAPSED`, …). **Localize client-side** — never render a backend string directly.
- Timestamps are UTC server-side; display in `Asia/Bangkok`.

## Design system

The design prototype's palette **replaces** the template's existing brand colors in `src/assets/css/tailwind.css` (`--color-primary-*` red `#BD0102`, `--color-secondary-*` navy `#4160BE`). This is a swap, not an addition — see `docs/modules/platform/` item `PLT-002`.

| Token | Hex | Used for |
|---|---|---|
| Primary / danger | `#C81E2C` | Brand primary, required-field `*`, blocked banners, "inside" alerts |
| Accent orange | `#F26B1D` | Topbar accent border, logo mark, map pin |
| Success green | `#1E8E5A` (dark `#176B45`, bg `#E4F4EC`, border `#B7E0CA`) | Safe atmosphere, Active status |
| Pending amber | `#B26A00` (bg `#FFF3DC`) | `PENDING` status badge only |
| Heights amber | `#B8860B` (bg `#FFF8E1`) | Working-at-Heights **type** chip/icon only |
| Confined-space purple | `#7C3AED` (bg `#F1E9FE`) | Confined Space type chip/icon |
| Hot-work red bg | `#FCE9EB` | Hot Work type chip/icon |
| Shell dark | `#111418` (topbar) · `#16191D` (sidebar, headings) | App chrome |
| Sidebar text | `#C2CAD2` · muted `#6B7681` | Nav |
| Body text | `#16191D` primary · `#5B656F` secondary · `#8B95A0` tertiary | Content |
| Surfaces | `#F7F8FA` main bg · `#F4F6F8` · `#EEF1F4` · `#fff` cards | Backgrounds |
| Borders | `#E1E6EB` · `#D7DCE2` · `#CBD2D9` | Dividers, card borders |

**Never hardcode a hex.** Every color above is a `@theme` token in `src/assets/css/tailwind.css`:
`--color-primary-*`, `--color-accent-*`, `--color-status-{draft,pending,active,fire-monitor,closed,rejected,expired}-{fg,bg,border}`, `--color-permit-type-{hot,confined,heights}-{fg,bg}`, `--color-shell-*`, `--color-text-*`, `--color-surface-*`, `--color-border*`. Use the token; if one is missing, add it to `tailwind.css` rather than inlining a hex.

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
> - **Check the router file, don't grep for the name** — a commented-out route still matches a naive grep. `ForgotPasswordPage` is commented out in `Auth.router.ts` and does **not** exist; grepping made it look registered.
> - `AppDrawer.vue` guards its nav with `isRegistered(name)` (backed by `router.hasRoute()`), rendering an inert `<span>` for routes that do not exist yet. This exists because `HistoryListPage` is not built until `feat-003`. **Delete the guard once all four nav routes are registered** — it is not free: `router.hasRoute()` is read once at render and is **not reactive**, so registering a route needs a **full page reload**, not a Vite HMR update, before the drawer picks it up.
> - Declare static segments before dynamic ones: `/create` must come before `/:id` or `create` is captured as an id.

### Layout switching

`App.vue` reads `route.meta.layout` (`'default' | 'blank'`) and renders the matching layout from `src/layouts/`. New layouts require both a new file in `src/layouts/` and a branch in `App.vue`'s template/computed.

### HTTP layer

All API access goes through `src/resources/HttpRequest.ts` (axios wrapper) + `src/resources/Interceptors.ts`. Base URL comes from `import.meta.env.VITE_APP_API_URL`. Interceptors handle camelCase conversion (humps) and 401 → logout + redirect to `/auth/login`.

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
- `src/volt/**`, `vite.config.ts`, `index.html`, `dist/**` are ignored. **`docs/**`, `.agents/**`, `.claude/**` are not yet ignored and account for ~3140 of the current lint errors — fix in `PLT-001`.**

Satisfy these up front when writing code — Vite will fail loudly via `vite-plugin-eslint2`.

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

1. Run `./init.sh` (typecheck + lint + tests) to see the current baseline. **It is red today** — see the recorded baseline in `progress.md`; do not mistake pre-existing failures for your own.
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

- The item is `done` only when `./init.sh` passes with **no new failures** versus the baseline recorded in `progress.md` — and once `PLT-001` lands, `./init.sh` must pass **clean**.
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
