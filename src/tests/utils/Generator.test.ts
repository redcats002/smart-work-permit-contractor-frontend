import { generator } from '@/utils/Generator'
import { describe, expect, it } from 'vitest'

describe('generator', () => {
  describe('generateRandomThaiCitizenId', () => {
    it('generates a 13-digit string', () => {
      const id = generator.generateRandomThaiCitizenId()
      expect(id).toHaveLength(13)
      expect((/^\d{13}$/).test(id)).toBe(true)
    })

    it('first digit is between 1 and 8', () => {
      for (let i = 0; i < 20; i++) {
        const id = generator.generateRandomThaiCitizenId()
        const first = parseInt(id[0], 10)
        expect(first).toBeGreaterThanOrEqual(1)
        expect(first).toBeLessThanOrEqual(8)
      }
    })

    it('generates a valid checksum (13th digit)', () => {
      for (let i = 0; i < 20; i++) {
        const id = generator.generateRandomThaiCitizenId()
        let sum = 0
        for (let j = 0; j < 12; j++) {
          sum += parseInt(id[j], 10) * (13 - j)
        }
        const expectedChecksum = (11 - (sum % 11)) % 10
        expect(parseInt(id[12], 10)).toBe(expectedChecksum)
      }
    })

    it('generates different IDs on each call', () => {
      const ids = new Set(Array.from({ length: 10 }, () => generator.generateRandomThaiCitizenId()))
      expect(ids.size).toBeGreaterThan(1)
    })
  })

  describe('generateRandomPhoneNumber', () => {
    it('generates a 10-digit string', () => {
      const phone = generator.generateRandomPhoneNumber()
      expect(phone).toHaveLength(10)
      expect((/^\d{10}$/).test(phone)).toBe(true)
    })

    it('starts with 06, 08, or 09', () => {
      for (let i = 0; i < 20; i++) {
        const phone = generator.generateRandomPhoneNumber()
        expect(['06', '08', '09']).toContain(phone.slice(0, 2))
      }
    })

    it('generates different phone numbers on each call', () => {
      const phones = new Set(Array.from({ length: 10 }, () => generator.generateRandomPhoneNumber()))
      expect(phones.size).toBeGreaterThan(1)
    })
  })
})
