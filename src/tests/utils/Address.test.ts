import { isSameAddress, resolvePostCode } from '@/utils/Address'
import { describe, expect, it, vi } from 'vitest'

vi.mock('thai-address-universal', () => ({
  searchAddressBySubDistrict: vi.fn()
}))

const { searchAddressBySubDistrict } = await import('thai-address-universal')

describe('resolvePostCode', () => {
  it('returns postal_code when district and province match', async () => {
    vi.mocked(searchAddressBySubDistrict).mockResolvedValue([
      { province: 'กรุงเทพมหานคร', district: 'บางรัก', sub_district: 'สีลม', postal_code: '10500' },
      { province: 'เชียงใหม่', district: 'เมืองเชียงใหม่', sub_district: 'สีลม', postal_code: '50000' }
    ])

    const result = await resolvePostCode('สีลม', 'บางรัก', 'กรุงเทพมหานคร')

    expect(result).toBe('10500')
  })

  it('returns empty string when no match found', async () => {
    vi.mocked(searchAddressBySubDistrict).mockResolvedValue([
      { province: 'เชียงใหม่', district: 'เมืองเชียงใหม่', sub_district: 'สีลม', postal_code: '50000' }
    ])

    const result = await resolvePostCode('สีลม', 'บางรัก', 'กรุงเทพมหานคร')

    expect(result).toBe('')
  })

  it('returns empty string when results array is empty', async () => {
    vi.mocked(searchAddressBySubDistrict).mockResolvedValue([])

    const result = await resolvePostCode('ไม่มีจริง', 'ไม่มีจริง', 'ไม่มีจริง')

    expect(result).toBe('')
  })

  it('returns empty string when the lookup throws', async () => {
    vi.mocked(searchAddressBySubDistrict).mockRejectedValue(new Error('network error'))

    const result = await resolvePostCode('สีลม', 'บางรัก', 'กรุงเทพมหานคร')

    expect(result).toBe('')
  })
})

describe('isSameAddress', () => {
  const base = {
    address: '123 ถ.สุขุมวิท',
    subDistrict: 'คลองตัน',
    district: 'คลองเตย',
    province: 'กรุงเทพมหานคร',
    postCode: '10110'
  }

  it('returns true when all fields match', () => {
    expect(isSameAddress({ ...base }, { ...base })).toBe(true)
  })

  it('returns false when any field differs', () => {
    expect(isSameAddress({ ...base }, { ...base, postCode: '10120' })).toBe(false)
  })

  it('returns false when a is undefined', () => {
    expect(isSameAddress(undefined, { ...base })).toBe(false)
  })

  it('returns false when b is undefined', () => {
    expect(isSameAddress({ ...base }, undefined)).toBe(false)
  })

  it('returns false when both are undefined', () => {
    expect(isSameAddress(undefined, undefined)).toBe(false)
  })
})
