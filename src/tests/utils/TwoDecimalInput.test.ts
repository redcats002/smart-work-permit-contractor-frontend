import { clampMaxValue, isAllowedTwoDecimalKeydown, parseTwoDecimalInput, sanitizeTwoDecimalRaw } from '@/utils/TwoDecimalInput'
import { describe, expect, it } from 'vitest'

describe('sanitizeTwoDecimalRaw', () => {
  it('removes non numeric characters except dot', () => {
    expect(sanitizeTwoDecimalRaw('a1,2b3.4c5')).toBe('123.45')
  })

  it('keeps only first decimal point', () => {
    expect(sanitizeTwoDecimalRaw('12.3.4.5')).toBe('12.345')
  })
})

describe('clampMaxValue', () => {
  it('returns original when max is not provided', () => {
    expect(clampMaxValue(120.5)).toBe(120.5)
  })

  it('clamps value to max', () => {
    expect(clampMaxValue(120.5, 100)).toBe(100)
  })
})

describe('parseTwoDecimalInput', () => {
  it('parses sanitized value', () => {
    expect(parseTwoDecimalInput('1,234.56')).toEqual({ raw: '1234.56', value: 1234.56 })
  })

  it('clamps parsed value to max and updates raw', () => {
    expect(parseTwoDecimalInput('999', 50)).toEqual({ raw: '50', value: 50 })
  })
})

describe('isAllowedTwoDecimalKeydown', () => {
  it('allows one decimal point', () => {
    const event = { key: '.', target: { value: '12' } } as KeyboardEvent | any
    expect(isAllowedTwoDecimalKeydown(event)).toBe(true)
  })

  it('blocks second decimal point', () => {
    const event = { key: '.', target: { value: '12.3' } } as KeyboardEvent | any
    expect(isAllowedTwoDecimalKeydown(event)).toBe(false)
  })
})
