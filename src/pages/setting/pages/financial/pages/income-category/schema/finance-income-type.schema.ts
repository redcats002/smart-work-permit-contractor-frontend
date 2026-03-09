import { z } from 'zod'

export const FinanceIncomeTypeSchema = z.object({
  name: z.string().min(1, 'กรุณากรอกชื่อหมวดหมู่รายได้'),
  incomeCategoryId: z
    .number()
    .min(1, 'กรุณาเลือกหมวดหมู่รายได้')
    .optional()
    .refine((val: number | undefined): boolean => val !== undefined, 'กรุณาเลือกหมวดหมู่รายได้')
})

export type FinanceIncomeTypeFormValues = z.infer<typeof FinanceIncomeTypeSchema>

export function useFormInitialValues (): FinanceIncomeTypeFormValues {
  return {
    name: '',
    incomeCategoryId: undefined
  }
}
