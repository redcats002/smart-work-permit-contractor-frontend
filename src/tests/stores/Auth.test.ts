import { createPinia, setActivePinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createApp, nextTick } from 'vue'
import Cookies from 'js-cookie'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuthStore } from '@/stores/Auth'
import type { IUser } from '@/stores/Auth'

/**
 * Exercises PLT-005's store contract:
 *  - login/logout state transitions
 *  - the token persistence round-trip through `accessTokenStorage` (cookie, see Storage.ts)
 *    and the `user` round-trip through localStorage, both wired via
 *    `pinia-plugin-persistedstate` exactly as `src/plugins/Pinia.plugin.ts` configures it.
 */
vi.mock('js-cookie', () => ({
  default: {
    set: vi.fn(),
    get: vi.fn()
  }
}))

const mockCookiesSet = vi.mocked(Cookies.set)

const STUB_USER: IUser = {
  id: 'stub-contractor-1',
  name: 'Somchai Contractor',
  firstName: 'Somchai',
  lastName: 'Contractor',
  email: 'contractor@smartworkpermit.dev',
  company: 'NNY Mechanical',
  role: 'contractor'
}

describe('useAuthStore', () => {
  beforeEach(() => {
    // Mirrors src/plugins/Pinia.plugin.ts + registerPlugins(): `pinia.use()` only queues a
    // plugin until `app.use(pinia)` actually installs it (see Pinia's `createPinia().use()`
    // — plugins added before `install(app)` sit in `toBeInstalled` until then), so
    // `pinia-plugin-persistedstate` needs a real (even if inert) Vue app in the loop or its
    // `$subscribe` persistence hook silently never attaches.
    const pinia = createPinia()
    pinia.use(piniaPluginPersistedstate)
    createApp({}).use(pinia)
    setActivePinia(pinia)
    localStorage.clear()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('login/logout state transitions', () => {
    it('starts unauthenticated with an empty user and token', () => {
      const authStore = useAuthStore()

      expect(authStore.isAuthenticated).toBe(false)
      expect(authStore.user.id).toBeNull()
      expect(authStore.userToken.accessToken).toBe('')
    })

    it('userLogin() sets the user and token and flips isAuthenticated to true', () => {
      const authStore = useAuthStore()

      authStore.userLogin(STUB_USER, 'stub-access-token')

      expect(authStore.isAuthenticated).toBe(true)
      expect(authStore.user).toEqual(STUB_USER)
      expect(authStore.userToken.accessToken).toBe('stub-access-token')
    })

    it('updateUser() merges a partial update without touching the token', () => {
      const authStore = useAuthStore()
      authStore.userLogin(STUB_USER, 'stub-access-token')

      authStore.updateUser({ company: 'New Co.' })

      expect(authStore.user.company).toBe('New Co.')
      expect(authStore.user.id).toBe(STUB_USER.id)
      expect(authStore.userToken.accessToken).toBe('stub-access-token')
    })

    it('logout() clears the user and token and flips isAuthenticated back to false', () => {
      const authStore = useAuthStore()
      authStore.userLogin(STUB_USER, 'stub-access-token')

      authStore.logout()

      expect(authStore.isAuthenticated).toBe(false)
      expect(authStore.user.id).toBeNull()
      expect(authStore.user.email).toBe('')
      expect(authStore.userToken.accessToken).toBe('')
    })
  })

  describe('token persistence round-trip', () => {
    it('userLogin() persists the token to the user_access_token cookie via accessTokenStorage', async () => {
      const authStore = useAuthStore()

      authStore.userLogin(STUB_USER, 'stub-access-token')
      await nextTick()

      expect(mockCookiesSet).toHaveBeenCalledWith(
        'user_access_token', expect.any(String), expect.objectContaining({ expires: 3 })
      )

      const [, base64Payload] = mockCookiesSet.mock.calls[mockCookiesSet.mock.calls.length - 1]
      const decoded = JSON.parse(atob(base64Payload as string))
      expect(decoded.userToken.accessToken).toBe('stub-access-token')
    })

    it('userLogin() persists the user to the "auth" localStorage key', async () => {
      const authStore = useAuthStore()

      authStore.userLogin(STUB_USER, 'stub-access-token')
      await nextTick()

      const stored = JSON.parse(localStorage.getItem('auth') ?? '{}')
      expect(stored.user).toEqual(STUB_USER)
    })

    it('logout() round-trips the cleared token back through the cookie storage', async () => {
      const authStore = useAuthStore()
      authStore.userLogin(STUB_USER, 'stub-access-token')
      await nextTick()

      authStore.logout()
      await nextTick()

      const [, base64Payload] = mockCookiesSet.mock.calls[mockCookiesSet.mock.calls.length - 1]
      const decoded = JSON.parse(atob(base64Payload as string))
      expect(decoded.userToken.accessToken).toBe('')
    })
  })
})
