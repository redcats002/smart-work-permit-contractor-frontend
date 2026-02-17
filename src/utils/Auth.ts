import { useAuthStore } from '@/stores/Auth'

interface IToken {
  key: string
  value: string
}

const authStore = useAuthStore()

export const getAccessToken = (): string | null => authStore?.userToken?.accessToken || null

export const getAuthToken = (): IToken | null => {
  const accessToken = getAccessToken()

  if (accessToken) {
    return {
      key: 'Authorization',
      value: `Bearer ${accessToken}`
    }
  }

  return null
}
