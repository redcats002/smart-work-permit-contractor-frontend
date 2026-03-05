import { useAuthStore } from '@/stores/Auth'

interface IToken {
  key: string
  value: string
}

export type TAuthType = 'USER' | 'BRANCH'

export const getAuthToken = (type: TAuthType = 'USER'): IToken | null => {
  const authStore = useAuthStore()

  const getUserAccessToken = (): string | null => authStore?.userToken?.accessToken || null
  const getBranchAccessToken = (): string | null => authStore?.branchToken?.accessToken || null
  if (type === 'USER') {
    const accessToken = getUserAccessToken()
    if (accessToken) {
      return {
        key: 'Authorization',
        value: `Bearer ${accessToken}`
      }
    }
  }
  if (type === 'BRANCH') {
    const accessToken = getBranchAccessToken()
    if (accessToken) {
      return {
        key: 'Authorization',
        value: `Bearer ${accessToken}`
      }
    }
  }
  return null
}
