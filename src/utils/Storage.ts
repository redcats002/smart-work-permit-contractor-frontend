import Cookies from 'js-cookie'

interface IAccessTokenState {
  accessToken: string
  expireIn: number | null
}

export interface IStorage {
  setItem (key: string, state: any): string | undefined
  getItem (): string
}

export const accessTokenStorage: IStorage = {
  setItem: (_key: string, state: string): string | undefined => {
    const token = JSON.parse(state)
    const { expireIn }: IAccessTokenState = token.userToken
    const expires: Date | number = expireIn ? new Date(expireIn * 1000) : 3

    return Cookies.set('user_access_token', btoa(state), {
      expires
    })
  },
  getItem: (): string => {
    const token = Cookies.get('user_access_token')
    return token ? atob(token as string) : ''
  }
}
