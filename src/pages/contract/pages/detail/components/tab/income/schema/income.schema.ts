import { schema } from '@/utils/Schema'
import { EVatType } from '@/enums/modules/Vat.enum'
import { z } from 'zod'

export const IncomeSchema = z.object({
  incomeCategoryId: schema.id('หมวดหมู่ค่าใช้จ่าย'),
  incomeTypeId: schema.id('ประเภทค่าใช้จ่าย'),
  note: z.string().min(1, 'กรุณากรอกคำอธิบาย'),
  amount: z
    .number({ message: 'กรุณากรอกจำนวนเงิน' })
    .min(1, 'กรุณากรอกจำนวนเงิน'),
  file: z.array(schema.media),
  vatType: z.enum(EVatType, { message: 'กรุณาเลือกประเภท VAT' })
})

export type IncomeFormValues = z.infer<typeof IncomeSchema>

export function useFormInitialValues (): IncomeFormValues {
  return {
    incomeCategoryId: null,
    incomeTypeId: null,
    note: '',
    amount: 0,
    file: [],
    vatType: EVatType.VAT
  }
}
