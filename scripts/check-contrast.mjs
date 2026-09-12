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

  // ── Brand colours carrying white text (wayfinder 058) ──
  // This family was the gate's blind spot: every pair above is a status, permit-type or body-text
  // colour, so white-on-brand was never checked — and white on --color-accent-500 (#f26b1d) was
  // sitting at 3.05:1 in FireMonitorPanel, AppTopbar's logo square and AuthHeader. Same shape as
  // the failures 026 and 027 were opened for, found the same way: by accident, while doing
  // something else. These rows exist so the next one fails the build instead.
  ['white text on brand primary', WHITE, 'color-primary-500', 4.5],
  ['white text on brand primary emphasis', WHITE, 'color-primary-600', 4.5],
  // Only the shade that ACTUALLY carries white text is listed. --color-accent-500 remains the
  // decorative/fill brand orange and is not held to 4.5 on its own; the 700 is what white sits on.
  ['white text on accent (Fire Monitor panel, chips)', WHITE, 'color-accent-700', 4.5],

  // Sign-in split panel. The copy sits on a mesh gradient, which has no single background for
  // this gate to check — white clears AA against the panel base but is 3.44:1 over the lightest
  // mesh stop. A scrim gives it a known floor, and THAT is what is asserted here. If the scrim
  // is ever removed, this row stops describing what renders: delete the row too, or the gate
  // becomes another one that measures something narrower than it appears to.
  ['sign-in panel copy on its scrim', WHITE, 'color-primary-950', 4.5],

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

/**
 * ── Chip-to-chip distinguishability gate (wayfinder 027) ──
 *
 * The WCAG luminance-ratio math above proves each status pair's fg reads legibly on its own
 * bg — it cannot prove two DIFFERENT statuses' chips are distinguishable from each other. That
 * is exactly how wayfinder 026 handed 027 a fresh bug: it darkened EXPIRED's fg to reuse
 * --color-text-secondary, which happened to already equal DRAFT's fg verbatim — two colour
 * pairs that read fine in isolation and collided in the browser.
 *
 * A second luminance-ratio check cannot catch that either: luminance can score two different
 * hues (e.g. grey vs. green) as numerically "close" despite being visually obvious, so an
 * all-pairs luminance-distance gate produces false positives across colour families. CIE76 ΔE
 * in Lab space captures hue + lightness in one number and does not have that failure mode.
 */
function hexToRgb (h) { h = h.replace('#', ''); return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)] }
function srgbToLinear (c) { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4 }
function rgbToXyz ([r, g, b]) {
  const [R, G, B] = [r, g, b].map(srgbToLinear)
  return [
    R * 0.4124564 + G * 0.3575761 + B * 0.1804375,
    R * 0.2126729 + G * 0.7151522 + B * 0.0721750,
    R * 0.0193339 + G * 0.1191920 + B * 0.9503041
  ]
}
const D65 = { X: 0.95047, Y: 1.0, Z: 1.08883 }
function fLab (t) { return t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116 }
function xyzToLab ([X, Y, Z]) {
  const fx = fLab(X / D65.X), fy = fLab(Y / D65.Y), fz = fLab(Z / D65.Z)
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)]
}
function labOf (hex) { return xyzToLab(rgbToXyz(hexToRgb(hex))) }
function deltaE (hex1, hex2) {
  const [L1, a1, b1] = labOf(hex1)
  const [L2, a2, b2] = labOf(hex2)
  return Math.sqrt((L1 - L2) ** 2 + (a1 - a2) ** 2 + (b1 - b2) ** 2)
}

// THRESHOLD_DELTA_E = 6, centred between two measured anchors:
//  - the bug this gate exists to catch (old EXPIRED #5b656f/#f7f8fa vs DRAFT #5b656f/#eef1f4,
//    wayfinder 026 → 027): fg ΔE = 0.00 (identical), bg ΔE = 2.70. Must FAIL → threshold > 2.70.
//  - the closest pair in the corrected palette, DRAFT vs CLOSED: fg ΔE ≈ 13.89, bg ΔE ≈ 1.89.
//    Must PASS (bg is close, but fg is clearly not, so the AND condition must not trip) →
//    threshold well below 13.89.
//  6 sits centred in that gap (2.70 < 6 < 13.89) with comfortable margin either side.
const THRESHOLD_DELTA_E = 6

const STATUSES = ['draft', 'pending', 'active', 'fire-monitor', 'closed', 'rejected', 'expired']

const statusFailures = []
let pairCount = 0
for (let i = 0; i < STATUSES.length; i++) {
  for (let j = i + 1; j < STATUSES.length; j++) {
    pairCount++
    const a = STATUSES[i]
    const b = STATUSES[j]
    const fgDeltaE = deltaE(hex(`color-status-${a}-fg`), hex(`color-status-${b}-fg`))
    const bgDeltaE = deltaE(hex(`color-status-${a}-bg`), hex(`color-status-${b}-bg`))
    if (fgDeltaE < THRESHOLD_DELTA_E && bgDeltaE < THRESHOLD_DELTA_E) {
      statusFailures.push([a, b, fgDeltaE, bgDeltaE])
    }
  }
}

if (statusFailures.length) {
  console.error('✗ status pairs too close in BOTH foreground and background (perceptually indistinguishable):')
  for (const [a, b, fgDeltaE, bgDeltaE] of statusFailures) {
    console.error(`    ${a.toUpperCase()} vs ${b.toUpperCase()}: fg ΔE ${fgDeltaE.toFixed(2)}, bg ΔE ${bgDeltaE.toFixed(2)} (needs ≥ ${THRESHOLD_DELTA_E} on at least one channel)`)
  }
  process.exit(1)
}

console.log(`✓ all ${PAIRS.length} colour pairs meet WCAG AA, all ${pairCount} status pairs are perceptually distinguishable`)
process.exit(0)
