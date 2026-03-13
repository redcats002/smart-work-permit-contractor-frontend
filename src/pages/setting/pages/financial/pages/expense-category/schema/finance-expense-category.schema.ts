import { ExternalInternalExpenseEnum } from '@/enums/modules/finance/ExpenseType.enum'
import { z } from 'zod'

const externalInternalExpenseSchema = z
  .preprocess((value: unknown): unknown => {
    if (typeof value === 'string') return value
    if (value && typeof value === 'object' && 'id' in value) return (value as { id?: unknown }).id ?? ''
    return value ?? ''
  }, z.enum(ExternalInternalExpenseEnum))
  .refine((val: ExternalInternalExpenseEnum): boolean => val !== '', 'กรุณาเลือกค่าใช้จ่าย ภายใน/ภายนอก')

export const FinanceExpenseCategorySchema = z.object({
  name: z.string().min(1, 'กรุณากรอกชื่อหมวดหมู่ค่าใช้จ่าย'),
  externalInternalExpense: externalInternalExpenseSchema
})

export type FinanceExpenseCategoryFormValues = z.infer<typeof FinanceExpenseCategorySchema>

export function useFormInitialValues (): FinanceExpenseCategoryFormValues {
  return {
    name: '',
    externalInternalExpense: ExternalInternalExpenseEnum['']
  }
}
