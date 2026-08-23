import { describe, expect, it } from 'vitest'
import { Step2BasicInfoSchema } from '@/pages/permit/pages/create/schema/Step2BasicInfo.schema'

function validDraft (overrides: Partial<Record<string, unknown>> = {}): Record<string, unknown> {
  return {
    title: 'Warehouse repaint',
    foreman: 'Somchai',
    location: 'Zone 3',
    workDate: '2026-08-20',
    workTimeStart: '2026-08-20T01:00:00.000Z',
    workTimeEnd: '2026-08-20T09:00:00.000Z',
    ...overrides
  }
}

describe('Step2BasicInfoSchema', () => {
  it('accepts a complete, well-ordered draft', () => {
    expect(Step2BasicInfoSchema.safeParse(validDraft()).success).toBe(true)
  })

  it.each(['title', 'foreman', 'location', 'workDate', 'workTimeStart', 'workTimeEnd'])(
    'rejects when %s is missing — matches hasCreatableDraft (useWizard.ts)', (field: string) => {
      const draft = validDraft({ [field]: '' })
      expect(Step2BasicInfoSchema.safeParse(draft).success).toBe(false)
    }
  )

  it('rejects when end time is not after start time', () => {
    const result = Step2BasicInfoSchema.safeParse(validDraft({
      workTimeStart: '2026-08-20T09:00:00.000Z',
      workTimeEnd: '2026-08-20T09:00:00.000Z'
    }))
    expect(result.success).toBe(false)
  })

  it('rejects when end time is before start time', () => {
    const result = Step2BasicInfoSchema.safeParse(validDraft({
      workTimeStart: '2026-08-20T09:00:00.000Z',
      workTimeEnd: '2026-08-20T01:00:00.000Z'
    }))
    expect(result.success).toBe(false)
  })

  it('ignores unrelated keys on the accumulated wizard formData (e.g. type, jsaSteps)', () => {
    expect(Step2BasicInfoSchema.safeParse(validDraft({ type: 'hot', jsaSteps: [] })).success).toBe(true)
  })
})
