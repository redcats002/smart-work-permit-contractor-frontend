import { regex } from '@/utils/Regex'
import { describe, expect, it } from 'vitest'

describe('regex', () => {
  describe('emailRegex', () => {
    it.each([
      'user@example.com',
      'user.name@domain.co',
      'user_name@sub.domain.org'
    ])('accepts valid email: %s', (email: string) => {
      expect(regex.emailRegex.test(email)).toBe(true)
    })

    it.each([
      'notanemail',
      '@nodomain.com',
      'user@',
      'user @example.com'
    ])('rejects invalid email: %s', (email: string) => {
      expect(regex.emailRegex.test(email)).toBe(false)
    })
  })

  describe('passwordRegex', () => {
    it('accepts a valid password (8-16 chars, upper+lower+digit)', () => {
      expect(regex.passwordRegex.test('Password1')).toBe(true)
      expect(regex.passwordRegex.test('Abcde123')).toBe(true)
    })

    it('rejects password without uppercase', () => {
      expect(regex.passwordRegex.test('password1')).toBe(false)
    })

    it('rejects password without digit', () => {
      expect(regex.passwordRegex.test('Password')).toBe(false)
    })

    it('rejects password shorter than 8 chars', () => {
      expect(regex.passwordRegex.test('Abc12')).toBe(false)
    })

    it('rejects password longer than 16 chars', () => {
      expect(regex.passwordRegex.test('Password12345678901')).toBe(false)
    })
  })

  describe('fullPassword', () => {
    it('accepts alphanumeric and special chars (min 8)', () => {
      expect(regex.fullPassword.test('Password1!')).toBe(true)
      expect(regex.fullPassword.test('abcdefgh')).toBe(true)
    })

    it('rejects strings shorter than 8 chars', () => {
      expect(regex.fullPassword.test('Abc!1')).toBe(false)
    })
  })

  describe('passportRegex', () => {
    it('accepts 9-char uppercase alphanumeric', () => {
      expect(regex.passportRegex.test('AA1234567')).toBe(true)
      expect(regex.passportRegex.test('123456789')).toBe(true)
    })

    it('rejects lowercase characters', () => {
      expect(regex.passportRegex.test('aa1234567')).toBe(false)
    })

    it('rejects wrong length', () => {
      expect(regex.passportRegex.test('AB123')).toBe(false)
      expect(regex.passportRegex.test('AB1234567890')).toBe(false)
    })
  })

  describe('upperCaseOneCharRegex', () => {
    it('accepts string with at least one uppercase character', () => {
      expect(regex.upperCaseOneCharRegex.test('abcD')).toBe(true)
    })

    it('rejects string with no uppercase', () => {
      expect(regex.upperCaseOneCharRegex.test('abcd')).toBe(false)
    })
  })

  describe('numberOneDigitRegex', () => {
    it('accepts string with at least one digit', () => {
      expect(regex.numberOneDigitRegex.test('abc1')).toBe(true)
    })

    it('rejects string with no digit', () => {
      expect(regex.numberOneDigitRegex.test('abcd')).toBe(false)
    })
  })

  describe('atLeastOneNumber', () => {
    it('accepts string with at least one number', () => {
      expect(regex.atLeastOneNumber.test('test1')).toBe(true)
    })

    it('rejects string with no number', () => {
      expect(regex.atLeastOneNumber.test('test')).toBe(false)
    })
  })
})
