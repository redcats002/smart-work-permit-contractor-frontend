import type { IUpdateCustomerPayload } from '@/models/request/customer/CustomerReq.model'
import { PersonalTypeEnum } from '@/enums/modules/customer/PersonalType.enum'
import type { CustomerFormValues } from '../../create/schema/customer.schema'

export function usePayload (form: CustomerFormValues): IUpdateCustomerPayload {
  const isCorporate = form.personalType === PersonalTypeEnum.CORPORATE
  return {
    ...form,
    phoneNumber: form?.phoneNumber?.replaceAll(/-/g, ''),
    phoneNumber2: form?.phoneNumber2?.replaceAll(/-/g, '') || undefined,
    email: form?.email || undefined,
    customerGroupId: form?.customerGroupId || undefined,
    currentAddress: form.currentAddress,
    workAddress: form.workAddress,
    occupationId: isCorporate ? undefined : (form?.occupationId || undefined),
    titleName: isCorporate ? undefined : form.titleName,
    lastName: isCorporate ? undefined : form.lastName,
    birthDate: isCorporate ? undefined : form.birthDate
  }
}
