import { computed, type ComputedRef, ref, type Ref } from 'vue'
import { accessTokenStorage } from '@/utils/Storage'
import { defineStore } from 'pinia'

/**
 * The backend's UserRole enum, verbatim (docs/api/openapi.json). This app is for `contractor`
 * only, but login returns whichever role the account holds — a safety officer or inspector CAN
 * sign in here, and the login flow rejects them explicitly rather than half-rendering the app
 * against endpoints that will 403 (API-003).
 */
export type TUserRole = 'contractor' | 'safety_officer' | 'inspector'

export const CONTRACTOR_ROLE: TUserRole = 'contractor'

export interface IUser {
  id: string | null
  name: string
  firstName: string
  lastName: string
  email: string
  /**
   * Contractor company/organisation name, shown on the sidebar account card.
   * NOT sent by the backend: the login response is
   * { id, name, firstName, lastName, email, image, role } (docs/api/openapi.json).
   * Kept optional so the card can degrade, but nothing will ever populate it until the API adds
   * an organisation concept — see docs/api/GAPS.md.
   */
  company?: string
  role?: TUserRole
}

export interface IToken {
  accessToken: string
  expireIn: number | null
}

interface IAuthStore {
  user: Ref<IUser>
  userToken: Ref<IToken>
  isAuthenticated: ComputedRef<boolean>
  userLogin(user: IUser, token: string): void
  updateUser(user: Partial<IUser>): void
  logout(): void
}

function emptyUser (): IUser {
  return {
    id: null,
    name: '',
    firstName: '',
    lastName: '',
    email: '',
    company: undefined,
    role: undefined
  }
}

export const useAuthStore = defineStore(
  'Auth', (): IAuthStore => {
    const user = ref<IUser>(emptyUser())

    const userToken = ref<IToken>({
      accessToken: '',
      expireIn: null
    })

    const isAuthenticated = computed((): boolean => {
      return !!userToken.value.accessToken
    })

    function userLogin (userValue: IUser, token: string): void {
      user.value = { ...userValue }
      userToken.value = {
        accessToken: token,
        expireIn: null
      }
    }

    function updateUser (userValue: Partial<IUser>): void {
      user.value = {
        ...user.value,
        ...userValue
      }
    }

    function logout (): void {
      user.value = emptyUser()
      userToken.value = {
        accessToken: '',
        expireIn: null
      }
    }

    return {
      user,
      userToken,
      isAuthenticated,
      userLogin,
      updateUser,
      logout
    }
  }, {
    persist: [
      { key: 'auth', pick: ['user'] },
      {
        pick: ['userToken'],
        key: 'userToken',
        storage: accessTokenStorage
      }
    ]
  }
)

export default { useAuthStore }
