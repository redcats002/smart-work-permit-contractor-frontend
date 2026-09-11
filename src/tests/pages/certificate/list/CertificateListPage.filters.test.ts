import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import PrimeVue from 'primevue/config'
import i18n, { setLocale } from '@/plugins/I18n.plugin'
import CertificateProvider from '@/resources/provider/certificate/Certificate.provider'
import WorkerProvider from '@/resources/provider/worker/Worker.provider'
import CertificateListPage from '@/pages/certificate/pages/list/pages/CertificateListPage.vue'
import type { ICertificate } from '@/models/modules/certificate/Certificate.model'
import type { IWorker } from '@/models/modules/worker/Worker.model'

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

function buildWorker (id: number, name: string): IWorker {
  return { id, name, role: 'Operator' }
}

function emptyCertificates (): { message: 'success', data: ICertificate[], count: number, page: number, limit: number, totalPage: number } {
  return { message: 'success', data: [], count: 0, page: 1, limit: 10, totalPage: 0 }
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

/**
 * wayfinder 110 — Certificates gained pagination, search and a filter. The server endpoint has no
 * validity-status filter (`list.service.ts` in the api takes only `search`/`workerName`/
 * `workerId`), so the filter that shipped is "by worker", not "by status" — see useCertificates.ts.
 */
describe('CertificateListPage — pagination, search and worker filter (wayfinder 110)', () => {
  beforeEach(() => {
    stubMatchMedia()
    setActivePinia(createPinia())
    setLocale('en')
  })

  afterEach(() => {
    setLocale('th')
    vi.restoreAllMocks()
  })

  it('paginates server-side with a real page size, not the old unpaginated limit: 50', async () => {
    const listSpy = vi.spyOn(CertificateProvider.prototype, 'list').mockResolvedValue(emptyCertificates())
    vi.spyOn(WorkerProvider.prototype, 'list').mockResolvedValue({ message: 'success', data: [], count: 0, page: 1, limit: 9999, totalPage: 0 })

    await mountPage()

    expect(listSpy).toHaveBeenCalledWith(expect.objectContaining({ page: 1, limit: 10 }))
  })

  it('sends the search box text as the server-side search param, debounced', async () => {
    vi.useFakeTimers()
    const listSpy = vi.spyOn(CertificateProvider.prototype, 'list').mockResolvedValue(emptyCertificates())
    vi.spyOn(WorkerProvider.prototype, 'list').mockResolvedValue({ message: 'success', data: [], count: 0, page: 1, limit: 9999, totalPage: 0 })

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
    listSpy.mockClear()

    await wrapper.find('input[type="text"]').setValue('Somchai')
    await vi.advanceTimersByTimeAsync(400)
    await flushPromises()

    expect(listSpy).toHaveBeenCalledWith(expect.objectContaining({ search: 'Somchai' }))
    vi.useRealTimers()
  })

  // The worker-Select options must be fetched unpaginated — the server defaults to a page size
  // of 10 (CommonPaginationModel), which would silently truncate the filter to the first 10
  // workers otherwise (the same silent-truncation defect an explicit `limit: 9999` guards
  // against elsewhere in this app).
  it('fetches every worker for the filter dropdown, not just the first page', async () => {
    vi.spyOn(CertificateProvider.prototype, 'list').mockResolvedValue(emptyCertificates())
    const workerSpy = vi.spyOn(WorkerProvider.prototype, 'list').mockResolvedValue({
      message: 'success',
      data: [buildWorker(1, 'Somchai'), buildWorker(2, 'Malee')],
      count: 2,
      page: 1,
      limit: 9999,
      totalPage: 1
    })

    await mountPage()

    expect(workerSpy).toHaveBeenCalledWith(expect.objectContaining({ limit: 9999 }))
  })

  it('filters by the selected worker via the server-side workerId param', async () => {
    const listSpy = vi.spyOn(CertificateProvider.prototype, 'list').mockResolvedValue(emptyCertificates())
    vi.spyOn(WorkerProvider.prototype, 'list').mockResolvedValue({
      message: 'success',
      data: [buildWorker(7, 'Somchai')],
      count: 1,
      page: 1,
      limit: 9999,
      totalPage: 1
    })

    const wrapper = await mountPage()
    listSpy.mockClear()

    // Volt's Select renders a native combobox under PrimeVue's unstyled mode — dispatch the
    // model update directly on the component instance rather than simulating a full pointer
    // interaction, the same way this repo's other Select-driven filter tests do.
    const select = wrapper.find('[data-test="certificate-worker-filter"]')
    await select.findComponent({ name: 'Select' }).vm.$emit('update:modelValue', 7)
    await flushPromises()

    expect(listSpy).toHaveBeenCalledWith(expect.objectContaining({ workerId: 7 }))
  })
})
