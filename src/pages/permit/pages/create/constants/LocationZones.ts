/**
 * Step 2's location vocabulary and pin placement.
 *
 * ⚠ MIRROR — `KNOWN_ZONE_POSITIONS` and `mapLocationToPosition()` below are a deliberate copy of
 * `../smart-work-permit-frontend/src/pages/safety-officer/pages/risk-map/utils/LocationPosition.ts`.
 * The two apps have no shared package, and the whole point of this feature (../PROMPT-LOG.md,
 * session 2 — "map scope") is that a pin the contractor drops on step 2 lands on the SAME spot the
 * Safety Officer's risk map plots for that permit. Keys and percentages must stay byte-identical
 * to that file; the Safety app's agent has been told not to rename them.
 *
 * What is explicitly NOT here, and must not be added: a map library, a real facility floor-plan
 * asset, or latitude/longitude. There are zero geo fields on the wire — `location` is free text —
 * and fabricating a floor-plan is forbidden by `SFO-007`'s acceptance. Full GIS is an open product
 * decision. This is a zone picker over free text, nothing more.
 */
export interface IMapPosition {
  x: number
  y: number
}

const KNOWN_ZONE_POSITIONS: Record<string, IMapPosition> = {
  'zone 1': { x: 15, y: 30 },
  'zone 2': { x: 42, y: 22 },
  'zone 3': { x: 68, y: 32 },
  'building 2': { x: 82, y: 18 },
  'tank farm': { x: 20, y: 72 },
  'process area': { x: 55, y: 68 },
  'admin building': { x: 85, y: 78 },
  'utility yard': { x: 45, y: 88 }
}

const MIN_PERCENT = 10
const MAX_PERCENT = 90

/**
 * One pickable zone. `value` is what actually lands in `formData.location` — canonical English,
 * because the Safety app matches on `location.trim().toLowerCase().startsWith(key)`. A Thai label
 * would never match and the two apps would plot the same permit in two places.
 */
export interface ILocationZone {
  key: string
  value: string
  labelKey: string
}

export const LOCATION_ZONES: ILocationZone[] = [
  { key: 'zone 1', value: 'Zone 1', labelKey: 'permit.create.steps.basicInfo.map.zone.zone1' },
  { key: 'zone 2', value: 'Zone 2', labelKey: 'permit.create.steps.basicInfo.map.zone.zone2' },
  { key: 'zone 3', value: 'Zone 3', labelKey: 'permit.create.steps.basicInfo.map.zone.zone3' },
  { key: 'building 2', value: 'Building 2', labelKey: 'permit.create.steps.basicInfo.map.zone.building2' },
  { key: 'tank farm', value: 'Tank Farm', labelKey: 'permit.create.steps.basicInfo.map.zone.tankFarm' },
  { key: 'process area', value: 'Process Area', labelKey: 'permit.create.steps.basicInfo.map.zone.processArea' },
  { key: 'admin building', value: 'Admin Building', labelKey: 'permit.create.steps.basicInfo.map.zone.adminBuilding' },
  { key: 'utility yard', value: 'Utility Yard', labelKey: 'permit.create.steps.basicInfo.map.zone.utilityYard' }
]

function hashString (value: string): number {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0
  }
  return hash
}

/**
 * The zone key a free-text location resolves to, or `undefined` when it is outside the vocabulary.
 * Prefix match, so "Zone 3 / Pipe Rack B" still resolves to `zone 3` — the same narrowing the
 * Safety app does. Free text outside the vocabulary stays perfectly valid; it just falls back to
 * the deterministic hash below.
 */
export function findKnownZoneKey (location: string): string | undefined {
  const normalized = location.trim().toLowerCase()
  return Object.keys(KNOWN_ZONE_POSITIONS).find((key: string): boolean => normalized.startsWith(key))
}

/**
 * Deterministically maps a free-text permit location to a percentage-based (x, y) position
 * (0-100) on the placeholder facility background. Known zone prefixes resolve to a fixed spot;
 * anything else is hashed to a stable pseudo-position so repeated renders never jitter.
 */
export function mapLocationToPosition (location: string): IMapPosition {
  const normalized = location.trim().toLowerCase()
  const knownKey = findKnownZoneKey(normalized)
  if (knownKey) {
    return KNOWN_ZONE_POSITIONS[knownKey]
  }

  const hash = hashString(normalized)
  const x = MIN_PERCENT + ((hash % 100) / 100) * (MAX_PERCENT - MIN_PERCENT)
  const y = MIN_PERCENT + ((Math.floor(hash / 100) % 100) / 100) * (MAX_PERCENT - MIN_PERCENT)
  return {
    x: Math.round(x * 100) / 100,
    y: Math.round(y * 100) / 100
  }
}
