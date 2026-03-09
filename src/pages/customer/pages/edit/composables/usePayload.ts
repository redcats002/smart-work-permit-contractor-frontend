import type { IUpdateCustomerPayload } from '@/models/request/customer/CustomerReq.model'
import type { CustomerFormValues } from '../../create/schema/customer.schema'

export function usePayload (form: CustomerFormValues): IUpdateCustomerPayload {
  return {
    ...form,
    customerGroupId: form?.customerGroupId || undefined,
    occupationId: form?.occupationId || undefined
  }
}
