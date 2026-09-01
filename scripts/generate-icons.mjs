/**
 * Builds `src/assets/icons/bundled-icons.gen.json` from `scripts/icons/allowlist.mjs` —
 * wayfinder ticket 041. Groups the allow-list by prefix, pulls each icon's body out of its full
 * `@iconify-json/<prefix>` collection (a devDependency — never shipped as a runtime dependency),
 * and writes one small per-prefix `IconifyJSON` object per collection, so the app registers only
 * the ~45 icons it actually uses instead of an entire icon set.
 *
 * Run manually with `node scripts/generate-icons.mjs` after editing the allow-list; the generated
 * file is committed (same convention as `components.d.ts`), not built on every `bun run build`.
 */
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { getIconData } from '@iconify/utils'
import { ALLOWED_ICONS } from './icons/allowlist.mjs'

const OUT_PATH = join(import.meta.dirname, '..', 'src', 'assets', 'icons', 'bundled-icons.gen.json')

function groupByPrefix (names) {
  const groups = new Map()
  for (const name of names) {
    const colonIndex = name.indexOf(':')
    if (colonIndex === -1) {
      throw new Error(`generate-icons: "${name}" in allowlist.mjs is not in "<prefix>:<name>" form`)
    }
    const prefix = name.slice(0, colonIndex)
    const iconName = name.slice(colonIndex + 1)
    if (!groups.has(prefix)) groups.set(prefix, [])
    groups.get(prefix).push(iconName)
  }
  return groups
}

async function main () {
  const groups = groupByPrefix(ALLOWED_ICONS)
  const output = []

  for (const [prefix, names] of groups) {
    let iconSet
    try {
      ;({ default: iconSet } = await import(`@iconify-json/${prefix}/icons.json`, { with: { type: 'json' } }))
    } catch (err) {
      console.error(`generate-icons: no @iconify-json/${prefix} collection installed as a devDependency.`)
      console.error(`  Run: bun add -D @iconify-json/${prefix}`)
      throw err
    }

    const icons = {}
    for (const name of names) {
      const data = getIconData(iconSet, name)
      if (!data) {
        console.error(`generate-icons: "${prefix}:${name}" was not found in the @iconify-json/${prefix} collection.`)
        process.exit(1)
      }
      icons[name] = data
    }

    output.push({ prefix, icons })
  }

  writeFileSync(OUT_PATH, `${JSON.stringify(output, null, 2)}\n`)
  const total = output.reduce((sum, group) => sum + Object.keys(group.icons).length, 0)
  console.info(`generate-icons: wrote ${total} icon(s) across ${output.length} collection(s) to ${OUT_PATH}`)
}

main()
