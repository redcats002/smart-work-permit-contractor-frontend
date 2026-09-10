import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import PrimeVue from 'primevue/config'
import i18n from '@/plugins/I18n.plugin'
import FacilityPlanProvider from '@/resources/provider/facility-plan/FacilityPlan.provider'
import UploadProvider from '@/resources/provider/Upload.provider'
import AreaProvider from '@/resources/provider/area/Area.provider'
import Step7Position from '@/pages/permit/pages/create/components/steps/Step7Position.vue'
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
  return mount(Step7Position, {
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

describe('Step7Position pin drop (wayfinder ticket 071, defect A)', () => {
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

    // Simulate AreaPicker's `change` event the way Step7Position wires it — an area with no
    // default position, which must omit `position` from the patch entirely.
    await (wrapper.vm as unknown as { onAreaChange: (p: { areaId: number, position?: unknown }) => void })
      .onAreaChange({ areaId: 3 })
    await flushPromises()

    const emitted = wrapper.emitted('update:formData')
    expect(emitted?.at(-1)?.[0]).toEqual({ areaId: 3 })
    expect(emitted?.some((call: unknown[]): boolean => 'position' in (call[0] as object))).toBe(false)
  })
})
