import type { VueWrapper } from '@vue/test-utils'
import type { Router } from 'vue-router'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import { createMemoryHistory, createRouter } from 'vue-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import PrimeVue from 'primevue/config'
import en from '@/locales/en'
import th from '@/locales/th'
import UserProvider from '@/resources/provider/user/User.provider'
import type { IUserAccount } from '@/models/response/user/UserRes.model'
import ProfileDetailPage from '@/pages/profile/pages/ProfileDetailPage.vue'

const account: IUserAccount = {
  id: 'contractor-001',
  email: 'somchai@boonmee.co.th',
  firstName: 'Somchai',
  lastName: 'Boonmee',
  phoneNumberPrefix: '+66',
  phoneNumber: '0812345678',
  phoneNumberExtend: null,
  permitRole: 'contractor',
  active: true,
  createdAt: '2026-08-01T03:00:00.000Z',
  updatedAt: '2026-08-01T03:00:00.000Z',
  contractorProfile: {
    firmName: 'Boonmee Engineering Co., Ltd.',
    taxId: '0105551234567',
    address: '99/1 Bang Na, Bangkok 10260',
    contactPerson: 'Somchai Boonmee',
    contractStart: '2026-01-01T00:00:00.000Z',
    contractEnd: '2026-12-31T00:00:00.000Z'
  }
}

async function mountPage (): Promise<VueWrapper> {
  const i18n = createI18n({ legacy: false, locale: 'en', fallbackLocale: 'en', messages: { en, th } })
  const router: Router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/profile', name: 'ProfileDetailPage', component: ProfileDetailPage }]
  })
  await router.push('/profile')

  const wrapper = mount(ProfileDetailPage, {
    global: { plugins: [i18n, router, [PrimeVue, { unstyled: true }]] }
  })
  await flushPromises()
  return wrapper
}

describe('ProfileDetailPage (CRT-005)', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.spyOn(UserProvider.prototype, 'me').mockResolvedValue({ message: 'success', data: account })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders the signed-in account from GET /users/me', async () => {
    const wrapper = await mountPage()

    expect(wrapper.text()).toContain('somchai@boonmee.co.th')
    expect((wrapper.find('input[type="text"]').element as HTMLInputElement).value).toBe('Somchai')
  })

  it('shows the company record read-only — it is the safety officer\'s to edit', async () => {
    const wrapper = await mountPage()

    expect(wrapper.text()).toContain('Boonmee Engineering Co., Ltd.')
    expect(wrapper.text()).toContain('Managed by your safety officer')
  })

  it('offers no role or activation control at all', async () => {
    // PATCH /users/me does not declare permitRole or active — the allow-list IS the privilege
    // boundary. A control here would promise an edit the server correctly refuses to make.
    const wrapper = await mountPage()

    expect(wrapper.find('select').exists()).toBe(false)
    expect(wrapper.text()).not.toContain('Deactivate')
  })

  it('sends only the allow-listed fields, and omits an empty phone rather than sending an invalid one', async () => {
    const updateMe = vi.spyOn(UserProvider.prototype, 'updateMe')
      .mockResolvedValue({ message: 'success', data: account })

    const wrapper = await mountPage()
    await wrapper.find('input[type="tel"]').setValue('')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    const payload = updateMe.mock.calls[0][0] as Record<string, unknown>
    // The API validates phoneNumber as exactly 10 characters, so '' would 400. Omitted means
    // unchanged, which is what someone who never filled it in expects.
    expect(payload.phoneNumber).toBeUndefined()
    expect(payload).not.toHaveProperty('permitRole')
    expect(payload).not.toHaveProperty('active')
    expect(payload).not.toHaveProperty('email')
  })

  it('renders the localized error, never the backend message', async () => {
    vi.spyOn(UserProvider.prototype, 'me').mockRejectedValue({
      code: 403,
      errorCode: 'ACCOUNT_DEACTIVATED',
      message: 'raw backend english that must never be rendered'
    })

    const wrapper = await mountPage()

    // useApiError localizes through the app's own i18n plugin instance, not the one this test
    // installs, and the app's default locale is Thai — so the Thai string is the correct
    // expectation here. What matters either way: the backend's English `message` is never shown.
    expect(wrapper.text()).toContain('บัญชีนี้ถูกปิดใช้งานแล้ว')
    expect(wrapper.text()).not.toContain('raw backend english')
  })
})
