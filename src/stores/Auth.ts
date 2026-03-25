import { computed, type ComputedRef, ref, type Ref } from 'vue'
import { accessTokenStorage } from '@/utils/Storage'
import type { IAuthBranchList } from '@/models/response/auth/private/AuthRes.private.model'
import type { TEmployeeRole } from '@/enums/modules/employee/EmployeeRole.enum'
import type { TTitleName } from '@/enums/TitleName.enum'
import { defineStore } from 'pinia'

export interface IUser {
  id: number | null
  title?: TTitleName
  firstName: string
  lastName: string
  email: string
  image?: string
  role?: TEmployeeRole
}

export interface IBranch extends IAuthBranchList {}

export interface IToken {
  accessToken: string
  expireIn: number | null
}


interface IAuthStore {
  user: Ref<IUser>
  userToken: Ref<IToken>
  branch: Ref<IBranch>
  // branchToken: Ref<IToken>
  isSeedAccount: ComputedRef<boolean>
  userLogin(user: IUser, token: string): void
  branchLogin(branch: IBranch): void
  logout(): void
}

export const useAuthStore = defineStore(
  'Auth', (): IAuthStore => {
    const user = ref<IUser>({
      id: null,
      firstName: '',
      lastName: '',
      email: '',
      image: undefined,
      role: undefined,
      title: undefined
    })

    const userToken = ref<IToken>({
      accessToken: '',
      expireIn: null
    })

    const branch = ref<IBranch>({
      id: '',
      name: '',
      logo: '',
      role: undefined,
      status: ''
    })

    // const branchToken = ref<IToken>({
    //   accessToken: '',
    //   expireIn: null
    // })

    const isSeedAccount = computed((): boolean => {
      return user.value.email === 'systemuser@email.com'
    })

    function userLogin (userValue: IUser, token: string): void {
      user.value = userValue
      userToken.value = {
        accessToken: token,
        expireIn: null
      }
    }

    function branchLogin (branchValue: IBranch): void {
      branch.value = branchValue
      // branchToken.value = tokenValue
    }

    function clearBranch (): void {
      branch.value = {
        id: '',
        name: '',
        logo: '',
        role: undefined,
        status: ''
      }
      // branchToken.value = {
      //   accessToken: '',
      //   expireIn: null
      // }
    }
    function clearUser (): void {
      user.value = {
        id: null,
        firstName: '',
        lastName: '',
        email: '',
        role: undefined
      }
      userToken.value = {
        accessToken: '',
        expireIn: null
      }
    }

    function logout (): void {
      clearBranch()
      clearUser()
    }

    return {
      user,
      userToken,
      isSeedAccount,
      branch,
      // branchToken,
      userLogin,
      logout,
      branchLogin
    }
  }, {
    persist: [
      { key: 'auth', pick: ['branch', 'user'] },
      {
        pick: ['userToken'],
        key: 'userToken',
        storage: accessTokenStorage
      }
      // {
      //   pick: ['branch'],
      //   key: 'auth_branch',
      //   storage: branchAccessTokenStorage
      // }
    ]
  }
)

export default { useAuthStore }
