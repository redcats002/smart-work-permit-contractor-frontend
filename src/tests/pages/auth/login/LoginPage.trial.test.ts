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
import LoginPage from '@/pages/auth/pages/login/pages/LoginPage.vue'
import type { IDemoLoginPayload } from '@/models/request/auth/public/AuthReq.public.model'
import type { TActionLoginResponse } from '@/models/response/auth/public/AuthRes.public.model'

/**
 * Trial auto-login button — a demo-only affordance so this app can be shown without typing
 * credentials. Since wayfinder ticket 023 the button calls the server-issued
 * `POST /api/v1/auth/demo-login` route with `role: 'contractor'` instead of a client-held
 * password: `VITE_TRIAL_LOGIN_PASSWORD` is gone, not just unused. Every assertion here is a
 * security constraint from the brief, not a nicety: no password is ever sent, the same
 * store-write/redirect path the real form uses is shared, and a 404 (demo login disabled
 * server-side) renders a localized message and hides the button rather than a raw error.
 */
vi.mock('@/plugins/toast', () => ({
  toast: {
    success: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn()
  }
}))

function loginResponse (): TActionLoginResponse {
  return {
    success: true,
    data: {
      token: 'session-token',
      user: {
        id: 'u-1',
        name: 'Demo Contractor',
        firstName: 'Demo',
        lastName: 'Contractor',
        email: 'demo.contractor@e-safework.demo',
        role: 'contractor'
      }
    }
  }
}

function buildRouter (): Router {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/auth/login', name: 'LoginPage', component: LoginPage },
      { path: '/permits', name: 'PermitListPage', component: { template: '<div />' } }
    ]
  })
}

async function mountPage (): Promise<{ wrapper: VueWrapper, router: Router }> {
  const router = buildRouter()
  await router.push('/auth/login')
  await router.isReady()

  const wrapper = mount(LoginPage, {
    global: { plugins: [i18n, router, [PrimeVue, { unstyled: true }]] }
  })
  await flushPromises()
  return { wrapper, router }
}

function findTrialButton (wrapper: VueWrapper): ReturnType<VueWrapper['find']> {
  return wrapper.find('[data-testid="trial-login-button"]')
}

describe('LoginPage — trial auto-login button (wayfinder 023)', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    setLocale('en')
  })

  afterEach(() => {
    setLocale('th')
    localStorage.clear()
    vi.restoreAllMocks()
    vi.unstubAllEnvs()
    vi.mocked(toast.error).mockClear()
    vi.mocked(toast.success).mockClear()
  })

  it('is hidden when VITE_TRIAL_LOGIN is unset (default off — never enabled by accident)', async () => {
    vi.stubEnv('VITE_TRIAL_LOGIN', '')

    const { wrapper } = await mountPage()

    expect(wrapper.text()).not.toContain('Trial account')
  })

  it('is hidden for any value other than the exact string "true"', async () => {
    vi.stubEnv('VITE_TRIAL_LOGIN', 'TRUE')

    const { wrapper } = await mountPage()

    expect(wrapper.text()).not.toContain('Trial account')
  })

  it('calls the demo-login endpoint with role "contractor" and no password, through the same session flow the form uses', async () => {
    vi.stubEnv('VITE_TRIAL_LOGIN', 'true')
    const demoLoginSpy = vi.spyOn(AuthPublicProvider.prototype, 'demoLogin').mockResolvedValue(loginResponse())
    const loginSpy = vi.spyOn(AuthPublicProvider.prototype, 'login')

    const { wrapper, router } = await mountPage()
    expect(wrapper.text()).toContain('Trial account')

    await findTrialButton(wrapper).trigger('click')
    await flushPromises()

    expect(demoLoginSpy).toHaveBeenCalledWith({ role: 'contractor' } satisfies IDemoLoginPayload)
    expect(demoLoginSpy.mock.calls[0][0]).not.toHaveProperty('password')
    expect(loginSpy).not.toHaveBeenCalled()
    expect(useAuthStore().isAuthenticated).toBe(true)
    expect(router.currentRoute.value.name).toBe('PermitListPage')
  })

  it('renders a localized message and hides the button when demo login is disabled server-side (404)', async () => {
    vi.stubEnv('VITE_TRIAL_LOGIN', 'true')
    vi.spyOn(AuthPublicProvider.prototype, 'demoLogin').mockRejectedValue({ code: 404 })

    const { wrapper } = await mountPage()
    await findTrialButton(wrapper).trigger('click')
    await flushPromises()

    expect(toast.error).toHaveBeenCalledWith('Trial login is not available in this environment.')
    expect(wrapper.text()).not.toContain('Trial account')
  })

  it('renders the localized "not available" message in Thai', async () => {
    setLocale('th')
    vi.stubEnv('VITE_TRIAL_LOGIN', 'true')
    vi.spyOn(AuthPublicProvider.prototype, 'demoLogin').mockRejectedValue({ code: 404 })

    const { wrapper } = await mountPage()
    await findTrialButton(wrapper).trigger('click')
    await flushPromises()

    expect(toast.error).toHaveBeenCalledWith('ไม่สามารถใช้งานการเข้าสู่ระบบทดลองในสภาพแวดล้อมนี้ได้')
  })
})
