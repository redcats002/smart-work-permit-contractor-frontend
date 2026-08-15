# Module: `platform`

Cross-cutting foundation for the Contractor app. No route prefix of its own — it owns the
things every other module sits on: the verification baseline, the design system, the app
shell, i18n, auth, the API client, and notifications.

Root feature: `feat-001`. Every other module depends on this one.

## Location

| Concern | Path |
|---|---|
| Design tokens | `src/assets/css/tailwind.css` (+ `main.css`, `primevue.css`, `fonts.css`) |
| Layouts | `src/layouts/DefaultLayout.vue`, `src/layouts/BlankLayout.vue`, switched by `App.vue` on `route.meta.layout` |
| Shell components | `src/components/app/AppDrawer.vue`, `src/components/nav/` |
| Router root | `src/router/index.ts` (guard, chunk-retry, title) |
| Auth pages | `src/pages/auth/` (`login`, `reset-password`) |
| Auth routes | `src/router/modules/Auth.router.ts` |
| Stores | `src/stores/{Auth,Loading,Notification}.ts` |
| HTTP | `src/resources/HttpRequest.ts`, `src/resources/Interceptors.ts` |
| Providers | `src/resources/provider/auth/{public,private}/`, `src/resources/provider/Upload.provider.ts` |
| i18n (to create) | `src/plugins/I18n.plugin.ts`, `src/locales/{en,th}.ts` |

## Invariants

- **PrimeVue is unstyled.** All component styling is PassThrough wrappers in `src/volt/`, Tailwind v4 classes. Never re-enable PrimeVue's theme.
- **`src/volt/` is auto-imported** by `unplugin-vue-components` and excluded from ESLint. Never write an explicit import for a Volt component.
- **All API access goes through `HttpRequest`.** Never call `axios`/`fetch` from a page or composable.
- **Interceptors already handle** camelCase conversion (humps) and `401 → logout → /auth/login`. Do not duplicate that per-provider.
- **Backend errors are localized client-side.** The backend returns a machine-readable `code`; the app maps it to an EN/TH string. Never render a backend message string directly.
- **Default locale is `th`.** Persisted in localStorage. Switcher lives in the topbar.
- **One role in this app: `contractor`.** There is no role toggle and no safety-officer/inspector UI here.

## The strip (why the baseline is red)

This repo was a lending app. `src/pages/`, `src/router/modules/`, and
`src/resources/provider/` were emptied of the lending domain, but references to the deleted
files survive in:

- `src/router/index.ts` — imports 11 deleted router modules + 3 deleted `common` pages (14 errors)
- `src/models/request/*`, `src/models/modules/*`, `src/models/response/*` — import deleted zod schemas from deleted pages (~25 errors)
- `src/components/selection/modules/api/*` (16 dirs) + `static/asset-type` — import deleted providers/enums (~28 errors)
- `src/stores/Notification.ts` — imports the deleted `notification` provider (1 error)
- `src/composables/` — 2 errors

Plus `eslint.config.js` `ignores` does not cover `docs/**`, `.agents/**`, `.claude/**`, or
`lint-staged.config.mjs`, so `bun run lint` reports 3140 errors in files that are not this
project's source.

**Rule for `PLT-001`: delete, do not repair.** A dangling lending model is not a
SmartWorkPermit model in disguise.

## What survives the strip and must be kept

`src/components/{base,button,input,modal,table,display,nav,paper,loader,transition,form,flex,card,chip,charts,progress}`,
`src/volt/`, `src/utils/` (19 files, 217 passing tests), `src/composables/`,
`src/resources/HttpRequest.ts` + `Interceptors.ts`, `src/stores/{Auth,Loading}.ts`,
`src/pages/auth/`, `src/models/{Form,Global,Table}.model.ts`.

## Design system

The design prototype's palette **replaces** the template's `--color-primary-*` (`#BD0102`
red) and `--color-secondary-*` (`#4160BE` navy). Full token table is in root `AGENTS.md`
under "Design system". Key values:

```
primary/danger  #C81E2C   accent orange #F26B1D   success #1E8E5A
warning #B8860B           confined #7C3AED        heights amber #B8860B
shell #111418 (topbar) / #16191D (sidebar)
text  #16191D / #5B656F / #8B95A0
surface #F7F8FA / #F4F6F8 / #EEF1F4 / #fff
border  #E1E6EB / #D7DCE2 / #CBD2D9
```

Status chip colors used by the permit list (design lines ~126-137 of
`SmartWorkPermit-v3.dc.html`): each card carries a 5px left border in the permit-type color,
and a pill whose fg/bg pair encodes status.

## Shell layout (from the design)

- **Topbar** — 54px, `#111418`, `2px solid #F26B1D` bottom border, sticky, `z-index: 50`. Left: 30px `#F26B1D` rounded-6px logo mark + "SafePermit" / "SMART WORK PERMIT · v3.0" in mono. Right: locale switcher (EN / ไทย) as a 2-button pill on `#1E232A`.
- **Sidebar** — 212px fixed, `#16191D`, text `#C2CAD2`, section label `#6B7681`. Four nav items: My Permits `▦`, New Permit `＋`, History `◷`, Certificates `◎`. Bottom: account card (32px avatar circle `#2B3138`, company name, "บัญชีผู้รับเหมา"), separated by `1px solid #262C33`.
- **Main** — `#F7F8FA`, scrollable, `26px 30px` padding.
- **Responsive** — below ~900px the sidebar collapses to a hamburger-triggered drawer. Test at 375 / 768 / 1280px.

## Conventions specific to this module

- Provider instantiation: `const AuthService: IAuthProvider = new AuthProvider()` — typed interface, `Service` suffix.
- Stores are setup-style: `defineStore('name', () => { ... })`.
- Routes lazy-load: `component: (): ComponentOptions => import('@/pages/...')`.
- Locale keys are namespaced by module: `permit.list.title`, `platform.nav.certificates`.
