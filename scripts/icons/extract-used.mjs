/**
 * Scans src/**\/*.{vue,ts} for every Iconify icon name actually referenced in source, both
 * static and dynamic. wayfinder ticket 041 — this is the extractor half of the build-time gate
 * that proves the bundled icon set (`bundled-icons.gen.json`) actually covers what the app uses.
 *
 * Two extraction passes, unioned:
 *  1. Every literal `icon="..."` / `:icon="..."` attribute value that is a plain string.
 *     Unconditional — not filtered by known prefix, so a brand-new collection prefix still shows
 *     up in the diff against the allow-list instead of being silently skipped.
 *  2. Every quoted string literal anywhere in the source matching `<knownPrefix>:<name>` or
 *     `<knownPrefix>-<name>`, which catches dynamic lookups (ternaries, lookup maps/objects, prop
 *     defaults) that pass 1 cannot see because the value never sits in an `icon="..."` attribute
 *     at the call site that uses it.
 *
 * Hyphen-form matches are normalized to colon-form before being returned, since that is the
 * canonical form the allow-list and the generator key off.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

export const KNOWN_PREFIXES = [
  'mdi',
  'solar',
  'lucide',
  'mynaui',
  'system-uicons',
  'material-symbols',
  'material-icon-theme',
  'lets-icons',
  'iconamoon',
  'famicons',
  'ph',
  'vscode-icons',
  'bxs',
  'qlementine-icons',
  'fluent',
  'icon-park-outline',
  'mingcute',
  'proicons',
  'quill',
  'streamline',
  'tabler'
]

const SRC_EXTENSIONS = new Set(['.vue', '.ts'])
const ATTR_ICON_RE = /(?<![\w:-])(?::?icon)="([^"{}]+)"/g
// A plain icon-name shape: letters/digits/hyphens either side of exactly one colon. Anything
// else (a ternary, a function call, an object literal) is a dynamic binding, not a literal.
const PLAIN_ICON_NAME_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*:[a-z0-9]+(?:-[a-z0-9]+)*$/i
const KNOWN_PREFIX_RE = new RegExp(
  `['"\`](${KNOWN_PREFIXES.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})[:-]([a-z0-9-]+)['"\`]`,
  'g'
)

function walk (dir, out) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    const stat = statSync(full)
    if (stat.isDirectory()) {
      walk(full, out)
      continue
    }
    const dot = entry.lastIndexOf('.')
    const ext = dot === -1 ? '' : entry.slice(dot)
    if (SRC_EXTENSIONS.has(ext)) out.push(full)
  }
}

function toColonForm (prefix, rest) {
  return `${prefix}:${rest}`
}

/**
 * Scans every .vue/.ts file under srcDir and returns the Set of icon names (colon form)
 * referenced anywhere in source.
 */
export function extractUsedIcons (srcDir) {
  const files = []
  walk(srcDir, files)

  const used = new Set()

  for (const file of files) {
    const content = readFileSync(file, 'utf8')

    for (const match of content.matchAll(ATTR_ICON_RE)) {
      const value = match[1].trim()
      if (!value) continue
      const prefix = KNOWN_PREFIXES.find((p) => value.startsWith(`${p}:`) || value.startsWith(`${p}-`))
      if (prefix) {
        const rest = value.slice(prefix.length + 1)
        used.add(toColonForm(prefix, rest))
      } else if (PLAIN_ICON_NAME_RE.test(value)) {
        // Unknown-prefix colon-form literal — still record it verbatim so it surfaces in the
        // allow-list diff rather than being silently dropped.
        used.add(value)
      }
    }

    for (const match of content.matchAll(KNOWN_PREFIX_RE)) {
      used.add(toColonForm(match[1], match[2]))
    }
  }

  return used
}
