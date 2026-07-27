import type { IReadIdCardResult } from '@/components/button/ReadIdentificationCardButton.vue'
import { ETitleName } from '@/enums/TitleName.enum'
import { resolvePostCode } from '@/utils/Address'
import type { CustomerFormValues } from '../schema/customer.schema'

const titleMap: Record<string, ETitleName> = {
  'Mr.': ETitleName.MR,
  'Mrs.': ETitleName.MRS,
  'Ms.': ETitleName.MS
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
