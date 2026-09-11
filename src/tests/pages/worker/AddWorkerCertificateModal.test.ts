import { DOMWrapper, flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, describe, expect, it, vi } from 'vitest'
import PrimeVue from 'primevue/config'
import { Form } from '@primevue/forms'
import i18n, { setLocale } from '@/plugins/I18n.plugin'
import CertificateProvider from '@/resources/provider/certificate/Certificate.provider'
import AddWorkerCertificateModal from '@/pages/worker/pages/detail/components/AddWorkerCertificateModal.vue'
import type { ICreateCertificatePayload } from '@/models/request/certificate/CertificateReq.model'
import type { ICertificate } from '@/models/modules/certificate/Certificate.model'
import type { IWorker } from '@/models/modules/worker/Worker.model'

vi.mock('@/plugins/toast', () => ({
  toast: { success: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() }
}))

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

function buildWorker (overrides: Partial<IWorker> = {}): IWorker {
  return { id: 42, name: 'Somchai', role: 'Entrant', ...overrides }
}

function buildCertificate (overrides: Partial<ICertificate> = {}): ICertificate {
  return {
    id: 9,
    workerId: 42,
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

/**
 * `resetForm()` — the only place `formData.workerId` is seeded from `props.worker.id` — runs off
 * `watch(visible, …)`, which only fires on a false→true TRANSITION (`WorkerDetailPage.vue` always
 * starts this modal closed). Mounting with `modelValue: true` from the start would skip that
 * transition entirely and mount the Form on the untouched (workerId: undefined) initial state —
 * a test artifact, not this modal's real lifecycle — so this mirrors the real open flow instead.
 */
async function mountModal (worker: IWorker = buildWorker()): Promise<ReturnType<typeof mount>> {
  stubMatchMedia()
  setActivePinia(createPinia())
  setLocale('en')

  const wrapper = mount(AddWorkerCertificateModal, {
    props: { modelValue: false, worker },
    global: { plugins: [i18n, [PrimeVue, { unstyled: true }]] },
    attachTo: document.body
  })
  await wrapper.setProps({ modelValue: true })
  await flushPromises()
  return wrapper
}

/**
 * Wayfinder 117 — this modal has no `WorkerPicker` at all (the worker is already known), so
 * `workerId` reaches `formData` through a plain assignment in `resetForm()` rather than a
 * picker's `update:modelValue`. Worth its own test rather than assuming the other three entry
 * points' fix covers it: the registration timing here is driven by `watch(visible, …)`, not user
 * interaction, and is the one entry point where `workerId` is never user-editable at all.
 */
describe('AddWorkerCertificateModal — workerId reaches the resolver (wayfinder 117)', () => {
  it('the worker\'s id is present in the Form\'s resolved values, as a number', async (): Promise<void> => {
    const wrapper = await mountModal(buildWorker({ id: 42 }))

    await pickCertType('Confined Space Entry')
    await body().find('input[name="issuedDate"]').setValue('2026-01-01')
    await body().find('input[name="expiryDate"]').setValue('2030-01-01')
    await body().find('input[name="licenceNo"]').setValue('LIC-001')
    await flushPromises()

    const form = wrapper.findComponent(Form).vm as unknown as {
      validate: () => Promise<{ values?: Record<string, unknown> }>
    }
    const result = await form.validate()

    expect(result.values?.workerId).toBe(42)
    expect(typeof result.values?.workerId).toBe('number')
  })

  it('submits against the worker prop\'s id end to end', async (): Promise<void> => {
    const create = vi.spyOn(CertificateProvider.prototype, 'create').mockResolvedValue({
      message: 'success',
      data: buildCertificate()
    })

    await mountModal(buildWorker({ id: 42 }))

    await pickCertType('Confined Space Entry')
    await body().find('input[name="issuedDate"]').setValue('2026-01-01')
    await body().find('input[name="expiryDate"]').setValue('2030-01-01')
    await body().find('input[name="licenceNo"]').setValue('LIC-001')

    await body().find('form').trigger('submit')
    await flushPromises()

    expect(create).toHaveBeenCalledTimes(1)
    const payload = create.mock.calls[0][0] as ICreateCertificatePayload
    expect(payload.workerId).toBe(42)
  })
})
