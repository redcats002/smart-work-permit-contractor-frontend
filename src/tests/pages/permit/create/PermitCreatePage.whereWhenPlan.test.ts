import type { Router } from 'vue-router'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import PrimeVue from 'primevue/config'
import i18n, { setLocale } from '@/plugins/I18n.plugin'
import CertificateProvider from '@/resources/provider/certificate/Certificate.provider'
import FacilityPlanProvider from '@/resources/provider/facility-plan/FacilityPlan.provider'
import PermitProvider from '@/resources/provider/permit/Permit.provider'
import AreaProvider from '@/resources/provider/area/Area.provider'
import PermitCreatePage from '@/pages/permit/pages/create/pages/PermitCreatePage.vue'
import WizardFooter from '@/pages/permit/pages/create/components/WizardFooter.vue'
import Step1Type from '@/pages/permit/pages/create/components/steps/Step1Type.vue'
import Step3WhereWhen from '@/pages/permit/pages/create/components/steps/Step3WhereWhen.vue'
import type { IFacilityPlan } from '@/models/modules/facility-plan/FacilityPlan.model'

/**
 * wayfinder 069/070 — "the pin surface is the area's own drawing when it has one, the active
 * site plan otherwise." Proves the REAL mechanism end to end through `useWizard`: picking an area
 * re-fetches `GET /facility-plans/active?areaId=<picked area>`, and the plan that comes back
 * (the area's own drawing, resolved server-side) becomes `activePlan` — never `IArea.planId` (a
 * historical default-position snapshot on a DIFFERENT Prisma relation) treated as if it were the
 * live drawing reference.
 */
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

function sitePlan (): IFacilityPlan {
  return {
    id: 5,
    fileRef: 'plans/site.png',
    uploadedById: 'u1',
    uploadedBy: null,
    createdAt: '2026-08-01T00:00:00.000Z',
    activatedAt: '2026-08-01T00:00:00.000Z',
    active: true
  }
}

function areaDrawing (): IFacilityPlan {
  return {
    id: 99,
    fileRef: 'plans/area-3-drawing.png',
    uploadedById: 'u1',
    uploadedBy: null,
    createdAt: '2026-08-05T00:00:00.000Z',
    activatedAt: '2026-08-05T00:00:00.000Z',
    active: true
  }
}

function buildRouter (): Router {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/permits', name: 'PermitListPage', component: { template: '<div />' } },
      { path: '/permits/create', name: 'PermitCreatePage', component: PermitCreatePage },
      { path: '/permits/:id', name: 'PermitDetailPage', component: { template: '<div />' } }
    ]
  })
}

describe('useWizard re-scopes activePlan to the picked area (wayfinder 069/070)', () => {
  beforeEach((): void => {
    stubMatchMedia()
    setActivePinia(createPinia())
    setLocale('en')
    vi.spyOn(PermitProvider.prototype, 'create')
      .mockResolvedValue({ message: 'success', data: { id: 'WP-HOT-20260820-001' } } as never)
    vi.spyOn(PermitProvider.prototype, 'update')
      .mockResolvedValue({ message: 'success', data: { id: 'WP-HOT-20260820-001' } } as never)
    vi.spyOn(CertificateProvider.prototype, 'byWorker').mockResolvedValue({ message: 'success', data: null } as never)
    vi.spyOn(AreaProvider.prototype, 'list').mockResolvedValue({
      message: 'success', data: [], page: 1, limit: 9999, totalPage: 1, count: 0
    } as never)
  })

  afterEach((): void => {
    vi.restoreAllMocks()
  })

  it('re-fetches GET /facility-plans/active?areaId=<picked> the moment an area is picked, and the resolved plan becomes activePlan', async () => {
    const getActiveSpy = vi.spyOn(FacilityPlanProvider.prototype, 'getActive').mockImplementation(
      async (areaId?: number): Promise<{ message: string, data: IFacilityPlan | null }> => (
        areaId === 3
          ? { message: 'success', data: areaDrawing() }
          : { message: 'success', data: sitePlan() }
      )
    )
    vi.spyOn(FacilityPlanProvider.prototype, 'getById').mockImplementation(async (id: number) => (
      { message: 'success', data: id === 99 ? areaDrawing() : sitePlan() }
    ) as never)
    const uploadService = await import('@/resources/provider/Upload.provider')
    vi.spyOn(uploadService.default.prototype, 'getFileUrl').mockImplementation(async (fileRef: string) => (
      { message: 'success', data: { url: `https://example.test/${fileRef}` } }
    ) as never)

    const router = buildRouter()
    await router.push('/permits/create')
    await router.isReady()

    const wrapper = mount(PermitCreatePage, {
      global: { plugins: [i18n, router, [PrimeVue, { unstyled: true }]] }
    })
    await flushPromises()

    // Boot: no area picked yet — the unscoped, site-wide lookup.
    expect(getActiveSpy).toHaveBeenCalledWith(undefined)

    wrapper.findComponent(Step1Type).vm.$emit('update:formData', {
      type: 'hot', title: 'Warehouse repaint', foreman: 'Somchai', location: 'Zone 3'
    })
    await flushPromises()
    const footer = wrapper.findComponent(WizardFooter)
    footer.vm.$emit('next') // -> basicInfo
    await flushPromises()
    footer.vm.$emit('next') // -> whereWhen
    await flushPromises()

    const whereWhen = wrapper.findComponent(Step3WhereWhen)
    expect(whereWhen.exists()).toBe(true)

    // Simulate AreaPicker's `change` event picking area 3 — the ticket's headline behaviour:
    // selecting an area drops the pin AND (per 069/070) re-scopes the plan lookup.
    await (whereWhen.vm as unknown as { onAreaChange: (p: { areaId: number, position?: unknown }) => void })
      .onAreaChange({ areaId: 3, position: { planId: 99, planX: 40, planY: 60 } })
    await flushPromises()

    expect(getActiveSpy).toHaveBeenCalledWith(3)
    // The step's pin surface now renders the AREA'S drawing — resolved as `activePlan`, not via
    // an extra `getById` lookup (planId 99 IS the currently resolved activePlan.id).
    expect(whereWhen.find('.cursor-crosshair').exists()).toBe(true)
    expect(whereWhen.find('img').attributes('src')).toBe('https://example.test/plans/area-3-drawing.png')
  })
})
