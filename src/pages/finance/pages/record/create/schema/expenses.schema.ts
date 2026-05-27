/* eslint-disable @typescript-eslint/typedef */
import { schema } from '@/utils/Schema'
import { ExpensesTypeEnum } from '@/enums/modules/finance/ExpenseType.enum'
import { z } from 'zod'

export const ExpensesSchema = z.object({
  type: schema.enum(ExpensesTypeEnum, 'ประเภทรับ/จ่าย'),
  expenseCategoryId: schema.id('หมวดหมู่ค่าใช้จ่าย'),
  expenseTypeId: schema.id('ประเภทค่าใช้จ่าย'),
  amount: z.number({ message: 'กรุณากรอกจำนวนเงิน' }).min(1, 'กรุณากรอกจำนวนเงิน'),
  expenseDate: schema.date('วันที่จ่าย'),
  reason: z.string().optional(),
  files: z.array(z.object({ name: z.string(), url: z.string(), path: z.string() })).min(1),
  branchId: schema.id('สาขา')
}).superRefine((data, ctx) => {
  if (data.expenseCategoryId && !data.expenseTypeId) {
    ctx.addIssue({
      path: ['expenseTypeId'],
      code: 'custom',
      message: 'กรุณาเลือกประเภทค่าใช้จ่าย'
    })
  }
})

export type ExpensesFormValues = z.infer<typeof ExpensesSchema>

export function useFormInitialValues (): ExpensesFormValues {
  return {
    type: undefined,
    expenseTypeId: undefined,
    expenseCategoryId: undefined,
    amount: 0,
    expenseDate: '',
    files: []
  }
}
