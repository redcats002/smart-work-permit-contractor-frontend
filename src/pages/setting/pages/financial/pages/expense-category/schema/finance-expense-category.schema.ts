import { ExternalInternalExpenseEnum } from '@/enums/modules/finance/ExternalInternalExpense.enum'
import { z } from 'zod'

export const FinanceExpenseCategorySchema = z.object({
  name: z.string().min(1, 'กรุณากรอกชื่อหมวดหมู่ค่าใช้จ่าย'),
  externalInternalExpense: z
    .enum(ExternalInternalExpenseEnum)
    .optional()
    .refine((val: ExternalInternalExpenseEnum | undefined): boolean => val !== undefined, 'กรุณาเลือกค่าใช้จ่าย')
})

export type FinanceExpenseCategoryFormValues = z.infer<typeof FinanceExpenseCategorySchema>

export function useFormInitialValues (): FinanceExpenseCategoryFormValues {
  return {
    name: '',
    externalInternalExpense: undefined
  }
}
