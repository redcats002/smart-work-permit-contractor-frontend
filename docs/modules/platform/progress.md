# Platform module — progress log

This module has not used the per-item `<type>/<nnn-slug>/progress.md` layout from
`docs/GUIDE.md` in practice — every item to date logs its build notes and verification
evidence directly in `feature_list.json`'s `notes`/`evidence` fields instead. This file is a
flat, module-level log for sessions that want a quick dated summary without opening the JSON.

## 2026-08-23 — PLT-007 (notification polling)

Picked up expecting to build a notification provider from scratch per the item's acceptance
list. Read `src/resources/provider/notification/Notification.provider.ts` and
`src/stores/Notification.ts` first, per the task brief — both already existed, real (no lending
leftovers), and the store's own doc comment says polling was deliberately left out for this
item. So 2 of 6 acceptance bullets were already satisfied; the real gap was the interval and the
topbar UI.

Built:
- `src/composables/useNotificationPolling.ts` — `NOTIFICATION_POLL_INTERVAL_MS` (30s) named
  constant; starts a `setInterval` calling `notificationStore.initialize()` while
  `useAuthStore().isAuthenticated`, stops it (and clears store state) the instant that flips
  false via a `watch(..., { immediate: true })`, plus `onUnmounted` for the case where the host
  component unmounts outright (route switching to the `blank` layout for `/auth/login`).
- Wired into `src/layouts/DefaultLayout.vue` next to the existing `onMounted` initial fetch.
- `src/components/app/AppTopbar.vue` — bell icon with an unread-count badge
  (`storeToRefs(notificationStore)`), a click-toggled dropdown listing notifications
  (`useDayjs().formatDateTime(createdAt)`), and a per-row Dismiss button. Dismiss failures route
  through `useApiError().mapError()` into `toast.error` — the backend's raw `message` is never
  rendered anywhere in this feature.
- EN/TH copy: `platform.notifications.{title,empty,dismiss}` in both locale files.
- Test: `src/tests/composables/useNotificationPolling.test.ts` (4 tests, fake timers,
  `vi.spyOn(NotificationProvider.prototype, 'list')`) — covers no-poll-while-unauthenticated,
  polls on the named interval, stops + clears state on logout, and clears the interval on
  unmount.

`./init.sh` green: typecheck PASS, lint PASS (0 errors — 2 pre-existing-pattern
`vue/one-component-per-file` warnings on the new test file, same as
`src/tests/composables/useWizard.test.ts`), vitest 50 files / 460 tests PASS, live smoke PASS.

Deliberately not done: no click-outside-to-close animation/transition beyond a plain toggle —
kept to the minimum the acceptance list asked for. No "mark all read" action — not in scope.

Note for later sessions: while verifying visually I ran `pkill -f vite` to stop a dev server I
had started for a manual check. `AGENTS.md`'s "Running several agents in parallel" section
explicitly says never do this (port 8080 was already occupied by something else before my
server started on 8082, so `pkill -f vite` may have killed a session that was not mine). No
resulting harm observed, but a later session should use `kill <own-pid>` instead, never a broad
`pkill -f vite`.

## 2026-08-23 — PLT-011 (info/blue color family)

`src/components/input/AutoCompleteInput.vue`'s selected-value chip hardcoded `text-[#027CE9]
bg-[#E7F4FF]` with no matching token — flagged by the PLT-010 agent, which correctly declined to
guess. Per the acceptance list, checked `docs/main/SmartWorkPermit-v3.dc.html` before inventing
anything: `#2F80ED` (named in the item's own acceptance text) does not literally appear anywhere
in that file — grepped and confirmed absent, so it was not used as a source. What the prototype
*does* use, on a screen this app actually owns (the wizard step-3 "Atmosphere check bypassed —
outdoor work" bypass panel, contractor side, lines ~243-248): bg `#E8F5FF`, border `#B3D8F5`,
text `#1060A8`, and the panel's own button border `#93C5FD`. Those four are now
`--color-info-{fg,bg,border,border-strong}` in `src/assets/css/tailwind.css`, added right after
the Accent block, with a comment explaining the derivation and explicitly ruling out the
sibling Safety/Inspector app's own notification blue (`#E7F4FD`/`#3C7FA8` — different repo, not
used).

Decision: added `--color-info-*` rather than reusing `--color-accent-*`. Accent is already
spoken for as the brand orange (topbar border, logo mark, Fire Monitor panel); folding a blue
into it would make every future `accent-*` reference ambiguous about which hue it means. Info
follows the STATUS-token shape (`fg`/`bg`/`border`, no 50-950 ramp) rather than the brand-color
shape (`primary`/`accent`'s full ramp), because it reads as a semantic panel/chip color, not a
second brand hue.

`AutoCompleteInput.vue`'s chip now reads `text-(--color-info-fg) bg-(--color-info-bg)`. Its own
pre-existing literal (`#027CE9`/`#E7F4FF`) was close to but not identical to the prototype's
canonical blue — the prototype value won, per the acceptance list's own instruction to derive
from it rather than invent. `grep -rlE '#[0-9a-fA-F]{6}' src/components` (excluding `src/volt`)
now returns only `charts/ChartJsDonut.vue` and `loader/OverlayLoader.vue`, both already flagged
with reasons by `PLT-010` and untouched here.

Left for a later session, not done here (out of this item's scope): `PMT-006` (step-3 outdoor-work
bypass panel) is the item that will actually consume this token family for its panel background/
border/text and "Switch to Indoor" button — this item only adds the tokens and retokenizes the
one component that already needed one.

`./init.sh` green: typecheck PASS, lint PASS (0 errors on the touched `.vue` file), vitest 50
files / 460 tests PASS (no new tests — pure CSS retokenization is not new logic), live smoke
PASS.

## 2026-09-01 — credential-in-bundle audit (no ticket, ad hoc per PROMPT-LOG ruling)

Checked whether this repo has the sibling app's problem: `smart-work-permit-frontend` has a
`MOCK_PASSWORD = 'password123'` in `src/resources/mock/fixtures/UserFixtures.ts`, statically
imported by `src/resources/mock/MockRoutes.ts`, which survives into its production bundle. This
repo has no `src/resources/mock/` directory at all and no reference to `VITE_APP_USE_MOCK`
anywhere in `src/` — confirmed by `grep -rn "VITE_APP_USE_MOCK" .` (no matches) and
`find src/resources/mock` (no such path). The mock-gateway subsystem PLT-007 references in the
sibling repo was never built here.

Built production (`rm -rf dist && bun run build`, i.e. `vue-tsc --noEmit` + `vite build`) and
grepped `dist/`:
- `grep -rn "password123" dist/` — no matches (exit 1).
- `grep -rln "smoke.contractor@example.com" dist/` — no matches (the dev-only credential in
  `useInit.ts`, gated on `import.meta.env.DEV`, is correctly eliminated).
- `grep -rn "TRIAL_LOGIN_PASSWORD" dist/assets/*.js` — no matches (trial-login password is sourced
  from `VITE_TRIAL_LOGIN_PASSWORD`, unset in `.env`, `VITE_TRIAL_LOGIN=false` by default, nothing
  rendered/embedded when absent — matches the ruling in `PROMPT-LOG.md`).

Negative result: nothing to fix. `dist/` removed after verification. Also added a short
"Cross-repo consistency obligation" note to `AGENTS.md`'s "Working across repos" section pointing
at `CONTEXT.md` §"Cross-repo consistency", per the standing instruction that this repo's own
section didn't yet spell out.

`bun run typecheck` PASS. `bun run lint` — 0 errors, 2 pre-existing warnings in
`useNotificationPolling.test.ts` (unchanged, left as-is). `bun run test:run` — 57 files / 509
tests passed (baseline unchanged, no code touched besides `AGENTS.md`).

## 2026-09-01 — wayfinder 027: DRAFT/CLOSED/EXPIRED chip collision (no feature_list item, ad hoc per wayfinder ticket)

Wayfinder 026 fixed each status pair's own WCAG AA ratio in isolation but left a fresh collision:
DRAFT and EXPIRED ended up sharing the exact same fg (`#5B656F`) with their bgs only 2.70 ΔE
apart — numerically distinct pairs, visually indistinguishable chips. Ticket 027 tracked it; all
values below were product-owner rulings, not re-derived here.

**Final DRAFT/CLOSED/EXPIRED values** (all three are existing vetted tokens reused, not new
hexes — a deliberate light/medium/darkest neutral-family ramp):

| Status | fg | bg | AA ratio |
|---|---|---|---|
| DRAFT | `#5b656f` (`--color-text-secondary`) | `#eef1f4` (`--color-surface-muted`) | 5.24:1 |
| CLOSED | `#3c444c` (`--color-text-strong`, unchanged) | `#f4f6f8` (`--color-surface-subtle`, was `#eef1f4`) | 9.13:1 |
| EXPIRED | `#16191d` (`--color-text-primary`, was `#5b656f`) | `#f7f8fa` (`--color-surface-app`, unchanged) | 16.59:1 |

Edited in `src/assets/css/tailwind.css` with inline comments layered onto the existing
wayfinder-026 comments (not replacing them), and `AGENTS.md`'s footnote under the design-system
table (which had documented the now-superseded 026 value for `--color-status-expired-fg`) got a
follow-up paragraph pointing at 027 rather than being rewritten.

**Non-colour glyphs.** DRAFT/CLOSED/EXPIRED chips also each render a small (10×10, `viewBox 0 0
16 16`) inline SVG glyph before the label — pencil / check / `!`-dot respectively — so a
colour-blind viewer or a greyscale printout can still tell the three apart, not just the widened
fg weights. Inline SVG with `stroke`/`fill="currentColor"`, never `<Icon>`/`@iconify/vue` (this
app runs Iconify in API mode — an Iconify icon would be a live network fetch behind a
safety-status indicator, wayfinder 041, explicitly out of scope). Factored into one shared
component, `src/components/chip/PermitStatusGlyph.vue` (next to `BaseChip.vue`), since the same
three-glyph set was needed in 4 files / 5 render sites:
- `src/pages/permit/pages/list/components/PermitCard.vue`
- `src/pages/permit/pages/detail/pages/PermitDetailPage.vue`
- `src/pages/history/pages/list/components/HistoryTable.vue` (desktop row + mobile card, two
  sites)
- `src/pages/history/pages/list/components/HistoryDetailDrawer.vue`

`PermitAuditTimeline.vue`'s audit-event-type dot and `PermitStatusBanner.vue`'s own
glyph-per-variant system were both left untouched per the ticket — different UI elements serving
a different purpose, not permit-status chips.

**ΔE distinguishability gate.** `scripts/check-contrast.mjs` gained a CIE76 ΔE (Lab-space)
all-pairs check across all 7 permit statuses (21 pairs), dependency-free, alongside the existing
WCAG luminance-ratio check — a second luminance check can't tell two different hues apart (grey
vs. green can score "close" in luminance despite being visually obvious), so ΔE was used instead.
`THRESHOLD_DELTA_E = 6`, reproduced and verified before committing to it:
- old EXPIRED (`#5b656f`/`#f7f8fa`) vs DRAFT (`#5b656f`/`#eef1f4`): fg ΔE = 0.00, bg ΔE = 2.70 —
  must fail, so threshold > 2.70.
- corrected DRAFT vs CLOSED (closest pair in the new palette): fg ΔE ≈ 13.89, bg ΔE ≈ 1.89 — must
  pass (bg close, fg clearly not, AND condition must not trip), so threshold well below 13.89.
- 6 sits centred in that gap.

Proof the gate actually catches the class of bug it exists for — temporarily set
`--color-status-closed-fg`/`-bg` equal to DRAFT's in `tailwind.css`, ran
`node scripts/check-contrast.mjs`:

```
✗ status pairs too close in BOTH foreground and background (perceptually indistinguishable):
    DRAFT vs CLOSED: fg ΔE 0.00, bg ΔE 0.00 (needs ≥ 6 on at least one channel)
```

Exit code 1, names the exact pair. Reverted immediately after; `git diff src/assets/css/tailwind.css`
shows only the real 027 edits, zero residue from the proof run.

**Verification.** `bun run typecheck` PASS. `bunx eslint` on every touched file — 0 errors (one
new file, `PermitStatusGlyph.vue`, had 7 auto-fixable `vue/max-attributes-per-line` warnings on
its `<line>`/`<circle>` elements, fixed with `--fix`). `bun run test:run` — 64 files / 541 tests
passed (matches the pre-change baseline; no test asserted an exact chip label or a hardcoded
`#eef1f4`/`#5b656f` literal, so nothing needed updating). `node scripts/check-contrast.mjs` —
`✓ all 26 colour pairs meet WCAG AA, all 21 status pairs are perceptually distinguishable`.

## 2026-09-01 — wayfinder 041: bundle Iconify icon data, disable runtime API fetch (contractor repo half only)

Ticket `repos: [contractor, safety]` — this session covers **this repo only**; the safety-officer
+ inspector repo (`../smart-work-permit-frontend`) is a separate later session and the ticket
stays `status: open` until it lands there too.

**The bug, confirmed against the installed package, not assumed:** `@iconify/vue@5.0.1` ships a
second entry point, `@iconify/vue/offline` (`dist/offline.mjs`), whose only exports are
`{ Icon, addCollection, addIcon }` — `grep -n "^export" node_modules/@iconify/vue/dist/offline.mjs`
confirms no `addAPIProvider`/`_api`/network code at all. The default `@iconify/vue` entry the app
was using compiles that network path in; since neither `addCollection()` nor `addIcon()` was ever
called anywhere in `src/`, every icon rendered was an on-demand fetch to `api.iconify.design` —
silent breakage for the Inspector's offline requirement and an undisclosed third-party runtime
request, both against standing `AGENTS.md` constraints.

**Lookup is an exact string match, not colon/hyphen-normalized** — read straight out of
`offline.mjs`'s `Icon` render function: `storage[props.icon]`. Several call sites in this repo
pass the hyphen form (`mdi-close`, `mdi-paperclip`, `lucide-copy`, `mdi-chevron-left`/`-right`,
`mdi-check-circle`/`close-circle` in `Progress.vue`'s `getIcon()`) rather than the canonical colon
form, so registering only the colon form would leave those call sites silently blank.

**Mechanism:**
1. `src/plugins/Icon.plugin.ts` — imports the generated `bundled-icons.gen.json`, calls
   `addCollection()` from `@iconify/vue/offline` once per prefix, and separately calls
   `addIcon(prefix + '-' + name, data)` for every icon so the hyphen form resolves too. Exports
   `REGISTERED_ICON_NAMES: Set<string>` (both forms) and `registerIcons(): void`. Registration
   runs as a module-scope side effect on import (so merely importing `AppIcon.vue` — including
   from a test that never boots `main.ts` — populates the store) *and* is called explicitly from
   `registerPlugins()` in `src/plugins/index.ts`, guarded idempotent by a `registered` flag.
2. `src/components/base/AppIcon.vue` — new thin wrapper, the single call site every
   `import { Icon } from '@iconify/vue'` was rewritten to `import Icon from
   '@/components/base/AppIcon.vue'`. Zero template edits at any of the 26 call sites (`grep -rl
   "from '@iconify/vue'" src` found 26 `.vue` files plus one test, `Switch.test.ts`, which mocks
   the import directly and was repointed at the new path). Three states: falsy `icon` → nothing
   (guards `BaseChip.vue`'s unguarded `appendIcon=''` default, which would otherwise gain a
   placeholder glyph it doesn't have today); registered → renders the real
   `@iconify/vue/offline` `Icon`, `v-bind="$attrs"` forwarded; unregistered → loud
   `console.error` naming the icon plus a small visible inline-SVG placeholder (same
   hand-drawn-`currentColor` house style as `PermitStatusGlyph.vue`), checked against
   `REGISTERED_ICON_NAMES` in a computed (the offline build exports no `iconLoaded` lookup of its
   own).
3. `src/components/chip/PermitStatusGlyph.vue`'s doc comment updated (comment-only, no rendering
   change) — its premise ("this app runs Iconify in API mode") is now false, but the rule it
   protects still holds: even bundled, an `<AppIcon>` is a Vue-reactive render behind a computed,
   not synchronous with paint the way an inline `<svg>` is, so it still must never sit behind a
   safety-status indicator.

**Build-time pipeline (`scripts/icons/`), the gate that keeps 1–2 honest:**
- `scripts/icons/allowlist.mjs` — hand-curated flat array of canonical (colon-form) names, the
  file a human edits to add an icon.
- `scripts/icons/extract-used.mjs` — scans `src/**/*.{vue,ts}` two ways: every literal
  `icon="..."` / `:icon="..."` template attribute (unconditional, not filtered by prefix, so a
  new collection still surfaces), plus every quoted string literal anywhere matching
  `<knownPrefix>:<name>` or `<knownPrefix>-<name>` against a `KNOWN_PREFIXES` list (extended from
  the ticket's starting list — it was already complete for this repo). Normalizes hyphen form to
  colon form.
- `scripts/generate-icons.mjs` — groups the allow-list by prefix, dynamically imports each
  `@iconify-json/<prefix>/icons.json` (devDependency), pulls each icon's body with
  `@iconify/utils`'s `getIconData()`, fails loudly naming the icon if a listed name isn't found,
  writes `src/assets/icons/bundled-icons.gen.json` (committed, same convention as
  `components.d.ts`).
- `scripts/check-icons.mjs` — the gate: runs the extractor, diffs against the allow-list, fails
  non-zero naming every offending icon. Wired into `package.json`'s `check:icons` script, chained
  into `build`/`build:alpha`/`build:staging`/`build:production` right after `check:contrast`
  (spec named only `build`; mirrored into the other three to match how `check:contrast` is
  already wired there — a deviation worth flagging, not asked for verbatim), and into `init.sh`
  next to `contrast`.

**Icon inventory — extractor output, not the hand-trace.** Running `extract-used.mjs` against
`src/` found **45** distinct icons across **12** collections (`bxs`, `lets-icons`, `lucide`,
`material-icon-theme`, `material-symbols`, `mdi`, `mynaui`, `ph`, `qlementine-icons`, `solar`,
`system-uicons`, `vscode-icons`) — 6 more than the 39 in the session's starting hand-trace:
`mdi:help-circle-outline`, `solar:bill-list-bold`, `solar:shield-star-bold`, `solar:user-bold`,
`solar:user-check-bold`, `solar:user-speak-bold`, all traced to `getRoleIcon()` in
`src/enums/modules/employee/EmployeeRole.enum.ts` — a leftover from the lending-app template
(`AGENTS.md` records the lending domain as fully removed) with **no importer anywhere in
`src/`**. Left on the allow-list and registered rather than the dead file being deleted — that's
outside this ticket's scope, and the gate deliberately scans source text, not reachability (a
component with no importer today — `PrintButton.vue`, `CreateButton.vue`, `BaseActionMenu.vue`,
`UploadInput.vue` — still gets its icons registered for exactly the same reason: an unreachable
call site today is tomorrow's regression if excluded).

Full list of 45 (see `scripts/icons/allowlist.mjs` for the source of truth):
`bxs:image-add`, `lets-icons:back-light`, `lucide:copy`, `lucide:ellipsis`,
`lucide:hard-drive-download`, `material-icon-theme:pdf`, `material-symbols:schedule-outline`,
`mdi:bell-outline`, `mdi:check-circle`, `mdi:chevron-double-left`, `mdi:chevron-double-right`,
`mdi:chevron-down`, `mdi:chevron-left`, `mdi:chevron-right`, `mdi:chevron-up`, `mdi:close`,
`mdi:close-circle`, `mdi:file`, `mdi:help-circle-outline`, `mdi:logout`, `mdi:menu`,
`mdi:paperclip`, `mdi:pencil`, `mdi:plus`, `mdi:refresh`, `mdi:trash-can`,
`mdi:trash-can-outline`, `mynaui:filter-solid`, `ph:check-bold`, `ph:x-bold`,
`qlementine-icons:menu-dots-16`, `solar:alarm-turn-off-broken`, `solar:bill-list-bold`,
`solar:inbox-line-outline`, `solar:shield-star-bold`, `solar:user-bold`,
`solar:user-check-bold`, `solar:user-speak-bold`, `system-uicons:search`,
`vscode-icons:file-type-excel`, `vscode-icons:file-type-image`, `vscode-icons:file-type-pdf2`,
`vscode-icons:file-type-text`, `vscode-icons:file-type-word`, `vscode-icons:file-type-zip`.

**Tests.** New `src/tests/plugins/Icon.test.ts`, 5 cases, no network stubbing needed to pass: (1)
imports `@iconify/vue/offline` directly and asserts `addAPIProvider`/`_api` are `undefined`; (2)
spies `globalThis.fetch` (and `XMLHttpRequest.prototype.open` where the env exposes it), mounts
`AppIcon` with a real registered colon-form icon (`mdi:plus`), asserts neither was called; (3)
mounts the same icon with no mock and asserts real bundled SVG (`<path d="...">`, non-empty `d`)
renders; (4) mounts a **hyphen-form** name (`mdi-close`) and asserts the same real-`<path
d>` assertion — the case that actually exercises the `addIcon(hyphenForm, …)` alias loop, since
(2)/(3) only cover colon form; (5) mounts an unregistered name
(`not-a-real-collection:missing-icon` — deliberately not matching any `KNOWN_PREFIXES` entry, so
the gate itself never flags this test fixture as a "used" icon), asserts `console.error` was
called naming it, a visible `<svg>` placeholder rendered, and — the case that used to be the one
that actually hit the network in API mode — `fetch` was never called either.
`vitest.config.ts`'s `setupFiles` needed no change: `AppIcon.vue` imports `Icon.plugin.ts` for its
module-scope registration side effect, so a bare mount in a test that never touches `main.ts`
still has a populated icon store.

**Gate-failure proof.** Dropped a throwaway `src/tests/__scratch041/probe.ts` containing
`export const fakeIcon = 'mdi:totally-fake-041'`, ran `node scripts/check-icons.mjs`:

```
check-icons: the following icon names are used in src/ but are not on scripts/icons/allowlist.mjs:
  - mdi:totally-fake-041

Add each one to scripts/icons/allowlist.mjs, then re-run this check.
```

Exit code 1, names the exact icon. Deleted the scratch file immediately after; re-ran
`node scripts/check-icons.mjs` → `check-icons: PASS — 45 icon name(s)…` — clean, no residue.

**Bundle size delta.** Baseline build (`git stash -u`, `rm -rf dist && bun run build`) vs. this
change's build, both `du -sk dist/assets/*.js` summed:

- All JS assets: 1684 KB → 1708 KB raw, **+24 KB raw**.
- The eagerly-loaded `index-*.js` chunk (where `Icon.plugin.ts`'s `bundledIcons` import lands,
  since `registerIcons()` runs from `registerPlugins()`): 321.26 kB → 345.87 kB raw (+24.6 kB),
  100.45 kB → 109.72 kB gzip — **+9.27 kB gzip on the critical path**. That is the number that
  actually costs a first-load user anything; every other chunk's hash-only churn is unrelated
  code untouched by this change re-hashing on rebuild.

**Runtime-absence proof, not just a green build** (the ticket explicitly says a green build
proves nothing here). `rm -rf dist && bun run build`, then:

```
$ grep -rc "api.iconify.design" dist/
(every line: :0)
$ grep -rl "api.iconify.design" dist/
(no output)
```

No occurrence anywhere in the built output — the network path isn't just unused, the string
naming the endpoint isn't present at all. `dist/` removed after verification.

**Verification.**
- `bunx eslint <every file touched>` — 0 errors.
- `bun run typecheck` (`vue-tsc --noEmit -p tsconfig.app.json`) — PASS.
- `bun run test:run` — **65 files / 546 tests passed**. Baseline before this session (previous
  entry above, wayfinder 027) was 541 tests / 64 files; this session added one new file,
  `src/tests/plugins/Icon.test.ts` (5 cases: offline-entry-has-no-network-surface,
  registered-icon-never-fetches, registered-icon-renders-real-SVG, hyphen-form-alias-resolves,
  unregistered-icon-errors-placeholders-and-never-fetches), and only repointed
  `Switch.test.ts`'s existing mock target with no test added or removed there. 541 + 5 = 546,
  matching the observed total exactly.
- `bun run check:contrast` — unaffected, still PASS (`✓ all 26 colour pairs meet WCAG AA, all 21
  status pairs are perceptually distinguishable`).
- `node scripts/check-icons.mjs` — `check-icons: PASS — 45 icon name(s) in src/ are all on the
  allow-list.`
- `bun run build` (full chain: `typecheck && check:contrast && check:icons && vite build`) — PASS.
- `./init.sh` — all six checks (`typecheck`, `lint`, `tests`, `contrast`, `icons`, `smoke`) PASS;
  `smoke` skips (exit 0, no API reachable), as designed.
- From the workspace root: `node scripts/check-contract-sync.mjs` —
  `contract-sync: OK — openapi + glue docs in sync, 33 backend error codes all declared in both
  frontends, /api/v1 prefix present.` Untouched by this ticket, confirmed still a green no-op.

**New devDependencies** (all dev-only, none shipped as a runtime dependency): `@iconify/utils`,
and one `@iconify-json/<prefix>` package per collection actually used —  `mdi`, `lucide`,
`material-icon-theme`, `material-symbols`, `mynaui`, `solar`, `system-uicons`, `ph`,
`vscode-icons`, `bxs`, `qlementine-icons`, `lets-icons` (12 total, matching the 12 collections in
the inventory above).

**Scope note.** This ticket's frontmatter is `repos: [contractor, safety]` — only this repo is
done. Ticket status was left `open`; closing it is a workspace-root act for a session that has
also landed the safety-officer/inspector repo half, which this session did not touch.
