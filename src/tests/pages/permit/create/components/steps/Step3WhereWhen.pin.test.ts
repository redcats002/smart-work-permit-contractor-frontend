import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import PrimeVue from 'primevue/config'
import i18n, { setLocale } from '@/plugins/I18n.plugin'
import FacilityPlanProvider from '@/resources/provider/facility-plan/FacilityPlan.provider'
import UploadProvider from '@/resources/provider/Upload.provider'
import AreaProvider from '@/resources/provider/area/Area.provider'
import Step3WhereWhen from '@/pages/permit/pages/create/components/steps/Step3WhereWhen.vue'
import type { IFacilityPlan } from '@/models/modules/facility-plan/FacilityPlan.model'
import type { IUpdatePermitDraftPayload } from '@/models/request/permit/PermitReq.model'
import type { IWizardStepProps } from '@/pages/permit/pages/create/wizard/WizardSteps'

/**
 * wayfinder ticket 071 — "I pinned it and it still said I didn't pin, and I can't submit."
 *
 * The ticket named three candidate causes for `usePlanPosition.stateFor` returning `'fail'`
 * against a visibly-drawn pin, in priority order, and flagged the third — `renderedPlan` still
 * `undefined` at click time, so `onFrameClick` would emit `position.planId: undefined` while a
 * pin renders anyway — as the one matching the report exactly.
 *
 * None of the three reproduce on this checkout:
 *   1. The deployed build predating the emit — `onFrameClick` has emitted all three fields
 *      (`planId`/`planX`/`planY`) since the step's very first commit (078e749a).
 *   2. `onAreaChange` overwriting an existing pin — it only forwards a `position` key when the
 *      newly selected area actually carries a default one; picking an area with none omits the
 *      key entirely, so `useWizard.updateFormData`'s spread-merge leaves the existing pin alone.
 *   3. `renderedPlan` being `undefined` at click time — `onFrameClick` guards on
 *      `!renderedPlan.value` and returns early. The clickable frame (`v-else-if="imageUrl"`)
 *      doesn't even exist until `loadPlanImage` has already set `renderedPlan.value` (it runs
 *      before the `imageUrl`-setting await), so by the time a click is physically possible,
 *      `renderedPlan` is never `undefined`. The first case below proves this directly.
 */
function plan (overrides: Partial<IFacilityPlan> = {}): IFacilityPlan {
  return {
    id: 5,
    fileRef: 'plans/f1.png',
    uploadedById: 'u1',
    uploadedBy: null,
    createdAt: '2026-08-01T00:00:00.000Z',
    activatedAt: '2026-08-01T00:00:00.000Z',
    active: true,
    ...overrides
  } as IFacilityPlan
}

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

function mountStep (formData: Partial<IUpdatePermitDraftPayload>, activePlan: IFacilityPlan | null): ReturnType<typeof mount> {
  vi.spyOn(AreaProvider.prototype, 'list').mockResolvedValue({
    message: 'success', data: [], page: 1, limit: 9999, totalPage: 1, count: 0
  } as never)
  return mount(Step3WhereWhen, {
    global: { plugins: [i18n, [PrimeVue, { unstyled: true }]] },
    props: {
      title: 'Position',
      formData,
      checklistAnswers: {},
      submitFailures: {},
      certificateState: 'ok',
      certificateProblems: [],
      positionState: activePlan ? 'fail' : 'none',
      activePlan
    } as unknown as IWizardStepProps
  })
}

describe('Step3WhereWhen pin drop (wayfinder ticket 071, defect A — moved here by 070)', () => {
  afterEach((): void => {
    vi.restoreAllMocks()
  })

  it('candidate 3 falsified — the frame is not clickable until renderedPlan has already resolved, so no pin can carry an undefined planId', async () => {
    stubMatchMedia()
    vi.spyOn(UploadProvider.prototype, 'getFileUrl').mockImplementation(
      (): Promise<never> => new Promise((): void => undefined) // never resolves — plan image stays "loading" forever
    )

    const wrapper = mountStep({ position: undefined, areaId: undefined }, plan())
    await flushPromises()

    // imageUrl never resolved, so the clickable frame must not exist yet.
    expect(wrapper.find('.cursor-crosshair').exists()).toBe(false)
    expect(wrapper.emitted('update:formData')).toBeFalsy()
  })

  it('candidate 1 falsified — once the frame IS clickable, the emitted position always carries planId', async () => {
    stubMatchMedia()
    vi.spyOn(UploadProvider.prototype, 'getFileUrl').mockResolvedValue({
      message: 'success', data: { url: 'https://example.test/plan.png' }
    } as never)

    const wrapper = mountStep({ position: undefined, areaId: undefined }, plan({ id: 7 }))
    await flushPromises()

    const frame = wrapper.find('.cursor-crosshair')
    expect(frame.exists()).toBe(true)
    await frame.trigger('click', { clientX: 10, clientY: 10 })
    await flushPromises()

    const emitted = wrapper.emitted('update:formData')
    expect(emitted).toBeTruthy()
    const patch = emitted?.at(-1)?.[0] as { position: { planId: number, planX: number, planY: number } }
    expect(patch.position.planId).toBe(7)
    expect(typeof patch.position.planX).toBe('number')
    expect(typeof patch.position.planY).toBe('number')
  })

  it('candidate 2 falsified — an area change carrying no default position never re-emits (and so never overwrites) an existing pin', async () => {
    stubMatchMedia()
    vi.spyOn(FacilityPlanProvider.prototype, 'getById').mockResolvedValue({ message: 'success', data: plan() } as never)
    vi.spyOn(UploadProvider.prototype, 'getFileUrl').mockResolvedValue({
      message: 'success', data: { url: 'https://example.test/plan.png' }
    } as never)

    const wrapper = mountStep({ position: { planId: 5, planX: 40, planY: 60 }, areaId: undefined }, plan())
    await flushPromises()

    // Simulate AreaPicker's `change` event the way Step3WhereWhen wires it — an area with no
    // default position, which must omit `position` from the patch entirely.
    await (wrapper.vm as unknown as { onAreaChange: (p: { areaId: number, position?: unknown }) => void })
      .onAreaChange({ areaId: 3 })
    await flushPromises()

    const emitted = wrapper.emitted('update:formData')
    expect(emitted?.at(-1)?.[0]).toEqual({ areaId: 3 })
    expect(emitted?.some((call: unknown[]): boolean => 'position' in (call[0] as object))).toBe(false)
  })
})

/**
 * wayfinder 070 — "the step still renders" regardless of plan state: no active plan at all, and
 * an active plan (site-wide OR an area's own drawing — indistinguishable to THIS component, which
 * only ever renders whatever `activePlan` prop it is handed; WHICH plan that is gets resolved one
 * layer up, in `useWizard`, by re-fetching `GET /facility-plans/active?areaId=<picked area>` on
 * every `formData.areaId` change — see `useWizard.ts` and its own composable-level test for that
 * mechanism). Only the pin SURFACE changes across these; area/geo/dates/note always render.
 */
describe('Step3WhereWhen renders regardless of plan state (wayfinder 070)', () => {
  afterEach((): void => {
    vi.restoreAllMocks()
  })

  it('no active plan — area, geo, dates and note all render; the pin surface is a plain "no plan" line', async () => {
    setLocale('en')
    stubMatchMedia()
    vi.spyOn(AreaProvider.prototype, 'list').mockResolvedValue({
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
        positionState: 'none',
        activePlan: null
      } as unknown as IWizardStepProps
    })
    await flushPromises()

    expect(wrapper.text()).toContain('No facility plan has been activated yet')
    expect(wrapper.find('.cursor-crosshair').exists()).toBe(false)
    // Area, geo and dates are still there — this step is not "hidden", only the pin surface swaps.
    expect(wrapper.text()).toContain('Work Area')
    expect(wrapper.text()).toContain('Geo Coordinate')
    expect(wrapper.text()).toContain('Start Date')
  })

  it('an active plan (site-wide or an area drawing — this component cannot tell which) — the pin frame renders directly, no extra lookup', async () => {
    stubMatchMedia()
    vi.spyOn(UploadProvider.prototype, 'getFileUrl').mockResolvedValue({
      message: 'success', data: { url: 'https://example.test/plan.png' }
    } as never)
    const getByIdSpy = vi.spyOn(FacilityPlanProvider.prototype, 'getById')

    const wrapper = mountStep({ position: undefined, areaId: undefined }, plan({ id: 5 }))
    await flushPromises()

    expect(wrapper.find('.cursor-crosshair').exists()).toBe(true)
    // No stale/other plan id on the pin, so `activePlan` (whatever it resolved to) is used
    // directly — no extra lookup.
    expect(getByIdSpy).not.toHaveBeenCalled()
  })

  it('a pin placed on an OLDER plan version still resolves and plots against THAT version (037/069)', async () => {
    stubMatchMedia()
    vi.spyOn(FacilityPlanProvider.prototype, 'getById')
      .mockResolvedValue({ message: 'success', data: plan({ id: 99, fileRef: 'plans/older-version.png' }) } as never)
    const getFileUrlSpy = vi.spyOn(UploadProvider.prototype, 'getFileUrl')
      .mockResolvedValue({ message: 'success', data: { url: 'https://example.test/older-version.png' } } as never)

    // The permit's stored pin references plan 99 — an older version, or an area drawing that has
    // since gone inactive — while the CURRENTLY resolved `activePlan` is 5. Either way the pin
    // must plot against the version it was actually placed on, never silently re-project onto 5.
    const wrapper = mountStep({ position: { planId: 99, planX: 40, planY: 60 }, areaId: 3 }, plan({ id: 5 }))
    await flushPromises()

    expect(FacilityPlanProvider.prototype.getById).toHaveBeenCalledWith(99)
    expect(getFileUrlSpy).toHaveBeenCalledWith('plans/older-version.png')
    expect(wrapper.find('.cursor-crosshair').exists()).toBe(true)
    expect(wrapper.text()).toContain('This permit was placed on an earlier plan version')
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

    const dailyStart = '1970-01-01T01:00:00.000Z'
    const wrapper = mount(Step3WhereWhen, {
      global: { plugins: [i18n, [PrimeVue, { unstyled: true }]] },
      props: {
        title: 'Where & when',
        formData: { startDate: '2026-08-20', endDate: '2026-08-20', dailyStart, dailyEnd: '1970-01-01T09:00:00.000Z' },
        checklistAnswers: {},
        submitFailures: {},
        certificateState: 'ok',
        certificateProblems: [],
        positionState: 'none',
        activePlan: null
      } as unknown as IWizardStepProps
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
