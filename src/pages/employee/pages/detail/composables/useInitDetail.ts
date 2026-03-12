import { ref, type Ref } from 'vue'

import type { IEmployeeById } from '@/models/response/employee/EmployeeRes.model'

export function useInitDetail (data?: Partial<IEmployeeById>): Ref<IEmployeeById> {
  return ref<IEmployeeById>({
    status: 'INACTIVE',
    idCard: '',
    titleName: 'MR',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    birthDate: '',
    email: '',
    role: 'ADMIN',
    branchId: 0,

    ...data,
    id: data?.id ?? 0,
    mainAddress: {
      id: 0,
      address: '',
      district: '',
      postCode: '',
      subDistrict: '',
      province: '',
      urlGoogleMap: '',
      isSameCitizenAddress: false,
      isSameCurrentAddress: false,
      ...data?.mainAddress
    },
    currentAddress: {
      id: 0,
      address: '',
      district: '',
      postCode: '',
      subDistrict: '',
      province: '',
      urlGoogleMap: '',
      isSameCitizenAddress: false,
      isSameCurrentAddress: false,
      ...data?.currentAddress
    }
  })
}
