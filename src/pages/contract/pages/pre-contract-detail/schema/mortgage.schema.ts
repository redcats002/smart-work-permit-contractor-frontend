import { schema } from '@/utils/Schema'
import { z } from 'zod'

export const MortgageSchema = z.object({
  contractDate: z.string().min(1, 'กรุณาระบุวันที่ทำสัญญา'),
  loanTypeId: schema.id('ประเภทเงินกู้'),
  loanPurposeId: schema.id('วัตถุประสงค์การกู้'),
  customerSourceId: schema.id('ช่องทางที่มาของลูกค้า'),
  customerIds: z.array(z.number()).default([]),
  guarantorIds: z.array(z.number()).default([])
})

export type MortgageFormValues = z.infer<typeof MortgageSchema>

export function useFormInitialValues (): MortgageFormValues {
  return {
    contractDate: '',
    loanTypeId: undefined,
    loanPurposeId: undefined,
    customerSourceId: undefined,
    customerIds: [],
    guarantorIds: []
  }
}
