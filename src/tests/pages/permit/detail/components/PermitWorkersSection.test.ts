import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import i18n, { setLocale } from '@/plugins/I18n.plugin'
import { EPpeItem } from '@/enums/modules/permit/PpeItem.enum'
import PermitWorkersSection from '@/pages/permit/pages/detail/components/PermitWorkersSection.vue'
import type { IPermitDetail } from '@/models/response/permit/PermitRes.model'
import type { TPermitStatus } from '@/enums/modules/permit/PermitStatus.enum'
import type { TPermitType } from '@/enums/modules/permit/PermitType.enum'

/**
 * Wayfinder 097 — the declared PPE + note render inside §3 Workers & PPE (the section this
 * ticket's own name describes), never a whole-page mount, since nothing else on the page is
 * exercised here.
 */
function buildPermit (overrides: Partial<IPermitDetail> = {}): IPermitDetail {
  return {
    id: 'WP-CONF-20260810-002',
    type: 'confined' as TPermitType,
    status: 'DRAFT' as TPermitStatus,
    title: 'Clean tank T-101',
    foreman: 'Somchai P.',
    location: 'Zone C — Tank farm',
    startDate: '2026-08-10T00:00:00.000Z',
    endDate: '2026-08-10T00:00:00.000Z',
    dailyStart: '2026-08-10T01:00:00.000Z',
    dailyEnd: '2026-08-10T10:00:00.000Z',
    scheduleNote: null,
    outdoorWork: false,
    ppeDeclared: [],
    ppeNote: null,
    createdById: 'u-1',
    createdBy: null,
    createdAt: '2026-08-09T01:00:00.000Z',
    updatedAt: '2026-08-09T02:00:00.000Z',
    submittedAt: null,
    approvedById: null,
    approvedBy: null,
    approvedAt: null,
    rejectedReason: null,
    rejectedAt: null,
    closedById: null,
    closedBy: null,
    closedAt: null,
    fireMonitorStartedAt: null,
    qrIssuedAt: null,
    entrantCount: 0,
    fireWatch: null,
    pinId: null,
    jsaSteps: [],
    workers: [],
    photos: [],
    latestSafetyReading: null,
    ...overrides
  }
}

describe('PermitWorkersSection — declared PPE (wayfinder 097)', () => {
  it('renders the "none declared" empty state when ppeDeclared is []', () => {
    setLocale('en')
    const wrapper = mount(PermitWorkersSection, {
      props: { permit: buildPermit() },
      global: { plugins: [i18n] }
    })

    expect(wrapper.find('[data-test="ppe-empty"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="ppe-declared"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="ppe-note"]').exists()).toBe(false)
  })

  it('renders every declared item by its localized label, and the note', () => {
    setLocale('en')
    const wrapper = mount(PermitWorkersSection, {
      props: {
        permit: buildPermit({
          ppeDeclared: [EPpeItem.HARDHAT, EPpeItem.SAFETY_GLASSES, EPpeItem.RESPIRATORY_PROTECTION],
          ppeNote: 'Confined space entry crew'
        })
      },
      global: { plugins: [i18n] }
    })

    expect(wrapper.find('[data-test="ppe-empty"]').exists()).toBe(false)
    const declared = wrapper.find('[data-test="ppe-declared"]')
    expect(declared.exists()).toBe(true)
    expect(declared.text()).toContain('Hardhat')
    expect(declared.text()).toContain('Safety Glasses')
    expect(declared.text()).toContain('Respiratory Protection')

    expect(wrapper.find('[data-test="ppe-note"]').text()).toBe('Confined space entry crew')
  })

  it('renders no note element when ppeNote is null', () => {
    setLocale('en')
    const wrapper = mount(PermitWorkersSection, {
      props: { permit: buildPermit({ ppeDeclared: [EPpeItem.GLOVES], ppeNote: null }) },
      global: { plugins: [i18n] }
    })

    expect(wrapper.find('[data-test="ppe-declared"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="ppe-note"]').exists()).toBe(false)
  })
})
