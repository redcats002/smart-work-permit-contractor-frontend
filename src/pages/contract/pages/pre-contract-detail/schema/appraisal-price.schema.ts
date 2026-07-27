import { z } from 'zod'

export const AppraisalPriceSchema = z.object({
  loanAmount: z.number().min(1, 'กรุณากรอกราคา').default(0)
})

export type AppraisalPriceFormValues = z.infer<typeof AppraisalPriceSchema>

export function useFormInitialValues (): AppraisalPriceFormValues {
  return {
    loanAmount: 0
  }
}
