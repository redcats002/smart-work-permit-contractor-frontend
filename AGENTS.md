## Read this first — Project skill

Before doing any non-trivial work in this repo, read the project skill index at `{.agents, .claude}/skills/project-conventions/SKILL.md` and then load the relevant topic file under `{.agents, .claude}/skills/project-conventions/reference/`. The skill is the canonical convention set for this codebase (one H2 topic per reference file): coding style, naming, architecture, forms, providers, stores, composables, styling, testing, etc. Pull from it rather than inventing a parallel pattern.

The skill describes the _target_ convention set (imported from a downstream production app — Management). Most subsystems it documents (forms, full provider tree, domain pages, tests) are **not yet present** in this template — only HTTP plumbing, plugins, router skeleton, two Pinia stores, a few composables/utils, and one `HomePage.vue` exist today. When adding a new subsystem, follow the skill rather than inventing a new pattern.

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

## Architecture

### Entry & plugin registration

`src/main.ts` → `registerPlugins()` in `src/plugins/index.ts`. Plugins compose onto the Vue app in order: router → pinia → PrimeVue (`unstyled: true`). Adding a global plugin means editing `plugins/index.ts`, not `main.ts`.

PrimeVue runs in **unstyled** mode — all component styling lives in `src/volt/` PassThrough (PT) wrappers using Tailwind v4 classes. Never re-enable PrimeVue's default theme.

### Volt auto-import

`unplugin-vue-components` is configured in `vite.config.ts` with `dirs: ['src/volt']` and `dts: true`. Every `.vue` file in `src/volt/` is globally available with no import statement — `components.d.ts` is regenerated automatically. To add a Volt component, scaffold into `src/volt/` (the project uses `volt add <ComponentName>` per the skill); do **not** add an explicit import.

`src/volt/**/*` is excluded from ESLint (`eslint.config.js`).

### Router

`src/router/index.ts` boots an HTML5-history router, sets `document.title` from `route.meta.title` in `afterEach`, and is wired into the app via plugins. Auth guard exists only as commented-out code; uncommenting requires `useAuthStore` to expose `userToken.accessToken` (current `stores/Auth.ts` may not match — check before enabling).

Per-domain routes belong in `src/router/modules/<Domain>.router.ts` and merge into the top-level `routes` array. All page components must be lazy-loaded (`(): ComponentOptions => import(...)`). See skill reference `router-conventions.md` for `meta` fields (`layout`, `auth`, `title`, `menu`, `icon`, `root`).

### Layout switching

`App.vue` reads `route.meta.layout` (`'default' | 'blank'`) and renders the matching layout from `src/layouts/`. New layouts require both a new file in `src/layouts/` and a branch in `App.vue`'s template/computed.

### HTTP layer

All API access goes through `src/resources/HttpRequest.ts` (axios wrapper) + `src/resources/Interceptors.ts`. Base URL comes from `import.meta.env.VITE_APP_API_URL`. Interceptors handle camelCase conversion (humps) and 401 → logout + redirect to `/auth/login`.

New API surfaces extend `HttpRequest`, implement a typed `I<Name>Provider` interface, set a `urlPrefix`, and export as default. Provider files live under `src/resources/provider/<feature>/<Name>.provider.ts` (directory does not yet exist — create when first provider is added). Request/response types live in `src/models/Request/` and `src/models/Response/`.

### State (Pinia)

Setup-store pattern only — `defineStore('name', () => { ... })`. Persist via `pinia-plugin-persistedstate` configured in `src/plugins/Pinia.plugin.ts`. Existing stores: `useAuthStore` (`stores/Auth.ts`), `useLoadingStore` (`stores/Loading.ts`).

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
