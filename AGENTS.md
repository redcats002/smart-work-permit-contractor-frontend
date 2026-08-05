## Read this first — Project skill

Before doing any non-trivial work in this repo, read the project skill index at `{.agents, .claude}/skills/project-conventions/SKILL.md` and then load the relevant topic file under `{.agents, .claude}/skills/project-conventions/reference/`. The skill is the canonical convention set for this codebase (one H2 topic per reference file): coding style, naming, architecture, forms, providers, stores, composables, styling, testing, etc. Pull from it rather than inventing a parallel pattern.

This is a **full production app**, not a template — 12 router modules, ~36 API providers, 15 page domains, 3 Pinia stores, 14 composables, 18 utils. See [Modules](#modules) for the map. When adding a new subsystem, follow the skill rather than inventing a parallel pattern.

## Commands

Package manager is **bun** — do not invoke `npm`/`yarn`/`pnpm`.

```bash
bun install            # install deps
bun run dev            # vite dev server on 0.0.0.0:8080
bun run build          # production build
bun run build:alpha    # vite build --mode development
bun run build:staging  # vite build --mode staging
bun run preview        # preview built bundle
bun run lint           # eslint .
bun run lint:fix       # eslint . --fix
bun run test           # run tests (no script wired in package.json yet; vitest is installed)
bunx vitest path/to/file.test.ts  # single file
```

ESLint also runs **inside Vite** via `vite-plugin-eslint2` — lint errors surface during `dev`/`build`, not only via `bun run lint`.

Husky `pre-commit` runs `lint-staged` → `eslint --fix` on staged `*.{js,jsx,ts,tsx,vue}`.

## Modules

> **Maintenance rule — this table is part of the main flow.**
> When a change adds, removes, or renames a module, changes its route prefix or `permission` key, or changes which provider a module talks to, **update this table in the same commit**. A stale map costs every later session more than the edit costs now.

Each module owns three parallel trees: routes (`src/router/modules/<mod>/`), pages (`src/pages/<mod>/`), providers (`src/resources/provider/<feature>/`). Route prefix comes from the `const prefix` at the top of each module's `index.ts`; `permission` on the root route gates menu + access via `usePermission`.

| Module | Prefix | Permission | Pages (`src/pages/<mod>/pages/`) | Main providers |
|---|---|---|---|---|
| `dashboard` | `/dashboard` | `dashboard` | `list` | `dashboard` |
| `work` | `/work` | `tasks` | `asset-appraisal`, `follow-up` | `work` |
| `contract` | `/contract` | `contracts` | `list`, `create`, `detail`, `contract-edit`, `pre-contract-detail`, `pre-contract-edit`, `refinance`, `print` | `contract`, `pre-contract`, `contract-document`, `contract-history`, `contract-income`, `contract-expense`, `refinance`, `invoice`, `customer` |
| `customer` | `/customer` | `customers` | `list`, `create`, `detail`, `edit` | `customer` |
| `asset` | `/assets` | `assets` | `list`, `detail` | `contract-asset` |
| `finance` | `/finance` | `finance_docs` | `record`, `receipt`, `invoice`, `close-account`, `re-finance` | `invoice`, `receipt`, `expenses`, `close-contract`, `refinance` |
| `stock` | `/stock` | `storage` | `list`, `create`, `detail` | `warehouse`, `document-storages` |
| `reports` | `/reports` | `reports` | `list` + 22 report pages | `report` |
| `announcement` | `/announcement` | `news` | `AnnouncementPage.vue` | `announcement` |
| `action-log` | `/action-log` | `audit_logs` | `ActionLogListPage.vue` | `action-log` |
| `setting` | `/setting` | `settings` | `list`, `contract`, `customer`, `financial`, `other`, `profile` | `branch`, `management-position`, `warehouse`, `employee`, `contract-loan-type`, `contract-loan-purpose`, `customer-group`, `customer-occupation`, `how-did-find-us`, `finance-income-category`, `finance-income-type`, `finance-expense-category`, `finance-expense-type` |
| `auth` | `/auth` | — (public) | `login`, `reset-password` | `auth/public`, `auth/private` |

**Modules without a top-level router entry** — non-obvious wiring, check before moving files:

- `employee` — pages at `src/pages/employee/`, but routes live in `src/router/modules/setting/Employee.router.ts` (under `/setting`). Providers: `employee`, `auth/public`.
- `notification` — no pages, no routes. Provider `notification` is consumed only by `stores/Notification.ts`; the store is read by `DefaultLayout`, `AppDrawer`, `useSocket`, and the `work` / `announcement` pages. Cross-cutting — changing it touches the main flow.
- `common` — `not-found`, `not-permitted`, `not-available`. Routes declared inline in `src/router/index.ts`, all `meta.layout: 'blank'`.

**Sub-trees that are lists, not modules** — do not enumerate these in the table:

- `src/router/modules/reports/*.router.ts` — 22 per-report router files merged by `reports/index.ts`.
- `src/router/modules/setting/other/` — `Branch`, `Warehouse`, `HowDidFindUs`, `ManagementStructure`.
- `src/components/selection/modules/api/` (16) and `.../static/` (25) — reusable dropdown components. `api/*` fetch via a provider; `static/*` are hardcoded enum lists.

### Main flow (contract lifecycle)

The spine most changes touch. Break a step here and the app's core path breaks:

```
customer (create/verify)
  → work/asset-appraisal (value the collateral)
    → contract/pre-contract/create  [status PENDING_REVIEW]
      → contract/pre-contract/:id   (review → approve)
        → contract/detail/:id       (active contract)
          → finance/record + finance/receipt   (installments)
            → finance/close-account | contract/refinance
```

Cross-cutting on this path: `stores/Auth.ts` (token + permissions), `stores/Notification.ts` + `useSocket` (realtime), `resources/Interceptors.ts` (401 → logout), `utils/Permission.ts`. A change to any of those is a main-flow change — re-read this section and update it if the flow moved.

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

### Layout switching

`App.vue` reads `route.meta.layout` (`'default' | 'blank'`) and renders the matching layout from `src/layouts/`. New layouts require both a new file in `src/layouts/` and a branch in `App.vue`'s template/computed.

### HTTP layer

All API access goes through `src/resources/HttpRequest.ts` (axios wrapper) + `src/resources/Interceptors.ts`. Base URL comes from `import.meta.env.VITE_APP_API_URL`. Interceptors handle camelCase conversion (humps) and 401 → logout + redirect to `/auth/login`.

New API surfaces extend `HttpRequest`, implement a typed `I<Name>Provider` interface, set a `urlPrefix`, and export as default. Provider files live under `src/resources/provider/<feature>/<Name>.provider.ts` — ~36 feature dirs exist; match an existing one before creating a new dir. Request/response types live in `src/models/request/` and `src/models/response/` (plus `src/models/modules/`).

When instantiating a provider in a page or composable, always declare with the typed interface and a `Service` suffix:

```ts
// correct
const DashboardService: IDashboardProvider = new DashboardProvider()

// wrong
const provider = new DashboardProvider()
const dashboardProvider = new DashboardProvider()
```

### State (Pinia)

Setup-store pattern only — `defineStore('name', () => { ... })`. Persist via `pinia-plugin-persistedstate` configured in `src/plugins/Pinia.plugin.ts`. Existing stores: `useAuthStore` (`stores/Auth.ts` — token + permissions), `useLoadingStore` (`stores/Loading.ts`), `useNotificationStore` (`stores/Notification.ts` — paired with `useSocket`).

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
- `src/volt/**`, `vite.config.ts`, `index.html`, `dist/**` are ignored.

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

### Startup Workflow

Before writing code:

1. Run `./init.sh` (lint + vitest) to verify a clean baseline.
2. Read `feature_list.json` for feature status and `progress.md` for the last session's state.
3. Pick ONE feature whose `dependencies` are all `done`.

### Stay in scope

- **One feature at a time** — implement only the active feature from `feature_list.json`.
- Do not start a feature whose dependencies are not `done`.
- Do not touch code outside the active feature.

### Definition of Done

- A feature is `done` only when `./init.sh` passes.
- Record the passing command output in the feature's `evidence` field in `feature_list.json`.
- If the change touched module wiring (new/renamed/removed module, changed route prefix, changed `permission` key, new provider dir) or the contract lifecycle, the [Modules](#modules) table and main-flow diagram must match reality before the feature is `done`.

### End of Session

Before ending:

1. Update `feature_list.json` status and evidence.
2. Append a dated entry to `progress.md` (what changed, what's next).
3. Fill `session-handoff.md` with blockers, touched files, and the recommended next step.
