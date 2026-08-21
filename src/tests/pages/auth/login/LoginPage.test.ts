import type { VueWrapper } from '@vue/test-utils'
import type { Router } from 'vue-router'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import PrimeVue from 'primevue/config'
import i18n, { setLocale } from '@/plugins/I18n.plugin'
import { toast } from '@/plugins/toast'
import { useAuthStore } from '@/stores/Auth'
import AuthPublicProvider from '@/resources/provider/auth/public/Auth.public.provider'
import LoginForm from '@/pages/auth/pages/login/components/auth/form/LoginForm.vue'
import LoginPage from '@/pages/auth/pages/login/pages/LoginPage.vue'
import type { TActionLoginResponse } from '@/models/response/auth/public/AuthRes.public.model'

// `toast` is a thin module-level wrapper around PrimeVue's ToastService (src/plugins/toast.ts),
// which is not registered in a bare mount. Mocking it is also what makes the §2 invariant
// assertable: the exact string the user would have seen is the argument recorded here.
vi.mock('@/plugins/toast', () => ({
  toast: {
    success: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn()
  }
}))

function loginResponse (role: string): TActionLoginResponse {
  return {
    success: true,
    data: {
      token: 'session-token',
      user: {
        id: 'u-1',
        name: 'Somchai C',
        firstName: 'Somchai',
        lastName: 'C',
        email: 'somchai@example.com',
        role: role as 'contractor'
      }
    }
  }
}

function buildRouter (): Router {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/auth/login', name: 'LoginPage', component: LoginPage },
      // vue-router 5 resolves a RouterLink/router.push target eagerly and throws on an unknown
      // name, so every route this page can navigate to must exist here.
      { path: '/permits', name: 'PermitListPage', component: { template: '<div />' } }
    ]
  })
}

async function mountPage (): Promise<{ wrapper: VueWrapper, router: Router }> {
  const router = buildRouter()
  await router.push('/auth/login')
  await router.isReady()

  const wrapper = mount(LoginPage, {
    global: {
      plugins: [i18n, router, [PrimeVue, { unstyled: true }]]
    }
  })
  await flushPromises()
  return { wrapper, router }
}

/** Fires the form's `submit` emit, which is what LoginForm does once zod validation passes. */
async function submitLogin (wrapper: VueWrapper): Promise<void> {
  wrapper.findComponent(LoginForm).vm.$emit('submit')
  await flushPromises()
}

describe('LoginPage (PLT-004)', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    // The app's default locale is `th`. Pin `en` on the REAL i18n plugin instance — not a fresh
    // createI18n — because useApiError() localizes through that singleton, so a separate test
    // instance would leave mapError() answering in Thai while the page rendered English.
    setLocale('en')
  })

  afterEach(() => {
    setLocale('th')
    localStorage.clear()
    vi.restoreAllMocks()
    vi.mocked(toast.error).mockClear()
    vi.mocked(toast.success).mockClear()
  })

  it('signs a contractor in and routes to My Permits', async () => {
    vi.spyOn(AuthPublicProvider.prototype, 'login').mockResolvedValue(loginResponse('contractor'))

    const { wrapper, router } = await mountPage()
    await submitLogin(wrapper)

    expect(useAuthStore().isAuthenticated).toBe(true)
    expect(router.currentRoute.value.name).toBe('PermitListPage')
  })

  // The cross-repo invariant (../CONTEXT.md §2): clients localize off `errorCode` and must NEVER
  // render the backend's `message`. RATE_LIMITED is emitted by POST /auth/user/public/login since
  // the 2026-08-19 backend pass (docs/api/GAPS.md row V4), so this is the cheapest live trigger.
  it('renders the localized RATE_LIMITED copy and never the backend message', async () => {
    const backendMessage = 'Too many requests, please try again later'
    vi.spyOn(AuthPublicProvider.prototype, 'login')
      .mockRejectedValue({ code: 429, errorCode: 'RATE_LIMITED', message: backendMessage })

    const { wrapper } = await mountPage()
    await submitLogin(wrapper)

    expect(toast.error).toHaveBeenCalledWith('Too many attempts. Wait a moment and try again.')
    expect(toast.error).not.toHaveBeenCalledWith(backendMessage)
    expect(useAuthStore().isAuthenticated).toBe(false)
  })

  it('falls back to the generic copy — never the backend message — when the error carries no errorCode', async () => {
    vi.spyOn(console, 'error').mockImplementation((): void => undefined)
    const backendMessage = 'Invalid credentials'
    vi.spyOn(AuthPublicProvider.prototype, 'login')
      .mockRejectedValue({ code: 401, message: backendMessage })

    const { wrapper } = await mountPage()
    await submitLogin(wrapper)

    expect(toast.error).toHaveBeenCalledWith('Something went wrong. Please try again.')
    expect(toast.error).not.toHaveBeenCalledWith(backendMessage)
  })

  // A safety officer or inspector authenticates successfully — every contractor-gated screen
  // would then 403, so the session is refused outright rather than half-rendered (API-003).
  it('refuses a non-contractor role and does not open a session', async () => {
    vi.spyOn(AuthPublicProvider.prototype, 'login').mockResolvedValue(loginResponse('safety_officer'))

    const { wrapper, router } = await mountPage()
    await submitLogin(wrapper)

    expect(toast.error).toHaveBeenCalledWith('Your account does not have permission to do this.')
    expect(useAuthStore().isAuthenticated).toBe(false)
    expect(router.currentRoute.value.name).toBe('LoginPage')
  })

  it('redirects an already-authenticated visitor straight to My Permits', async () => {
    useAuthStore().userLogin({
      id: 'u-1', name: 'Somchai C', firstName: 'Somchai', lastName: 'C', email: 'somchai@example.com', role: 'contractor'
    }, 'session-token')

    const { router } = await mountPage()

    expect(router.currentRoute.value.name).toBe('PermitListPage')
  })
})
