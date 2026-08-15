import type { ILoginPayload } from '@/models/request/auth/public/AuthReq.public.model'
import useDev from '@/composables/useDev'

/** Dev convenience — must match the stub credential in Auth.public.provider.ts. */
export function useInitForm (): ILoginPayload {
  const { isDev } = useDev()
  return {
    email: isDev.value ? 'contractor@smartworkpermit.dev' : '',
    password: isDev.value ? 'password123' : ''
  }
}
