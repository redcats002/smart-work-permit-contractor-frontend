import { formatter } from '@/utils/Formatter'
import { describe, expect, it } from 'vitest'

describe('formatter', () => {
  describe('numberParseFloat', () => {
    it('returns a number as-is', () => {
      expect(formatter.numberParseFloat(1234)).toBe(1234)
    })

    it('parses a string with commas', () => {
      expect(formatter.numberParseFloat('1,234,567')).toBe(1234567)
    })

    it('parses a string with baht symbol', () => {
      expect(formatter.numberParseFloat('฿1234')).toBe(1234)
    })

    it('parses a decimal string', () => {
      expect(formatter.numberParseFloat('123.45')).toBe(123.45)
    })
  })

  describe('numberFormat', () => {
    it('formats zero', () => {
      expect(formatter.numberFormat(0)).toBe('0')
    })

    it('formats with comma separators', () => {
      expect(formatter.numberFormat(1234567)).toBe('1,234,567')
    })

    it('truncates decimals', () => {
      expect(formatter.numberFormat(1234.9)).toBe('1,235')
    })

    it('formats a string number', () => {
      expect(formatter.numberFormat('5000')).toBe('5,000')
    })
  })

  describe('numberFormat2Decimal', () => {
    it('formats with 2 decimal places', () => {
      expect(formatter.numberFormat2Decimal(100)).toBe('100.00')
    })

    it('rounds to 2 decimals', () => {
      expect(formatter.numberFormat2Decimal(99.999)).toBe('100.00')
    })
  })

  describe('numberFormat3Decimal', () => {
    it('formats with 3 decimal places', () => {
      expect(formatter.numberFormat3Decimal(100)).toBe('100.000')
    })
  })

  describe('numberFormatNoDecimal', () => {
    it('formats with no decimal places', () => {
      expect(formatter.numberFormatNoDecimal(100)).toBe('100')
    })

    it('rounds down decimal', () => {
      expect(formatter.numberFormatNoDecimal(99.4)).toBe('99')
    })
  })

  describe('thaiCitizenId', () => {
    it('formats a 13-digit ID', () => {
      expect(formatter.thaiCitizenId('1234567890123')).toBe('1-2345-67890-12-3')
    })

    it('returns original if not 13 digits', () => {
      expect(formatter.thaiCitizenId('12345')).toBe('12345')
    })

    it('returns empty string for empty input', () => {
      expect(formatter.thaiCitizenId('')).toBe('')
    })

    it('strips non-digit characters before formatting', () => {
      expect(formatter.thaiCitizenId('1-2345-67890-12-3')).toBe('1-2345-67890-12-3')
    })
  })

  describe('thaiBaht', () => {
    it('formats a number with ฿ prefix', () => {
      expect(formatter.thaiBaht(100)).toBe('฿100.00')
    })

    it('formats with a custom prefix', () => {
      expect(formatter.thaiBaht(100, 'Total')).toBe('Total ฿100.00')
    })
  })

  describe('phoneNumberFormat', () => {
    it('formats a personal phone number', () => {
      expect(formatter.phoneNumberFormat('0812345678')).toBe('081-234-5678')
    })

    it('formats a home phone number', () => {
      expect(formatter.phoneNumberFormat('021234567', 'HOME')).toBe('02-123-4567')
    })
  })

  describe('bankAccountNumberFormat', () => {
    it('formats a bank account number', () => {
      expect(formatter.bankAccountNumberFormat('1234567890')).toBe('123-4567-890')
    })
  })

  describe('stringFormatSnakeToCamelCase', () => {
    it('converts snake_case to camelCase', () => {
      expect(formatter.stringFormatSnakeToCamelCase('hello_world')).toBe('helloWorld')
    })

    it('handles single word', () => {
      expect(formatter.stringFormatSnakeToCamelCase('hello')).toBe('hello')
    })
  })

  describe('stringFormatSnakeToTitleCase', () => {
    it('converts snake_case to Title Case', () => {
      expect(formatter.stringFormatSnakeToTitleCase('hello_world')).toBe('Hello World')
    })
  })

  describe('stringFormatToCapitalize', () => {
    it('capitalizes first letter and lowercases rest', () => {
      expect(formatter.stringFormatToCapitalize('hELLO')).toBe('Hello')
    })

    it('returns empty string for empty input', () => {
      expect(formatter.stringFormatToCapitalize('')).toBe('')
    })
  })

  describe('stringFormatCamelCaseToTitleCase', () => {
    it('converts camelCase to Title Case', () => {
      expect(formatter.stringFormatCamelCaseToTitleCase('helloWorld')).toBe('Hello World')
    })

    it('handles a single word', () => {
      expect(formatter.stringFormatCamelCaseToTitleCase('hello')).toBe('Hello')
    })
  })

  describe('stringFormatKebabCaseToTitleCase', () => {
    it('converts kebab-case to Title Case', () => {
      expect(formatter.stringFormatKebabCaseToTitleCase('hello-world')).toBe('Hello World')
    })
  })

  describe('fullName', () => {
    it('returns "ไม่ระบุ" when no name provided', () => {
      expect(formatter.fullName({})).toBe('ไม่ระบุ')
    })

    it('returns firstName only when no lastName', () => {
      expect(formatter.fullName({ firstName: 'John' })).toBe('John')
    })

    it('returns lastName only when no firstName', () => {
      expect(formatter.fullName({ lastName: 'Doe' })).toBe('Doe')
    })

    it('formats full Thai name with title', () => {
      const result = formatter.fullName({ titleName: 'MR', firstName: 'สมชาย', lastName: 'ใจดี' })
      expect(result).toBe('นาย สมชาย ใจดี')
    })

    it('formats full English name with title', () => {
      const result = formatter.fullName({ titleName: 'MR', firstName: 'John', lastName: 'Doe' })
      expect(result).toBe('MR John Doe')
    })
  })

  describe('fullPhoneNumber', () => {
    it('returns "ไม่ระบุ" when no phone provided', () => {
      expect(formatter.fullPhoneNumber({})).toBe('ไม่ระบุ')
    })

    it('formats single phone number', () => {
      expect(formatter.fullPhoneNumber({ phoneNumber: '0812345678' })).toBe('081-234-5678')
    })

    it('formats both phone numbers', () => {
      const result = formatter.fullPhoneNumber({ phoneNumber: '0812345678', phoneNumber2: '0899876543' })
      expect(result).toBe('081-234-5678 089-987-6543')
    })
  })

  describe('fullAddress', () => {
    it('formats a full address', () => {
      const result = formatter.fullAddress({
        address: '123/4',
        district: 'Watthana',
        subDistrict: 'Khlong Toei Nuea',
        province: 'Bangkok',
        postCode: '10110'
      })
      expect(result).toBe('123/4, Watthana, Khlong Toei Nuea, Bangkok, 10110')
    })

    it('returns empty string for undefined input', () => {
      expect(formatter.fullAddress(undefined)).toBe('')
    })

    it('skips empty fields', () => {
      const result = formatter.fullAddress({ address: '123', province: 'Bangkok' })
      expect(result).toContain('123')
      expect(result).toContain('Bangkok')
      expect(result).not.toMatch(/^,\s*/)
    })
  })
})
