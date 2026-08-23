import { describe, expect, it } from 'vitest'
import { EJsaPhase } from '@/enums/modules/permit/JsaPhase.enum'
import { Step5JsaSchema, jsaRowComplete } from '@/pages/permit/pages/create/schema/Step5Jsa.schema'

const COMPLETE_ROW = {
  phase: EJsaPhase.PRE,
  step: 'Isolate the line',
  hazard: 'Residual pressure',
  control: 'Lockout / tagout'
}

describe('Step5JsaSchema', () => {
  /**
   * REGRESSION — the create wizard's dead end. The old "at least one JSA row" minimum was never in
   * the backend contract (PATCH accepts an empty `jsaSteps`, submit never checks it) and the
   * product owner dropped it (../PROMPT-LOG.md, session 2). `jsaSteps` starts empty, so while the
   * rule stood, step 5's Next was disabled on arrival and the only way forward was an "add step"
   * button the footer's blocked note never mentioned.
   */
  it('does NOT block Next on an empty JSA — the server accepts an empty jsaSteps', () => {
    expect(Step5JsaSchema.safeParse({}).success).toBe(true)
    expect(Step5JsaSchema.safeParse({ jsaSteps: [] }).success).toBe(true)
  })

  it('accepts one complete row anywhere', () => {
    expect(Step5JsaSchema.safeParse({ jsaSteps: [COMPLETE_ROW] }).success).toBe(true)
    expect(Step5JsaSchema.safeParse({
      jsaSteps: [{ ...COMPLETE_ROW, phase: EJsaPhase.POST }]
    }).success).toBe(true)
  })

  it.each(['step', 'hazard', 'control'])(
    'blocks a row with a blank %s — all three are minLength: 1 on the wire', (field: string) => {
      const result = Step5JsaSchema.safeParse({ jsaSteps: [{ ...COMPLETE_ROW, [field]: '' }] })
      expect(result.success).toBe(false)
    }
  )

  it('names the offending row index in the issue path', () => {
    const result = Step5JsaSchema.safeParse({
      jsaSteps: [COMPLETE_ROW, { ...COMPLETE_ROW, phase: EJsaPhase.PROCESS, control: '   ' }]
    })
    expect(result.success).toBe(false)
    if (result.success) return
    expect(result.error.issues.map((issue: { path: PropertyKey[] }): PropertyKey[] => issue.path))
      .toContainEqual(['jsaSteps', 1])
  })

  it('rejects an unknown phase', () => {
    expect(Step5JsaSchema.safeParse({ jsaSteps: [{ ...COMPLETE_ROW, phase: 'during' }] }).success).toBe(false)
  })
})

describe('jsaRowComplete', () => {
  it('treats whitespace-only text as blank', () => {
    expect(jsaRowComplete(COMPLETE_ROW)).toBe(true)
    expect(jsaRowComplete({ ...COMPLETE_ROW, hazard: '  ' })).toBe(false)
  })
})
