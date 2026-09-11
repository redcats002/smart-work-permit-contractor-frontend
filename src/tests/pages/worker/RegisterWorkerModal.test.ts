import { DOMWrapper, flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, describe, expect, it, vi } from 'vitest'
import PrimeVue from 'primevue/config'
import i18n, { setLocale } from '@/plugins/I18n.plugin'
import WorkerProvider from '@/resources/provider/worker/Worker.provider'
import RegisterWorkerModal from '@/pages/worker/pages/list/components/RegisterWorkerModal.vue'
import type { ICreateWorkerPayload } from '@/models/request/worker/WorkerReq.model'

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

function body (): DOMWrapper<HTMLElement> {
  return new DOMWrapper(document.body)
}

async function mountModal (): Promise<ReturnType<typeof mount>> {
  stubMatchMedia()
  setActivePinia(createPinia())
  setLocale('en')

  const wrapper = mount(RegisterWorkerModal, {
    props: { modelValue: false },
    global: { plugins: [i18n, [PrimeVue, { unstyled: true }]] },
    attachTo: document.body
  })
  await wrapper.setProps({ modelValue: true })
  await flushPromises()
  return wrapper
}

/**
 * wayfinder 103 — "a worker is a name; the role belongs to the job". `POST /workers` no longer
 * declares `role`, and the register-worker modal's own `role` Select is gone with it. This is the
 * regression test: a worker created through this modal must never carry a `role` key, in the
 * form's type OR in what actually reaches the provider at runtime.
 */
describe('RegisterWorkerModal — no worker-level role reaches the wire (wayfinder 103)', () => {
  it('creates a worker with only name/idCardNo/phone — no role key at all', async (): Promise<void> => {
    const create = vi.spyOn(WorkerProvider.prototype, 'create').mockResolvedValue({
      message: 'success',
      data: { id: 1, name: 'Somchai' }
    })

    await mountModal()

    await body().find('input[name="name"]').setValue('Somchai')
    await body().find('form').trigger('submit')
    await flushPromises()

    expect(create).toHaveBeenCalledTimes(1)
    const payload = create.mock.calls[0][0] as ICreateWorkerPayload
    expect(payload).not.toHaveProperty('role')
    expect(payload.name).toBe('Somchai')
  })

  it('never renders a role field at all', async (): Promise<void> => {
    await mountModal()

    expect(document.body.textContent).not.toContain('Role')
  })
})
