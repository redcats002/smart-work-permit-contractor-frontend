import { z } from 'zod'

export const FinanceExpenseTypeSchema = z.object({
  name: z.string().min(1, 'กรุณากรอกชื่อประเภทค่าใช้จ่าย'),
  expenseCategoryId: z
    .number()
    .min(1, 'กรุณาเลือกหมวดหมู่ค่าใช้จ่าย')
    .optional()
    .refine((val: number | undefined): boolean => val !== undefined, 'กรุณาเลือกหมวดหมู่ค่าใช้จ่าย')
})

export type FinanceExpenseTypeFormValues = z.infer<typeof FinanceExpenseTypeSchema>

export function useFormInitialValues (): FinanceExpenseTypeFormValues {
  return {
    name: '',
    expenseCategoryId: undefined
  }
}
