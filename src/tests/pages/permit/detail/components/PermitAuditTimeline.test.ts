import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import i18n, { setLocale } from '@/plugins/I18n.plugin'
import PermitAuditTimeline from '@/pages/permit/pages/detail/components/PermitAuditTimeline.vue'
import type { IPermitAuditEntry } from '@/models/modules/permit/Permit.model'

/**
 * 2026-09-12 owner-filed issue 1 — every `AuditLog.action` value `smart-work-permit-api`'s permit
 * module actually writes via `writeAuditLog` (confirmed by grepping its command/lib call sites)
 * must resolve to a human label, not fall back to the raw enum string. `DEMO_LOGIN` is included —
 * a retired feature (wayfinder 042), but the audit log is append-only, so an old row can still
 * carry it. `USER_CREATED`/`USER_UPDATED`/`USER_DEACTIVATED`/`USER_REACTIVATED` are deliberately
 * NOT in this list — those are user-scoped rows (`permitId: null`) from a different API module,
 * and `PermitAuditService.execute` filters `findMany({ where: { permitId } })`, so they can never
 * reach this component in the first place.
 */
const PERMIT_SCOPED_ACTIONS = [
  'PERMIT_SUBMITTED', 'PERMIT_APPROVED', 'PERMIT_REJECTED', 'PERMIT_WITHDRAWN_FOR_EDIT',
  'PERMIT_MARKED_COMPLETE', 'PERMIT_CLOSED', 'PERMIT_CLOSE_REQUESTED', 'PERMIT_EXPIRED',
  'ENTRANT_CHECKED_IN', 'ENTRANT_CHECKED_OUT', 'GAS_LOG_RECORDED', 'CERT_BLOCKED',
  'WORKER_MARKED_NOT_AVAILABLE', 'DEMO_LOGIN'
]

function buildEntry (action: string, id: number): IPermitAuditEntry {
  return {
    id,
    permitId: 'WP-HOT-20260810-001',
    actorId: 'u-1',
    actor: { id: 'u-1', email: 'jp@example.com', firstName: 'Pornchai', lastName: 'S.' },
    action,
    hash: `hash-${id}`,
    prevHash: null,
    createdAt: '2026-08-10T02:00:00.000Z'
  }
}

describe('PermitAuditTimeline — action label coverage (2026-09-12 owner-filed issue 1)', () => {
  it.each(['en', 'th'] as const)('renders a human label, never the raw enum, for every permit-scoped action (%s)', (locale: 'en' | 'th') => {
    setLocale(locale)
    const entries = PERMIT_SCOPED_ACTIONS.map((action: string, index: number): IPermitAuditEntry => buildEntry(action, index + 1))

    const wrapper = mount(PermitAuditTimeline, {
      props: { entries },
      global: { plugins: [i18n] }
    })

    for (const action of PERMIT_SCOPED_ACTIONS) {
      // The raw enum string must never appear as a rendered label — every one of these keys
      // resolves through `te()`/`t()` in the component under test.
      expect(wrapper.text()).not.toContain(action)
    }
    expect(wrapper.findAll('ol li')).toHaveLength(PERMIT_SCOPED_ACTIONS.length)
    setLocale('th')
  })

  it('falls back to the raw enum for a code with no label (belt-and-suspenders on an unknown future action)', () => {
    setLocale('en')
    const wrapper = mount(PermitAuditTimeline, {
      props: { entries: [buildEntry('SOME_FUTURE_ACTION', 1)] },
      global: { plugins: [i18n] }
    })

    expect(wrapper.text()).toContain('SOME_FUTURE_ACTION')
  })
})
