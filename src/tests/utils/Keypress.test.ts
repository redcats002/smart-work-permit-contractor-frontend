import { emailNoThai, number, numberNoDecimal, numberTwoDecimal, telInput, telInputWithPrefix } from '@/utils/Keypress'
import { describe, expect, it, vi } from 'vitest'

function createEvent (charCode: number, options: {
  targetValue?: string
  selectionStart?: number
  key?: string
  ctrlKey?: boolean
  metaKey?: boolean
} = {}): any {
  const event = {
    which: charCode,
    keyCode: charCode,
    key: options.key ?? String.fromCharCode(charCode),
    ctrlKey: options.ctrlKey ?? false,
    metaKey: options.metaKey ?? false,
    preventDefault: vi.fn(),
    target: {
      value: options.targetValue ?? '',
      selectionStart: options.selectionStart ?? 0
    }
  }
  return event
}

describe('number', () => {
  it('allows digit characters (0-9)', () => {
    for (let code = 48; code <= 57; code++) {
      const event = createEvent(code)
      expect(number(event)).toBe(true)
      expect(event.preventDefault).not.toHaveBeenCalled()
    }
  })

  it('allows decimal point (charCode 46)', () => {
    const event = createEvent(46)
    expect(number(event)).toBe(true)
  })

  it('blocks letters', () => {
    const event = createEvent(65) // 'A'
    expect(number(event)).toBe(false)
    expect(event.preventDefault).toHaveBeenCalled()
  })

  it('allows control characters (charCode <= 31)', () => {
    const event = createEvent(8) // Backspace
    expect(number(event)).toBe(true)
  })
})

describe('numberNoDecimal', () => {
  it('allows digits (0-9)', () => {
    const event = createEvent(49) // '1'
    expect(numberNoDecimal(event)).toBe(true)
  })

  it('blocks decimal point (charCode 46)', () => {
    const event = createEvent(46) // '.'
    expect(numberNoDecimal(event)).toBe(false)
    expect(event.preventDefault).toHaveBeenCalled()
  })

  it('blocks letters', () => {
    const event = createEvent(65) // 'A'
    expect(numberNoDecimal(event)).toBe(false)
  })

  it('blocks exceeding 100 for PERCENTAGE type', () => {
    const event = createEvent(49) // pressing '1'
    const result = numberNoDecimal(event, 'PERCENTAGE', 100)
    expect(result).toBe(false)
    expect(event.preventDefault).toHaveBeenCalled()
  })

  it('allows digit for PERCENTAGE when value stays within 100', () => {
    const event = createEvent(49) // pressing '1', current value is 9 → new value would be 91
    const result = numberNoDecimal(event, 'PERCENTAGE', 9)
    expect(result).toBe(true)
  })
})

describe('numberTwoDecimal', () => {
  it('allows digits', () => {
    const event = createEvent(49)
    expect(numberTwoDecimal(event)).toBe(true)
  })

  it('allows first decimal point', () => {
    const event = createEvent(46, { targetValue: '123' })
    expect(numberTwoDecimal(event)).toBe(true)
  })

  it('blocks second decimal point', () => {
    const event = createEvent(46, { targetValue: '123.45' })
    expect(numberTwoDecimal(event)).toBe(false)
    expect(event.preventDefault).toHaveBeenCalled()
  })

  it('blocks a 3rd decimal digit when cursor is after decimal', () => {
    const event = createEvent(49, { targetValue: '123.45', selectionStart: 6 }) // cursor at end: '123.45|'
    expect(numberTwoDecimal(event)).toBe(false)
    expect(event.preventDefault).toHaveBeenCalled()
  })

  it('allows digit when cursor is before decimal even if 2 decimal places exist', () => {
    const event = createEvent(49, { targetValue: '123.45', selectionStart: 1 }) // cursor after '1'
    expect(numberTwoDecimal(event)).toBe(true)
  })
})

describe('telInput', () => {
  it('allows digits', () => {
    const event = createEvent(49)
    expect(telInput(event)).toBe(true)
  })

  it('allows plus sign (charCode 43)', () => {
    const event = createEvent(43)
    expect(telInput(event)).toBe(true)
  })

  it('blocks letters', () => {
    const event = createEvent(65)
    expect(telInput(event)).toBe(false)
    expect(event.preventDefault).toHaveBeenCalled()
  })

  it('blocks decimal point (charCode 46)', () => {
    const event = createEvent(46)
    expect(telInput(event)).toBe(false)
  })
})

describe('telInputWithPrefix', () => {
  it('allows space (32)', () => {
    const event = createEvent(32)
    expect(telInputWithPrefix(event)).toBe(true)
  })

  it('allows parentheses (40, 41)', () => {
    expect(telInputWithPrefix(createEvent(40))).toBe(true)
    expect(telInputWithPrefix(createEvent(41))).toBe(true)
  })

  it('allows plus (43) and minus (45)', () => {
    expect(telInputWithPrefix(createEvent(43))).toBe(true)
    expect(telInputWithPrefix(createEvent(45))).toBe(true)
  })

  it('still delegates to telInput for digits', () => {
    const event = createEvent(49)
    expect(telInputWithPrefix(event)).toBe(true)
  })
})

describe('emailNoThai', () => {
  it('allows regular ASCII characters', () => {
    const event = createEvent(65, { key: 'a' })
    expect(emailNoThai(event)).toBe(true)
  })

  it('blocks Thai characters', () => {
    const event = createEvent(0, { key: 'ก' }) // ก is a Thai character
    expect(emailNoThai(event)).toBe(false)
    expect(event.preventDefault).toHaveBeenCalled()
  })

  it('allows Backspace', () => {
    const event = createEvent(8, { key: 'Backspace' })
    expect(emailNoThai(event)).toBe(true)
  })

  it('allows Delete', () => {
    const event = createEvent(46, { key: 'Delete' })
    expect(emailNoThai(event)).toBe(true)
  })

  it('allows ArrowLeft and ArrowRight', () => {
    expect(emailNoThai(createEvent(0, { key: 'ArrowLeft' }))).toBe(true)
    expect(emailNoThai(createEvent(0, { key: 'ArrowRight' }))).toBe(true)
  })

  it('allows Tab', () => {
    expect(emailNoThai(createEvent(9, { key: 'Tab' }))).toBe(true)
  })

  it('allows ctrl+c (ctrlKey)', () => {
    const event = createEvent(67, { key: 'c', ctrlKey: true })
    expect(emailNoThai(event)).toBe(true)
  })
})
