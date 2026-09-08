import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import PrimeVue from 'primevue/config'
import i18n, { setLocale } from '@/plugins/I18n.plugin'
import AreaProvider from '@/resources/provider/area/Area.provider'
import AreaPicker from '@/pages/permit/pages/create/components/AreaPicker.vue'
import Select from '@/volt/Select.vue'
import type { IArea } from '@/models/modules/area/Area.model'

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
 * wayfinder ticket 037 — the permit wizard's area picker over APPROVED areas, plus proposing a
 * new one inline. Area is optional and never gates anything (unlike `usePlanPosition`'s
 * `position` step), so this file only exercises `AreaPicker`'s own contract: what it fetches,
 * what it emits on selection, and how it renders a permit's already-referenced area that the
 * list it can see does not contain.
 *
 * wayfinder ticket 044 adds the two cases that matter once `AREA_VISIBILITY_SCOPED=TRUE` makes
 * that last situation ordinary rather than rare: a still-APPROVED area outside this contractor's
 * scope renders as a read-only value (not as 037's "no longer approved" warning), and nothing
 * this component does on its own may ever emit `areaId: null`. The wire-level half of that second
 * invariant — the key never reaching the PATCH body — lives in
 * `../composables/useWizard.persistence.test.ts`.
 */
function area (overrides: Partial<IArea> = {}): IArea {
  return {
    id: 1,
    name: 'Tank Farm A',
    status: 'APPROVED',
    planId: null,
    planX: null,
    planY: null,
    createdById: 'u1',
    createdBy: null,
    createdAt: '2026-08-01T00:00:00.000Z',
    updatedAt: '2026-08-01T00:00:00.000Z',
    approvedById: 'u2',
    approvedBy: null,
    approvedAt: '2026-08-02T00:00:00.000Z',
    rejectedReason: null,
    rejectedAt: null,
    ...overrides
  }
}

function mountPicker (areaId: number | null | undefined = undefined): ReturnType<typeof mount> {
  return mount(AreaPicker, {
    global: { plugins: [i18n, [PrimeVue, { unstyled: true }]] },
    props: { areaId }
  })
}

describe('AreaPicker (wayfinder ticket 037)', () => {
  beforeEach((): void => {
    stubMatchMedia()
  })

  afterEach((): void => {
    vi.restoreAllMocks()
  })

  it('fetches an explicit large page of APPROVED areas — never the server default page size', async () => {
    const listSpy = vi.spyOn(AreaProvider.prototype, 'list').mockResolvedValue({
      message: 'success', data: [area()], page: 1, limit: 9999, totalPage: 1, count: 1
    } as never)

    mountPicker()
    await flushPromises()

    expect(listSpy).toHaveBeenCalledWith({ status: 'APPROVED', limit: 9999 })
  })

  it('renders the propose affordance and does not look broken when the approved list is empty', async () => {
    vi.spyOn(AreaProvider.prototype, 'list').mockResolvedValue({
      message: 'success', data: [], page: 1, limit: 9999, totalPage: 1, count: 0
    } as never)
    setLocale('en')

    const wrapper = mountPicker()
    await flushPromises()

    expect(wrapper.text()).toContain('No approved areas yet')
    expect(wrapper.text()).toContain('Propose new area')
    expect(wrapper.findComponent(Select).exists()).toBe(true)
  })

  it('selecting an area with a default position emits areaId AND position together', async () => {
    vi.spyOn(AreaProvider.prototype, 'list').mockResolvedValue({
      message: 'success',
      data: [area({ id: 5, name: 'Reactor Bay', planId: 2, planX: 40, planY: 60 })],
      page: 1,
      limit: 9999,
      totalPage: 1,
      count: 1
    } as never)

    const wrapper = mountPicker()
    await flushPromises()

    await wrapper.findComponent(Select).vm.$emit('update:modelValue', 5)
    await flushPromises()

    const emitted = wrapper.emitted('change')
    expect(emitted).toBeTruthy()
    expect(emitted?.at(-1)?.[0]).toEqual({
      areaId: 5,
      position: { planId: 2, planX: 40, planY: 60 }
    })
  })

  it('selecting an area with no default position emits areaId only — an existing pin is left untouched', async () => {
    vi.spyOn(AreaProvider.prototype, 'list').mockResolvedValue({
      message: 'success',
      data: [area({ id: 9, name: 'Warehouse', planId: null, planX: null, planY: null })],
      page: 1,
      limit: 9999,
      totalPage: 1,
      count: 1
    } as never)

    const wrapper = mountPicker()
    await flushPromises()

    await wrapper.findComponent(Select).vm.$emit('update:modelValue', 9)
    await flushPromises()

    const emitted = wrapper.emitted('change')
    expect(emitted?.at(-1)?.[0]).toEqual({ areaId: 9 })
  })

  it('clearing the selection emits areaId: null — a deliberate unset, distinct from a stale strip', async () => {
    vi.spyOn(AreaProvider.prototype, 'list').mockResolvedValue({
      message: 'success', data: [area()], page: 1, limit: 9999, totalPage: 1, count: 1
    } as never)

    const wrapper = mountPicker()
    await flushPromises()

    await wrapper.findComponent(Select).vm.$emit('update:modelValue', undefined)
    await flushPromises()

    expect(wrapper.emitted('change')?.at(-1)?.[0]).toEqual({ areaId: null })
  })

  /**
   * wayfinder ticket 044 — the headline case. `AREA_VISIBILITY_SCOPED=TRUE` narrows the list
   * server-side, so a permit's own area is routinely absent from it while still being perfectly
   * APPROVED. That must read as a read-only value, never as the "no longer approved, choose
   * another one" warning, which would be wrong advice about a permit that is fine.
   */
  it('an APPROVED area outside this contractor’s scoped list renders read-only — not as a stale warning', async () => {
    vi.spyOn(AreaProvider.prototype, 'list').mockResolvedValue({
      message: 'success', data: [area({ id: 1, name: 'Tank Farm A' })], page: 1, limit: 9999, totalPage: 1, count: 1
    } as never)
    const getByIdSpy = vi.spyOn(AreaProvider.prototype, 'getById').mockResolvedValue({
      message: 'success', data: area({ id: 77, name: 'Granted Yard B', status: 'APPROVED' })
    } as never)
    setLocale('en')

    const wrapper = mountPicker(77)
    await flushPromises()

    // Resolved through GET /v1/areas/:id, which ticket 044 deliberately left unscoped.
    expect(getByIdSpy).toHaveBeenCalledWith(77)
    const readOnly = wrapper.find('[data-testid="area-current-readonly"]')
    expect(readOnly.exists()).toBe(true)
    expect(readOnly.text()).toContain('Current area')
    expect(readOnly.text()).toContain('Granted Yard B')
    // The 037 wording must NOT appear — this area is approved, and telling the contractor to pick
    // a different one would be a lie about their own permit.
    expect(wrapper.text()).not.toContain('no longer an approved area')
    expect(wrapper.text()).not.toContain('could not be found')
  })

  it('a scoped-out area is stripped as undefined and NEVER as null — the permit stays saveable', async () => {
    vi.spyOn(AreaProvider.prototype, 'list').mockResolvedValue({
      message: 'success', data: [], page: 1, limit: 9999, totalPage: 1, count: 0
    } as never)
    vi.spyOn(AreaProvider.prototype, 'getById').mockResolvedValue({
      message: 'success', data: area({ id: 77, name: 'Granted Yard B', status: 'APPROVED' })
    } as never)

    const wrapper = mountPicker(77)
    await flushPromises()

    const emitted = wrapper.emitted('change')
    expect(emitted?.at(-1)?.[0]).toEqual({ areaId: undefined })
    // `null` is a destructive clear the server would honour. Nothing this component does on its
    // own — mounting, resolving, rendering — may ever emit it; only a human using the Select can.
    expect(emitted?.some((call: unknown[]): boolean => (call[0] as { areaId: unknown }).areaId === null)).toBe(false)
  })

  it('a hydrated areaId not in the approved list still renders — resolved and shown, not hidden', async () => {
    vi.spyOn(AreaProvider.prototype, 'list').mockResolvedValue({
      message: 'success', data: [area({ id: 1 })], page: 1, limit: 9999, totalPage: 1, count: 1
    } as never)
    const getByIdSpy = vi.spyOn(AreaProvider.prototype, 'getById').mockResolvedValue({
      message: 'success', data: area({ id: 99, name: 'Old Loading Dock', status: 'REJECTED' })
    } as never)
    setLocale('en')

    const wrapper = mountPicker(99)
    await flushPromises()

    expect(getByIdSpy).toHaveBeenCalledWith(99)
    expect(wrapper.text()).toContain('Old Loading Dock')
    // Stripped from the outgoing payload — never resent on the next autosave PATCH.
    expect(wrapper.emitted('change')?.at(-1)?.[0]).toEqual({ areaId: undefined })
  })

  it('proposing a new area adds it to a visible, non-selectable "awaiting approval" list — never silent', async () => {
    vi.spyOn(AreaProvider.prototype, 'list').mockResolvedValue({
      message: 'success', data: [], page: 1, limit: 9999, totalPage: 1, count: 0
    } as never)
    setLocale('en')

    const wrapper = mountPicker()
    await flushPromises()

    await (wrapper.vm as unknown as { onAreaCreated: (a: IArea) => void })
      .onAreaCreated(area({ id: 42, name: 'New Loading Bay', status: 'PENDING' }))
    await flushPromises()

    expect(wrapper.text()).toContain('New Loading Bay')
    expect(wrapper.text()).toContain('Awaiting approval')
    // Never auto-selected — it is not usable by any permit until a safety officer approves it.
    expect(wrapper.emitted('change')).toBeFalsy()
  })
})
