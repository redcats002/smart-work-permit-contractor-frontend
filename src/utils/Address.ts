import { searchAddressBySubDistrict } from 'thai-address-universal'
import type { IAddressRequest } from '@/models/request/AddressReq.model'

export async function resolvePostCode (subDistrict: string, district: string, province: string): Promise<string> {
  try {
    const results = await searchAddressBySubDistrict(subDistrict)
    const match = results.find(
      (r: { province: string, district: string, sub_district: string, postal_code: string }): boolean =>
        r.district === district && r.province === province
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
