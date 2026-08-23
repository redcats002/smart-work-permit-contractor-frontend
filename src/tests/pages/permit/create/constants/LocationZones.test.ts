import { describe, expect, it } from 'vitest'
import {
  LOCATION_ZONES, findKnownZoneKey, mapLocationToPosition
} from '@/pages/permit/pages/create/constants/LocationZones'

/**
 * The point of this vocabulary is that a contractor's step-2 pin and the safety officer's risk-map
 * pin land on the SAME spot for the same permit (../PROMPT-LOG.md, session 2 — "map scope"). The
 * two apps are separate repos with no shared package, so these expectations are copied from
 * `smart-work-permit-frontend/.../risk-map/utils/LocationPosition.ts` and are the guard against
 * this copy drifting away from it.
 */
const SAFETY_APP_POSITIONS: Record<string, { x: number, y: number }> = {
  'zone 1': { x: 15, y: 30 },
  'zone 2': { x: 42, y: 22 },
  'zone 3': { x: 68, y: 32 },
  'building 2': { x: 82, y: 18 },
  'tank farm': { x: 20, y: 72 },
  'process area': { x: 55, y: 68 },
  'admin building': { x: 85, y: 78 },
  'utility yard': { x: 45, y: 88 }
}

describe('LOCATION_ZONES', () => {
  it('offers exactly the safety app’s zone vocabulary, in its order', () => {
    expect(LOCATION_ZONES.map((zone: { key: string }): string => zone.key))
      .toEqual(Object.keys(SAFETY_APP_POSITIONS))
  })

  it('writes a canonical value that the safety app’s prefix match still resolves', () => {
    for (const zone of LOCATION_ZONES) {
      expect(zone.value.toLowerCase()).toBe(zone.key)
      expect(findKnownZoneKey(zone.value)).toBe(zone.key)
    }
  })
})

describe('mapLocationToPosition', () => {
  it('puts every known zone on the safety app’s exact percentages', () => {
    for (const [key, position] of Object.entries(SAFETY_APP_POSITIONS)) {
      expect(mapLocationToPosition(key)).toEqual(position)
    }
  })

  it('narrows a longer location down to its zone prefix', () => {
    expect(mapLocationToPosition('Zone 3 / Pipe Rack B')).toEqual(SAFETY_APP_POSITIONS['zone 3'])
    expect(mapLocationToPosition('  TANK FARM — bund 2 ')).toEqual(SAFETY_APP_POSITIONS['tank farm'])
  })

  it('still accepts free text outside the vocabulary, deterministically', () => {
    const first = mapLocationToPosition('Effluent plant — sump pit')
    expect(findKnownZoneKey('Effluent plant — sump pit')).toBeUndefined()
    expect(mapLocationToPosition('Effluent plant — sump pit')).toEqual(first)
    expect(first.x).toBeGreaterThanOrEqual(10)
    expect(first.x).toBeLessThanOrEqual(90)
    expect(first.y).toBeGreaterThanOrEqual(10)
    expect(first.y).toBeLessThanOrEqual(90)
  })

  it('gives two different free-text locations different positions', () => {
    expect(mapLocationToPosition('Boiler house')).not.toEqual(mapLocationToPosition('Compressor room'))
  })
})
