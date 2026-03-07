import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'

export interface IUser {
  id: number | null
  firstName: string
  lastName: string
  email: string
}

export interface IBranch {
  id: number | null
  name: string
}

export interface IToken {
  accessToken: string
  expireIn: number | null
}

interface IAuthStore {
  user: Ref<IUser>
  // userToken: Ref<IToken>
  branch: Ref<IBranch>
  // branchToken: Ref<IToken>
  userLogin(user: IUser): void
  branchLogin(branch: IBranch): void
  logout (): void
}

export const useAuthStore = defineStore('Auth', (): IAuthStore => {
  const user = ref<IUser>({
    id: null,
    firstName: '',
    lastName: '',
    email: ''
  })

  const userToken = ref<IToken>({
    accessToken: '',
    expireIn: null
  })

  const branch = ref<IBranch>({
    id: null,
    name: ''
  })

  const branchToken = ref<IToken>({
    accessToken: '',
    expireIn: null
  })

  function userLogin (userValue: IUser): void {
    user.value = userValue
    // userToken.value = tokenValue
  }

  function branchLogin (branchValue: IBranch): void {
    branch.value = branchValue
    // branchToken.value = tokenValue
  }

  function clearBranch (): void {
    branch.value = {
      id: null,
      name: ''
    }
    branchToken.value = {
      accessToken: '',
      expireIn: null
    }
  }
  function clearUser (): void {
    user.value = {
      id: null,
      firstName: '',
      lastName: '',
      email: ''
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
    // userToken,
    userLogin,
    logout,
    branch,
    // branchToken,
    branchLogin
  }
}, {
  persist: [
    {
      pick: ['user']
      // storage: accessTokenStorage
    },
    {
      pick: ['branch']
      // storage: branchAccessTokenStorage
    }
  ]
})

export default { useAuthStore }
