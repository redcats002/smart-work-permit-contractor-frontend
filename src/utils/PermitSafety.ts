import type { TPermitType } from '@/enums/modules/permit/PermitType.enum'
import { EPermitType } from '@/enums/modules/permit/PermitType.enum'

/**
 * Single source of truth for permit safety-reading numbers. Both the wizard's zod
 * schemas and the inline pass/fail UI must import SAFETY_RANGES / validateReadings
 * from here instead of re-typing any of these numbers.
 *
 * Backend is authoritative — this is client-side convenience only. See
 * docs/modules/permit/context.md and AGENTS.md "Business rules that must not drift".
 */
export type TSafetyReadingKey = 'lel' | 'o2' | 'co' | 'so2' | 'wind' | 'height'

export interface ISafetyRange {
  /** Inclusive lower bound. Undefined = no lower bound. */
  min?: number
  /** Inclusive upper bound. Undefined = no upper bound. */
  max?: number
  unit: string
  /**
   * false = advisory only (SO2 guidance range, height-from-ground informational
   * threshold) — never produces a validateReadings() failure, even out of range.
   */
  blocking: boolean
}

export interface ISafetyRanges {
  ranges: Record<TSafetyReadingKey, ISafetyRange>
  /** Which readings each permit type requires, in wizard display order. */
  requiredByType: Record<TPermitType, TSafetyReadingKey[]>
  /** Readings skipped entirely when the permit is flagged outdoorWork: true. */
  bypassableByOutdoor: TSafetyReadingKey[]
}

export const SAFETY_RANGES: ISafetyRanges = {
  ranges: {
    lel: { max: 0, unit: '%', blocking: true },
    o2: { min: 19.5, max: 23.5, unit: '%', blocking: true },
    co: { max: 50, unit: 'ppm', blocking: true },
    so2: { max: 10, unit: 'ppm', blocking: false },
    wind: { max: 25, unit: 'km/h', blocking: true },
    height: { min: 4, unit: 'm', blocking: false }
  },
  requiredByType: {
    [EPermitType.HOT]: ['lel', 'o2'],
    [EPermitType.CONFINED]: ['lel', 'o2', 'co', 'so2'],
    [EPermitType.HEIGHTS]: ['wind', 'height']
  },
  // Wind is deliberately absent — Working at Heights is outdoors by definition,
  // so its wind reading is never bypassable.
  bypassableByOutdoor: ['lel', 'o2', 'co']
}

export type TReadingFailureReason = 'MISSING' | 'OUT_OF_RANGE'

export interface IReadingFailure {
  reading: TSafetyReadingKey
  reason: TReadingFailureReason
}

export type TSafetyReadings = Partial<Record<TSafetyReadingKey, number | null | undefined>>

/**
 * Pure function — no I/O, no defaults baked in beyond SAFETY_RANGES itself.
 * Returns every failing required reading for `type` (empty array = pass).
 *
 * - Non-blocking readings (SO2, height) never appear in the result, even when
 *   missing or out of range — they are advisory/informational only.
 * - `outdoorWork` skips readings listed in SAFETY_RANGES.bypassableByOutdoor
 *   (LEL/O2/CO) entirely — they are neither MISSING nor OUT_OF_RANGE.
 */
export function validateReadings (
  type: TPermitType,
  readings: TSafetyReadings,
  outdoorWork: boolean
): IReadingFailure[] {
  const required = SAFETY_RANGES.requiredByType[type] ?? []
  const failures: IReadingFailure[] = []

  for (const key of required) {
    const range = SAFETY_RANGES.ranges[key]
    if (!range.blocking) continue

    const bypassed = outdoorWork && SAFETY_RANGES.bypassableByOutdoor.includes(key)
    if (bypassed) continue

    const value = readings[key]
    if (typeof value !== 'number' || Number.isNaN(value)) {
      failures.push({ reading: key, reason: 'MISSING' })
      continue
    }

    const belowMin = range.min !== undefined && value < range.min
    const aboveMax = range.max !== undefined && value > range.max
    if (belowMin || aboveMax) {
      failures.push({ reading: key, reason: 'OUT_OF_RANGE' })
    }
  }

  return failures
}
