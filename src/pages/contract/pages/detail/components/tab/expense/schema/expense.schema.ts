import { schema } from '@/utils/Schema'
import { EVatType } from '@/enums/modules/Vat.enum'
import { z } from 'zod'

export const ExpenseSchema = z.object({
  expenseCategoryId: schema.id('หมวดหมู่ค่าใช้จ่าย'),
  expenseTypeId: schema.id('ประเภทค่าใช้จ่าย'),
  note: z.string().min(1, 'กรุณากรอกคำอธิบาย'),
  amount: z
    .number({ message: 'กรุณากรอกจำนวนเงิน' })
    .min(1, 'กรุณากรอกจำนวนเงิน'),
  file: z.array(schema.media),
  vatType: z.enum(EVatType, { message: 'กรุณาเลือกประเภท VAT' })
})

export type ExpenseFormValues = z.infer<typeof ExpenseSchema>

export function useFormInitialValues (): ExpenseFormValues {
  return {
    expenseCategoryId: undefined,
    expenseTypeId: undefined,
    note: '',
    amount: 0,
    file: [],
    vatType: EVatType.VAT
  }
}
