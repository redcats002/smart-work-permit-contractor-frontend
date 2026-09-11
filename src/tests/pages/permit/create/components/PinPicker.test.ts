import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import PrimeVue from 'primevue/config'
import i18n, { setLocale } from '@/plugins/I18n.plugin'
import FacilityPlanProvider from '@/resources/provider/facility-plan/FacilityPlan.provider'
import PinProvider from '@/resources/provider/pin/Pin.provider'
import UploadProvider from '@/resources/provider/Upload.provider'
import PinPicker from '@/pages/permit/pages/create/components/PinPicker.vue'
import Select from '@/volt/Select.vue'
import type { IFacilityPlan } from '@/models/modules/facility-plan/FacilityPlan.model'
import type { IPin } from '@/models/modules/pin/Pin.model'

/** PrimeVue's Select calls window.matchMedia (orientation listener bound on mount). */
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

/**
 * wayfinder ticket 107 — the permit wizard's pin picker: safety places pins, the contractor only
 * ever selects one. Modeled on `AreaPicker.test.ts`'s shape: what it fetches, what it emits, and
 * how it renders a permit's already-referenced pin the active list does not contain.
 */
function plan (overrides: Partial<IFacilityPlan> = {}): IFacilityPlan {
  return {
    id: 5,
    name: 'Floor 1',
    fileRef: 'plans/f1.png',
    uploadedById: 'u1',
    uploadedBy: null,
    createdAt: '2026-08-01T00:00:00.000Z',
    activatedAt: '2026-08-01T00:00:00.000Z',
    deactivatedAt: null,
    active: true,
    ...overrides
  }
}

function pin (overrides: Partial<IPin> = {}): IPin {
  return {
    id: 1,
    planId: 5,
    name: 'Tank T-102',
    x: 40,
    y: 60,
    active: true,
    deactivatedAt: null,
    createdById: 'u1',
    createdBy: null,
    createdAt: '2026-08-01T00:00:00.000Z',
    updatedAt: '2026-08-01T00:00:00.000Z',
    ...overrides
  }
}

function mountPicker (pinId: number | null | undefined = undefined): ReturnType<typeof mount> {
  return mount(PinPicker, {
    global: { plugins: [i18n, [PrimeVue, { unstyled: true }]] },
    props: { pinId }
  })
}

describe('PinPicker (wayfinder ticket 107)', () => {
  beforeEach((): void => {
    stubMatchMedia()
  })

  afterEach((): void => {
    vi.restoreAllMocks()
  })

  it('fetches an explicit large page of active facility plans — never the server default page size', async () => {
    const listSpy = vi.spyOn(FacilityPlanProvider.prototype, 'list').mockResolvedValue({
      message: 'success', data: [plan()], page: 1, limit: 9999, totalPage: 1, count: 1
    } as never)

    mountPicker()
    await flushPromises()

    expect(listSpy).toHaveBeenCalledWith({ active: true, limit: 9999 })
  })

  /**
   * The empty-picker case: zero plans, zero pins. Must render cleanly with a "no plans yet" note
   * and never throw or block.
   */
  it('renders cleanly with zero plans and zero pins — no crash, no pin Select shown yet', async () => {
    vi.spyOn(FacilityPlanProvider.prototype, 'list').mockResolvedValue({
      message: 'success', data: [], page: 1, limit: 9999, totalPage: 1, count: 0
    } as never)
    setLocale('en')

    const wrapper = mountPicker()
    await flushPromises()

    expect(wrapper.text()).toContain('No facility plans have been added yet')
    // No plan chosen (there is nothing to choose) — the pin Select never even mounts, and there
    // is no plan image to render either.
    expect(wrapper.findAllComponents(Select)).toHaveLength(1)
    expect(wrapper.find('img').exists()).toBe(false)
  })

  it('choosing a plan fetches an explicit large page of that plan\'s active pins', async () => {
    vi.spyOn(FacilityPlanProvider.prototype, 'list').mockResolvedValue({
      message: 'success', data: [plan({ id: 5 })], page: 1, limit: 9999, totalPage: 1, count: 1
    } as never)
    const pinListSpy = vi.spyOn(PinProvider.prototype, 'list').mockResolvedValue({
      message: 'success', data: [pin()], page: 1, limit: 9999, totalPage: 1, count: 1
    } as never)
    vi.spyOn(UploadProvider.prototype, 'getFileUrl').mockResolvedValue({
      message: 'success', data: { url: 'https://example.test/plan.png' }
    } as never)

    const wrapper = mountPicker()
    await flushPromises()

    await wrapper.findAllComponents(Select)[0].vm.$emit('update:modelValue', 5)
    await flushPromises()

    expect(pinListSpy).toHaveBeenCalledWith({ planId: 5, active: true, limit: 9999 })
    expect(wrapper.findAllComponents(Select)).toHaveLength(2)
  })

  it('selecting a pin emits pinId — no click handler, no cursor-crosshair, no placing', async () => {
    vi.spyOn(FacilityPlanProvider.prototype, 'list').mockResolvedValue({
      message: 'success', data: [plan({ id: 5 })], page: 1, limit: 9999, totalPage: 1, count: 1
    } as never)
    vi.spyOn(PinProvider.prototype, 'list').mockResolvedValue({
      message: 'success', data: [pin({ id: 3, name: 'Reactor Bay' })], page: 1, limit: 9999, totalPage: 1, count: 1
    } as never)
    vi.spyOn(UploadProvider.prototype, 'getFileUrl').mockResolvedValue({
      message: 'success', data: { url: 'https://example.test/plan.png' }
    } as never)

    const wrapper = mountPicker()
    await flushPromises()
    await wrapper.findAllComponents(Select)[0].vm.$emit('update:modelValue', 5)
    await flushPromises()

    await wrapper.findAllComponents(Select)[1].vm.$emit('update:modelValue', 3)
    await flushPromises()

    expect(wrapper.emitted('change')?.at(-1)?.[0]).toEqual({ pinId: 3 })
    // Read-only marker only — never a clickable frame.
    expect(wrapper.find('.cursor-crosshair').exists()).toBe(false)
  })

  it('clearing the pin selection emits pinId: null — a deliberate unset', async () => {
    vi.spyOn(FacilityPlanProvider.prototype, 'list').mockResolvedValue({
      message: 'success', data: [plan({ id: 5 })], page: 1, limit: 9999, totalPage: 1, count: 1
    } as never)
    vi.spyOn(PinProvider.prototype, 'list').mockResolvedValue({
      message: 'success', data: [pin()], page: 1, limit: 9999, totalPage: 1, count: 1
    } as never)
    vi.spyOn(UploadProvider.prototype, 'getFileUrl').mockResolvedValue({
      message: 'success', data: { url: 'https://example.test/plan.png' }
    } as never)

    const wrapper = mountPicker()
    await flushPromises()
    await wrapper.findAllComponents(Select)[0].vm.$emit('update:modelValue', 5)
    await flushPromises()

    await wrapper.findAllComponents(Select)[1].vm.$emit('update:modelValue', undefined)
    await flushPromises()

    expect(wrapper.emitted('change')?.at(-1)?.[0]).toEqual({ pinId: null })
  })

  /**
   * Ruling 8 — a deactivated pin (or one on a deactivated plan) still resolves and displays (name
   * + a read-only "current pin, retired" panel + its marker on the image) but must be ABSENT from
   * the active pin Select's own option list.
   */
  it('a deactivated pin still resolves and displays, but is absent from the active Select', async () => {
    vi.spyOn(FacilityPlanProvider.prototype, 'list').mockResolvedValue({
      message: 'success', data: [], page: 1, limit: 9999, totalPage: 1, count: 0
    } as never)
    const getByIdSpy = vi.spyOn(PinProvider.prototype, 'getById').mockResolvedValue({
      message: 'success', data: pin({ id: 42, name: 'Retired Tank', active: false, planId: 9 })
    } as never)
    vi.spyOn(PinProvider.prototype, 'list').mockResolvedValue({
      message: 'success', data: [], page: 1, limit: 9999, totalPage: 1, count: 0
    } as never)
    vi.spyOn(FacilityPlanProvider.prototype, 'getById').mockResolvedValue({
      message: 'success', data: plan({ id: 9, active: false })
    } as never)
    vi.spyOn(UploadProvider.prototype, 'getFileUrl').mockResolvedValue({
      message: 'success', data: { url: 'https://example.test/retired.png' }
    } as never)
    setLocale('en')

    const wrapper = mountPicker(42)
    await flushPromises()

    expect(getByIdSpy).toHaveBeenCalledWith(42)
    const retiredPanel = wrapper.find('[data-testid="pin-current-retired"]')
    expect(retiredPanel.exists()).toBe(true)
    expect(retiredPanel.text()).toContain('Retired Tank')
    // Never selectable — the pin Select's own model stays unbound to it.
    expect(wrapper.findAllComponents(Select)[1].props('modelValue')).toBeUndefined()

    // + its marker on the image (ruling 8's third requirement). jsdom's getBoundingClientRect is
    // always 0x0, so exact pixel placement can't be asserted here — only checked by hand in a
    // real browser against a non-trivial x/y — but the marker's presence, keyed off the image's
    // own `load` event (not just the frame mounting), is.
    expect(wrapper.find('img').exists()).toBe(true)
    expect(wrapper.find('span[aria-hidden="true"].absolute').exists()).toBe(false)
    await wrapper.find('img').trigger('load')
    await flushPromises()
    expect(wrapper.find('span[aria-hidden="true"].absolute').exists()).toBe(true)
  })

  it('a referenced pin that cannot be resolved shows a "could not be found" note and strips the reference', async () => {
    vi.spyOn(FacilityPlanProvider.prototype, 'list').mockResolvedValue({
      message: 'success', data: [], page: 1, limit: 9999, totalPage: 1, count: 0
    } as never)
    vi.spyOn(PinProvider.prototype, 'getById').mockRejectedValue({ code: 404, message: 'not found' })
    setLocale('en')

    const wrapper = mountPicker(999)
    await flushPromises()

    expect(wrapper.text()).toContain('could not be found')
    expect(wrapper.emitted('change')?.at(-1)?.[0]).toEqual({ pinId: undefined })
  })
})
