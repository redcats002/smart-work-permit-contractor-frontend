import type { IActionHowDidFindUsPayload } from '@/models/request/how-did-find-us/HowDidFindUsReq.model'
import { z } from 'zod'

export const HowDidFindUsSchema = z.object({
  name: z.string().min(1, 'กรุณากรอกชื่ออาชีพ')
})

export type HowDidFindUsFormValues = z.infer<typeof HowDidFindUsSchema>

export function useFormInitialValues (): IActionHowDidFindUsPayload {
  return {
    name: ''
  }
}
