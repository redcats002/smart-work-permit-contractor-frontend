import { describe, expect, it } from 'vitest'
import { Step3WhereWhenSchema } from '@/pages/permit/pages/create/schema/Step3WhereWhen.schema'

function validDraft (overrides: Partial<Record<string, unknown>> = {}): Record<string, unknown> {
  return {
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

  it.each(['startDate', 'endDate', 'dailyStart', 'dailyEnd'])(
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

  it('area/position/mapUrl/scheduleNote are all optional — geo is never a required field (068)', () => {
    expect(Step3WhereWhenSchema.safeParse(validDraft()).success).toBe(true)
  })

  it('accepts a bare "lat, lng" mapUrl', () => {
    expect(Step3WhereWhenSchema.safeParse(validDraft({ mapUrl: '13.7563, 100.5018' })).success).toBe(true)
  })

  it('accepts a Google Maps URL', () => {
    expect(Step3WhereWhenSchema.safeParse(validDraft({ mapUrl: 'https://www.google.com/maps/@13.7563,100.5018,17z' })).success).toBe(true)
  })

  // wayfinder 070's rule, verbatim: "unparseable input is a form error, never a silent no-op".
  it('rejects unparseable free text — a form error, never a silent no-op', () => {
    expect(Step3WhereWhenSchema.safeParse(validDraft({ mapUrl: 'not a coordinate' })).success).toBe(false)
  })

  it('rejects a maps.app.goo.gl shortener', () => {
    expect(Step3WhereWhenSchema.safeParse(validDraft({ mapUrl: 'https://maps.app.goo.gl/abc123' })).success).toBe(false)
  })

  it('rejects an out-of-range coordinate', () => {
    expect(Step3WhereWhenSchema.safeParse(validDraft({ mapUrl: '999, 100.5018' })).success).toBe(false)
  })

  it('accepts a valid position shape', () => {
    const result = Step3WhereWhenSchema.safeParse(validDraft({ position: { planId: 1, planX: 50, planY: 50 } }))
    expect(result.success).toBe(true)
  })

  it('accepts position: null (an explicit clear)', () => {
    expect(Step3WhereWhenSchema.safeParse(validDraft({ position: null })).success).toBe(true)
  })
})
