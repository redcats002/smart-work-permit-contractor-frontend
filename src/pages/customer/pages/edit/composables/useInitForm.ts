import type { Ref } from 'vue'
import { useDayjs } from '@/utils/Dayjs'
import type { ICustomerById } from '@/models/response/customer/CustomerRes.model'
import type { CustomerStatusEnum } from '@/enums/modules/customer/CustomerStatus.enum'
import type { ETitleName } from '@/enums/TitleName.enum'
import type { CustomerFormValues } from '../../create/schema/customer.schema'

const dayjs = useDayjs()

export function useInitForm (form: Ref<CustomerFormValues>, data: ICustomerById): void {
  form.value = {
    ...data,
    idCard: data.idCard,
    titleName: data.titleName as ETitleName,
    firstName: data.firstName,
    lastName: data.lastName,
    phoneNumber: data.phoneNumber,
    phoneNumber2: data.phoneNumber2 ?? '',
    birthDate: (data.birthDate ? dayjs(data.birthDate).toDate() : '') as unknown as string,
    email: data.email ?? '',
    status: data.status as CustomerStatusEnum,
    customerGroupId: typeof data.customerGroup?.id === 'number' ? data.customerGroup.id : undefined,
    occupationId: typeof data.occupation?.id === 'number' ? data.occupation.id : undefined,
    mainAddress: {
      id: data.mainAddress?.id,
      address: data.mainAddress?.address ?? '',
      subDistrict: data.mainAddress?.subDistrict ?? '',
      district: data.mainAddress?.district ?? '',
      province: data.mainAddress?.province ?? '',
      postCode: data.mainAddress?.postCode ?? '',
      urlGoogleMap: data.mainAddress?.urlGoogleMap ?? '',
      isSameCitizenAddress: data.mainAddress?.isSameCitizenAddress ?? false,
      isSameCurrentAddress: data.mainAddress?.isSameCurrentAddress ?? false
    },
    currentAddress: {
      id: data.currentAddress?.id,
      address: data.currentAddress?.address ?? '',
      subDistrict: data.currentAddress?.subDistrict ?? '',
      district: data.currentAddress?.district ?? '',
      province: data.currentAddress?.province ?? '',
      postCode: data.currentAddress?.postCode ?? '',
      urlGoogleMap: data.currentAddress?.urlGoogleMap ?? '',
      isSameCitizenAddress: data.currentAddress?.isSameCitizenAddress ?? false,
      isSameCurrentAddress: data.currentAddress?.isSameCurrentAddress ?? false
    },
    workAddress: {
      id: data.workAddress?.id,
      address: data.workAddress?.address ?? '',
      subDistrict: data.workAddress?.subDistrict ?? '',
      district: data.workAddress?.district ?? '',
      province: data.workAddress?.province ?? '',
      postCode: data.workAddress?.postCode ?? '',
      urlGoogleMap: data.workAddress?.urlGoogleMap ?? '',
      isSameCitizenAddress: data.workAddress?.isSameCitizenAddress ?? false,
      isSameCurrentAddress: data.workAddress?.isSameCurrentAddress ?? false
    }
  }
}
