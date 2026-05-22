import { computed, type ComputedRef, ref, type Ref } from 'vue'
import { formatter } from '@/utils/Formatter'
import { accessTokenStorage } from '@/utils/Storage'
import type { IAuthBranchList } from '@/models/response/auth/private/AuthRes.private.model'
import type { TEmployeeRole } from '@/enums/modules/employee/EmployeeRole.enum'
import type { TTitleName } from '@/enums/TitleName.enum'
import { defineStore } from 'pinia'

export interface IUser {
  id: number | null
  name: string
  firstName: string
  lastName: string
  email: string
  title?: TTitleName
  image?: string // imagePath
  imageUrl?: string
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
  setUserImage(image: string): void
  logout(): void
}

export const useAuthStore = defineStore(
  'Auth', (): IAuthStore => {
    const user = ref<IUser>({
      id: null,
      name: '',
      firstName: '',
      lastName: '',
      email: '',
      image: undefined,
      imageUrl: undefined,
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
      user.value = {
        ...userValue,
        name: userValue?.name || formatter.fullName(userValue)
      }
      userToken.value = {
        accessToken: token,
        expireIn: null
      }
    }

    function setUserImage (imageUrl: string): void {
      user.value.imageUrl = imageUrl
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
        name: '',
        firstName: '',
        lastName: '',
        email: '',
        title: undefined,
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
      setUserImage,
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
