import { describe, expect, it } from 'vitest'
import { Step2BasicInfoSchema } from '@/pages/permit/pages/create/schema/Step2BasicInfo.schema'

function validDraft (overrides: Partial<Record<string, unknown>> = {}): Record<string, unknown> {
  return {
    title: 'Warehouse repaint',
    foreman: 'Somchai',
    ...overrides
  }
}

/**
 * wayfinder 070 moved the date/time fields to Step3WhereWhen.schema.ts — see its own test file.
 * wayfinder 107 moved `location` there too (the "location detail" field, same wire field, under
 * a new label) — this step now only asserts title + foreman.
 */
describe('Step2BasicInfoSchema', () => {
  it('accepts a complete draft', () => {
    expect(Step2BasicInfoSchema.safeParse(validDraft()).success).toBe(true)
  })

  it.each(['title', 'foreman'])(
    'rejects when %s is missing — matches hasCreatableDraft (useWizard.ts)', (field: string) => {
      const draft = validDraft({ [field]: '' })
      expect(Step2BasicInfoSchema.safeParse(draft).success).toBe(false)
    }
  )

  it('ignores unrelated keys on the accumulated wizard formData (e.g. type, jsaSteps, startDate)', () => {
    expect(Step2BasicInfoSchema.safeParse(validDraft({ type: 'hot', jsaSteps: [], startDate: '2026-08-20' })).success).toBe(true)
  })
})
