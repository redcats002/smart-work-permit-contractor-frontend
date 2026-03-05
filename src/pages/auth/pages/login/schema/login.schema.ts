import { z } from 'zod'

export const LoginSchema = z.object({
  email: z.email('รูปแบบอีเมลไม่ถูกต้อง').min(1, 'กรุณากรอกอีเมล'),
  password: z
    .string()
    .min(1, 'กรุณากรอกรหัสผ่าน')
})

export type LoginFormValues = z.infer<typeof LoginSchema>
export function useFormInitialValues (): LoginFormValues {
  return {
    email: '',
    password: ''
  }
}
