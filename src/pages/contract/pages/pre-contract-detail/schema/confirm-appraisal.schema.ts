import { z } from 'zod'

export const ConfirmAppraisalSchema = z.object({
  loanAmount: z.number().min(0, 'กรุณากรอกราคา').default(0)
})

export type ConfirmAppraisalFormValues = z.infer<typeof ConfirmAppraisalSchema>

export function useFormInitialValues (): ConfirmAppraisalFormValues {
  return {
    loanAmount: 0
  }
}
