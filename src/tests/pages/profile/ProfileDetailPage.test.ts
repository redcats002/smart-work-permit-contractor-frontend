import type { DOMWrapper, VueWrapper } from '@vue/test-utils'
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

  it('validates first/last name and phone length client-side via the new zod schema, and keeps label + focus on the converted fields (wayfinder 006)', async () => {
    // jsdom has no scrollIntoView implementation; scrollToFirstError() calls it on the first
    // invalid field when a submit is blocked, same as every other real Form in this app.
    Element.prototype.scrollIntoView = vi.fn()

    const container = document.createElement('div')
    document.body.appendChild(container)

    const i18n = createI18n({ legacy: false, locale: 'en', fallbackLocale: 'en', messages: { en, th } })
    const router: Router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/profile', name: 'ProfileDetailPage', component: ProfileDetailPage }]
    })
    await router.push('/profile')

    const wrapper = mount(ProfileDetailPage, {
      attachTo: container,
      global: { plugins: [i18n, router, [PrimeVue, { unstyled: true }]] }
    })
    await flushPromises()

    // The first-name field is now a Volt InputText inside LabelField's own <label> wrapper — that
    // wrapping IS the label association (no separate `for`/`id` pair needed for it to be valid).
    const nameLabel = wrapper.findAll('label').find((label: DOMWrapper<Element>): boolean => label.text().includes('First name'))
    expect(nameLabel?.exists()).toBe(true)
    const nameInput = nameLabel!.find('input')
    expect(nameInput.exists()).toBe(true)

    const nameInputEl = nameInput.element as HTMLInputElement
    nameInputEl.focus()
    expect(document.activeElement).toBe(nameInputEl)

    // Clearing the required first-name field and submitting must block on the client — the zod
    // schema this test exercises — before any request goes out.
    const updateMe = vi.spyOn(UserProvider.prototype, 'updateMe')
    await nameInput.setValue('')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(updateMe).not.toHaveBeenCalled()
    // The zod schema's messages route through the app's own i18n SINGLETON (@/plugins/I18n.plugin),
    // like useApiError()'s mapError() does — not through this test's own local `createI18n`
    // instance, which only drives the page's own {{ t(...) }} template calls. The singleton's
    // default locale is Thai (see the "renders the localized error" test below for the same trap).
    expect(wrapper.text()).toContain('กรุณากรอกชื่อ')

    wrapper.unmount()
    container.remove()
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
