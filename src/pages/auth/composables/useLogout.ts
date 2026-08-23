import { useRouter } from 'vue-router'
import { toast } from '@/plugins/toast'
import { useApiError } from '@/composables/useApiError'
import { useAuthStore } from '@/stores/Auth'
import { handleLoading } from '@/utils/HandleLoading'
import AuthPrivateProvider, { type IAuthPrivateProvider } from '@/resources/provider/auth/private/Auth.private.provider'

interface IUseLogout {
  logout (): void
}
export default function useLogout (): IUseLogout {
  const AuthPrivateService: IAuthPrivateProvider = new AuthPrivateProvider()

  const router = useRouter()
  const authStore = useAuthStore()
  const { mapError } = useApiError()

  async function useLogout (): Promise<void> {
    await AuthPrivateService.logout()
    authStore.logout()
    router.push({ name: 'LoginPage' })
  }

  function logout (): void {
    handleLoading(useLogout, {}, (error: unknown): void => {
      toast.error(mapError(error).message)
    })
  }

  return {
    logout
  }
}
