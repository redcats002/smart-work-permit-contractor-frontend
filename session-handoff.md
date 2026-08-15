# Session Handoff

> Fill this in before ending every session. The next agent reads this file, `progress.md`,
> and the active module's `feature_list.json` — nothing else is guaranteed to be in context.

**Date:** 2026-08-15
**Session did:** Rebuilt the harness, then ran three parallel implementation waves (11 agents).
Baseline went from red (72 typecheck errors, ~3140 lint errors) to **green**: typecheck + lint +
**303 tests**. **19 of 30 items done.** `feat-003` (history) and `feat-004` (certificates) complete.

**The app is reachable by a human end to end** — orchestrator-verified live, not assumed:
unauthenticated `/permits` → `/auth/login` → real form submit → lands on `/permits`, token cookie
set, revisiting login bounces back, all four screens render, zero page errors.

**Log in with:** `contractor@smartworkpermit.dev` / `password123` (stub credential).

---

## Manual steps the agent cannot perform

**1. `.env.example` — delete the dead line.** `useSocket.ts` was removed in `PLT-001` and
nothing references `VITE_APP_WEBSOCKET` any more. A global `Read(**/.env*)` permission rule
blocks Read/Write/Bash on that path for both subagents and the orchestrator; bypassing it was
declined as a deliberate security boundary.

```diff
 VITE_APP_API_URL=
-VITE_APP_WEBSOCKET=
```

**2. There is no `.env`, only `.env.example`.** `src/utils/EnvChecker.ts` throws on boot without
`VITE_APP_API_URL`, so `bun run dev` renders a blank page until you create one. Workaround used
for verification this session:

```bash
VITE_APP_API_URL=http://localhost:9/api bun run dev
```

---

## Current state

`./init.sh` → typecheck PASS, lint PASS, **303 tests PASS**.

**Everything is stubbed.** `USE_STUB_DATA = true` in four providers — `Permit`, `Certificate`,
`Auth.public`, `Auth.private` — with real HTTP already wired underneath. **Going live:** flip those
four booleans, delete `Permit.mock.ts` + `Certificate.mock.ts`, point `VITE_APP_API_URL` at the backend.

> ⚠ The auth stub **bypasses `Interceptors.ts` entirely**, so the `401 → logout` path has been read
> and confirmed correct but **never exercised live**. Test it the moment a real backend exists.

### Done (19)

`PLT-001` baseline repair · `PLT-002` design tokens · `PLT-003` app shell · `PLT-004` i18n ·
`PLT-005` auth · `PLT-006` API error codes · `PLT-008` orphan sweep · `PLT-009` Schema i18n ·
`PLT-010` retokenize · `PMT-001` domain · `PMT-002` provider+router · `PMT-003` My Permits ·
`PMT-004` wizard shell · `HST-001`/`002`/`003` history · `CRT-001`/`002`/`003` certificates.

### Open (11), in dependency order

- **`PMT-005`–`PMT-009` — the 6 wizard step bodies. The biggest remaining chunk.**
- `PMT-010`–`PMT-012` permit detail, closure modal, Fire Watch countdown
- `CRT-004` certificate gate on submission (needs `PMT-007`)
- `PLT-007` notification polling
- `PLT-011` design system has no blue/info family (blocks a clean `PMT-006`)

---

## Traps discovered this session — do not rediscover these

**vue-router is 5.x, not 4.x.** An unregistered route name fails hard, but the two call sites fail
*differently* — both observed empirically:

- `<RouterLink :to="{ name }">` resolves at render/setup → **throws and blanks the entire page**.
- `router.push({ name })` rejects at runtime → **uncaught page error, page keeps rendering**, control is dead.

`AppDrawer.vue` guards nav with `isRegistered()` via `router.hasRoute()`. That guard is **not
reactive** (read once at render), so registering a route needs a **full reload**, not Vite HMR.
**All four nav routes now exist, so the guard has nothing left to guard — it can be deleted.**
Also: declare `/create` before `/:id` or `create` is captured as an id. Written up in `AGENTS.md`.

**Thai timezone is load-bearing, not cosmetic.** `src/utils/CertificateStatus.ts` deliberately
splits `bangkokCalendarDay` (bare business dates like `expiryDate`) from `bangkokInstantDay`
(real instants like `now`). A naive single-branch version was **proven** to break under a non-UTC
host timezone. Do not collapse the two helpers.

**Locales are split per namespace** — `src/locales/{en,th}/<module>.ts`. This exists so parallel
agents do not collide in one message file. `th/<ns>.ts` is typed as `typeof <ns>En`, so a key
added in English and missing in Thai is a **type error**, not a silent runtime fallback.

**`src/router/index.ts` is a contention point.** When running agents in parallel, keep it out of
every agent's hands and register route modules yourself afterwards. Same for shared utils. All four
route modules are now registered — see the "Running several agents in parallel" section in `AGENTS.md`
for the full set of rules this session paid for.

**Do not fan the wizard steps out in parallel.** `PMT-005`–`009` all write
`src/pages/permit/pages/create/**` *and* `src/locales/{en,th}/permit.ts`. The per-namespace locale
split solves cross-module collisions, not intra-module ones. Run them serially, or split the step
schemas and locale sub-files first.

**Pinia plugins in tests:** `pinia.use(plugin)` only *queues* a plugin until `app.use(pinia)` installs
it. A bare `setActivePinia(pinia)` with no Vue app silently no-ops every plugin, `persistedstate`
included — your persistence assertions will pass against nothing. See `src/tests/stores/Auth.test.ts`.

**A commented-out route still matches a grep.** `ForgotPasswordPage` looked registered and is not.
Read the router file.

---

## Product decisions still defaulted, not confirmed

1. **`vue-i18n` was installed** without explicit approval — the task doc sanctions it and all four modules assume `t()`. Reversible.
2. **Fonts:** kept self-hosted `LINE_Seed_Sans_TH`; `--font-mono` is a websafe stack. The design specifies IBM Plex Mono but its woff2 files are not in the repo, and **no CDN import is allowed** (industrial facility). Self-host to close the gap.
3. **`CERTIFICATE_EXPIRING_SOON_DAYS = 30`** — no spec states this window.
4. **`PMT-012` Fire Watch GPS-photo flow** — the design shows capture → verify GPS against the permit pin → pass/fail, but neither `00-SHARED-CONTEXT.md` nor the backend doc models it and **no endpoint exists**. Default recorded: build the countdown, skip the photo step. Confirm before building it.
5. **JSA minimum rows** — the backend doc states no minimum; `PMT-008` assumes ≥1.
6. **`IUser.company` was added as *optional*.** The backend `users` spec is `id, name, role, contact info` — no company field is promised. The design's account card shows one. Confirm with the backend team.
7. **Auth stub credential** `contractor@smartworkpermit.dev` / `password123` is dev-only and must not survive contact with a real backend.
8. **No blue/info color token exists** (`PLT-011`). The design does use a blue — `#2F80ED`, and the outdoor-work panel `#E8F5FF`/`#B3D8F5`/`#1060A8`. Decide before `PMT-006` needs it.

---

## Recommended next step

**`PMT-005` (wizard steps 1-2)**, then `006`, `007`, `008`, `009` — **serially, not in parallel**
(see the traps section). The shell is done and the structure is stable: `WIZARD_STEPS` in
`src/pages/permit/pages/create/wizard/WizardSteps.ts` is a registry of
`{ key, labelKey, component, schema }`, and each step has a stub component plus a placeholder
schema. Filling a step means editing only that step's `.vue` and `.schema.ts`.

Everything a step needs already exists: `SAFETY_RANGES` + `validateReadings()` in
`src/utils/PermitSafety.ts` (returns the *list of failing readings*, so the UI can name which one),
`useApiError()`, the permit provider, and the design tokens.

Read `docs/modules/permit/context.md` first — it carries the full per-step screen anatomy with
design line numbers, so the 2400-line prototype never needs reading whole.
