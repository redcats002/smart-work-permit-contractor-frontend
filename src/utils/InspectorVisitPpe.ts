import { PPE_ITEMS, ppeItemSlug, type EPpeItem } from '@/enums/modules/permit/PpeItem.enum'

// Ported from the safety app's src/utils/InspectorVisitPpe.ts (wayfinder 112/120) — kept
// semantically identical so both apps classify and render the same append-only `ppeChecklist`
// shapes the same way (map ruling 18's parity). Adapted only for import surface: this repo's
// `PpeItem.enum.ts` exposes `PPE_ITEMS`/`ppeItemSlug` rather than the safety app's
// `PpeItemLabelKey`/`isPpeItem`, so both are reimplemented locally below instead of imported.
//
// `ppeChecklist` on an inspector-visit record is `Record<string, unknown> | null` on the wire and
// visit records are append-only evidence: historic rows are NEVER migrated. Three shapes exist
// side by side forever:
// - 'none'   -- null, or an object that strips to `{}` (nothing was ever recorded).
// - 'legacy' -- an older inspector-app vocabulary (an arbitrary map of boolean-ish values, one key
//               per item, no structure of its own — e.g. `helmet`/`safetyBoots`/`gloves`/
//               `eyeProtection`, or an even older `harness`/`gasDetector`/... set).
// - 'new'    -- `{ worn?: [{item, worn}], undeclaredGaps?: string[], note?: string }`. Distinguished
//               structurally: its only top-level keys are worn/undeclaredGaps/note, and at least
//               one of them is actually present.
//
// A reader must never map a legacy key onto `EPpeItem` -- render it honestly as "recorded on an
// earlier checklist" instead (see legacyPpeEntries below), and must never crash on `null`, `{}` or
// an unrecognized shape.
export type TPpeChecklistShape = 'none' | 'new' | 'legacy'

const NEW_SHAPE_KEYS = new Set(['worn', 'undeclaredGaps', 'note'])

export function isPpeItem (value: string): value is EPpeItem {
  return (PPE_ITEMS as string[]).includes(value)
}

/** i18n key for a PPE item's label — reuses the wizard's own PPE-declare vocabulary (`permit.create.steps.ppeWorkers.ppe.item.*`). */
export function ppeItemLabelKey (item: string): string {
  return `permit.create.steps.ppeWorkers.ppe.item.${ppeItemSlug(item)}`
}

export function classifyPpeChecklist (raw: Record<string, unknown> | null | undefined): TPpeChecklistShape {
  if (!raw || typeof raw !== 'object') return 'none'
  const keys = Object.keys(raw)
  if (keys.length === 0) return 'none'
  const onlyNewShapeKeys = keys.every((key: string): boolean => NEW_SHAPE_KEYS.has(key))
  const hasRecognizableContent = Array.isArray(raw.worn) || Array.isArray(raw.undeclaredGaps) || typeof raw.note === 'string'
  return onlyNewShapeKeys && hasRecognizableContent ? 'new' : 'legacy'
}

export interface IPpeLabelledItem {
  item: string
  // Resolves through `ppeItemLabelKey` — null when `item` does not match EPpeItem -- render `item`
  // itself in that case rather than dropping the row.
  labelKey: string | null
}

export interface IPpeWornRow extends IPpeLabelledItem {
  worn: boolean
}

export function extractPpeWornRows (raw: Record<string, unknown>): IPpeWornRow[] {
  if (!Array.isArray(raw.worn)) return []
  return raw.worn
    .filter((entry: unknown): entry is { item: unknown, worn: unknown } => typeof entry === 'object' && entry !== null)
    .map((entry: { item: unknown, worn: unknown }): IPpeWornRow => {
      const item = typeof entry.item === 'string' ? entry.item : String(entry.item)
      return { item, worn: Boolean(entry.worn), labelKey: isPpeItem(item) ? ppeItemLabelKey(item) : null }
    })
}

export function extractPpeGaps (raw: Record<string, unknown>): IPpeLabelledItem[] {
  if (!Array.isArray(raw.undeclaredGaps)) return []
  return raw.undeclaredGaps
    .filter((item: unknown): item is string => typeof item === 'string')
    .map((item: string): IPpeLabelledItem => ({ item, labelKey: isPpeItem(item) ? ppeItemLabelKey(item) : null }))
}

export function extractPpeNote (raw: Record<string, unknown>): string | null {
  return typeof raw.note === 'string' && raw.note.trim() ? raw.note : null
}

// Raw key/value pairs, exactly as written -- never remapped onto EPpeItem. Value stays `unknown`
// on purpose: the legacy vocabulary is not guaranteed to be boolean-valued either.
export function legacyPpeEntries (raw: Record<string, unknown>): Array<{ key: string, value: unknown }> {
  return Object.entries(raw).map(([key, value]: [string, unknown]): { key: string, value: unknown } => ({ key, value }))
}
