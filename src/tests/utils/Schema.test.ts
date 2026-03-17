import { schema } from '@/utils/Schema'
import { describe, expect, it } from 'vitest'

enum StatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

describe('schema', () => {
  describe('schema.id', () => {
    const idSchema = schema.id('รายการ')

    it('accepts a positive integer', () => {
      const result = idSchema.safeParse(1)
      expect(result.success).toBe(true)
    })

    it('accepts a positive integer from a string', () => {
      const result = idSchema.safeParse('5')
      expect(result.success).toBe(true)
    })

    it('extracts id from an object with id property', () => {
      const result = idSchema.safeParse({ id: 3 })
      expect(result.success).toBe(true)
    })

    it('extracts id from an object with string id property', () => {
      const result = idSchema.safeParse({ id: '7' })
      expect(result.success).toBe(true)
    })

    it('rejects undefined', () => {
      const result = idSchema.safeParse(undefined)
      expect(result.success).toBe(false)
    })

    it('rejects zero', () => {
      const result = idSchema.safeParse(0)
      expect(result.success).toBe(false)
    })

    it('rejects negative number', () => {
      const result = idSchema.safeParse(-1)
      expect(result.success).toBe(false)
    })

    it('includes the label in the error message', () => {
      const result = idSchema.safeParse(undefined)
      expect(result.success).toBe(false)
      if (!result.success) {
        const messages = result.error.issues.map((i: { message: string }) => i.message).join(' ')
        expect(messages).toContain('รายการ')
      }
    })
  })

  describe('schema.enum', () => {
    const enumSchemaTest = schema.enum(StatusEnum, 'สถานะ')

    it('accepts a valid enum string', () => {
      const result = enumSchemaTest.safeParse('ACTIVE')
      expect(result.success).toBe(true)
    })

    it('extracts enum value from an object with id property', () => {
      const result = enumSchemaTest.safeParse({ id: 'INACTIVE' })
      expect(result.success).toBe(true)
    })

    it('rejects an invalid enum value', () => {
      const result = enumSchemaTest.safeParse('UNKNOWN')
      expect(result.success).toBe(false)
    })

    it('rejects empty string', () => {
      const result = enumSchemaTest.safeParse('')
      expect(result.success).toBe(false)
    })
  })

  describe('schema.date', () => {
    const dateSchema = schema.date('วันที่')

    it('accepts a valid Date object and transforms to ISO string', () => {
      const result = dateSchema.safeParse(new Date('2024-06-15T12:00:00Z'))
      expect(result.success).toBe(true)
      if (result.success) {
        expect(typeof result.data).toBe('string')
        expect(result.data).toContain('2024-06-15')
      }
    })

    it('rejects a non-Date value (string)', () => {
      const result = dateSchema.safeParse('2024-06-15')
      expect(result.success).toBe(false)
    })

    it('rejects null', () => {
      const result = dateSchema.safeParse(null)
      expect(result.success).toBe(false)
    })

    it('rejects undefined', () => {
      const result = dateSchema.safeParse(undefined)
      expect(result.success).toBe(false)
    })
  })
})
