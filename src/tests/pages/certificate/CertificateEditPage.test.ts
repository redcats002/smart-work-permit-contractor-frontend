import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import PrimeVue from 'primevue/config'
import i18n, { setLocale } from '@/plugins/I18n.plugin'
import CertificateProvider from '@/resources/provider/certificate/Certificate.provider'
import CertificateEditPage from '@/pages/certificate/pages/edit/pages/CertificateEditPage.vue'
import type { ICertificate } from '@/models/modules/certificate/Certificate.model'
import type { IUpdateCertificatePayload } from '@/models/request/certificate/CertificateReq.model'

vi.mock('@/plugins/toast', () => ({
  toast: { success: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() }
}))

// PrimeVue's DatePicker binds a matchMedia listener on mount and jsdom does not implement it.
// Same shim the history and permit page tests use.
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

function buildCertificate (overrides: Partial<ICertificate> = {}): ICertificate {
  return {
    id: 7,
    workerId: 1,
    workerName: 'Somchai',
    certType: 'Hot Work',
    issuedDate: '2026-01-01T00:00:00.000Z',
    expiryDate: '2030-01-01T00:00:00.000Z',
    expired: false,
    filePath: 'certificate/existing-card.png',
    createdById: 'u-1',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides
  }
}

function buildRouter () {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/certificates', name: 'CertificateListPage', component: { template: '<div />' } },
      { path: '/certificates/:id', name: 'CertificateDetailPage', component: { template: '<div />' } },
      { path: '/certificates/:id/edit', name: 'CertificateEditPage', component: CertificateEditPage }
    ]
  })
}

async function mountPage (certificate: ICertificate): Promise<VueWrapper> {
  vi.spyOn(CertificateProvider.prototype, 'detail').mockResolvedValue({ message: 'success', data: certificate })

  const router = buildRouter()
  await router.push('/certificates/7/edit')
  await router.isReady()

  const wrapper = mount(CertificateEditPage, {
    global: { plugins: [i18n, router, [PrimeVue, { unstyled: true }]] }
  })
  await flushPromises()
  return wrapper
}

/** Submits the form as-is, without touching the file input. */
async function submit (wrapper: VueWrapper): Promise<void> {
  await wrapper.find('form').trigger('submit')
  await flushPromises()
}

beforeEach((): void => {
  setActivePinia(createPinia())
  setLocale('en')
  vi.restoreAllMocks()
  mockMatchMedia()
})

describe('CertificateEditPage — the three attachment cases', () => {
  it('OMITS filePath when the file input was never touched, so the server keeps it', async (): Promise<void> => {
    // The single most damaging thing this page could get wrong: an edit to an unrelated field
    // silently detaching the attachment. Absent must mean keep.
    const update = vi.spyOn(CertificateProvider.prototype, 'update').mockResolvedValue({
      message: 'success',
      data: buildCertificate()
    })

    const wrapper = await mountPage(buildCertificate())
    await submit(wrapper)

    expect(update).toHaveBeenCalledTimes(1)
    const payload = update.mock.calls[0][1] as IUpdateCertificatePayload
    expect('filePath' in payload).toBe(false)
  })

  it('sends an explicit null once the attachment is marked for removal', async (): Promise<void> => {
    const update = vi.spyOn(CertificateProvider.prototype, 'update').mockResolvedValue({
      message: 'success',
      data: buildCertificate({ filePath: null })
    })

    const wrapper = await mountPage(buildCertificate())
    await wrapper.find('[data-test="toggle-remove-attachment"]').trigger('click')
    await submit(wrapper)

    const payload = update.mock.calls[0][1] as IUpdateCertificatePayload
    expect(payload.filePath).toBeNull()
  })

  it('un-marking removal goes back to omitting the field, not to sending null', async (): Promise<void> => {
    const update = vi.spyOn(CertificateProvider.prototype, 'update').mockResolvedValue({
      message: 'success',
      data: buildCertificate()
    })

    const wrapper = await mountPage(buildCertificate())
    const toggle = wrapper.find('[data-test="toggle-remove-attachment"]')
    await toggle.trigger('click')
    await toggle.trigger('click')
    await submit(wrapper)

    const payload = update.mock.calls[0][1] as IUpdateCertificatePayload
    expect('filePath' in payload).toBe(false)
  })

  it('offers no removal control when there is no attachment to remove', async (): Promise<void> => {
    const wrapper = await mountPage(buildCertificate({ filePath: null }))

    expect(wrapper.find('[data-test="toggle-remove-attachment"]').exists()).toBe(false)
  })
})

describe('CertificateEditPage — loading and saving', () => {
  it('seeds the worker picker with the current name and keeps its id when untouched', async (): Promise<void> => {
    const update = vi.spyOn(CertificateProvider.prototype, 'update').mockResolvedValue({
      message: 'success',
      data: buildCertificate()
    })

    const wrapper = await mountPage(buildCertificate())

    // The name is a SEED for the picker, not an editable field. wayfinder 060 moved identity to
    // the Worker record: correcting a person's spelling is a Worker rename, and re-pointing this
    // certificate at a different person is what the picker is for. The old version of this test
    // asserted that typing a new name here saved it, which is no longer true in either direction.
    expect(wrapper.text()).toContain('Somchai')
    expect(wrapper.find('input[name="workerName"]').exists()).toBe(false)

    await submit(wrapper)

    const payload = update.mock.calls[0][1] as IUpdateCertificatePayload
    expect(payload.workerId).toBe(1)
    expect(update.mock.calls[0][0]).toBe(7)
  })

  it('shows a load error rather than an editable form when the API refuses the id', async (): Promise<void> => {
    vi.spyOn(CertificateProvider.prototype, 'detail').mockRejectedValue({ response: { status: 403 } })

    const router = buildRouter()
    await router.push('/certificates/7/edit')
    await router.isReady()
    const wrapper = mount(CertificateEditPage, {
      global: { plugins: [i18n, router, [PrimeVue, { unstyled: true }]] }
    })
    await flushPromises()

    expect(wrapper.text()).toContain('Could not load this certificate')
    expect(wrapper.find('form').exists()).toBe(false)
  })
})

/**
 * Wayfinder 086 — 050's second data-audit constraint, the reason the certType Select must not be
 * a closed schema enum: an existing certificate can hold a value the Select does not offer (the
 * real data has `hot-work`, and the ticket says to assume nothing beyond that). Silently dropping
 * it on save would rewrite history — the exact shape 072 already found once for a normalizer that
 * only knew the new field names.
 */
describe('CertificateEditPage — an unrecognised stored certType survives (050\'s data audit)', () => {
  it('a legacy certType value not in the Select\'s vocabulary is preserved on submit, untouched', async (): Promise<void> => {
    const update = vi.spyOn(CertificateProvider.prototype, 'update').mockResolvedValue({
      message: 'success',
      data: buildCertificate({ certType: 'hot-work' })
    })

    const wrapper = await mountPage(buildCertificate({ certType: 'hot-work' }))

    // Never blank, never coerced to something the Select DOES recognise.
    expect(wrapper.text()).toContain('hot-work')

    await submit(wrapper)

    const payload = update.mock.calls[0][1] as IUpdateCertificatePayload
    expect(payload.certType).toBe('hot-work')
  })

  it('a recognised certType still round-trips unchanged', async (): Promise<void> => {
    const update = vi.spyOn(CertificateProvider.prototype, 'update').mockResolvedValue({
      message: 'success',
      data: buildCertificate()
    })

    const wrapper = await mountPage(buildCertificate({ certType: 'Hot Work' }))
    await submit(wrapper)

    const payload = update.mock.calls[0][1] as IUpdateCertificatePayload
    expect(payload.certType).toBe('Hot Work')
  })
})
