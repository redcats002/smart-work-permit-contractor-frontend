import type { ComputedRef, Ref } from 'vue'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { dayjs } from '@/plugins/dayjs.plugin'
import i18n from '@/plugins/I18n.plugin'
import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import { useDebounce } from '@/utils/Debounce'
import { downloadCsv, toCsv } from '@/utils/Csv'
import usePagination, { type IUsePagination } from '@/composables/usePagination'
import { useApiError } from '@/composables/useApiError'
import type { TPermitStatus } from '@/enums/modules/permit/PermitStatus.enum'
import type { TPermitType } from '@/enums/modules/permit/PermitType.enum'
import type { IGetPermitListQuery } from '@/models/request/permit/PermitReq.model'
import type { IPermitDetail, IPermitListItem } from '@/models/response/permit/PermitRes.model'
import PermitProvider, { type IPermitProvider } from '@/resources/provider/permit/Permit.provider'

/** History only ever shows these two terminal statuses — see docs/modules/history/context.md. */
export type THistoryStatus = 'CLOSED' | 'EXPIRED'
export type THistoryStatusFilter = 'all' | THistoryStatus
export type THistoryTypeFilter = 'all' | TPermitType

const ARCHIVE_STATUSES: TPermitStatus[] = ['CLOSED', 'EXPIRED']

const PermitService: IPermitProvider = new PermitProvider()

/** Row/type/status color tokens shared by the table and the detail drawer. */
export const TYPE_BORDER_CLASS: Record<TPermitType, string> = {
  hot: 'border-l-permit-type-hot-fg',
  confined: 'border-l-permit-type-confined-fg',
  heights: 'border-l-permit-type-heights-fg'
}

export const TYPE_CHIP_CLASS: Record<TPermitType, { bg: string, fg: string }> = {
  hot: { bg: 'bg-permit-type-hot-bg', fg: 'text-permit-type-hot-fg' },
  confined: { bg: 'bg-permit-type-confined-bg', fg: 'text-permit-type-confined-fg' },
  heights: { bg: 'bg-permit-type-heights-bg', fg: 'text-permit-type-heights-fg' }
}

export const STATUS_CHIP_CLASS: Record<THistoryStatus, { bg: string, fg: string }> = {
  CLOSED: { bg: 'bg-status-closed-bg', fg: 'text-status-closed-fg' },
  EXPIRED: { bg: 'bg-status-expired-bg', fg: 'text-status-expired-fg' }
}

/**
 * wayfinder 067/082 — `dailyStart`/`dailyEnd` are `1970-01-01`-anchored ISO datetimes, not
 * `HH:mm` strings (the previous `start.split(':')` parse always produced `NaN`, rendering the
 * literal string `"NaNh NaNm"`). Reads local wall-clock hours/minutes the same way
 * `PermitCard.vue`'s `clock()` does — never `getUTCHours`/`getUTCMinutes` (see the "067 UTC trap"
 * comment on `IPermitBase`).
 */
function clockMinutes (iso: string): number {
  const parsed = new Date(iso)
  return parsed.getHours() * 60 + parsed.getMinutes()
}

/**
 * `dailyStart`/`dailyEnd`-to-`dailyStart`/`dailyEnd` per-day duration, formatted `"6h"` /
 * `"6h 30m"`. Handles an overnight wrap. A permit's window now repeats daily between `startDate`
 * and `endDate` (wayfinder 067) — when the two dates differ, the day count rides along
 * (`"6h 30m/day · 5 day(s)"`) so a multi-day permit is never understated to its per-day figure.
 */
export function formatDuration (dailyStart: string, dailyEnd: string, startDate: string, endDate: string): string {
  let minutes = clockMinutes(dailyEnd) - clockMinutes(dailyStart)
  if (minutes < 0) minutes += 24 * 60
  const hours = Math.floor(minutes / 60)
  const remainder = minutes % 60
  const perDay = remainder === 0 ? `${hours}h` : `${hours}h ${remainder}m`

  if (startDate === endDate) return perDay

  const days = dayjs(endDate).diff(dayjs(startDate), 'day') + 1
  return i18n.global.t('history.duration.perDay', { duration: perDay, count: days })
}

export interface IUseHistory {
  items: Ref<IPermitListItem[]>
  loading: Ref<boolean>
  exporting: Ref<boolean>
  search: Ref<string>
  typeFilter: Ref<THistoryTypeFilter>
  statusFilter: Ref<THistoryStatusFilter>
  dateFrom: Ref<Date | null>
  dateTo: Ref<Date | null>
  pagination: IUsePagination['pagination']
  isEmpty: ComputedRef<boolean>
  drawerOpen: Ref<boolean>
  detailLoading: Ref<boolean>
  selectedDetail: Ref<IPermitDetail | null>
  fetchHistory (): Promise<void>
  onFilterChange (): void
  onPageChange (): void
  clearFilters (): void
  openDetail (id: string): Promise<void>
  closeDetail (): void
  exportCsv (): Promise<void>
}

export function useHistory (): IUseHistory {
  const { t } = useI18n()
  const { mapError } = useApiError()
  const { pagination } = usePagination({ inheritQuery: false })

  const items = ref<IPermitListItem[]>([]) as Ref<IPermitListItem[]>
  const loading = ref(false)
  const exporting = ref(false)

  const search = ref('')
  const typeFilter = ref<THistoryTypeFilter>('all')
  const statusFilter = ref<THistoryStatusFilter>('all')
  const dateFrom = ref<Date | null>(null)
  const dateTo = ref<Date | null>(null)

  const drawerOpen = ref(false)
  const detailLoading = ref(false)
  const selectedDetail = ref<IPermitDetail | null>(null) as Ref<IPermitDetail | null>

  const isEmpty: ComputedRef<boolean> = computed((): boolean => !loading.value && items.value.length === 0)

  function buildQuery (overrides: Partial<IGetPermitListQuery> = {}): IGetPermitListQuery {
    return {
      page: pagination.value.page,
      limit: pagination.value.limit,
      search: search.value.trim() || undefined,
      type: typeFilter.value === 'all' ? undefined : typeFilter.value,
      // One status per request — see the note in useMyPermits. "All" fetches unfiltered and the
      // archive set is applied client-side below.
      status: statusFilter.value === 'all' ? undefined : statusFilter.value,
      dateFrom: dateFrom.value ? dayjs(dateFrom.value).format('YYYY-MM-DD') : undefined,
      dateTo: dateTo.value ? dayjs(dateTo.value).format('YYYY-MM-DD') : undefined,
      ...overrides
    }
  }

  /**
   * The archive narrowing the table applies, in one place.
   *
   * `GET /permits` takes a single `status` (GAPS.md row B), so "All" fetches unfiltered and the
   * two archive statuses are selected client-side. Every consumer of a history query MUST run its
   * rows through this — the CSV export used to skip it, which shipped the user rows the table had
   * deliberately hidden (PRE-RUN-FINDINGS.md finding 5 / CT-HISTORY-009 step 5).
   */
  function narrowToArchive (rows: IPermitListItem[]): IPermitListItem[] {
    if (statusFilter.value !== 'all') return rows
    return rows.filter((permit: IPermitListItem): boolean => ARCHIVE_STATUSES.includes(permit.status))
  }

  async function useFetchHistory (): Promise<void> {
    const response = await PermitService.list(buildQuery())
    items.value = narrowToArchive(response.data)
    pagination.value.count = response.count
    pagination.value.totalPage = response.totalPage
  }

  async function fetchHistory (): Promise<void> {
    await handleLoading(useFetchHistory, { loadingUnit: loading }, (error: unknown): void => {
      toast.error(mapError(error).message)
    })
  }

  const debouncedFetch = useDebounce((): void => {
    pagination.value.page = 1
    void fetchHistory()
  }, 400)

  // Search drives the API query too (docs/modules/history/context.md), just debounced
  // so every keystroke doesn't fire a request.
  watch(search, (): void => {
    debouncedFetch()
  })

  function onFilterChange (): void {
    pagination.value.page = 1
    void fetchHistory()
  }

  function onPageChange (): void {
    void fetchHistory()
  }

  function clearFilters (): void {
    search.value = ''
    typeFilter.value = 'all'
    statusFilter.value = 'all'
    dateFrom.value = null
    dateTo.value = null
    // Setting `search` above schedules a debounced re-fetch via the watcher; cancel it
    // so the explicit fetch below is the only one that runs.
    debouncedFetch.cancel()
    pagination.value.page = 1
    void fetchHistory()
  }

  async function openDetail (id: string): Promise<void> {
    drawerOpen.value = true
    detailLoading.value = true
    try {
      const response = await PermitService.detail(id)
      selectedDetail.value = response.data
    } catch (error) {
      toast.error(mapError(error).message)
      drawerOpen.value = false
    } finally {
      detailLoading.value = false
    }
  }

  function closeDetail (): void {
    drawerOpen.value = false
    selectedDetail.value = null
  }

  /**
   * Exports every row matching the active search + filters, not just the current page — and
   * narrowed to the same archive set the table shows, so the file can never contain a row the
   * user could not see.
   */
  async function exportCsv (): Promise<void> {
    exporting.value = true
    try {
      const response = await PermitService.list(buildQuery({ page: 1, limit: 9999 }))
      const header = [
        t('history.table.columns.id'),
        t('history.table.columns.type'),
        t('history.table.columns.titleLocation'),
        t('history.table.columns.closed'),
        t('history.table.columns.duration'),
        t('history.table.columns.status')
      ]
      const rows = narrowToArchive(response.data).map((permit: IPermitListItem): string[] => [
        permit.id,
        t(`history.type.${permit.type}`),
        `${permit.title} · ${permit.location ?? ''}`,
        permit.closedAt ? dayjs(permit.closedAt).tz('Asia/Bangkok').format('DD/MM/YYYY HH:mm') : '-',
        formatDuration(permit.dailyStart, permit.dailyEnd, permit.startDate, permit.endDate),
        t(`history.status.${permit.status}`)
      ])
      const csv = toCsv([header, ...rows])
      downloadCsv(`history-${dayjs().tz('Asia/Bangkok').format('YYYYMMDD-HHmmss')}.csv`, csv)
    } catch (error) {
      toast.error(mapError(error).message)
    } finally {
      exporting.value = false
    }
  }

  return {
    items,
    loading,
    exporting,
    search,
    typeFilter,
    statusFilter,
    dateFrom,
    dateTo,
    pagination,
    isEmpty,
    drawerOpen,
    detailLoading,
    selectedDetail,
    fetchHistory,
    onFilterChange,
    onPageChange,
    clearFilters,
    openDetail,
    closeDetail,
    exportCsv
  }
}

export default useHistory
