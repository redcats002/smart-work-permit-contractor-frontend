import { describe, expect, it } from 'vitest'
import { csvEscapeField, toCsv } from '@/utils/Csv'

describe('csvEscapeField', () => {
  it('leaves a plain field untouched', () => {
    expect(csvEscapeField('WP-HW-20260601-002')).toBe('WP-HW-20260601-002')
  })

  it('quotes a field containing a comma', () => {
    expect(csvEscapeField('Unit 100, Pump Station A')).toBe('"Unit 100, Pump Station A"')
  })

  it('quotes a field and doubles an embedded double quote', () => {
    expect(csvEscapeField('12" Flange Replacement')).toBe('"12"" Flange Replacement"')
  })

  it('quotes a field containing a newline', () => {
    expect(csvEscapeField('line one\nline two')).toBe('"line one\nline two"')
  })

  it('turns null/undefined into an empty field', () => {
    expect(csvEscapeField(null)).toBe('')
    expect(csvEscapeField(undefined)).toBe('')
  })
})

describe('toCsv', () => {
  it('joins escaped cells with commas and rows with CRLF', () => {
    const csv = toCsv([
      ['ID', 'TITLE'],
      ['WP-1', 'Flange, Repair']
    ])
    expect(csv).toBe('ID,TITLE\r\nWP-1,"Flange, Repair"')
  })

  it('round-trips Thai characters unescaped and unmangled', () => {
    const csv = toCsv([
      ['ID', 'TITLE'],
      ['WP-CS-20260610-005', 'ที่อับอากาศ · ถังเก็บสาร T-101']
    ])
    expect(csv).toContain('ที่อับอากาศ · ถังเก็บสาร T-101')
  })
})
