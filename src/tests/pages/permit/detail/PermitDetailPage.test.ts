import type { VueWrapper } from '@vue/test-utils'
import type { Router } from 'vue-router'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import PrimeVue from 'primevue/config'
import i18n, { setLocale } from '@/plugins/I18n.plugin'
import PermitProvider from '@/resources/provider/permit/Permit.provider'
import PermitDetailPage from '@/pages/permit/pages/detail/pages/PermitDetailPage.vue'

vi.mock('@/plugins/toast', () => ({
  toast: { success: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() }
}))

function buildRouter (): Router {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/permits', name: 'PermitListPage', component: { template: '<div />' } },
      { path: '/permits/:id', name: 'PermitDetailPage', component: PermitDetailPage }
    ]
  })
}

async function mountPage (id: string): Promise<VueWrapper> {
  const router = buildRouter()
  await router.push(`/permits/${id}`)
  await router.isReady()

  const wrapper = mount(PermitDetailPage, {
    global: {
      plugins: [i18n, router, [PrimeVue, { unstyled: true }]]
    }
  })
  await flushPromises()
  return wrapper
}

/**
 * PermitDetailPage is a PLACEHOLDER — the status-banner / QR / audit-timeline screen is `PMT-010`
 * and is not built. These tests therefore pin the placeholder contract rather than a feature:
 * the route resolves, the id is echoed, and — the assertion that matters — the page makes NO
 * provider call. When `PMT-010` lands, the "fetches nothing" case is the tripwire that says this
 * file must be rewritten against the real screen instead of quietly passing forever.
 */
describe('PermitDetailPage (PMT-010 — placeholder)', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    setLocale('en')
  })

  afterEach(() => {
    setLocale('th')
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('resolves the route and echoes the permit id from the URL', async () => {
    const wrapper = await mountPage('WP-HOT-20260810-001')

    expect(wrapper.text()).toContain('WP-HOT-20260810-001')
  })

  it('states plainly that the screen is not built yet, in the active locale', async () => {
    const wrapper = await mountPage('WP-HOT-20260810-001')

    expect(wrapper.text()).toContain('Coming soon')
    expect(wrapper.text()).toContain('The permit detail screen is not built yet — this is a placeholder route.')

    setLocale('th')
    await flushPromises()
    const thai = await mountPage('WP-HOT-20260810-001')
    expect(thai.text()).not.toContain('The permit detail screen is not built yet')
  })

  it('fetches nothing — no permit, audit or QR call is made', async () => {
    const detailSpy = vi.spyOn(PermitProvider.prototype, 'detail')
    const auditSpy = vi.spyOn(PermitProvider.prototype, 'audit')
    const qrSpy = vi.spyOn(PermitProvider.prototype, 'qr')

    await mountPage('WP-HOT-20260810-001')

    expect(detailSpy).not.toHaveBeenCalled()
    expect(auditSpy).not.toHaveBeenCalled()
    expect(qrSpy).not.toHaveBeenCalled()
  })
})
