import { schema } from '@/utils/Schema'
import { ExpensesTypeEnum } from '@/enums/modules/finance/ExpenseType.enum'
import { z } from 'zod'

export const ExpensesSchema = z.object({
  expensesType: schema.enum(ExpensesTypeEnum, 'ประเภทค่าใช้จ่าย'),
  expensesId: schema.id('ประเภทค่าใช้จ่าย'),
  categoryId: schema.id('หมวดหมู่ค่าใช้จ่าย'),
  amount: z.number({ message: 'กรุณากรอกจำนวนเงิน' }).min(1, 'กรุณากรอกจำนวนเงิน'),
  payDate: schema.date('วันที่จ่าย'),
  note: z.string().optional(),
  files: z.array(z.object({ name: z.string(), url: z.string(), path: z.string() })).optional()
})

export type ExpensesFormValues = z.infer<typeof ExpensesSchema>

export function useFormInitialValues (): ExpensesFormValues {
  return {
    expensesType: ExpensesTypeEnum['PAY'],
    expensesId: undefined,
    categoryId: undefined,
    amount: 0,
    payDate: '',
    files: []
  }
}
