import { describe, expect, it } from 'vitest'
import { Step3WhereWhenSchema } from '@/pages/permit/pages/create/schema/Step3WhereWhen.schema'

function validDraft (overrides: Partial<Record<string, unknown>> = {}): Record<string, unknown> {
  return {
    location: 'North corner, near the loading dock',
    startDate: '2026-08-20',
    endDate: '2026-08-20',
    dailyStart: '1970-01-01T01:00:00.000Z',
    dailyEnd: '1970-01-01T09:00:00.000Z',
    ...overrides
  }
}

describe('Step3WhereWhenSchema', () => {
  it('accepts a complete, well-ordered single-day window', () => {
    expect(Step3WhereWhenSchema.safeParse(validDraft()).success).toBe(true)
  })

  it('accepts a multi-day window (wayfinder 067)', () => {
    expect(Step3WhereWhenSchema.safeParse(validDraft({ startDate: '2026-08-20', endDate: '2026-08-25' })).success).toBe(true)
  })

  it.each(['startDate', 'endDate', 'dailyStart', 'dailyEnd', 'location'])(
    'rejects when %s is missing', (field: string) => {
      expect(Step3WhereWhenSchema.safeParse(validDraft({ [field]: '' })).success).toBe(false)
    }
  )

  it('rejects when endDate precedes startDate', () => {
    const result = Step3WhereWhenSchema.safeParse(validDraft({ startDate: '2026-08-20', endDate: '2026-08-19' }))
    expect(result.success).toBe(false)
  })

  it('accepts endDate equal to startDate', () => {
    expect(Step3WhereWhenSchema.safeParse(validDraft({ startDate: '2026-08-20', endDate: '2026-08-20' })).success).toBe(true)
  })

  it('rejects when the daily end time is not after the daily start time', () => {
    const result = Step3WhereWhenSchema.safeParse(validDraft({
      dailyStart: '1970-01-01T09:00:00.000Z',
      dailyEnd: '1970-01-01T09:00:00.000Z'
    }))
    expect(result.success).toBe(false)
  })

  it('rejects when the daily end time is before the daily start time', () => {
    const result = Step3WhereWhenSchema.safeParse(validDraft({
      dailyStart: '1970-01-01T09:00:00.000Z',
      dailyEnd: '1970-01-01T01:00:00.000Z'
    }))
    expect(result.success).toBe(false)
  })

  it('ignores unrelated keys on the accumulated wizard formData (e.g. type, title)', () => {
    expect(Step3WhereWhenSchema.safeParse(validDraft({ type: 'hot', title: 'x' })).success).toBe(true)
  })

  // wayfinder 107 — pinId is never required here: whether a pin is OWED depends on async
  // external state (whether an active pin on an active plan exists) that a zod schema can't see.
  // That gate stays in usePinPreflight/useWizard.isNextBlocked, unchanged by this schema.
  it('areaId/pinId/scheduleNote are all optional', () => {
    expect(Step3WhereWhenSchema.safeParse(validDraft()).success).toBe(true)
  })

  it('accepts a real pinId', () => {
    expect(Step3WhereWhenSchema.safeParse(validDraft({ pinId: 12 })).success).toBe(true)
  })

  it('accepts pinId: null (an explicit clear)', () => {
    expect(Step3WhereWhenSchema.safeParse(validDraft({ pinId: null })).success).toBe(true)
  })

  it('rejects a non-number pinId', () => {
    expect(Step3WhereWhenSchema.safeParse(validDraft({ pinId: 'not-a-number' })).success).toBe(false)
  })
})
