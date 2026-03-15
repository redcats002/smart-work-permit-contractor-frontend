import { schema } from '@/utils/Schema'
import { EvaluatorLevelEnum } from '@/enums/modules/contract/EvaluatorLevel.enum'
import { z } from 'zod'

export const AssetValuationSchema = z.object({
  evaluatorLevel: schema.enum(EvaluatorLevelEnum, 'กลุ่มผู้ตีราคา'),
  detail: z.string().min(1, 'กรุณากรอกรายละเอียดเพิ่มเติม')
})

export type AssetValuationFormValues = z.infer<typeof AssetValuationSchema>

export function useFormInitialValues (): AssetValuationFormValues {
  return {
    evaluatorLevel: '',
    detail: ''
  }
}
