import { describe, expect, it } from 'vitest'
import { EJsaPhase } from '@/enums/modules/permit/JsaPhase.enum'
import {
  Step5JsaSchema, hasPartialJsaRow, jsaRowBlank, jsaRowComplete, toSubmittableJsaSteps
} from '@/pages/permit/pages/create/schema/Step5Jsa.schema'

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

  /**
   * wayfinder ticket 001 (field report item 4). A fully blank row is the "add row" button's own
   * placeholder — the field report's offending payload was exactly this, `{ step: '', hazard: '',
   * control: '', sortOrder: 1 }`, dropped at serialization and never sent. It must not block Next.
   */
  it('does NOT block Next on a fully blank row — it is dropped at serialization, never sent', () => {
    const result = Step5JsaSchema.safeParse({
      jsaSteps: [COMPLETE_ROW, { phase: EJsaPhase.PRE, step: '', hazard: '', control: '' }]
    })
    expect(result.success).toBe(true)
  })

  it('still blocks a row that is partially filled, not just fully blank', () => {
    const result = Step5JsaSchema.safeParse({
      jsaSteps: [{ phase: EJsaPhase.PRE, step: 'Isolate the line', hazard: '', control: '' }]
    })
    expect(result.success).toBe(false)
  })
})

describe('jsaRowComplete', () => {
  it('treats whitespace-only text as blank', () => {
    expect(jsaRowComplete(COMPLETE_ROW)).toBe(true)
    expect(jsaRowComplete({ ...COMPLETE_ROW, hazard: '  ' })).toBe(false)
  })
})

describe('jsaRowBlank', () => {
  it('is true only when all three fields are empty (or whitespace-only)', () => {
    expect(jsaRowBlank({ step: '', hazard: '', control: '' })).toBe(true)
    expect(jsaRowBlank({ step: '  ', hazard: '', control: '' })).toBe(true)
    expect(jsaRowBlank({ step: 'Isolate the line', hazard: '', control: '' })).toBe(false)
    expect(jsaRowBlank(COMPLETE_ROW)).toBe(false)
  })
})

describe('toSubmittableJsaSteps', () => {
  it('drops a fully blank row and keeps complete rows untouched', () => {
    const result = toSubmittableJsaSteps([
      COMPLETE_ROW,
      { phase: EJsaPhase.PRE, step: '', hazard: '', control: '', sortOrder: 1 }
    ])
    expect(result).toEqual([{ ...COMPLETE_ROW, sortOrder: 0 }])
  })

  it('also drops a partial row as a defensive default — callers must still check hasPartialJsaRow first', () => {
    const result = toSubmittableJsaSteps([
      { phase: EJsaPhase.PRE, step: 'Isolate the line', hazard: '', control: '' }
    ])
    expect(result).toEqual([])
  })

  it('recomputes sortOrder per phase over the surviving rows, closing the gap the dropped row left', () => {
    const result = toSubmittableJsaSteps([
      { ...COMPLETE_ROW, sortOrder: 0 },
      { phase: EJsaPhase.PRE, step: '', hazard: '', control: '', sortOrder: 1 },
      { ...COMPLETE_ROW, step: 'Second pre step', sortOrder: 2 },
      { ...COMPLETE_ROW, phase: EJsaPhase.POST, sortOrder: 0 }
    ])
    expect(result).toEqual([
      { ...COMPLETE_ROW, sortOrder: 0 },
      { ...COMPLETE_ROW, step: 'Second pre step', sortOrder: 1 },
      { ...COMPLETE_ROW, phase: EJsaPhase.POST, sortOrder: 0 }
    ])
  })
})

describe('hasPartialJsaRow', () => {
  it('is false for an all-complete or all-blank list', () => {
    expect(hasPartialJsaRow([COMPLETE_ROW])).toBe(false)
    expect(hasPartialJsaRow([{ step: '', hazard: '', control: '' }])).toBe(false)
    expect(hasPartialJsaRow([])).toBe(false)
  })

  it('is true as soon as any single row is partial, even alongside complete and blank rows', () => {
    expect(hasPartialJsaRow([{ step: 'Isolate the line', hazard: '', control: '' }])).toBe(true)
    expect(hasPartialJsaRow([
      COMPLETE_ROW,
      { step: '', hazard: '', control: '' },
      { step: '', hazard: 'Residual pressure', control: '' }
    ])).toBe(true)
  })
})
