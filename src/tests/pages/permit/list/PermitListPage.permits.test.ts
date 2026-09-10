import type { VueWrapper } from '@vue/test-utils'
import type { Router } from 'vue-router'
import { flushPromises, mount, type DOMWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import PrimeVue from 'primevue/config'
import i18n, { setLocale } from '@/plugins/I18n.plugin'
import PermitProvider from '@/resources/provider/permit/Permit.provider'
import WorkerProvider from '@/resources/provider/worker/Worker.provider'
import CertificateProvider from '@/resources/provider/certificate/Certificate.provider'
import PermitListPage from '@/pages/permit/pages/list/pages/PermitListPage.vue'
import type { TGetPermitListResponse } from '@/models/response/permit/PermitRes.model'

vi.mock('@/plugins/toast', () => ({
  toast: { success: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() }
}))

function mockMatchMedia (): void {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn()
    }))
  })
}

function emptyPage (): TGetPermitListResponse {
  return { message: 'success', data: [], count: 0, page: 1, limit: 10, totalPage: 0 }
}

function buildRouter (): Router {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/permits', name: 'PermitListPage', component: PermitListPage },
      { path: '/permits/create', name: 'PermitCreatePage', component: { template: '<div />' } },
      { path: '/permits/:id', name: 'PermitDetailPage', component: { template: '<div />' } },
      // Referenced by OnboardingChecklist.vue's RouterLinks, which render regardless of what
      // this test is asserting — vue-router 5 throws on an unresolved name (see AGENTS.md).
      { path: '/certificates', name: 'CertificateListPage', component: { template: '<div />' } },
      { path: '/workers', name: 'WorkerListPage', component: { template: '<div />' } }
    ]
  })
}

async function mountPage (): Promise<VueWrapper> {
  const router = buildRouter()
  await router.push('/permits')
  await router.isReady()

  const wrapper = mount(PermitListPage, {
    global: { plugins: [i18n, router, [PrimeVue, { unstyled: true }]] }
  })
  await flushPromises()
  return wrapper
}

/**
 * wayfinder 110 — "Permits" gained real search/pagination/filter, none of which existed before
 * (the page used to fetch an unpaginated `limit: 50` page with no search box at all). This covers
 * the three additions on the default "Permits" tab; `PermitListPage.history.test.ts` covers the
 * "History" tab this page also gained.
 */
describe('PermitListPage — Permits view mode (wayfinder 110)', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    setLocale('en')
    mockMatchMedia()
    // The onboarding checklist queries these unconditionally on mount (useOnboardingChecklist) —
    // stub them so the assertions below only see PermitProvider.list calls.
    vi.spyOn(WorkerProvider.prototype, 'list').mockResolvedValue({ message: 'success', data: [], count: 0, page: 1, limit: 1, totalPage: 0 })
    vi.spyOn(CertificateProvider.prototype, 'list').mockResolvedValue({ message: 'success', data: [], count: 0, page: 1, limit: 1, totalPage: 0 })
  })

  afterEach(() => {
    setLocale('th')
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('paginates server-side with a real page size, not the old unpaginated limit: 50', async () => {
    const listSpy = vi.spyOn(PermitProvider.prototype, 'list').mockResolvedValue(emptyPage())

    await mountPage()

    expect(listSpy).toHaveBeenCalledWith(expect.objectContaining({ page: 1, limit: 10 }))
  })

  it('sends the search box text as the server-side search param, debounced', async () => {
    vi.useFakeTimers()
    const listSpy = vi.spyOn(PermitProvider.prototype, 'list').mockResolvedValue(emptyPage())

    const router = buildRouter()
    await router.push('/permits')
    await router.isReady()
    const wrapper = mount(PermitListPage, {
      global: { plugins: [i18n, router, [PrimeVue, { unstyled: true }]] }
    })
    await flushPromises()
    listSpy.mockClear()

    const search = wrapper.find('input[type="text"]')
    await search.setValue('WP-HOT-2026')
    await vi.advanceTimersByTimeAsync(400)
    await flushPromises()

    expect(listSpy).toHaveBeenCalledWith(expect.objectContaining({ search: 'WP-HOT-2026' }))
    vi.useRealTimers()
  })

  // Reverses the pre-110 "fetch unfiltered, narrow client-side" workaround now that feat-009 lets
  // `GET /permits` take an array status — see useMyPermits.ts's FILTER_STATUS_MAP comment. A real
  // pager makes the old workaround an actual truncation bug (a short last page), not a cosmetic one.
  it('sends a grouped filter chip as a server-side status array, not an unfiltered fetch', async () => {
    const listSpy = vi.spyOn(PermitProvider.prototype, 'list').mockResolvedValue(emptyPage())

    const wrapper = await mountPage()
    listSpy.mockClear()

    const activeChip = wrapper.findAll('button').find((candidate: DOMWrapper<HTMLButtonElement>): boolean => candidate.text() === 'Active')
    await activeChip?.trigger('click')
    await flushPromises()

    expect(listSpy).toHaveBeenCalledWith(expect.objectContaining({ status: ['ACTIVE', 'FIRE_MONITOR'], page: 1 }))
  })
})
