import { z } from 'zod'

export const FinanceIncomeCategorySchema = z.object({
  name: z.string().min(1, 'กรุณากรอกชื่อหมวดหมู่รายได้')
})

export type FinanceIncomeCategoryFormValues = z.infer<typeof FinanceIncomeCategorySchema>

export function useFormInitialValues (): FinanceIncomeCategoryFormValues {
  return {
    name: ''
  }
}
