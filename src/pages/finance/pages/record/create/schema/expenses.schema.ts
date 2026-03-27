import { schema } from '@/utils/Schema'
import { ExpensesTypeEnum } from '@/enums/modules/finance/ExpenseType.enum'
import { z } from 'zod'

export const ExpensesSchema = z.object({
  expensesType: schema.enum(ExpensesTypeEnum, 'ประเภทค่าใช้จ่าย'),
  expensesId: z.number().min(1, 'กรุณาเลือกค่าใช้จ่าย').nullable(),
  categoryId: z.number().min(1, 'กรุณาเลือกหมวดหมู่ค่าใช้จ่าย').nullable(),
  amount: z.number().min(1, 'กรุณาเลือกกรอกจำนวนเงิน'),
  payDate: schema.date('วันที่จ่าย'),
  note: z.string().optional()
})

export type ExpensesFormValues = z.infer<typeof ExpensesSchema>

export function useDev (): ExpensesFormValues {
  return {
    expensesType: ExpensesTypeEnum['PAY'],
    expensesId: null,
    categoryId: null,
    amount: 0,
    payDate: ''
  }
}

export function useFormInitialValues (): ExpensesFormValues {
  return {
    expensesType: ExpensesTypeEnum['PAY'],
    expensesId: null,
    categoryId: null,
    amount: 0,
    payDate: ''
  }
}
