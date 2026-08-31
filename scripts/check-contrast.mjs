/**
 * WCAG AA contrast gate — the check that should have caught wayfinder 026 before a human
 * had to find three sub-AA status/warning colour pairs by accident while doing something
 * else. Ports `smart-work-permit-landing/scripts/check-landing.mjs`'s contrast half into this
 * app: same luminance/ratio math, same enumerated-pairs shape, same "fail the build, don't
 * wait to be noticed" intent.
 *
 * Unlike the landing gate this one does not need a build first — it reads the live
 * `--color-*` custom properties straight out of `src/assets/css/tailwind.css`'s light-mode
 * `@theme` block, so a colour changed there is checked against its actual current value, not
 * a hardcoded duplicate that could drift out of sync with the source of truth. Run any time
 * (`node scripts/check-contrast.mjs`); wired into `init.sh` alongside the other gates.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const CSS_PATH = join(import.meta.dirname, '..', 'src', 'assets', 'css', 'tailwind.css')
const css = readFileSync(CSS_PATH, 'utf8')

// The first `@theme { ... }` block is the light-mode token set — the one every page renders
// by default (there is no `.dark` toggle wired up anywhere in this app yet). Its top-level
// close is an unindented `}` (every property line inside is tab-indented), so a naive
// "next closing brace" scan is safe here — there is nothing else brace-nested inside it.
const themeStart = css.indexOf('@theme {')
if (themeStart === -1) {
  console.error('✗ could not find "@theme {" in tailwind.css — has the token block moved?')
  process.exit(1)
}
const themeEnd = css.indexOf('\n}', themeStart)
const themeBlock = css.slice(themeStart, themeEnd)

const TOKENS = new Map()
for (const match of themeBlock.matchAll(/--(color-[a-z0-9-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)) {
  TOKENS.set(match[1], match[2].toLowerCase())
}

function hex (tokenOrLiteral) {
  if (tokenOrLiteral.startsWith('#')) return tokenOrLiteral
  const value = TOKENS.get(tokenOrLiteral)
  if (!value) {
    console.error(`✗ unknown token "--${tokenOrLiteral}" — renamed or removed in tailwind.css?`)
    process.exit(1)
  }
  return value
}

const srgb = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
const luminance = (h) => {
  const [r, g, b] = [1, 3, 5].map((i) => srgb(parseInt(h.slice(i, i + 2), 16) / 255))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const ratio = (fg, bg) => {
  const [a, b] = [luminance(fg), luminance(bg)].sort((x, y) => y - x)
  return (a + 0.05) / (b + 0.05)
}

const WHITE = '#ffffff'

// [label, foreground token/hex, background token/hex, minimum ratio]
// 4.5 = WCAG AA normal text. 3.0 = AA large text (>=24px, or >=18.66px bold) — none of the
// pairs below are large-text-only uses, so everything here is held to 4.5.
const PAIRS = [
  // ── Status triples — all seven statuses, fg against its own bg (wayfinder 026) ──
  ['DRAFT status text on its surface', 'color-status-draft-fg', 'color-status-draft-bg', 4.5],
  ['PENDING status text on its surface', 'color-status-pending-fg', 'color-status-pending-bg', 4.5],
  // PermitStatusBanner renders the pending icon glyph on a plain white circle, not the tinted
  // status surface — a second real background the same fg has to clear.
  ['PENDING status text on white', 'color-status-pending-fg', WHITE, 4.5],
  ['ACTIVE status text on its surface', 'color-status-active-fg', 'color-status-active-bg', 4.5],
  ['ACTIVE status emphasis text on its surface', 'color-status-active-fg-emphasis', 'color-status-active-bg', 4.5],
  ['FIRE_MONITOR status text on its surface', 'color-status-fire-monitor-fg', 'color-status-fire-monitor-bg', 4.5],
  ['FIRE_MONITOR status emphasis text on its surface', 'color-status-fire-monitor-fg-emphasis', 'color-status-fire-monitor-bg', 4.5],
  ['CLOSED status text on its surface', 'color-status-closed-fg', 'color-status-closed-bg', 4.5],
  ['REJECTED status text on its surface', 'color-status-rejected-fg', 'color-status-rejected-bg', 4.5],
  ['REJECTED status emphasis text on its surface', 'color-status-rejected-fg-emphasis', 'color-status-rejected-bg', 4.5],
  ['EXPIRED status text on its surface', 'color-status-expired-fg', 'color-status-expired-bg', 4.5],

  // ── Status colours used as a button/badge background with white text ──
  ['white text on ACTIVE fg background', WHITE, 'color-status-active-fg', 4.5],

  // ── Permit-type chips ──
  ['Hot Work type text on its surface', 'color-permit-type-hot-fg', 'color-permit-type-hot-bg', 4.5],
  ['Confined Space type text on its surface', 'color-permit-type-confined-fg', 'color-permit-type-confined-bg', 4.5],
  ['Working at Heights type text on its surface', 'color-permit-type-heights-fg', 'color-permit-type-heights-bg', 4.5],

  // ── Semantic panel colour ──
  ['info text on its surface', 'color-info-fg', 'color-info-bg', 4.5],

  // ── Body text scale on the surfaces it actually renders on ──
  ['primary text on app surface', 'color-text-primary', 'color-surface-app', 4.5],
  ['primary text on card', 'color-text-primary', 'color-surface-card', 4.5],
  ['secondary text on app surface', 'color-text-secondary', 'color-surface-app', 4.5],
  ['secondary text on card', 'color-text-secondary', 'color-surface-card', 4.5],
  ['strong text on muted surface', 'color-text-strong', 'color-surface-muted', 4.5],
  // tertiary/quaternary are real body text (PermitInfoCard labels, PermitAuditTimeline
  // timestamps, HistoryTable captions, table row indices), not decoration — checked against
  // the darkest surface each is actually used on in this repo (wayfinder 026). Tertiary reaches
  // surface-muted via the Step4/Step6 "loading"/"checking" chip; quaternary's darkest real
  // background is surface-subtle. Neither renders on surface-muted at quaternary weight today —
  // if a future call site puts quaternary text on surface-muted, add that row rather than
  // assuming it still passes.
  ['tertiary text on card', 'color-text-tertiary', 'color-surface-card', 4.5],
  ['tertiary text on app surface', 'color-text-tertiary', 'color-surface-app', 4.5],
  ['tertiary text on muted surface (loading/checking chip)', 'color-text-tertiary', 'color-surface-muted', 4.5],
  ['quaternary text on card', 'color-text-quaternary', 'color-surface-card', 4.5],
  ['quaternary text on subtle surface (inactive toggle pill)', 'color-text-quaternary', 'color-surface-subtle', 4.5]
]

const failures = PAIRS.filter(([, fg, bg, min]) => ratio(hex(fg), hex(bg)) < min)

if (failures.length) {
  console.error('✗ below WCAG AA:')
  for (const [label, fg, bg, min] of failures) {
    console.error(`    ${label}: ${ratio(hex(fg), hex(bg)).toFixed(2)}:1 (needs ${min}:1) — ${hex(fg)} on ${hex(bg)}`)
  }
  process.exit(1)
}

console.log(`✓ all ${PAIRS.length} colour pairs meet WCAG AA`)
process.exit(0)
