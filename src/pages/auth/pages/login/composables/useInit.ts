import type { IActionLoginPayload } from '@/models/request/auth/public/AuthReq.public.model'
import useDev from '@/composables/useDev'

export function useInitForm (): IActionLoginPayload {
  const { isDev } = useDev()
  return {
    email: isDev.value ? 'systemuser@email.com' : '', // systemuser@email.com
    password: isDev.value ? 'password123' : '', // password123
    confirmPassword: ''
  }
}
