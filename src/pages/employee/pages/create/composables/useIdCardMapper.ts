import type { IReadIdCardResult } from '@/components/button/ReadIdentificationCardButton.vue'
import { ETitleName } from '@/enums/TitleName.enum'
import type { EmployeeFormValues } from '../schema/employee.schema'

const titleMap: Record<string, ETitleName> = {
  'Mr.': ETitleName.MR,
  'Mrs.': ETitleName.MRS,
  'Ms.': ETitleName.MS
}

export function mapIdCardToEmployee (data: IReadIdCardResult, current: EmployeeFormValues): EmployeeFormValues {
  const addr = data.address
  const addressText = [addr.houseNo, addr.moo, addr.soi, addr.road].filter(Boolean).join(' ')
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
      province: addr.province
    }
  }
}
