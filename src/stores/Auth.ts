import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import { accessTokenStorage } from '@/utils/Storage'

interface IUser {
  id: number | null
  firstName: string
  lastName: string
  email: string
}

interface IToken {
  accessToken: string
  expireIn: number | null
}

interface IAuthStore {
  user: Ref<IUser>
  userToken: Ref<IToken>
  userLogin(user: IUser, token: IToken): void
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

  function userLogin (userValue: IUser, tokenValue: IToken): void {
    user.value = userValue
    userToken.value = tokenValue
  }

  function logout (): void {
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

  return {
    user,
    userToken,
    userLogin,
    logout
  }
}, {
  persist: [
    {
      pick: ['userToken'],
      storage: accessTokenStorage
    }
  ]
})

export default { useAuthStore }
