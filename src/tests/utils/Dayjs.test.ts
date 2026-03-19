import { useDayjs } from '@/utils/Dayjs'
import { describe, expect, it } from 'vitest'

describe('useDayjs', () => {
  const d = useDayjs()

  describe('formatDate', () => {
    it('returns "-" when input is undefined', () => {
      expect(d.formatDate(undefined)).toBe('-')
    })

    it('formats a date string to DD/MM/BBBB (Buddhist era)', () => {
      // 2024 AD = 2567 BE, using noon to avoid timezone boundary issues
      expect(d.formatDate('2024-06-15T12:00:00')).toBe('15/06/67')
    })

    it('formats a Date object', () => {
      expect(d.formatDate(new Date('2024-01-15T12:00:00'))).toBe('15/01/67')
    })
  })

  describe('formatTime', () => {
    it('returns "-" when input is undefined', () => {
      expect(d.formatTime(undefined)).toBe('-')
    })

    it('formats time correctly', () => {
      expect(d.formatTime('2024-06-15T14:30:00')).toBe('14:30น.')
    })

    it('formats midnight correctly', () => {
      expect(d.formatTime('2024-06-15T00:00:00')).toBe('00:00น.')
    })
  })

  describe('formatDateTime', () => {
    it('returns "-" when input is undefined', () => {
      expect(d.formatDateTime(undefined)).toBe('-')
    })

    it('formats date and time together', () => {
      expect(d.formatDateTime('2024-06-15T14:30:00')).toBe('15/06/2567 14:30')
    })
  })

  describe('formatDateRequest', () => {
    it('returns null when input is undefined', () => {
      expect(d.formatDateRequest(undefined)).toBeNull()
    })

    it('formats a date string to YYYY-MM-DD', () => {
      expect(d.formatDateRequest('2024-06-15')).toBe('2024-06-15')
    })

    it('formats a Date object to YYYY-MM-DD', () => {
      expect(d.formatDateRequest(new Date('2024-06-15T12:00:00'))).toBe('2024-06-15')
    })
  })

  describe('formatAge', () => {
    it('returns a string with ปี เดือน วัน', () => {
      const result = d.formatAge('1990-01-01')
      expect(result).toMatch(/\d+ ปี \d+ เดือน \d+ วัน/)
    })

    it('returns 0 ปี for a very recent date', () => {
      const recent = new Date()
      recent.setDate(recent.getDate() - 1)
      const result = d.formatAge(recent)
      expect(result).toMatch(/^0 ปี/)
    })
  })

  describe('formatAgeYear', () => {
    it('returns only years', () => {
      const result = d.formatAgeYear('1990-01-01')
      expect(result).toMatch(/^\d+ ปี$/)
    })
  })

  describe('formatDurationThai', () => {
    it('formats ms under 1 hour as MM.SS นาที', () => {
      const ms = 5 * 60 * 1000 + 30 * 1000 // 5 min 30 sec
      expect(d.formatDurationThai(ms)).toBe('05.30 นาที')
    })

    it('formats over 1 hour as H.MM.SS นาที', () => {
      const ms = 2 * 3600 * 1000 + 15 * 60 * 1000 // 2h 15m 0s
      expect(d.formatDurationThai(ms)).toBe('2.15.00 นาที')
    })

    it('formats 0 ms correctly', () => {
      expect(d.formatDurationThai(0)).toBe('00.00 นาที')
    })
  })
})
