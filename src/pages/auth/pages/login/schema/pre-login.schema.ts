import { z } from 'zod'

export const PreLoginSchema = z.object({
  email: z.email('รูปแบบอีเมลไม่ถูกต้อง').min(1, 'กรุณากรอกอีเมล')
})

export type PreLoginFormValues = z.infer<typeof PreLoginSchema>
export function useFormInitialValues (): PreLoginFormValues {
  return {
    email: ''
  }
}
