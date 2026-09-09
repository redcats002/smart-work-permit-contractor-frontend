import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import PrimeVue from 'primevue/config'
import i18n, { setLocale } from '@/plugins/I18n.plugin'
import CertificateProvider from '@/resources/provider/certificate/Certificate.provider'
import UploadProvider from '@/resources/provider/Upload.provider'
import CertificateDetailPage from '@/pages/certificate/pages/detail/pages/CertificateDetailPage.vue'
import type { ICertificate } from '@/models/modules/certificate/Certificate.model'

vi.mock('@/plugins/toast', () => ({
  toast: { success: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() }
}))

function buildCertificate (overrides: Partial<ICertificate> = {}): ICertificate {
  return {
    id: 7,
    workerId: 1,
    workerName: 'Somchai',
    certType: 'Hot Work',
    issuedDate: '2026-01-01T00:00:00.000Z',
    expiryDate: '2030-01-01T00:00:00.000Z',
    expired: false,
    filePath: null,
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
      { path: '/certificates/:id', name: 'CertificateDetailPage', component: CertificateDetailPage },
      { path: '/certificates/:id/edit', name: 'CertificateEditPage', component: { template: '<div />' } }
    ]
  })
}

async function mountPage (): Promise<VueWrapper> {
  const router = buildRouter()
  await router.push('/certificates/7')
  await router.isReady()

  const wrapper = mount(CertificateDetailPage, {
    global: { plugins: [i18n, router, [PrimeVue, { unstyled: true }]] }
  })
  await flushPromises()
  return wrapper
}

beforeEach((): void => {
  setActivePinia(createPinia())
  setLocale('en')
  vi.restoreAllMocks()
})

describe('CertificateDetailPage', () => {
  it('renders the certificate and its server-computed status', async (): Promise<void> => {
    vi.spyOn(CertificateProvider.prototype, 'detail').mockResolvedValue({
      message: 'success',
      data: buildCertificate()
    })

    const wrapper = await mountPage()

    expect(wrapper.text()).toContain('Somchai')
    // `role` is deliberately absent — wayfinder 060 moved it onto the Worker record, because it
    // describes the person and not the card. The page must not render a blank labelled row for it.
    expect(wrapper.text()).not.toContain('Welder')
    expect(wrapper.text()).toContain('Hot Work')
    expect(wrapper.find('[data-test="certificate-status"]').text()).toContain('Valid')
  })

  it('shows the server\'s expired verdict even when the date alone would not look lapsed', async (): Promise<void> => {
    // The whole point of `Certificate.model.ts`'s "never recompute expiry client-side" rule: the
    // server's flag wins. A far-future date with `expired: true` must still read Expired.
    vi.spyOn(CertificateProvider.prototype, 'detail').mockResolvedValue({
      message: 'success',
      data: buildCertificate({ expired: true, expiryDate: '2099-01-01T00:00:00.000Z' })
    })

    const wrapper = await mountPage()

    expect(wrapper.find('[data-test="certificate-status"]').text()).toContain('Expired')
  })

  it('offers no attachment button when the certificate has no filePath', async (): Promise<void> => {
    vi.spyOn(CertificateProvider.prototype, 'detail').mockResolvedValue({
      message: 'success',
      data: buildCertificate({ filePath: null })
    })

    const wrapper = await mountPage()

    expect(wrapper.find('[data-test="open-attachment"]').exists()).toBe(false)
    expect(wrapper.text()).toContain('No file attached')
  })

  it('resolves the download at click time rather than holding a URL', async (): Promise<void> => {
    vi.spyOn(CertificateProvider.prototype, 'detail').mockResolvedValue({
      message: 'success',
      data: buildCertificate({ filePath: 'certificate/abc-card.png' })
    })
    const getFileUrl = vi.spyOn(UploadProvider.prototype, 'getFileUrl').mockResolvedValue({
      message: 'success',
      data: { url: 'https://storage.example/presigned' }
    })
    const open = vi.spyOn(window, 'open').mockReturnValue(null)

    const wrapper = await mountPage()

    // Nothing fetched on mount: the presigned handle dies 60s after it is issued, so a URL
    // resolved at mount would be dead by the time anyone clicked it.
    expect(getFileUrl).not.toHaveBeenCalled()

    await wrapper.find('[data-test="open-attachment"]').trigger('click')
    await flushPromises()

    expect(getFileUrl).toHaveBeenCalledWith('certificate/abc-card.png')
    expect(open).toHaveBeenCalledWith('https://storage.example/presigned', '_blank', 'noopener')
  })

  it('shows a load error rather than an empty shell when the API refuses the id', async (): Promise<void> => {
    // A directly-typed id belonging to another contractor answers 403. The page must not render
    // a shell that looks loadable — the list's scoping does not protect a typed URL.
    vi.spyOn(CertificateProvider.prototype, 'detail').mockRejectedValue({ response: { status: 403 } })

    const wrapper = await mountPage()

    expect(wrapper.text()).toContain('Could not load this certificate')
    expect(wrapper.find('[data-test="edit-certificate"]').exists()).toBe(false)
  })
})
