import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import PrimeVue from 'primevue/config'
import i18n, { setLocale } from '@/plugins/I18n.plugin'
import CertificateProvider from '@/resources/provider/certificate/Certificate.provider'
import CertificateListPage from '@/pages/certificate/pages/list/pages/CertificateListPage.vue'
import AddCertificateModal from '@/pages/certificate/pages/list/components/AddCertificateModal.vue'

/**
 * wayfinder ticket 006 — the page's native "+ Add Certificate" <button> is now a Volt `Button`
 * (the inventory's own "worth converting" call, a real primary form/dialog action). No page test
 * existed before this pass; this one covers the conversion, not the whole page.
 */
vi.mock('@/plugins/toast', () => ({
  toast: { success: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() }
}))

function stubMatchMedia (): void {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (query: string): MediaQueryList => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: (): void => undefined,
      removeListener: (): void => undefined,
      addEventListener: (): void => undefined,
      removeEventListener: (): void => undefined,
      dispatchEvent: (): boolean => false
    } as unknown as MediaQueryList)
  })
}

async function mountPage (): Promise<VueWrapper> {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/certificates', name: 'CertificateListPage', component: CertificateListPage }]
  })
  await router.push('/certificates')
  await router.isReady()

  const wrapper = mount(CertificateListPage, {
    global: { plugins: [i18n, router, [PrimeVue, { unstyled: true }]] }
  })
  await flushPromises()
  return wrapper
}

describe('CertificateListPage — Volt Button conversion (wayfinder 006)', () => {
  beforeEach(() => {
    stubMatchMedia()
    setActivePinia(createPinia())
    setLocale('en')
    vi.spyOn(CertificateProvider.prototype, 'list').mockResolvedValue({
      message: 'success', data: [], page: 1, limit: 50, count: 0, totalPage: 1
    })
  })

  afterEach(() => {
    setLocale('th')
    vi.restoreAllMocks()
  })

  it('renders the Add Certificate action as a real, focusable, labeled button and opens the modal on click', async () => {
    const wrapper = await mountPage()

    const addButton = wrapper.find('[data-test="add-certificate-open"]')
    expect(addButton.exists()).toBe(true)
    expect(addButton.text()).toContain('Add Certificate')

    // Volt Button renders a real native <button> under the hood, carrying the wrapper's own
    // default `focus-visible:outline` theme untouched — this call site only overrides color/
    // spacing utilities, never the focus-ring classes (src/volt/ is never edited for this).
    const buttonEl = addButton.element as HTMLButtonElement
    expect(buttonEl.tagName).toBe('BUTTON')
    expect(buttonEl.type).toBe('button')

    expect(wrapper.findComponent(AddCertificateModal).props('modelValue')).toBe(false)
    await addButton.trigger('click')
    expect(wrapper.findComponent(AddCertificateModal).props('modelValue')).toBe(true)
  })
})
