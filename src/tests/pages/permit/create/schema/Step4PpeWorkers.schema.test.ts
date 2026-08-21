import { describe, expect, it } from 'vitest'
import { EPermitType } from '@/enums/modules/permit/PermitType.enum'
import { Step4PpeWorkersSchema } from '@/pages/permit/pages/create/schema/Step4PpeWorkers.schema'

const HEALTHY = { bloodPressure: '119/78', alcoholReading: '0.00' }

describe('Step4PpeWorkersSchema', () => {
  it('rejects a draft with no permit type — the role options depend on it', () => {
    expect(Step4PpeWorkersSchema.safeParse({ workers: [] }).success).toBe(false)
  })

  it('does NOT invent a minimum worker count — the backend has no such rule', () => {
    expect(Step4PpeWorkersSchema.safeParse({ type: EPermitType.HOT, workers: [] }).success).toBe(true)
    expect(Step4PpeWorkersSchema.safeParse({ type: EPermitType.HOT }).success).toBe(true)
  })

  it('does NOT require every photo slot to be filled — also not in the contract', () => {
    const result = Step4PpeWorkersSchema.safeParse({
      type: EPermitType.HOT,
      photos: [],
      workers: [{ workerName: 'Somchai', roleOnPermit: 'Operator' }]
    })
    expect(result.success).toBe(true)
  })

  it('blocks Next on a half-filled row — both fields are minLength: 1 on the wire', () => {
    expect(Step4PpeWorkersSchema.safeParse({
      type: EPermitType.HOT,
      workers: [{ workerName: 'Somchai', roleOnPermit: '' }]
    }).success).toBe(false)

    expect(Step4PpeWorkersSchema.safeParse({
      type: EPermitType.HOT,
      workers: [{ workerName: '', roleOnPermit: 'Operator' }]
    }).success).toBe(false)
  })

  it('blocks Next while any Confined Space worker fails the health check', () => {
    const result = Step4PpeWorkersSchema.safeParse({
      type: EPermitType.CONFINED,
      workers: [
        { workerName: 'Somchai', roleOnPermit: 'Entrant', ...HEALTHY },
        { workerName: 'Krit', roleOnPermit: 'Attendant', bloodPressure: '119/78', alcoholReading: '0.03' }
      ]
    })
    expect(result.success).toBe(false)
    if (result.success) return
    expect(result.error.issues.map((issue: { path: PropertyKey[] }): PropertyKey[] => issue.path))
      .toContainEqual(['workers', 1])
  })

  it('unblocks once every Confined Space worker passes', () => {
    const result = Step4PpeWorkersSchema.safeParse({
      type: EPermitType.CONFINED,
      workers: [
        { workerName: 'Somchai', roleOnPermit: 'Entrant', ...HEALTHY },
        { workerName: 'Krit', roleOnPermit: 'Attendant', ...HEALTHY }
      ]
    })
    expect(result.success).toBe(true)
  })

  it('does not health-gate hot work or heights — those types register no health check', () => {
    for (const type of [EPermitType.HOT, EPermitType.HEIGHTS]) {
      const result = Step4PpeWorkersSchema.safeParse({
        type,
        workers: [{ workerName: 'Somchai', roleOnPermit: 'Operator' }]
      })
      expect(result.success).toBe(true)
    }
  })
})
