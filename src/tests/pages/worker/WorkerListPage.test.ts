import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import PrimeVue from 'primevue/config'
import i18n, { setLocale } from '@/plugins/I18n.plugin'
import WorkerProvider from '@/resources/provider/worker/Worker.provider'
import WorkerListPage from '@/pages/worker/pages/list/pages/WorkerListPage.vue'
import type { IWorker } from '@/models/modules/worker/Worker.model'

vi.mock('@/plugins/toast', () => ({
  toast: { success: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() }
}))

function buildWorker (overrides: Partial<IWorker> = {}): IWorker {
  return {
    id: 1,
    name: 'Somchai',
    role: 'Operator',
    certificateCount: 0,
    permitCount: 0,
    latestExpiryDate: null,
    ...overrides
  }
}

function buildRouter () {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/workers', name: 'WorkerListPage', component: WorkerListPage },
      { path: '/workers/:id', name: 'WorkerDetailPage', component: { template: '<div />' } }
    ]
  })
}

async function mountPage (): Promise<VueWrapper> {
  const router = buildRouter()
  await router.push('/workers')
  await router.isReady()

  const wrapper = mount(WorkerListPage, {
    global: { plugins: [i18n, router, [PrimeVue, { unstyled: true }]] }
  })
  await flushPromises()
  return wrapper
}


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

beforeEach((): void => {
  setActivePinia(createPinia())
  setLocale('en')
  vi.restoreAllMocks()
  stubMatchMedia()
})

/**
 * wayfinder 062 — "/workers" list, required test: renders certificate status correctly, reusing
 * `CertificateStatus.ts`'s existing vocabulary rather than a second one.
 */
describe('WorkerListPage', () => {
  it('renders a valid, an expiring-soon, and a no-certificate worker with the right status', async (): Promise<void> => {
    const soon = new Date()
    soon.setDate(soon.getDate() + 10)

    vi.spyOn(WorkerProvider.prototype, 'list').mockResolvedValue({
      message: 'success',
      count: 3,
      totalPage: 1,
      data: [
        buildWorker({ id: 1, name: 'Somchai', certificateCount: 1, latestExpiryDate: '2099-01-01T00:00:00.000Z' }),
        buildWorker({ id: 2, name: 'Malee', certificateCount: 1, latestExpiryDate: soon.toISOString() }),
        buildWorker({ id: 3, name: 'Krit', certificateCount: 0, latestExpiryDate: null })
      ]
    })

    const wrapper = await mountPage()

    const rows = wrapper.text()
    expect(rows).toContain('Somchai')
    expect(rows).toContain('Malee')
    expect(rows).toContain('Krit')

    expect(wrapper.find('[data-test="worker-row-1"]').text()).toContain('Valid')
    expect(wrapper.find('[data-test="worker-row-2"]').text()).toContain('Expires soon')
    expect(wrapper.find('[data-test="worker-row-3"]').text()).toContain('No certificate')
  })

  it('shows the empty state when the contractor has no workers yet', async (): Promise<void> => {
    vi.spyOn(WorkerProvider.prototype, 'list').mockResolvedValue({
      message: 'success', count: 0, totalPage: 1, data: []
    })

    const wrapper = await mountPage()

    expect(wrapper.text()).toContain('No workers yet')
    expect(wrapper.find('[data-test="worker-table"]').exists()).toBe(false)
  })

  it('links each row to that worker\'s detail page', async (): Promise<void> => {
    vi.spyOn(WorkerProvider.prototype, 'list').mockResolvedValue({
      message: 'success', count: 1, totalPage: 1, data: [buildWorker({ id: 42 })]
    })

    const wrapper = await mountPage()

    const row = wrapper.find('[data-test="worker-row-42"]')
    expect(row.attributes('href')).toBe('/workers/42')
  })
})
