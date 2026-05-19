import type { ICreateCustomerPayload } from '@/models/request/customer/CustomerReq.model'
import type { CustomerFormValues } from '../schema/customer.schema'

export function usePayload (form: CustomerFormValues): ICreateCustomerPayload {
  return {
    ...form,
    phoneNumber: form?.phoneNumber?.replaceAll(/-/g, ''),
    phoneNumber2: form?.phoneNumber2?.replaceAll(/-/g, '') || undefined,
    email: form?.email || undefined,
    customerGroupId: form?.customerGroupId,
    occupationId: form?.occupationId
  }
}
