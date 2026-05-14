import type { IAddressRequest } from '@/models/request/AddressReq.model'

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
