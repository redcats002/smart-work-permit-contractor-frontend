import { describe, expect, it } from 'vitest'
import { Step1TypeSchema } from '@/pages/permit/pages/create/schema/Step1Type.schema'

describe('Step1TypeSchema', () => {
  it('accepts each real permit type', () => {
    for (const type of ['hot', 'confined', 'heights']) {
      expect(Step1TypeSchema.safeParse({ type }).success).toBe(true)
    }
  })

  it('rejects a missing type', () => {
    expect(Step1TypeSchema.safeParse({}).success).toBe(false)
  })

  it('rejects an unknown type value', () => {
    expect(Step1TypeSchema.safeParse({ type: 'unknown' }).success).toBe(false)
  })

  it('ignores unrelated keys on the accumulated wizard formData', () => {
    expect(Step1TypeSchema.safeParse({ type: 'hot', title: 'Warehouse repaint' }).success).toBe(true)
  })
})
