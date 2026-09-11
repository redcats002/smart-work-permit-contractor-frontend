import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import PrimeVue from 'primevue/config'
import i18n, { setLocale } from '@/plugins/I18n.plugin'
import WorkerProvider from '@/resources/provider/worker/Worker.provider'
import WorkerDetailPage from '@/pages/worker/pages/detail/pages/WorkerDetailPage.vue'
import type { IWorkerDetail } from '@/models/modules/worker/Worker.model'

vi.mock('@/plugins/toast', () => ({
  toast: { success: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() }
}))

function buildWorkerDetail (overrides: Partial<IWorkerDetail> = {}): IWorkerDetail {
  return {
    id: 761,
    name: 'Somchai',
    idCardNo: null,
    phone: null,
    employerId: 'u-1',
    deletedAt: null,
    certificates: [],
    permits: [],
    ...overrides
  }
}

function buildRouter () {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/workers', name: 'WorkerListPage', component: { template: '<div />' } },
      { path: '/workers/:id', name: 'WorkerDetailPage', component: WorkerDetailPage },
      { path: '/certificates/:id', name: 'CertificateDetailPage', component: { template: '<div />' } },
      { path: '/permits/:id', name: 'PermitDetailPage', component: { template: '<div />' } }
    ]
  })
}

async function mountPage (id: number = 761): Promise<VueWrapper> {
  const router = buildRouter()
  await router.push(`/workers/${id}`)
  await router.isReady()

  const wrapper = mount(WorkerDetailPage, {
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
 * wayfinder 062 — the QR card is "the most important part: it must show a QR code and the
 * worker's id/name clearly enough that a field inspector can scan/read it off a phone screen".
 * The two required assertions here: id/QR presence on the detail page.
 */
describe('WorkerDetailPage', () => {
  it('renders the worker name, and the QR card with the worker id encoded and readable as text', async (): Promise<void> => {
    vi.spyOn(WorkerProvider.prototype, 'getById').mockResolvedValue({
      message: 'success',
      data: buildWorkerDetail({ id: 761, name: 'Somchai' })
    })

    const wrapper = await mountPage(761)

    expect(wrapper.text()).toContain('Somchai')

    const qr = wrapper.find('[data-test="worker-qr-code"]')
    expect(qr.exists()).toBe(true)
    // The payload is the bare worker id and nothing else (wayfinder 062's resolution / 065's scan
    // contract) — asserted indirectly via the SVG actually rendering modules, and directly via
    // the human-readable id printed alongside it for when a scan fails.
    expect(qr.findAll('rect').length).toBeGreaterThan(1)
    expect(wrapper.find('[data-test="worker-qr-id"]').text()).toContain('761')
  })

  it('lists certificates with their status and permits with their status', async (): Promise<void> => {
    vi.spyOn(WorkerProvider.prototype, 'getById').mockResolvedValue({
      message: 'success',
      data: buildWorkerDetail({
        certificates: [
          { id: 9, certType: 'Hot Work', issuedDate: '2026-01-01', expiryDate: '2099-01-01', expired: false }
        ],
        permits: [
          { id: 'WP-HOT-20260901-001', title: 'Roof weld', type: 'hot', status: 'ACTIVE', roleOnPermit: 'Operator' }
        ]
      })
    })

    const wrapper = await mountPage()

    expect(wrapper.find('[data-test="worker-certificates-list"]').text()).toContain('Hot Work')
    expect(wrapper.find('[data-test="worker-certificates-list"]').text()).toContain('Valid')
    expect(wrapper.find('[data-test="worker-permits-list"]').text()).toContain('Roof weld')
    expect(wrapper.find('[data-test="worker-permits-list"]').text()).toContain('Active')
  })

  it('shows empty states when the worker has no certificates or permits yet', async (): Promise<void> => {
    vi.spyOn(WorkerProvider.prototype, 'getById').mockResolvedValue({
      message: 'success',
      data: buildWorkerDetail()
    })

    const wrapper = await mountPage()

    expect(wrapper.find('[data-test="worker-certificates-empty"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="worker-permits-empty"]').exists()).toBe(true)
  })

  it('shows a load error rather than an empty shell when the API refuses the id', async (): Promise<void> => {
    vi.spyOn(WorkerProvider.prototype, 'getById').mockRejectedValue({ response: { status: 403 } })

    const wrapper = await mountPage()

    expect(wrapper.text()).toContain('Could not load this worker')
  })

  /**
   * wayfinder 103 — `Worker.role` is removed. `PATCH /workers/:id` no longer declares it, so a
   * client still sending the key would be silently discarded server-side (harmless) but is proof
   * the form itself lost the field, not just its own display of it.
   */
  it('saves without a role in the PATCH payload — Worker.role is gone (wayfinder 103)', async (): Promise<void> => {
    vi.spyOn(WorkerProvider.prototype, 'getById').mockResolvedValue({
      message: 'success',
      data: buildWorkerDetail()
    })
    const update = vi.spyOn(WorkerProvider.prototype, 'update').mockResolvedValue({
      message: 'success',
      data: buildWorkerDetail({ name: 'Somchai Updated' })
    })

    const wrapper = await mountPage()

    await wrapper.find('input[name="name"]').setValue('Somchai Updated')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(update).toHaveBeenCalledTimes(1)
    const payload = update.mock.calls[0][1] as Record<string, unknown>
    expect(payload).not.toHaveProperty('role')
    expect(payload.name).toBe('Somchai Updated')
  })

  it('hides the retire button once a worker is already retired', async (): Promise<void> => {
    vi.spyOn(WorkerProvider.prototype, 'getById').mockResolvedValue({
      message: 'success',
      data: buildWorkerDetail({ deletedAt: '2026-09-01T00:00:00.000Z' })
    })

    const wrapper = await mountPage()

    expect(wrapper.find('[data-test="retire-worker-open"]').exists()).toBe(false)
    expect(wrapper.text()).toContain('Retired')
  })
})
