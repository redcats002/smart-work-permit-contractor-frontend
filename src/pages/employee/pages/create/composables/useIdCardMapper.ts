import type { IReadIdCardResult } from '@/components/button/ReadIdentificationCardButton.vue'
import { ETitleName } from '@/enums/TitleName.enum'
import { resolvePostCode } from '@/utils/Address'
import type { EmployeeFormValues } from '../schema/employee.schema'

const titleMap: Record<string, ETitleName> = {
  'Mr.': ETitleName.MR,
  'Mrs.': ETitleName.MRS,
  'Ms.': ETitleName.MS
}

export async function mapIdCardToEmployee (data: IReadIdCardResult, current: EmployeeFormValues): Promise<EmployeeFormValues> {
  const addr = data.address
  const addressText = [addr.houseNo, addr.moo, addr.soi, addr.road].filter(Boolean).join(' ')
  const postCode = await resolvePostCode(addr.subDistrict, addr.district, addr.province)
  return {
    ...current,
    idCard: data.idCard,
    title: titleMap[data.title] || ETitleName[''],
    firstName: data.firstName,
    lastName: data.lastName,
    dateOfBirth: data.birthDay,
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
