import type { IActionLoginPayload } from '@/models/request/auth/public/AuthReq.public.model'

export function useInitForm (): IActionLoginPayload {
  return {
    email: 'systemuser@email.com',
    password: 'password123',
    confirmPassword: ''
  }
}
