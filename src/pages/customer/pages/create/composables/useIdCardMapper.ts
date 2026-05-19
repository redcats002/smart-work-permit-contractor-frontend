import { searchAddressBySubDistrict } from 'thai-address-universal'
import type { IReadIdCardResult } from '@/components/button/ReadIdentificationCardButton.vue'
import { ETitleName } from '@/enums/TitleName.enum'
import type { CustomerFormValues } from '../schema/customer.schema'

const titleMap: Record<string, ETitleName> = {
  'Mr.': ETitleName.MR,
  'Mrs.': ETitleName.MRS,
  'Ms.': ETitleName.MS
}

async function resolvePostCode (subDistrict: string, district: string, province: string): Promise<string> {
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

export async function mapIdCardToCustomer (data: IReadIdCardResult, current: CustomerFormValues): Promise<CustomerFormValues> {
  const addr = data.address
  const addressText = [addr.houseNo, addr.moo, addr.soi, addr.road].filter(Boolean).join(' ')
  const postCode = await resolvePostCode(addr.subDistrict, addr.district, addr.province)
  return {
    ...current,
    idCard: data.idCard,
    titleName: titleMap[data.title] || ETitleName[''],
    firstName: data.firstName,
    lastName: data.lastName,
    birthDate: data.birthDay,
    mainAddress: {
      ...current.mainAddress,
      address: addressText,
      subDistrict: addr.subDistrict,
      district: addr.district,
      province: addr.province,
      postCode
    }
  }
}
