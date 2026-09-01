import type { VueWrapper } from '@vue/test-utils'
import type { Router } from 'vue-router'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import PrimeVue from 'primevue/config'
import i18n, { setLocale } from '@/plugins/I18n.plugin'
import AuthPublicProvider from '@/resources/provider/auth/public/Auth.public.provider'
import LoginPage from '@/pages/auth/pages/login/pages/LoginPage.vue'

/**
 * wayfinder ticket 032 — "UAT role-fill login button". Gated behind the SAME `VITE_TRIAL_LOGIN`
 * flag as ticket 023's server-issued trial-login button, but a different affordance: this one
 * fills the visible form fields with a fixed test contractor account and does NOT itself submit
 * or call any endpoint — the tester still presses the real Sign In button. The two must not be
 * mistaken for each other (separate section, separate data-testid, separate copy).
 */
vi.mock('@/plugins/toast', () => ({
  toast: { success: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() }
}))

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

describe('LoginPage — UAT fill-form button (wayfinder 032)', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    setLocale('en')
  })

  afterEach(() => {
    setLocale('th')
    localStorage.clear()
    vi.restoreAllMocks()
    vi.unstubAllEnvs()
  })

  it('is hidden when VITE_TRIAL_LOGIN is unset (default off)', async () => {
    vi.stubEnv('VITE_TRIAL_LOGIN', '')

    const { wrapper } = await mountPage()

    expect(wrapper.find('[data-testid="trial-fill-contractor-button"]').exists()).toBe(false)
    expect(wrapper.text()).not.toContain('UAT')
  })

  it('is hidden for any value other than the exact string "true"', async () => {
    vi.stubEnv('VITE_TRIAL_LOGIN', 'TRUE')

    const { wrapper } = await mountPage()

    expect(wrapper.find('[data-testid="trial-fill-contractor-button"]').exists()).toBe(false)
  })

  it('fills the form with the test contractor account and submits nothing by itself', async () => {
    vi.stubEnv('VITE_TRIAL_LOGIN', 'true')
    const loginSpy = vi.spyOn(AuthPublicProvider.prototype, 'login')
    const demoLoginSpy = vi.spyOn(AuthPublicProvider.prototype, 'demoLogin')

    const { wrapper, router } = await mountPage()
    const fillButton = wrapper.find('[data-testid="trial-fill-contractor-button"]')
    expect(fillButton.exists()).toBe(true)

    await fillButton.trigger('click')
    await flushPromises()

    const emailInput = wrapper.find('input[name="email"]')
    expect((emailInput.element as HTMLInputElement).value).toBe('contractor1@mail.com')
    // Password field is masked by PasswordInput (wayfinder 028) — assert via the underlying
    // v-model value the button actually wrote, not the DOM (which stays type="password").
    const passwordInput = wrapper.find('input[name="password"]')
    expect((passwordInput.element as HTMLInputElement).value).toBe('adminadmin')

    expect(loginSpy).not.toHaveBeenCalled()
    expect(demoLoginSpy).not.toHaveBeenCalled()
    expect(router.currentRoute.value.name).toBe('LoginPage')
  })

  it('is a distinct control from the ticket-023 trial-login button when both are visible', async () => {
    vi.stubEnv('VITE_TRIAL_LOGIN', 'true')

    const { wrapper } = await mountPage()

    expect(wrapper.find('[data-testid="trial-login-button"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="trial-fill-contractor-button"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Trial account')
    expect(wrapper.text()).toContain('UAT')
  })
})
