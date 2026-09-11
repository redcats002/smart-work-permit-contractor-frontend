import { DOMWrapper, flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, describe, expect, it, vi } from 'vitest'
import PrimeVue from 'primevue/config'
import { Form } from '@primevue/forms'
import i18n, { setLocale } from '@/plugins/I18n.plugin'
import CertificateProvider from '@/resources/provider/certificate/Certificate.provider'
import WorkerPicker from '@/components/worker/WorkerPicker.vue'
import CreateCertificateModal from '@/pages/permit/pages/create/components/CreateCertificateModal.vue'
import type { ICreateCertificatePayload } from '@/models/request/certificate/CertificateReq.model'
import type { ICertificate } from '@/models/modules/certificate/Certificate.model'

vi.mock('@/plugins/toast', () => ({
  toast: { success: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() }
}))

// Same rationale as AddCertificateModal.test.ts — a Dialog left open at the end of a test would
// leave its teleported <form>/Select nodes in document.body for the next test to collide with.
afterEach((): void => {
  document.body.innerHTML = ''
  vi.restoreAllMocks()
})

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

function buildCertificate (overrides: Partial<ICertificate> = {}): ICertificate {
  return {
    id: 1,
    workerId: 761,
    workerName: 'Somchai',
    certType: 'Confined Space Entry',
    issuedDate: '2026-01-01T00:00:00.000Z',
    expiryDate: '2030-01-01T00:00:00.000Z',
    expired: false,
    filePath: null,
    ...overrides
  }
}

async function pickCertType (label: string): Promise<void> {
  const combo = document.querySelector('[data-pc-name="select"]') as HTMLElement
  combo.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  await flushPromises()
  const option = document.querySelector(`li[role="option"][aria-label="${label}"]`) as HTMLElement
  for (const type of ['mousedown', 'mouseup', 'click']) {
    option.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true }))
  }
  await flushPromises()
}

function body (): DOMWrapper<HTMLElement> {
  return new DOMWrapper(document.body)
}

async function mountModal (): Promise<ReturnType<typeof mount>> {
  stubMatchMedia()
  setActivePinia(createPinia())
  setLocale('en')

  const wrapper = mount(CreateCertificateModal, {
    props: { modelValue: true },
    global: { plugins: [i18n, [PrimeVue, { unstyled: true }]] },
    attachTo: document.body
  })
  await flushPromises()
  return wrapper
}

/**
 * Wayfinder 117 — this modal carries the exact same `workerId`-registration gap
 * `AddCertificateModal.vue` had (same `WorkerPicker`, same broken `<input type="hidden">` before
 * the fix). Proven independently here rather than assumed from the sibling form, per the ticket's
 * own instruction to check each entry point against real behaviour rather than assuming.
 */
describe('CreateCertificateModal — workerId reaches the resolver (wayfinder 117)', () => {
  it('the picked workerId is present in the Form\'s resolved values, as a number', async (): Promise<void> => {
    const wrapper = await mountModal()

    const picker = wrapper.findComponent(WorkerPicker)
    picker.vm.$emit('update:modelValue', 761)
    picker.vm.$emit('worker-selected', { id: 761, name: 'Somchai', role: 'Entrant' })
    await flushPromises()

    // Every other required field must also be valid — the resolver's `values` collapse to
    // `undefined` for the WHOLE object on ANY base-parse failure, not just workerId's; leaving
    // certType/dates empty here would "prove" the fix by accident, for the wrong reason.
    await pickCertType('Confined Space Entry')
    await body().find('input[name="issuedDate"]').setValue('2026-01-01')
    await body().find('input[name="expiryDate"]').setValue('2030-01-01')
    await body().find('input[name="licenceNo"]').setValue('LIC-001')
    await flushPromises()

    const form = wrapper.findComponent(Form).vm as unknown as {
      validate: () => Promise<{ values?: Record<string, unknown> }>
    }
    const result = await form.validate()

    expect(result.values?.workerId).toBe(761)
    expect(typeof result.values?.workerId).toBe('number')
  })

  it('submits the picked worker end to end, through formData rather than event.values', async (): Promise<void> => {
    const create = vi.spyOn(CertificateProvider.prototype, 'create').mockResolvedValue({
      message: 'success',
      data: buildCertificate()
    })

    const wrapper = await mountModal()

    const picker = wrapper.findComponent(WorkerPicker)
    picker.vm.$emit('update:modelValue', 761)
    picker.vm.$emit('worker-selected', { id: 761, name: 'Somchai', role: 'Entrant' })
    await flushPromises()

    await pickCertType('Confined Space Entry')
    await body().find('input[name="issuedDate"]').setValue('2026-01-01')
    await body().find('input[name="expiryDate"]').setValue('2030-01-01')
    await body().find('input[name="licenceNo"]').setValue('LIC-001')

    await body().find('form').trigger('submit')
    await flushPromises()

    expect(create).toHaveBeenCalledTimes(1)
    const payload = create.mock.calls[0][0] as ICreateCertificatePayload
    expect(payload.workerId).toBe(761)
    expect(payload.certType).toBe('Confined Space Entry')
  })
})
