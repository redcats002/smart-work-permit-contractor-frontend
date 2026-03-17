import { accessTokenStorage, branchAccessTokenStorage } from '@/utils/Storage'
import Cookies from 'js-cookie'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('js-cookie', () => ({
  default: {
    set: vi.fn(),
    get: vi.fn()
  }
}))

const mockCookiesSet = vi.mocked(Cookies.set)
const mockCookiesGet = vi.mocked(Cookies.get) as ReturnType<typeof vi.fn>

describe('accessTokenStorage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('setItem', () => {
    it('stores the user token as base64 in cookie', () => {
      const state = JSON.stringify({ userToken: { accessToken: 'abc', expireIn: null } })

      accessTokenStorage.setItem('key', state)

      expect(mockCookiesSet).toHaveBeenCalledWith(
        'user_access_token', btoa(state), expect.objectContaining({ expires: 3 })
      )
    })

    it('uses expireIn as expiry when provided', () => {
      const expireTimestamp = Math.floor(Date.now() / 1000) + 3600 // 1 hour from now
      const state = JSON.stringify({ userToken: { accessToken: 'abc', expireIn: expireTimestamp } })

      accessTokenStorage.setItem('key', state)

      expect(mockCookiesSet).toHaveBeenCalledWith(
        'user_access_token', btoa(state), expect.objectContaining({ expires: new Date(expireTimestamp * 1000) })
      )
    })
  })

  describe('getItem', () => {
    it('returns decoded token when cookie exists', () => {
      const state = JSON.stringify({ userToken: { accessToken: 'abc' } })
      mockCookiesGet.mockReturnValue(btoa(state))

      const result = accessTokenStorage.getItem()
      expect(result).toBe(state)
    })

    it('returns empty string when cookie does not exist', () => {
      mockCookiesGet.mockReturnValue(undefined)

      const result = accessTokenStorage.getItem()
      expect(result).toBe('')
    })
  })
})

describe('branchAccessTokenStorage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('setItem', () => {
    it('stores the branch token as base64 in cookie', () => {
      const state = JSON.stringify({ branchToken: { accessToken: 'xyz', expireIn: null } })

      branchAccessTokenStorage.setItem('key', state)

      expect(mockCookiesSet).toHaveBeenCalledWith(
        'branch_access_token', btoa(state), expect.objectContaining({ expires: 3 })
      )
    })
  })

  describe('getItem', () => {
    it('returns decoded token when cookie exists', () => {
      const state = JSON.stringify({ branchToken: { accessToken: 'xyz' } })
      mockCookiesGet.mockReturnValue(btoa(state))

      const result = branchAccessTokenStorage.getItem()
      expect(result).toBe(state)
    })

    it('returns empty string when cookie does not exist', () => {
      mockCookiesGet.mockReturnValue(undefined)

      const result = branchAccessTokenStorage.getItem()
      expect(result).toBe('')
    })
  })
})
