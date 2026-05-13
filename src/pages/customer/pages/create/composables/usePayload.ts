import type { ICreateCustomerPayload } from '@/models/request/customer/CustomerReq.model'
import type { CustomerFormValues } from '../schema/customer.schema'

export function usePayload (form: CustomerFormValues): ICreateCustomerPayload {
  return {
    ...form,
    email: form?.email || undefined,
    customerGroupId: form?.customerGroupId,
    occupationId: form?.occupationId
  }
}
