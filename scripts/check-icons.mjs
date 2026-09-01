/**
 * The icon gate — wayfinder ticket 041. Scans `src/` for every referenced Iconify icon name and
 * fails the build if any name isn't on `scripts/icons/allowlist.mjs`. That allow-list is what
 * `scripts/generate-icons.mjs` bundles into `src/assets/icons/bundled-icons.gen.json`, so a name
 * used in source but missing here would silently render nothing at runtime (or, before this
 * ticket, silently fall back to a live `api.iconify.design` fetch) — this catches it at build
 * time instead. Wired into `bun run build` alongside `check:contrast`; run standalone with
 * `node scripts/check-icons.mjs`.
 */
import { join } from 'node:path'
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

console.info(`check-icons: PASS — ${used.size} icon name(s) in src/ are all on the allow-list.`)
