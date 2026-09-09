import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import i18n, { setLocale } from '@/plugins/I18n.plugin'
import WorkerCertificateSuggestionOption from '@/pages/permit/pages/create/components/WorkerCertificateSuggestionOption.vue'
import type { ICertificate } from '@/models/modules/certificate/Certificate.model'

/**
 * wayfinder ticket 004 — one row of the worker-name AutoComplete's suggestion list. Mirrors
 * CertificateCard.vue's danger-status precedent: an expired certificate marks itself with
 * `text-status-rejected-fg`, never recomputing expiry off `expiryDate` — the backend's `expired`
 * flag is the verdict.
 */
function certificate (overrides: Partial<ICertificate> = {}): ICertificate {
  return {
    id: 1,
    workerId: 1,
    workerName: 'Somchai',
    certType: 'Hot Work',
    issuedDate: '2026-01-01',
    expiryDate: '2027-01-01',
    filePath: null,
    expired: false,
    ...overrides
  }
}

describe('WorkerCertificateSuggestionOption', () => {
  setLocale('en')

  it('renders the worker name, cert type and expiry with no expired mark for a valid certificate', () => {
    const wrapper = mount(WorkerCertificateSuggestionOption, {
      global: { plugins: [i18n] },
      props: { certificate: certificate() }
    })

    expect(wrapper.text()).toContain('Somchai')
    expect(wrapper.text()).toContain('Hot Work')
    expect(wrapper.text()).toContain('2027-01-01')
    expect(wrapper.text()).not.toContain('Expired')
    expect(wrapper.find('.text-status-rejected-fg').exists()).toBe(false)
  })

  it('visibly marks an expired certificate, using the CertificateCard danger-status class', () => {
    const wrapper = mount(WorkerCertificateSuggestionOption, {
      global: { plugins: [i18n] },
      props: { certificate: certificate({ workerName: 'Malee', expired: true, expiryDate: '2025-01-01' }) }
    })

    expect(wrapper.text()).toContain('Malee')
    expect(wrapper.text()).toContain('Expired')
    expect(wrapper.find('.text-status-rejected-fg').exists()).toBe(true)
  })

  /**
   * wayfinder ticket 048. Volt's AutoComplete option carries `whitespace-nowrap overflow-hidden`
   * and that inherits, so a long name used to be clipped mid-word with no ellipsis. The name is
   * the field being searched and must never be the half that is cut: it opts back out of nowrap
   * and wraps, and the `certType · expiry` line is the one allowed to ellipsize.
   */
  it('lets a long worker name wrap instead of inheriting the overlay row\'s hard clip', () => {
    const wrapper = mount(WorkerCertificateSuggestionOption, {
      global: { plugins: [i18n] },
      props: { certificate: certificate({ workerName: 'Kittipong Rattanaporn-Suwannachai' }) }
    })

    const name = wrapper.findAll('span')[0]
    expect(name.text()).toBe('Kittipong Rattanaporn-Suwannachai')
    expect(name.classes()).toContain('whitespace-normal')
    expect(name.classes()).toContain('break-words')
    // The name must not be the element that truncates — that is the metadata line's job.
    expect(name.classes()).not.toContain('truncate')
    expect(wrapper.findAll('span')[1].classes()).toContain('truncate')
    // The row itself may shrink below its content so `truncate` has something to act on.
    expect(wrapper.find('div').classes()).toContain('min-w-0')
  })
})
