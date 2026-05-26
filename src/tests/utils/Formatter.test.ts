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
      expect(result).toBe('Mr John Doe')
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
      expect(result).toBe('081-234-5678, 089-987-6543')
    })
  })

  describe('numberToThaiText', () => {
    describe('zero', () => {
      it('returns ศูนย์บาทถ้วน for 0', () => {
        expect(formatter.numberToThaiText(0)).toBe('ศูนย์บาทถ้วน')
      })
    })

    describe('single digits', () => {
      it('converts 1 → หนึ่งบาทถ้วน', () => {
        expect(formatter.numberToThaiText(1)).toBe('หนึ่งบาทถ้วน')
      })

      it('converts 9 → เก้าบาทถ้วน', () => {
        expect(formatter.numberToThaiText(9)).toBe('เก้าบาทถ้วน')
      })
    })

    describe('tens', () => {
      it('converts 10 → สิบบาทถ้วน (no หนึ่ง prefix)', () => {
        expect(formatter.numberToThaiText(10)).toBe('สิบบาทถ้วน')
      })

      it('converts 11 → สิบเอ็ดบาทถ้วน', () => {
        expect(formatter.numberToThaiText(11)).toBe('สิบเอ็ดบาทถ้วน')
      })

      it('converts 20 → ยี่สิบบาทถ้วน', () => {
        expect(formatter.numberToThaiText(20)).toBe('ยี่สิบบาทถ้วน')
      })

      it('converts 21 → ยี่สิบเอ็ดบาทถ้วน', () => {
        expect(formatter.numberToThaiText(21)).toBe('ยี่สิบเอ็ดบาทถ้วน')
      })

      it('converts 30 → สามสิบบาทถ้วน', () => {
        expect(formatter.numberToThaiText(30)).toBe('สามสิบบาทถ้วน')
      })
    })

    describe('hundreds', () => {
      it('converts 100 → หนึ่งร้อยบาทถ้วน', () => {
        expect(formatter.numberToThaiText(100)).toBe('หนึ่งร้อยบาทถ้วน')
      })

      it('converts 101 → หนึ่งร้อยเอ็ดบาทถ้วน', () => {
        expect(formatter.numberToThaiText(101)).toBe('หนึ่งร้อยเอ็ดบาทถ้วน')
      })

      it('converts 110 → หนึ่งร้อยสิบบาทถ้วน', () => {
        expect(formatter.numberToThaiText(110)).toBe('หนึ่งร้อยสิบบาทถ้วน')
      })

      it('converts 111 → หนึ่งร้อยสิบเอ็ดบาทถ้วน', () => {
        expect(formatter.numberToThaiText(111)).toBe('หนึ่งร้อยสิบเอ็ดบาทถ้วน')
      })
    })

    describe('thousands', () => {
      it('converts 1000 → หนึ่งพันบาทถ้วน', () => {
        expect(formatter.numberToThaiText(1000)).toBe('หนึ่งพันบาทถ้วน')
      })

      it('converts 10000 → หนึ่งหมื่นบาทถ้วน', () => {
        expect(formatter.numberToThaiText(10000)).toBe('หนึ่งหมื่นบาทถ้วน')
      })

      it('converts 100000 → หนึ่งแสนบาทถ้วน', () => {
        expect(formatter.numberToThaiText(100000)).toBe('หนึ่งแสนบาทถ้วน')
      })

      it('converts 999999 → เก้าแสนเก้าหมื่นเก้าพันเก้าร้อยเก้าสิบเก้าบาทถ้วน', () => {
        expect(formatter.numberToThaiText(999999)).toBe('เก้าแสนเก้าหมื่นเก้าพันเก้าร้อยเก้าสิบเก้าบาทถ้วน')
      })
    })

    describe('millions (the bug cases)', () => {
      it('converts 1000000 → หนึ่งล้านบาทถ้วน', () => {
        expect(formatter.numberToThaiText(1_000_000)).toBe('หนึ่งล้านบาทถ้วน')
      })

      it('converts 10000000 → สิบล้านบาทถ้วน', () => {
        expect(formatter.numberToThaiText(10_000_000)).toBe('สิบล้านบาทถ้วน')
      })

      it('converts 100000000 → หนึ่งร้อยล้านบาทถ้วน', () => {
        expect(formatter.numberToThaiText(100_000_000)).toBe('หนึ่งร้อยล้านบาทถ้วน')
      })

      it('converts 1000000000 → หนึ่งพันล้านบาทถ้วน', () => {
        expect(formatter.numberToThaiText(1_000_000_000)).toBe('หนึ่งพันล้านบาทถ้วน')
      })

      it('converts 90000000 → เก้าสิบล้านบาทถ้วน', () => {
        expect(formatter.numberToThaiText(90_000_000)).toBe('เก้าสิบล้านบาทถ้วน')
      })

      it('converts 1500000 → หนึ่งล้านห้าแสนบาทถ้วน (millions + remainder)', () => {
        expect(formatter.numberToThaiText(1_500_000)).toBe('หนึ่งล้านห้าแสนบาทถ้วน')
      })

      it('converts 11000000 → สิบเอ็ดล้านบาทถ้วน', () => {
        expect(formatter.numberToThaiText(11_000_000)).toBe('สิบเอ็ดล้านบาทถ้วน')
      })
    })

    describe('decimals (สตางค์)', () => {
      it('appends บาทถ้วน when decimal is .00', () => {
        expect(formatter.numberToThaiText(100.00)).toBe('หนึ่งร้อยบาทถ้วน')
      })

      it('converts 100.50 → หนึ่งร้อยบาทจุดห้าสิบสตางค์', () => {
        expect(formatter.numberToThaiText(100.50)).toBe('หนึ่งร้อยบาทจุดห้าสิบสตางค์')
      })

      it('converts 1.25 → หนึ่งบาทจุดยี่สิบห้าสตางค์', () => {
        expect(formatter.numberToThaiText(1.25)).toBe('หนึ่งบาทจุดยี่สิบห้าสตางค์')
      })
    })

    describe('error handling', () => {
      it('throws for NaN', () => {
        expect(() => formatter.numberToThaiText(NaN)).toThrow('Input must be a valid number')
      })
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
