import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import PrimeVue from 'primevue/config'
import i18n, { setLocale } from '@/plugins/I18n.plugin'
import AreaProvider from '@/resources/provider/area/Area.provider'
import FacilityPlanProvider from '@/resources/provider/facility-plan/FacilityPlan.provider'
import Step3WhereWhen from '@/pages/permit/pages/create/components/steps/Step3WhereWhen.vue'
import type { IUpdatePermitDraftPayload } from '@/models/request/permit/PermitReq.model'
import type { IWizardStepProps } from '@/pages/permit/pages/create/wizard/WizardSteps'

/**
 * wayfinder ticket 107. Replaces `Step3WhereWhen.pin.test.ts`, which pinned the click-to-place
 * pin behaviour this ticket removes entirely — safety places pins now, the contractor only
 * selects one via `PinPicker.vue` (see its own test file). What remains worth pinning at THIS
 * step's level: it renders cleanly with nothing to pick from, `onAreaChange` no longer forwards
 * `position` (105 removed `Permit.position` from the wire), and the 067 UTC trap round-trip.
 */
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

function mountStep (formData: Partial<IUpdatePermitDraftPayload>): ReturnType<typeof mount> {
  return mount(Step3WhereWhen, {
    global: { plugins: [i18n, [PrimeVue, { unstyled: true }]] },
    props: {
      title: 'Where & when',
      formData,
      checklistAnswers: {},
      submitFailures: {},
      certificateState: 'ok',
      certificateProblems: [],
      positionState: 'none'
    } as unknown as IWizardStepProps
  })
}

describe('Step3WhereWhen renders cleanly with nothing to pick from (wayfinder 107)', () => {
  afterEach((): void => {
    vi.restoreAllMocks()
  })

  it('zero areas, zero facility plans, zero pins — no throw, area/pin/location/dates all still render', async () => {
    setLocale('en')
    stubMatchMedia()
    vi.spyOn(AreaProvider.prototype, 'list').mockResolvedValue({
      message: 'success', data: [], page: 1, limit: 9999, totalPage: 1, count: 0
    } as never)
    vi.spyOn(FacilityPlanProvider.prototype, 'list').mockResolvedValue({
      message: 'success', data: [], page: 1, limit: 9999, totalPage: 1, count: 0
    } as never)

    const wrapper = mountStep({
      startDate: '2026-08-20', endDate: '2026-08-20', dailyStart: '', dailyEnd: '', location: ''
    })
    await flushPromises()

    expect(wrapper.text()).toContain('Work Area')
    expect(wrapper.text()).toContain('No facility plans have been added yet')
    expect(wrapper.text()).toContain('Location Detail')
    expect(wrapper.text()).toContain('Start Date')
    // No pin required state is shown while positionState is 'none' — the fail banner is absent.
    expect(wrapper.text()).not.toContain('A pin is required')
  })

  it('positionState fail renders the required banner', async () => {
    setLocale('en')
    stubMatchMedia()
    vi.spyOn(AreaProvider.prototype, 'list').mockResolvedValue({
      message: 'success', data: [], page: 1, limit: 9999, totalPage: 1, count: 0
    } as never)
    vi.spyOn(FacilityPlanProvider.prototype, 'list').mockResolvedValue({
      message: 'success', data: [], page: 1, limit: 9999, totalPage: 1, count: 0
    } as never)

    const wrapper = mount(Step3WhereWhen, {
      global: { plugins: [i18n, [PrimeVue, { unstyled: true }]] },
      props: {
        title: 'Where & when',
        formData: { startDate: '2026-08-20', endDate: '2026-08-20', dailyStart: '', dailyEnd: '' },
        checklistAnswers: {},
        submitFailures: {},
        certificateState: 'ok',
        certificateProblems: [],
        positionState: 'fail'
      } as unknown as IWizardStepProps
    })
    await flushPromises()

    expect(wrapper.text()).toContain('A pin is required')
  })

  /**
   * wayfinder ticket 107, design decision 3 — `AreaPicker` is untouched and still computes a
   * `position` alongside `areaId` (an area's own optional default position, unrelated to
   * `Permit.pinId`). `onAreaChange` must forward ONLY `{ areaId }` now that `Permit` has no
   * `position` field for it to drop into.
   */
  it('onAreaChange forwards only areaId, never position (105 removed Permit.position)', async () => {
    setLocale('en')
    stubMatchMedia()
    vi.spyOn(AreaProvider.prototype, 'list').mockResolvedValue({
      message: 'success', data: [], page: 1, limit: 9999, totalPage: 1, count: 0
    } as never)
    vi.spyOn(FacilityPlanProvider.prototype, 'list').mockResolvedValue({
      message: 'success', data: [], page: 1, limit: 9999, totalPage: 1, count: 0
    } as never)

    const wrapper = mountStep({ startDate: '2026-08-20', endDate: '2026-08-20', dailyStart: '', dailyEnd: '' })
    await flushPromises()

    await (wrapper.vm as unknown as { onAreaChange: (p: { areaId: number, position?: unknown }) => void })
      .onAreaChange({ areaId: 3, position: { planId: 5, planX: 40, planY: 60 } })
    await flushPromises()

    const emitted = wrapper.emitted('update:formData')
    expect(emitted?.at(-1)?.[0]).toEqual({ areaId: 3 })
  })
})

/**
 * ⚠ THE 067 UTC TRAP (see IPermitBase's doc comment). `dailyStart`/`dailyEnd` are
 * `1970-01-01`-anchored on the wire; the migration preserved every existing permit's instant only
 * because the client reads/writes them through the SAME local-time conversion the old
 * `workTimeStart` used (`Date#getHours`/`Date#setHours`, never the UTC variants). This proves the
 * round trip is symmetric: reading a value into the picker and writing it straight back out
 * (nothing changed) reproduces the EXACT same wire string — the shape of bug this guards against
 * is a get/set pair that quietly disagree about which clock they are reading.
 */
describe('Step3WhereWhen daily window survives a no-op edit (wayfinder 067 UTC trap)', () => {
  afterEach((): void => {
    vi.restoreAllMocks()
  })

  it('re-emitting the SAME picked time reproduces the exact same ISO string', async () => {
    stubMatchMedia()
    vi.spyOn(AreaProvider.prototype, 'list').mockResolvedValue({
      message: 'success', data: [], page: 1, limit: 9999, totalPage: 1, count: 0
    } as never)
    vi.spyOn(FacilityPlanProvider.prototype, 'list').mockResolvedValue({
      message: 'success', data: [], page: 1, limit: 9999, totalPage: 1, count: 0
    } as never)

    const dailyStart = '1970-01-01T01:00:00.000Z'
    const wrapper = mountStep({
      startDate: '2026-08-20', endDate: '2026-08-20', dailyStart, dailyEnd: '1970-01-01T09:00:00.000Z'
    })
    await flushPromises()

    // Re-select the SAME wall-clock time the field already displays — proves `dailyStartModel`'s
    // get (extract local hours/minutes from the ISO string) and set (compose them back onto a
    // carrier date, then `.toISOString()`) are inverse operations, not a UTC/local mismatch.
    const readBack = new Date(dailyStart)
    const vm = wrapper.vm as unknown as { dailyStartModel: Date | undefined }
    vm.dailyStartModel = new Date(readBack)
    await flushPromises()

    const emitted = wrapper.emitted('update:formData')
    expect(emitted).toBeTruthy()
    const patch = emitted?.at(-1)?.[0] as { dailyStart: string }
    expect(patch.dailyStart).toBe(dailyStart)
  })
})
