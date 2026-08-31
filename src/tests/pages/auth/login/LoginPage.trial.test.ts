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
import type { ILoginPayload } from '@/models/request/auth/public/AuthReq.public.model'
import type { TActionLoginResponse } from '@/models/response/auth/public/AuthRes.public.model'

/**
 * Trial auto-login button — a demo-only affordance so this app can be shown without typing
 * credentials. Every assertion here is a security constraint from the brief, not a nicety:
 * the button must be gated on TWO env vars (never one), must call the SAME provider/flow the
 * real form uses (no client-side bypass), and must never render with a guessed password.
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
        name: 'Trial Contractor',
        firstName: 'Trial',
        lastName: 'Contractor',
        email: 'contractor@e2e.test',
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

describe('LoginPage — trial auto-login button', () => {
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
    vi.stubEnv('VITE_TRIAL_LOGIN_PASSWORD', 'demo-password')

    const { wrapper } = await mountPage()

    expect(wrapper.text()).not.toContain('Trial account')
  })

  it('is hidden when the flag is on but no password is configured — never guesses a default', async () => {
    vi.stubEnv('VITE_TRIAL_LOGIN', 'true')
    vi.stubEnv('VITE_TRIAL_LOGIN_PASSWORD', '')

    const { wrapper } = await mountPage()

    expect(wrapper.text()).not.toContain('Trial account')
  })

  it('is hidden for any value other than the exact string "true"', async () => {
    vi.stubEnv('VITE_TRIAL_LOGIN', 'TRUE')
    vi.stubEnv('VITE_TRIAL_LOGIN_PASSWORD', 'demo-password')

    const { wrapper } = await mountPage()

    expect(wrapper.text()).not.toContain('Trial account')
  })

  it('signs in the seeded contractor account through the SAME provider call the form uses, when both env vars are set', async () => {
    vi.stubEnv('VITE_TRIAL_LOGIN', 'true')
    vi.stubEnv('VITE_TRIAL_LOGIN_PASSWORD', 'demo-password')
    const loginSpy = vi.spyOn(AuthPublicProvider.prototype, 'login').mockResolvedValue(loginResponse())

    const { wrapper, router } = await mountPage()
    expect(wrapper.text()).toContain('Trial account')

    await findTrialButton(wrapper).trigger('click')
    await flushPromises()

    expect(loginSpy).toHaveBeenCalledWith({
      email: 'contractor@e2e.test',
      password: 'demo-password'
    } satisfies ILoginPayload)
    expect(useAuthStore().isAuthenticated).toBe(true)
    expect(router.currentRoute.value.name).toBe('PermitListPage')
  })
})
