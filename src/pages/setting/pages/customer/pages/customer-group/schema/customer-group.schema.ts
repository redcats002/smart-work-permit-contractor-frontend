import type { IActionCustomerGroupPayload } from '@/models/request/customer-group/CustomerGroupReq.model'
import { z } from 'zod'

export const CustomerGroupSchema = z.object({
  name: z.string().min(1, 'กรุณากรอกชื่อกลุ่มลูกค้า')
})

export type CustomerGroupFormValues = z.infer<typeof CustomerGroupSchema>

export function useFormInitialValues (): IActionCustomerGroupPayload {
  return {
    name: ''
  }
}
