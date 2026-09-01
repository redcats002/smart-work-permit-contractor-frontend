/**
 * The icon gate — wayfinder ticket 041. Scans `src/` for every referenced Iconify icon name and
 * fails the build if any name isn't on `scripts/icons/allowlist.mjs`. That allow-list is what
 * `scripts/generate-icons.mjs` bundles into `src/assets/icons/bundled-icons.gen.json`, so a name
 * used in source but missing here would silently render nothing at runtime (or, before this
 * ticket, silently fall back to a live `api.iconify.design` fetch) — this catches it at build
 * time instead. Wired into `bun run build` alongside `check:contrast`; run standalone with
 * `node scripts/check-icons.mjs`.
 */
import { readFileSync, readdirSync } from 'node:fs'
import { extname, join, relative } from 'node:path'
import { ALLOWED_ICONS } from './icons/allowlist.mjs'
import { extractUsedIcons } from './icons/extract-used.mjs'

const SRC_DIR = join(import.meta.dirname, '..', 'src')

const allowed = new Set(ALLOWED_ICONS)
const used = extractUsedIcons(SRC_DIR)
const missing = [...used].filter((name) => !allowed.has(name)).sort()

if (missing.length > 0) {
  console.error('check-icons: the following icon names are used in src/ but are not on scripts/icons/allowlist.mjs:')
  for (const name of missing) console.error(`  - ${name}`)
  console.error('\nAdd each one to scripts/icons/allowlist.mjs, then re-run this check.')
  process.exit(1)
}

// Second, independent check: nothing in src/ may import the NETWORK build of Iconify.
//
// The allow-list check above verifies icon NAMES, which leaves a hole: a future
// `import { Icon } from '@iconify/vue'` that happens to use an already-allow-listed name would
// pass it while quietly reopening the `api.iconify.design` fetch path this ticket closed. The
// name is not what makes an icon offline-safe — the import path is. Only `@iconify/vue/offline`
// is permitted, whose bundle contains no fetch code at all (verified: 0 network references in
// dist/offline.mjs against 3 in dist/iconify.mjs).
const SOURCE_EXTENSIONS = new Set(['.vue', '.ts', '.tsx', '.js', '.mjs'])
const offenders = []

function walk (dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      walk(full)
      continue
    }
    if (!SOURCE_EXTENSIONS.has(extname(entry.name))) continue
    // Anchored to a line that BEGINS with `import`, plus the dynamic-import form. AppIcon.vue's
    // own doc comment quotes the bare specifier on purpose to explain what was migrated away
    // from, and an unanchored /from ['"]@iconify\/vue['"]/ matches that prose — a gate that
    // fails on its own documentation gets deleted by the next person, so anchor it.
    const text = readFileSync(full, 'utf8')
    const staticImport = /^[^\S\n]*import[^\n]*from\s*['"]@iconify\/vue['"]/m
    const dynamicImport = /\bimport\s*\(\s*['"]@iconify\/vue['"]\s*\)/
    if (staticImport.test(text) || dynamicImport.test(text)) {
      offenders.push(relative(SRC_DIR, full))
    }
  }
}

walk(SRC_DIR)

if (offenders.length > 0) {
  console.error("check-icons: the following files import the NETWORK build of Iconify ('@iconify/vue'):")
  for (const file of offenders) console.error(`  - src/${file}`)
  console.error("\nImport '@iconify/vue/offline' instead, or use the AppIcon component. The network")
  console.error('build reaches api.iconify.design at runtime, which breaks the offline Inspector.')
  process.exit(1)
}

console.info(`check-icons: PASS — ${used.size} icon name(s) on the allow-list, no network-build imports.`)
