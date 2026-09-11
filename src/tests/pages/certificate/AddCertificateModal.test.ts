import { DOMWrapper, flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, describe, expect, it, vi } from 'vitest'
import PrimeVue from 'primevue/config'
import { Form } from '@primevue/forms'
import i18n, { setLocale } from '@/plugins/I18n.plugin'
import CertificateProvider from '@/resources/provider/certificate/Certificate.provider'
import WorkerPicker from '@/components/worker/WorkerPicker.vue'
import AddCertificateModal from '@/pages/certificate/pages/list/components/AddCertificateModal.vue'
import type { ICreateCertificatePayload } from '@/models/request/certificate/CertificateReq.model'
import type { ICertificate } from '@/models/modules/certificate/Certificate.model'
import { toast } from '@/plugins/toast'

vi.mock('@/plugins/toast', () => ({
  toast: { success: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() }
}))

// `mountModal` teleports the Dialog's content to `document.body` (attachTo) and no test unmounts
// it — a wrapper still open at the end of one test (never submitted, so never closed) leaves its
// <form>/Select nodes in the document for the NEXT test's global `document.querySelector`/`body()`
// lookups to collide with. Wiped between every test rather than only added to the new describe
// block below, since any test here can leave a dialog open.
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
    // wayfinder 095/115 — a certificate needs a licence number OR an attachment; this test is not
    // about that rule, so satisfy it plainly rather than letting the one-of refine block submit.
    await body().find('input[name="licenceNo"]').setValue('LIC-001')

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
    // still be offering Hot Work / Working at Heights.
    await openCertTypeSelect()
    expect(certTypeOptionLabels()).toEqual(['Confined Space Entry'])
    expect(document.body.textContent).not.toContain('Showing every certificate type')
    await openCertTypeSelect() // toggles it closed again

    // Real production data (050's audit): a role outside the vocabulary must not make the worker
    // uncertifiable — the Select falls back to the full list rather than an empty one.
    picker.vm.$emit('worker-selected', { id: 6, name: 'Somjai', role: 'Welder' })
    await flushPromises()

    await openCertTypeSelect()
    expect(certTypeOptionLabels()).toEqual(['Hot Work', 'Confined Space Entry', 'Working at Heights'])
    expect(document.body.textContent).toContain('Showing every certificate type')
  })
})

/**
 * Wayfinder 095/115 — the one-of rule (a licence number OR an attachment, at least one), mirrored
 * client-side for instant feedback via an explicit check in `onSubmit`, NOT a zod cross-field
 * refine: `AddCertificate.schema.ts` documents why a `.refine()` on this schema never actually
 * runs in any of these four forms (`workerId`'s hidden-input registration never reaches
 * `@primevue/forms`'s tracked field state, so the schema's base object parse — and everything
 * chained after it — never succeeds; `event.valid` is unaffected only because `workerId` was
 * never added to the Form's own validity aggregate either). The server stays authoritative; this
 * only proves the mirror shows the SAME localized copy `useApiError().mapError()` would produce
 * for the real `CERT_LICENCE_OR_ATTACHMENT_REQUIRED` response, never the backend's raw `message`.
 * Asserted via `toast.error` — this modal has no inline error paragraph, unlike its two siblings.
 */
describe('AddCertificateModal — the one-of rule (licence number or attachment)', () => {
  it('creating with neither surfaces the localized error and never calls the API', async (): Promise<void> => {
    const create = vi.spyOn(CertificateProvider.prototype, 'create')

    const wrapper = await mountModal()

    const picker = wrapper.findComponent(WorkerPicker)
    picker.vm.$emit('update:modelValue', 761)
    picker.vm.$emit('worker-selected', { id: 761, name: 'Somchai', role: 'Entrant' })
    await flushPromises()

    await pickCertType('Confined Space Entry')
    await body().find('input[name="issuedDate"]').setValue('2026-01-01')
    await body().find('input[name="expiryDate"]').setValue('2030-01-01')
    // licenceNo left empty, no file attached — the exact case the rule exists to catch.

    await body().find('form').trigger('submit')
    await flushPromises()

    expect(create).not.toHaveBeenCalled()
    expect(toast.error).toHaveBeenCalledWith(
      'A certificate needs either a licence number or an attached image — at least one.'
    )
  })

  it('a licence number alone, with no attachment, is enough to submit', async (): Promise<void> => {
    const create = vi.spyOn(CertificateProvider.prototype, 'create').mockResolvedValue({
      message: 'success',
      data: buildCertificate({ licenceNo: 'LIC-001' })
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
    expect(payload.licenceNo).toBe('LIC-001')
    expect(payload.filePath).toBeUndefined()
  })
})

/**
 * Wayfinder 117 — the ticket's own required test: `workerId` must actually reach the resolver's
 * `values`, not just the outgoing payload (which every one of these forms builds from `formData`
 * directly and would look correct even while the resolver silently never saw `workerId` at all —
 * exactly the bug this ticket found). Calling the mounted `<Form>`'s own `validate()` (part of
 * the public `FormInstance` API, `node_modules/@primevue/forms/form/index.d.ts`) is what proves
 * this at the layer where the original defect actually lived, rather than only observing its
 * absence of consequence downstream.
 */
describe('AddCertificateModal — workerId reaches the resolver (wayfinder 117)', () => {
  it('the picked workerId is present in the Form\'s resolved values, as a number', async (): Promise<void> => {
    const wrapper = await mountModal()

    const picker = wrapper.findComponent(WorkerPicker)
    picker.vm.$emit('update:modelValue', 761)
    picker.vm.$emit('worker-selected', { id: 761, name: 'Somchai', role: 'Entrant' })
    await flushPromises()

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

  /**
   * The other half of the same proof: `event.valid` used to stay `true` regardless of `workerId`
   * because it is computed only over the Form's own registered `_states`, and `workerId` was
   * never one of them. With every OTHER required field filled in validly, clearing only `workerId`
   * must now surface a `workerId`-specific error from the resolver — not silently pass, and not
   * (the trivial, uninformative failure mode) fail the whole object for reasons unrelated to
   * `workerId` at all.
   */
  it('clearing the picked worker surfaces a workerId-specific validation error', async (): Promise<void> => {
    const wrapper = await mountModal()

    const picker = wrapper.findComponent(WorkerPicker)
    picker.vm.$emit('update:modelValue', 761)
    picker.vm.$emit('worker-selected', { id: 761, name: 'Somchai', role: 'Entrant' })
    await flushPromises()

    await pickCertType('Confined Space Entry')
    await body().find('input[name="issuedDate"]').setValue('2026-01-01')
    await body().find('input[name="expiryDate"]').setValue('2030-01-01')
    await body().find('input[name="licenceNo"]').setValue('LIC-001')
    await flushPromises()

    picker.vm.$emit('update:modelValue', undefined)
    picker.vm.$emit('worker-selected', undefined)
    await flushPromises()

    const form = wrapper.findComponent(Form).vm as unknown as {
      validate: () => Promise<{ errors?: Record<string, Array<{ message?: string }>> }>
    }
    const result = await form.validate()

    expect(result.errors?.workerId?.length ?? 0).toBeGreaterThan(0)
  })
})
