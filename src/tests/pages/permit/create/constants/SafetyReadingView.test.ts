import { describe, expect, it } from 'vitest'
import { EPermitType } from '@/enums/modules/permit/PermitType.enum'
import { SAFETY_RANGES, type TSafetyReadingKey } from '@/utils/PermitSafety'
import {
  atmosphereReadings, environmentalReadings, instrumentSlotKey, readingHint, supportsOutdoorBypass
} from '@/pages/permit/pages/create/constants/SafetyReadingView'

/**
 * PMT-006 acceptance: "the numbers are not re-typed here". These cases pin that the range hints
 * are BUILT from SAFETY_RANGES rather than written as literals — a hint always carries the exact
 * bound object the constant holds.
 */
describe('readingHint — derived from SAFETY_RANGES, never re-typed', () => {
  it.each(Object.keys(SAFETY_RANGES.ranges) as TSafetyReadingKey[])(
    'carries %s bounds and unit straight from the constant', (reading: TSafetyReadingKey) => {
      const range = SAFETY_RANGES.ranges[reading]
      const hint = readingHint(reading)

      expect(hint.params.unit).toBe(range.unit)
      if (range.min !== undefined && range.max !== undefined) {
        expect(hint.params).toEqual({ unit: range.unit, min: range.min, max: range.max })
      } else if (range.max !== undefined) {
        expect(hint.params).toEqual({ unit: range.unit, max: range.max })
      } else if (range.min !== undefined) {
        expect(hint.params).toEqual({ unit: range.unit, min: range.min })
      }
    }
  )

  it('picks the "must read exactly" template only for a zero upper bound (LEL)', () => {
    expect(readingHint('lel').key).toMatch(/\.exact$/)
    expect(readingHint('co').key).toMatch(/\.atMost$/)
    expect(readingHint('o2').key).toMatch(/\.range$/)
    expect(readingHint('height').key).toMatch(/\.above$/)
  })
})

describe('reading grouping', () => {
  it('renders the gas grid for hot and confined, and the environmental grid for heights', () => {
    expect(atmosphereReadings(EPermitType.HOT)).toEqual(['lel', 'o2'])
    expect(atmosphereReadings(EPermitType.CONFINED)).toEqual(['lel', 'o2', 'co', 'so2'])
    expect(atmosphereReadings(EPermitType.HEIGHTS)).toEqual([])
    expect(environmentalReadings(EPermitType.HEIGHTS)).toEqual(['wind', 'height'])
    expect(environmentalReadings(EPermitType.HOT)).toEqual([])
  })

  it('offers the Indoor/Outdoor toggle only where a bypassable reading exists', () => {
    expect(supportsOutdoorBypass(EPermitType.HOT)).toBe(true)
    expect(supportsOutdoorBypass(EPermitType.CONFINED)).toBe(true)
    // Wind is deliberately absent from SAFETY_RANGES.bypassableByOutdoor — no toggle, no implied override.
    expect(supportsOutdoorBypass(EPermitType.HEIGHTS)).toBe(false)
  })

  it('gives every instrument photo a stable, per-reading slotKey (photos upsert by slotKey)', () => {
    expect(instrumentSlotKey('lel')).toBe('instrument-lel')
    expect(new Set(atmosphereReadings(EPermitType.CONFINED).map(instrumentSlotKey)).size).toBe(4)
  })
})
