import { schema } from '@/utils/Schema'
import { z } from 'zod'

export const ContractHistorySchema = z.object({
  date: schema.date('วันที่'),
  subjectId: schema.id('เรื่อง'),
  detail: z.string().min(1, 'กรุณากรอกรายละเอียด')
})

export type ContractHistoryFormValues = z.infer<typeof ContractHistorySchema>

export function useFormInitialValues (): ContractHistoryFormValues {
  return {
    date: '',
    subjectId: undefined,
    detail: ''
  }
}
