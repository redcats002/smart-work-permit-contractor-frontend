import { ref, type Ref } from 'vue'
import type { IEmployeeById } from '@/models/response/employee/EmployeeRes.model'

export function useInitDetail (data?: Partial<IEmployeeById>): Ref<IEmployeeById> {
  return ref<IEmployeeById>({
    ...data,
    status: data?.status || 'INACTIVE',
    idCard: data?.idCard || '',
    title: data?.title || 'MR',
    firstName: data?.firstName || '',
    lastName: data?.lastName || '',
    phoneNumber: data?.phoneNumber || '',
    dateOfBirth: data?.dateOfBirth || '',
    email: data?.email || '',
    role: data?.role || 'ADMIN',
    branches: data?.branches || [],
    id: data?.id ?? '',
    mainAddress: data?.mainAddress || {
      id: 0,
      address: '',
      district: '',
      postCode: '',
      subDistrict: '',
      province: '',
      urlGoogleMap: '',
      isSameCitizenAddress: false,
      isSameCurrentAddress: false
    },
    currentAddress: data?.currentAddress || {
      id: 0,
      address: '',
      district: '',
      postCode: '',
      subDistrict: '',
      province: '',
      urlGoogleMap: '',
      isSameCitizenAddress: false,
      isSameCurrentAddress: false
    }
  })
}
