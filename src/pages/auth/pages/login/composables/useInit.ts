import type { IActionLoginPayload } from '@/models/request/auth/public/AuthReq.public.model'

export function useInitForm (): IActionLoginPayload {
  return {
    email: 'info@makewebbkk.com',
    password: 'Admin1234',
    confirmPassword: ''
  }
}
