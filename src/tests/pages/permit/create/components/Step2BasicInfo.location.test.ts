import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { describe, expect, it } from 'vitest'
import PrimeVue from 'primevue/config'
import { createPinia, setActivePinia } from 'pinia'
import en from '@/locales/en'
import th from '@/locales/th'
import Step2BasicInfo from '@/pages/permit/pages/create/components/steps/Step2BasicInfo.vue'
import { EMPTY_SUBMIT_FAILURES } from '@/pages/permit/pages/create/constants/SubmitErrorRouting'

/**
 * wayfinder 093 — `location` is a text field and nothing else.
 *
 * This step used to render a zone-chip row and a pin on a grey placeholder rectangle, positioned by
 * hashing this very string. The Safety app deleted the identical mechanism on 2026-08-24 with a
 * HISTORY note saying it must not come back, because a pin the system cannot vouch for reads as a
 * claim about where hot work physically is. This test is the contractor half of that note: it fails
 * if the map, the chips or the pin are ever reintroduced here.
 *
 * The real placement is step 3 (`Step3WhereWhen.vue`, wayfinder 070) — an approved Area, a pin on a
 * real facility-plan raster, and a parsed coordinate. Nothing here should compete with it.
 */
function mountStep (location: string) {
  setActivePinia(createPinia())
  return mount(Step2BasicInfo, {
    props: {
      title: 'Basic information',
      formData: { title: 'Weld the flange', foreman: 'Somchai', location },
      checklistAnswers: {},
      submitFailures: EMPTY_SUBMIT_FAILURES,
      certificateState: 'idle' as const,
      certificateProblems: [],
      positionState: 'none' as const,
      activePlan: null
    },
    global: {
      plugins: [createI18n({ legacy: false, locale: 'en', messages: { en, th } }), PrimeVue]
    }
  })
}

describe('Step 2 location (wayfinder 093)', () => {
  it('renders no plan placeholder and no pin', (): void => {
    const wrapper = mountStep('north corner, near the loading dock')
    expect(wrapper.find('[data-test="location-plan"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="location-pin"]').exists()).toBe(false)
  })

  it('renders no zone chips — the only control is the text field', (): void => {
    const wrapper = mountStep('Zone 3')
    // 'Zone 3' was a chip label AND a known zone key, so if the chip row ever comes back this is
    // the string that brings it back with a pin attached.
    expect(wrapper.text()).not.toContain('Tank Farm')
    expect(wrapper.find('[data-test="location-pin"]').exists()).toBe(false)
  })

  it('keeps location as free text on the wire', async (): Promise<void> => {
    const wrapper = mountStep('')
    const input = wrapper.find('input[name="location"]')
    expect(input.exists()).toBe(true)

    await input.setValue('north corner, near the loading dock')

    const patches = wrapper.emitted('update:formData') ?? []
    const locations = patches
      .map((args: unknown[]): unknown => (args[0] as Record<string, unknown>).location)
      .filter((value: unknown): boolean => value !== undefined)
    expect(locations).toContain('north corner, near the loading dock')
  })
})
