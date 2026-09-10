import { DOMWrapper, flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { describe, expect, it, vi } from 'vitest'
import PrimeVue from 'primevue/config'
import i18n, { setLocale } from '@/plugins/I18n.plugin'
import CertificateProvider from '@/resources/provider/certificate/Certificate.provider'
import WorkerPicker from '@/components/worker/WorkerPicker.vue'
import AddCertificateModal from '@/pages/certificate/pages/list/components/AddCertificateModal.vue'
import type { ICreateCertificatePayload } from '@/models/request/certificate/CertificateReq.model'
import type { ICertificate } from '@/models/modules/certificate/Certificate.model'

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

/** PrimeVue's unstyled Select opens its option list on click and teleports it to `document.body`,
 * outside the mounted wrapper's own subtree — so both the open and the option pick go through
 * `document`, not `wrapper.find`, mirroring how a real click on a real page would resolve it. */
async function openCertTypeSelect (): Promise<void> {
  const combo = document.querySelector('[data-pc-name="select"]') as HTMLElement
  combo.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  await flushPromises()
}

async function pickCertType (label: string): Promise<void> {
  await openCertTypeSelect()
  const option = document.querySelector(`li[role="option"][aria-label="${label}"]`) as HTMLElement
  // PrimeVue's unstyled Select option only registers a selection on the full mousedown/mouseup/
  // click sequence a real click produces — a bare synthetic `click` event is silently ignored.
  for (const type of ['mousedown', 'mouseup', 'click']) {
    option.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true }))
  }
  await flushPromises()
}

function certTypeOptionLabels (): string[] {
  return Array.from(document.querySelectorAll('li[role="option"]')).map(
    (el: Element): string => el.getAttribute('aria-label') ?? ''
  )
}

/** Everything the Form renders is teleported (PrimeVue's `Dialog`) to `document.body`, outside
 * the mounted wrapper's own vnode subtree — `wrapper.find` cannot see it, so interactions after
 * the modal opens go through a `DOMWrapper` over `document.body` instead. */
function body (): DOMWrapper<HTMLElement> {
  return new DOMWrapper(document.body)
}

async function mountModal (): Promise<ReturnType<typeof mount>> {
  stubMatchMedia()
  setActivePinia(createPinia())
  setLocale('en')

  const wrapper = mount(AddCertificateModal, {
    props: { modelValue: true },
    global: { plugins: [i18n, [PrimeVue, { unstyled: true }]] },
    attachTo: document.body
  })
  await flushPromises()
  return wrapper
}

/**
 * Wayfinder 086 — the CertTypeSelect replacing the free-text ชนิดบัตร box. The first test is the
 * "no-op trap" regression 061 already paid a cycle for once with `WorkerPicker`: a picker that is
 * a component rather than an `<input>` needs `name` registered with the Form, or the zod
 * resolver fails on `undefined` and submit silently no-ops — no error, no request, nothing.
 * `CertTypeSelect` forwards `name` straight to the underlying PrimeVue `Select`, the same
 * `name` + `v-model` pattern this form's `DatePicker` fields already use successfully, rather
 * than repeating `WorkerPicker`'s hidden-input workaround — this test is what proves that choice
 * actually works, not just that it looks structurally similar.
 */
describe('AddCertificateModal — the certType Select actually reaches the wire (the no-op trap)', () => {
  it('submits the certType chosen in the Select, not undefined', async (): Promise<void> => {
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

    await body().find('form').trigger('submit')
    await flushPromises()

    expect(create).toHaveBeenCalledTimes(1)
    const payload = create.mock.calls[0][0] as ICreateCertificatePayload
    expect(payload.certType).toBe('Confined Space Entry')
    expect(payload.workerId).toBe(761)
  })

  it('filters the Select down to the selected worker\'s role, and stays usable for an unknown role', async (): Promise<void> => {
    const wrapper = await mountModal()

    const picker = wrapper.findComponent(WorkerPicker)
    picker.vm.$emit('worker-selected', { id: 5, name: 'Niran', role: 'Entrant' })
    await flushPromises()

    // Entrant only fits Confined Space Entry (ROLE_ALLOWED_CERT_TYPES) — the Select should not
    // still be offering Hot Work / Working at Heights / Gas Testing.
    await openCertTypeSelect()
    expect(certTypeOptionLabels()).toEqual(['Confined Space Entry'])
    expect(document.body.textContent).not.toContain('Showing every certificate type')
    await openCertTypeSelect() // toggles it closed again

    // Real production data (050's audit): a role outside the vocabulary must not make the worker
    // uncertifiable — the Select falls back to the full list rather than an empty one.
    picker.vm.$emit('worker-selected', { id: 6, name: 'Somjai', role: 'Welder' })
    await flushPromises()

    await openCertTypeSelect()
    expect(certTypeOptionLabels()).toEqual(['Hot Work', 'Confined Space Entry', 'Working at Heights', 'Gas Testing'])
    expect(document.body.textContent).toContain('Showing every certificate type')
  })
})
