import type { IActionContractLoanTypePayload } from '@/models/request/contract-loan-type/ContractLoanTypeReq.model'
import { z } from 'zod'

export const ContractLoanTypeSchema = z.object({
  name: z.string().min(1, 'กรุณากรอกชื่ออาชีพ')
})

export type ContractLoanTypeFormValues = z.infer<typeof ContractLoanTypeSchema>

export function useFormInitialValues (): IActionContractLoanTypePayload {
  return {
    name: ''
  }
}
