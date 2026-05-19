import type { IUpdateCustomerPayload } from '@/models/request/customer/CustomerReq.model'
import type { CustomerFormValues } from '../../create/schema/customer.schema'

export function usePayload (form: CustomerFormValues): IUpdateCustomerPayload {
  return {
    ...form,
    phoneNumber: form?.phoneNumber?.replaceAll(/-/g, ''),
    phoneNumber2: form?.phoneNumber2?.replaceAll(/-/g, '') || undefined,
    email: form?.email || undefined,
    customerGroupId: form?.customerGroupId || undefined,
    occupationId: form?.occupationId || undefined
  }
}
