import type { RouteRecordRaw } from 'vue-router'

/**
 * wayfinder 110 — "History" was cut from the drawer; it duplicated Permits, and its content
 * (search/type/status/date filters, the table, CSV export, the row drawer) is now the "History"
 * view mode on `PermitListPage` (`src/pages/permit/pages/list/composables/useHistory.ts` +
 * `components/PermitHistoryView.vue`). `/history` stays registered as a redirect rather than being
 * deleted outright — a bookmark or an external link to it must land somewhere, not 404 — and
 * `?view=history` is the one query param `PermitListPage` reads to open on that tab.
 */
const prefix = '/history'

export default {
  path: prefix,
  redirect: { name: 'PermitListPage', query: { view: 'history' } }
} as RouteRecordRaw
