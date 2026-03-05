import type { IActionContractLoanPurposePayload } from '@/models/request/contract-loan-purpose/ContractLoanPurposeReq.model'
import { z } from 'zod'

export const ContractLoanPurposeSchema = z.object({
  name: z.string().min(1, 'กรุณากรอกชื่ออาชีพ')
})

export type ContractLoanPurposeFormValues = z.infer<typeof ContractLoanPurposeSchema>

export function useFormInitialValues (): IActionContractLoanPurposePayload {
  return {
    name: ''
  }
}
