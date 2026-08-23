import type { TPermitType } from '@/enums/modules/permit/PermitType.enum'
import { SAFETY_RANGES, type ISafetyRange, type TSafetyReadingKey } from '@/utils/PermitSafety'

/**
 * View-model helpers for step 3's reading cards. Everything here is DERIVED from the single
 * exported SAFETY_RANGES (PMT-001) — no bound, unit or reading list is re-typed, in this file,
 * in the component, in the schema, or in the locale files. The locale entries are templates
 * (`'{min} – {max}{unit}'`); the numbers are interpolated from SAFETY_RANGES at render time.
 */

const HINT_PREFIX = 'permit.create.steps.safetyChecks.hint'

export interface IReadingHint {
  key: string
  params: Record<string, string | number>
}

/**
 * Which locale template describes a range, chosen from the shape of the range itself:
 * both bounds → `range`; an upper bound of exactly 0 → `exact` ("must read 0%"); any other
 * upper bound → `atMost`; a lower bound only → `above` (advisory, e.g. height from ground).
 */
export function readingHint (reading: TSafetyReadingKey): IReadingHint {
  const range: ISafetyRange = SAFETY_RANGES.ranges[reading]
  const params: Record<string, string | number> = { unit: range.unit }

  if (range.min !== undefined && range.max !== undefined) {
    return { key: `${HINT_PREFIX}.range`, params: { ...params, min: range.min, max: range.max } }
  }
  if (range.max !== undefined) {
    const key = range.max === 0 ? `${HINT_PREFIX}.exact` : `${HINT_PREFIX}.atMost`
    return { key, params: { ...params, max: range.max } }
  }
  if (range.min !== undefined) {
    return { key: `${HINT_PREFIX}.above`, params: { ...params, min: range.min } }
  }
  return { key: `${HINT_PREFIX}.none`, params }
}

/**
 * Readings hidden by the outdoor bypass. SAFETY_RANGES.bypassableByOutdoor is the authority for
 * what validateReadings() skips; SO2 is added here for DISPLAY only — it is read off the same
 * gas detector, so hiding the gas grid must hide it too. It is advisory (`blocking: false`) and
 * never gates Next either way, so this display grouping cannot change a pass/fail verdict.
 */
export const ATMOSPHERE_READINGS: TSafetyReadingKey[] = [...SAFETY_RANGES.bypassableByOutdoor, 'so2']

export function isAtmosphereReading (reading: TSafetyReadingKey): boolean {
  return ATMOSPHERE_READINGS.includes(reading)
}

/** The gas grid for this permit type, in SAFETY_RANGES display order. */
export function atmosphereReadings (type: TPermitType): TSafetyReadingKey[] {
  return (SAFETY_RANGES.requiredByType[type] ?? []).filter(isAtmosphereReading)
}

/** Everything else this type asks for — wind / height for Working at Heights. */
export function environmentalReadings (type: TPermitType): TSafetyReadingKey[] {
  return (SAFETY_RANGES.requiredByType[type] ?? []).filter(
    (reading: TSafetyReadingKey): boolean => !isAtmosphereReading(reading)
  )
}

/**
 * The Indoor/Outdoor toggle only exists for types that have a bypassable reading. Working at
 * Heights is outdoors by definition and its wind reading is deliberately NOT bypassable
 * (SAFETY_RANGES.bypassableByOutdoor excludes it), so offering the toggle there would imply an
 * override that does not exist.
 */
export function supportsOutdoorBypass (type: TPermitType): boolean {
  return atmosphereReadings(type).some(
    (reading: TSafetyReadingKey): boolean => SAFETY_RANGES.bypassableByOutdoor.includes(reading)
  )
}

/** Instrument-photo slot key for a gas reading — upserted per `slotKey` by PATCH /permits/:id. */
export function instrumentSlotKey (reading: TSafetyReadingKey): string {
  return `instrument-${reading}`
}
