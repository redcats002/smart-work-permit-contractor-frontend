import { searchAddressBySubDistrict } from 'thai-address-universal'
import type { IAddressRequest } from '@/models/request/AddressReq.model'

const ADDRESS_PREFIX_REGEX = /^(ตำบล|ต\.|แขวง|อำเภอ|อ\.|เขต|จังหวัด|จ\.)/

function stripAddressPrefix (value: string): string {
  return value.replace(ADDRESS_PREFIX_REGEX, '').trim()
}

export async function resolvePostCode (subDistrict: string, district: string, province: string): Promise<string> {
  try {
    const results = await searchAddressBySubDistrict(stripAddressPrefix(subDistrict))
    const targetDistrict = stripAddressPrefix(district)
    const targetProvince = stripAddressPrefix(province)
    const match = results.find(
      (r: { province: string, district: string, sub_district: string, postal_code: string }): boolean =>
        r.district === targetDistrict && r.province === targetProvince
    )
    return match?.postal_code ?? ''
  } catch {
    return ''
  }
}

export function isSameAddress (a: IAddressRequest | undefined, b: IAddressRequest | undefined): boolean {
  if (!a || !b) return false
  return (
    a.address === b.address
    && a.subDistrict === b.subDistrict
    && a.district === b.district
    && a.province === b.province
    && a.postCode === b.postCode
  )
}
