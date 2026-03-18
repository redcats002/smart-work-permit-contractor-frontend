import { schema } from '@/utils/Schema'
import { z } from 'zod'

export const ContractHistorySchema = z.object({
  date: schema.date('วันที่'),
  topic: schema.id('เรื่อง'),
  note: z.string().min(1, 'กรุณากรอกรายละเอียด')
})

export type ContractHistoryFormValues = z.infer<typeof ContractHistorySchema>

export function useFormInitialValues (): ContractHistoryFormValues {
  return {
    date: '',
    topic: '',
    note: ''
  }
}
