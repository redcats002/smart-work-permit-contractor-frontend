import { ref, type Ref } from 'vue'
import type { ICustomerById } from '@/models/response/customer/CustomerRes.model'

export function useInitDetail (data?: Partial<ICustomerById>): Ref<ICustomerById> {
  return ref<ICustomerById>({
    ...data,
    id: data?.id ?? 0,
    status: data?.status ?? 'ACTIVE',
    idCard: data?.idCard ?? '',
    titleName: data?.titleName ?? 'MR',
    firstName: data?.firstName ?? '',
    lastName: data?.lastName ?? '',
    phoneNumber: data?.phoneNumber ?? '',
    birthDate: data?.birthDate ?? '',
    email: data?.email ?? '',
    mainAddress: {
      address: data?.mainAddress?.address ?? '',
      subDistrict: data?.mainAddress?.subDistrict ?? '',
      district: data?.mainAddress?.district ?? '',
      province: data?.mainAddress?.province ?? '',
      postCode: data?.mainAddress?.postCode ?? '',
      urlGoogleMap: data?.mainAddress?.urlGoogleMap ?? '',
      isSameCitizenAddress: data?.mainAddress?.isSameCitizenAddress ?? false,
      isSameCurrentAddress: data?.mainAddress?.isSameCurrentAddress ?? false
    },
    currentAddress: {
      address: data?.currentAddress?.address ?? '',
      subDistrict: data?.currentAddress?.subDistrict ?? '',
      district: data?.currentAddress?.district ?? '',
      province: data?.currentAddress?.province ?? '',
      postCode: data?.currentAddress?.postCode ?? '',
      urlGoogleMap: data?.currentAddress?.urlGoogleMap ?? '',
      isSameCitizenAddress: data?.currentAddress?.isSameCitizenAddress ?? false,
      isSameCurrentAddress: data?.currentAddress?.isSameCurrentAddress ?? false
    },
    workAddress: {
      address: data?.workAddress?.address ?? '',
      subDistrict: data?.workAddress?.subDistrict ?? '',
      district: data?.workAddress?.district ?? '',
      province: data?.workAddress?.province ?? '',
      postCode: data?.workAddress?.postCode ?? '',
      urlGoogleMap: data?.workAddress?.urlGoogleMap ?? '',
      isSameCitizenAddress: data?.workAddress?.isSameCitizenAddress ?? false,
      isSameCurrentAddress: data?.workAddress?.isSameCurrentAddress ?? false
    }
  })
}
