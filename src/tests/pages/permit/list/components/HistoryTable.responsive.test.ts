import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import i18n, { setLocale } from '@/plugins/I18n.plugin'
import HistoryTable from '@/pages/permit/pages/list/components/HistoryTable.vue'
import type { IPermitListItem } from '@/models/response/permit/PermitRes.model'

/**
 * wayfinder ticket 029 — "single-line rows" and "mobile responsive" pull against each other, so
 * this pins the deliberate choice made in HistoryTable.vue rather than leaving it to `overflow`:
 * a `hidden md:block` single-line grid table (every cell `truncate`s, never wraps) ABOVE the `md`
 * breakpoint, and a completely different `md:hidden` stacked-card layout below it — not the same
 * table left to scroll horizontally on a phone.
 */
function permit (): IPermitListItem {
  return {
    id: 'WP-HOT-20260810-001',
    type: 'hot',
    status: 'CLOSED',
    title: 'Warehouse repaint with an extremely long title that would otherwise wrap onto a second line',
    foreman: 'Somchai',
    location: 'Zone A, near the north dock, past the third gate',
    startDate: '2026-08-10T00:00:00.000Z',
    endDate: '2026-08-10T00:00:00.000Z',
    dailyStart: '1970-01-01T08:00:00.000Z',
    dailyEnd: '1970-01-01T17:00:00.000Z',
    scheduleNote: null,
    outdoorWork: false,
    createdById: 'u-1',
    createdBy: null,
    createdAt: '2026-08-10T01:00:00.000Z',
    updatedAt: '2026-08-10T01:00:00.000Z',
    submittedAt: null,
    approvedById: null,
    approvedBy: null,
    approvedAt: null,
    rejectedReason: null,
    rejectedAt: null,
    closedById: null,
    closedBy: null,
    closedAt: '2026-08-10T10:00:00.000Z',
    fireMonitorStartedAt: null,
    qrIssuedAt: null,
    entrantCount: 0,
    fireWatch: null,
    pinId: null,
    areaId: null
  }
}

describe('HistoryTable — deliberate desktop-table / mobile-card split', () => {
  it('renders one single-line grid table hidden below md, and one stacked-card list hidden at md and up', () => {
    setLocale('en')
    const wrapper = mount(HistoryTable, {
      props: { items: [permit()] },
      global: { plugins: [i18n] }
    })

    const desktop = wrapper.find('.hidden.md\\:block')
    const mobile = wrapper.find('[data-test="history-table-mobile"]')

    expect(desktop.exists()).toBe(true)
    expect(mobile.exists()).toBe(true)
    expect(mobile.classes()).toContain('md:hidden')

    // Every desktop cell truncates rather than wrapping — a row stays exactly one line tall.
    const desktopTitle = desktop.find('.text-text-primary')
    expect(desktopTitle.classes()).toContain('truncate')

    // The mobile card still carries the full title/location text (re-flowed, not scrolled away).
    expect(mobile.text()).toContain('Warehouse repaint')
    expect(mobile.text()).toContain('Zone A')
  })
})
