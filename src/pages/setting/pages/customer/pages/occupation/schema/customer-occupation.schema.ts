import type { IActionCustomerOccupationPayload } from '@/models/request/customer-occupation/CustomerOccupationReq.model'
import { z } from 'zod'

export const CustomerOccupationSchema = z.object({
  name: z.string().min(1, 'กรุณากรอกชื่ออาชีพ')
})

export type CustomerOccupationFormValues = z.infer<typeof CustomerOccupationSchema>

export function useFormInitialValues (): IActionCustomerOccupationPayload {
  return {
    name: ''
  }
}
