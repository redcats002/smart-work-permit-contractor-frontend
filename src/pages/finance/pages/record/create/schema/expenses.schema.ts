import { useDayjs } from '@/utils/Dayjs'
import { ExpensesTypeEnum } from '@/enums/modules/finance/ExpenseType.enum'
import { z } from 'zod'

export const ExpensesSchema = z.object({
  expensesType: z.enum(ExpensesTypeEnum, 'กรุณาเลือกคำนำหน้าชื่อ'),
  expensesId: z.number().min(1, 'กรุณาเลือกค่าใช้จ่าย').nullable(),
  categoryId: z.number().min(1, 'กรุณาเลือกหมวดหมู่ค่าใช้จ่าย').nullable(),
  amount: z.number().min(1, 'กรุณาเลือกกรอกจำนวนเงิน'),
  payDate: z.date().min(1, 'วันที่จ่าย').transform((val: Date): string => {
    const dayjs = useDayjs()
    const parse = dayjs(val).toISOString()
    return dayjs(val).isValid() ? parse : val.toString()
  }),
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
