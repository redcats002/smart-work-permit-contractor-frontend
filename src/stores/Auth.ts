import { computed, type ComputedRef, ref, type Ref } from 'vue'
import { accessTokenStorage } from '@/utils/Storage'
import { defineStore } from 'pinia'

/** This app has exactly one role — kept as a literal union (not an enum) so there is nothing to switch on. */
export type TUserRole = 'contractor'

export interface IUser {
  id: string | null
  name: string
  firstName: string
  lastName: string
  email: string
  /**
   * Contractor company/organisation name, shown on the sidebar account card
   * (design: "NNY Mechanical"). The backend `users` table
   * (docs/main/dev-handoff/01-backend-elysia-tasks.md) only specifies
   * `id, name, role, contact info` — no company field is named there, so
   * this is optional. Named `company` to match the shape PLT-005's
   * acceptance criteria spells out: `user: { id, name, role: 'contractor', company }`.
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
