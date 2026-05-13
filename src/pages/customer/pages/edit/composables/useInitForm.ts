import type { Ref } from 'vue'
import { useDayjs } from '@/utils/Dayjs'
import type { IAddressRequest } from '@/models/request/AddressReq.model'
import type { ICustomerById } from '@/models/response/customer/CustomerRes.model'
import type { CustomerStatusEnum } from '@/enums/modules/customer/CustomerStatus.enum'
import type { ETitleName } from '@/enums/TitleName.enum'
import type { CustomerFormValues } from '../../create/schema/customer.schema'

const dayjs = useDayjs()

function isSameAddress (a: IAddressRequest | undefined, b: IAddressRequest | undefined): boolean {
  if (!a || !b) return false
  return (
    a.address === b.address
    && a.subDistrict === b.subDistrict
    && a.district === b.district
    && a.province === b.province
    && a.postCode === b.postCode
  )
}

export function useInitForm (form: Ref<CustomerFormValues>, data: ICustomerById): void {
  const { mainAddress, currentAddress, workAddress } = data
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
      id: mainAddress?.id,
      address: mainAddress?.address ?? '',
      subDistrict: mainAddress?.subDistrict ?? '',
      district: mainAddress?.district ?? '',
      province: mainAddress?.province ?? '',
      postCode: mainAddress?.postCode ?? '',
      urlGoogleMap: mainAddress?.urlGoogleMap ?? '',
      isSameCitizenAddress: false,
      isSameCurrentAddress: isSameAddress(mainAddress, currentAddress)
    },
    currentAddress: {
      id: currentAddress?.id,
      address: currentAddress?.address ?? '',
      subDistrict: currentAddress?.subDistrict ?? '',
      district: currentAddress?.district ?? '',
      province: currentAddress?.province ?? '',
      postCode: currentAddress?.postCode ?? '',
      urlGoogleMap: currentAddress?.urlGoogleMap ?? '',
      isSameCitizenAddress: isSameAddress(currentAddress, mainAddress),
      isSameCurrentAddress: false
    },
    workAddress: {
      id: workAddress?.id,
      address: workAddress?.address ?? '',
      subDistrict: workAddress?.subDistrict ?? '',
      district: workAddress?.district ?? '',
      province: workAddress?.province ?? '',
      postCode: workAddress?.postCode ?? '',
      urlGoogleMap: workAddress?.urlGoogleMap ?? '',
      isSameCitizenAddress: isSameAddress(workAddress, mainAddress),
      isSameCurrentAddress: isSameAddress(workAddress, currentAddress)
    }
  }
}
