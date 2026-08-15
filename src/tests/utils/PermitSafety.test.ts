import { EPermitType } from '@/enums/modules/permit/PermitType.enum'
import { SAFETY_RANGES, validateReadings } from '@/utils/PermitSafety'
import { describe, expect, it } from 'vitest'

describe('SAFETY_RANGES', () => {
  it('encodes the exact numbers from AGENTS.md / docs/modules/permit/context.md', () => {
    expect(SAFETY_RANGES.ranges.lel).toEqual({ max: 0, unit: '%', blocking: true })
    expect(SAFETY_RANGES.ranges.o2).toEqual({ min: 19.5, max: 23.5, unit: '%', blocking: true })
    expect(SAFETY_RANGES.ranges.co).toEqual({ max: 50, unit: 'ppm', blocking: true })
    expect(SAFETY_RANGES.ranges.wind).toEqual({ max: 25, unit: 'km/h', blocking: true })
    expect(SAFETY_RANGES.ranges.so2.blocking).toBe(false)
    expect(SAFETY_RANGES.ranges.height.blocking).toBe(false)
  })

  it('requires the right readings per permit type', () => {
    expect(SAFETY_RANGES.requiredByType[EPermitType.HOT]).toEqual(['lel', 'o2'])
    expect(SAFETY_RANGES.requiredByType[EPermitType.CONFINED]).toEqual(['lel', 'o2', 'co', 'so2'])
    expect(SAFETY_RANGES.requiredByType[EPermitType.HEIGHTS]).toEqual(['wind', 'height'])
  })

  it('never lists wind as bypassable by outdoorWork', () => {
    expect(SAFETY_RANGES.bypassableByOutdoor).not.toContain('wind')
    expect(SAFETY_RANGES.bypassableByOutdoor).toEqual(['lel', 'o2', 'co'])
  })
})

describe('validateReadings — LEL boundary (Hot Work)', () => {
  it('passes at exactly 0', () => {
    const failures = validateReadings(EPermitType.HOT, { lel: 0, o2: 20.9 }, false)
    expect(failures).toEqual([])
  })

  it('fails at 0.1', () => {
    const failures = validateReadings(EPermitType.HOT, { lel: 0.1, o2: 20.9 }, false)
    expect(failures).toContainEqual({ reading: 'lel', reason: 'OUT_OF_RANGE' })
  })
})

describe('validateReadings — O2 boundary (Hot Work)', () => {
  it('fails at 19.4 (below min)', () => {
    const failures = validateReadings(EPermitType.HOT, { lel: 0, o2: 19.4 }, false)
    expect(failures).toContainEqual({ reading: 'o2', reason: 'OUT_OF_RANGE' })
  })

  it('passes at 19.5 (inclusive min)', () => {
    const failures = validateReadings(EPermitType.HOT, { lel: 0, o2: 19.5 }, false)
    expect(failures).toEqual([])
  })

  it('passes at 23.5 (inclusive max)', () => {
    const failures = validateReadings(EPermitType.HOT, { lel: 0, o2: 23.5 }, false)
    expect(failures).toEqual([])
  })

  it('fails at 23.6 (above max)', () => {
    const failures = validateReadings(EPermitType.HOT, { lel: 0, o2: 23.6 }, false)
    expect(failures).toContainEqual({ reading: 'o2', reason: 'OUT_OF_RANGE' })
  })
})

describe('validateReadings — CO boundary (Confined Space)', () => {
  const base = { lel: 0, o2: 20.9, so2: 2 }

  it('passes at 50', () => {
    const failures = validateReadings(EPermitType.CONFINED, { ...base, co: 50 }, false)
    expect(failures).toEqual([])
  })

  it('fails at 50.1', () => {
    const failures = validateReadings(EPermitType.CONFINED, { ...base, co: 50.1 }, false)
    expect(failures).toContainEqual({ reading: 'co', reason: 'OUT_OF_RANGE' })
  })
})

describe('validateReadings — wind boundary (Working at Heights)', () => {
  it('passes at 25', () => {
    const failures = validateReadings(EPermitType.HEIGHTS, { wind: 25, height: 8 }, false)
    expect(failures).toEqual([])
  })

  it('fails at 25.1', () => {
    const failures = validateReadings(EPermitType.HEIGHTS, { wind: 25.1, height: 8 }, false)
    expect(failures).toContainEqual({ reading: 'wind', reason: 'OUT_OF_RANGE' })
  })
})

describe('validateReadings — outdoor bypass', () => {
  it('skips LEL/O2/CO entirely when outdoorWork is true, even if missing', () => {
    const failures = validateReadings(EPermitType.CONFINED, {}, true)
    expect(failures).toEqual([])
  })

  it('does NOT bypass wind for Heights when outdoorWork is true', () => {
    const failures = validateReadings(EPermitType.HEIGHTS, { wind: 25.1, height: 8 }, true)
    expect(failures).toContainEqual({ reading: 'wind', reason: 'OUT_OF_RANGE' })
  })

  it('still bypasses gas for Hot Work outdoors even when a value is out of range', () => {
    const failures = validateReadings(EPermitType.HOT, { lel: 5, o2: 10 }, true)
    expect(failures).toEqual([])
  })
})

describe('validateReadings — missing required readings', () => {
  it('fails a Confined Space permit missing CO', () => {
    const failures = validateReadings(EPermitType.CONFINED, { lel: 0, o2: 20.9 }, false)
    expect(failures).toContainEqual({ reading: 'co', reason: 'MISSING' })
  })

  it('fails a Hot Work permit missing O2', () => {
    const failures = validateReadings(EPermitType.HOT, { lel: 0 }, false)
    expect(failures).toContainEqual({ reading: 'o2', reason: 'MISSING' })
  })

  it('treats NaN the same as missing', () => {
    const failures = validateReadings(EPermitType.HOT, { lel: 0, o2: Number.NaN }, false)
    expect(failures).toContainEqual({ reading: 'o2', reason: 'MISSING' })
  })
})

describe('validateReadings — SO2 and height are advisory, never blocking', () => {
  it('does not fail Confined Space when SO2 is far outside the 10ppm guidance', () => {
    const failures = validateReadings(EPermitType.CONFINED, { lel: 0, o2: 20.9, co: 12, so2: 999 }, false)
    expect(failures).toEqual([])
  })

  it('does not fail Confined Space when SO2 is missing entirely', () => {
    const failures = validateReadings(EPermitType.CONFINED, { lel: 0, o2: 20.9, co: 12 }, false)
    expect(failures).toEqual([])
  })

  it('does not fail Heights when height-from-ground is missing', () => {
    const failures = validateReadings(EPermitType.HEIGHTS, { wind: 12 }, false)
    expect(failures).toEqual([])
  })

  it('does not fail Heights when height-from-ground exceeds the informational 4m threshold', () => {
    const failures = validateReadings(EPermitType.HEIGHTS, { wind: 12, height: 40 }, false)
    expect(failures).toEqual([])
  })
})

describe('validateReadings — full pass scenarios', () => {
  it('passes a fully-in-range Confined Space permit', () => {
    const failures = validateReadings(EPermitType.CONFINED, { lel: 0, o2: 20.9, co: 12, so2: 2 }, false)
    expect(failures).toEqual([])
  })
})
