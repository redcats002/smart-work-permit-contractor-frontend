import { describe, expect, it } from 'vitest'
import { EPermitType } from '@/enums/modules/permit/PermitType.enum'
import { SAFETY_RANGES } from '@/utils/PermitSafety'
import { Step3SafetyChecksSchema } from '@/pages/permit/pages/create/schema/Step3SafetyChecks.schema'

/**
 * PMT-006. The bounds are NOT written here either — every expectation is derived from
 * SAFETY_RANGES, so a future change to a range moves this test with it instead of turning it red
 * for the wrong reason. Boundary behaviour itself is already pinned by src/tests/utils/PermitSafety.test.ts.
 */
const { ranges } = SAFETY_RANGES

const SAFE_GAS = { lel: ranges.lel.max, o2: ranges.o2.min, co: ranges.co.max }
const SAFE_HEIGHTS = { wind: ranges.wind.max, height: ranges.height.min }

describe('Step3SafetyChecksSchema', () => {
  it('rejects a draft with no permit type — step 3 cannot know what to ask for', () => {
    expect(Step3SafetyChecksSchema.safeParse({ safetyReading: SAFE_GAS }).success).toBe(false)
  })

  it('blocks Next while a required reading is missing', () => {
    const result = Step3SafetyChecksSchema.safeParse({ type: EPermitType.HOT, safetyReading: {} })
    expect(result.success).toBe(false)
  })

  it('accepts hot work once LEL and O2 are within range', () => {
    const result = Step3SafetyChecksSchema.safeParse({
      type: EPermitType.HOT,
      safetyReading: { lel: ranges.lel.max, o2: ranges.o2.min }
    })
    expect(result.success).toBe(true)
  })

  it('blocks Next when a reading is out of range, and names the failing reading in the issue path', () => {
    const result = Step3SafetyChecksSchema.safeParse({
      type: EPermitType.HOT,
      safetyReading: { lel: (ranges.lel.max ?? 0) + 1, o2: ranges.o2.min }
    })
    expect(result.success).toBe(false)
    if (result.success) return
    expect(result.error.issues.map((issue: { path: PropertyKey[] }): PropertyKey[] => issue.path))
      .toContainEqual(['safetyReading', 'lel'])
  })

  it('requires CO for confined space but never blocks on SO2 — SO2 is advisory (blocking: false)', () => {
    const withoutCo = Step3SafetyChecksSchema.safeParse({
      type: EPermitType.CONFINED,
      safetyReading: { lel: ranges.lel.max, o2: ranges.o2.min }
    })
    expect(withoutCo.success).toBe(false)

    const withoutSo2 = Step3SafetyChecksSchema.safeParse({
      type: EPermitType.CONFINED,
      safetyReading: SAFE_GAS
    })
    expect(withoutSo2.success).toBe(true)

    const badSo2 = Step3SafetyChecksSchema.safeParse({
      type: EPermitType.CONFINED,
      safetyReading: { ...SAFE_GAS, so2: (ranges.so2.max ?? 0) + 100 }
    })
    expect(badSo2.success).toBe(true)
  })

  it('lets outdoorWork bypass the gas readings entirely', () => {
    const indoors = Step3SafetyChecksSchema.safeParse({ type: EPermitType.CONFINED, safetyReading: {} })
    expect(indoors.success).toBe(false)

    const outdoors = Step3SafetyChecksSchema.safeParse({
      type: EPermitType.CONFINED,
      outdoorWork: true,
      safetyReading: {}
    })
    expect(outdoors.success).toBe(true)
  })

  it('never lets outdoorWork bypass wind — Working at Heights is outdoors by definition', () => {
    const result = Step3SafetyChecksSchema.safeParse({
      type: EPermitType.HEIGHTS,
      outdoorWork: true,
      safetyReading: {}
    })
    expect(result.success).toBe(false)

    const overWindLimit = Step3SafetyChecksSchema.safeParse({
      type: EPermitType.HEIGHTS,
      outdoorWork: true,
      safetyReading: { ...SAFE_HEIGHTS, wind: (ranges.wind.max ?? 0) + 0.1 }
    })
    expect(overWindLimit.success).toBe(false)
  })

  it('never blocks Working at Heights on height-from-ground — it is informational only', () => {
    const result = Step3SafetyChecksSchema.safeParse({
      type: EPermitType.HEIGHTS,
      safetyReading: { wind: ranges.wind.max }
    })
    expect(result.success).toBe(true)
  })

  it('treats a null reading as missing, not as zero', () => {
    const result = Step3SafetyChecksSchema.safeParse({
      type: EPermitType.HOT,
      safetyReading: { lel: null, o2: ranges.o2.min }
    })
    expect(result.success).toBe(false)
  })
})
