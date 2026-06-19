import { schema } from '@/utils/Schema'
import { z } from 'zod'

export const MortgageSchema = z.object({
  contractedAt: schema.date('วันที่ทำสัญญา').default(() => new Date()),
  contractLoanTypeId: schema.id('ประเภทเงินกู้'),
  contractLoanPurposeId: schema.id('วัตถุประสงค์การกู้'),
  howDidFindUsId: schema.id('ช่องทางที่มาของลูกค้า'),
  borrowerIds: z.array(z.number()).default([]),
  guarantorIds: z.array(z.number()).default([])
})

export type MortgageFormValues = z.infer<typeof MortgageSchema>

export function useFormInitialValues (): MortgageFormValues {
  return {
    contractedAt: new Date(),
    contractLoanTypeId: undefined,
    contractLoanPurposeId: undefined,
    howDidFindUsId: undefined,
    borrowerIds: [],
    guarantorIds: []
  }
}
