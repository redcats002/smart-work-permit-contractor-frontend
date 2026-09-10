import type { ComputedRef, Ref } from 'vue'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import { useDebounce } from '@/utils/Debounce'
import usePagination, { type IUsePagination } from '@/composables/usePagination'
import type { TPermitStatus } from '@/enums/modules/permit/PermitStatus.enum'
import type { IPermitListItem } from '@/models/response/permit/PermitRes.model'
import PermitProvider, { type IPermitProvider } from '@/resources/provider/permit/Permit.provider'

/** My Permits filter chips — see docs/modules/permit/context.md § My Permits. */
export type TPermitListFilter = 'all' | 'active' | 'pending' | 'closed'

export const PERMIT_LIST_FILTERS: TPermitListFilter[] = ['all', 'active', 'pending', 'closed']

/**
 * Maps each filter chip to the status set the API query should ask for.
 * "Active" covers ACTIVE + FIRE_MONITOR and "Closed" covers CLOSED + REJECTED,
 * mirroring the design's own cFilter grouping (SmartWorkPermit-v3.dc.html ~line 1836).
 *
 * wayfinder 110 — feat-009 added array support to `GET /permits`'s `status` param (repeated
 * `?status=A&status=B`, see docs/api/openapi.json). A grouped chip now sends its whole array and
 * the server filters AND paginates on it, so `count`/`totalPage` describe the group correctly.
 * The previous approach (fetch unfiltered, narrow the page client-side) predates feat-009 and,
 * once this page gained a real pager, would render a short last page — the same truncation defect
 * class `AreaPicker`'s `limit: 9999` note warns about, just from the other direction.
 */
const FILTER_STATUS_MAP: Record<TPermitListFilter, TPermitStatus[] | undefined> = {
  all: undefined,
  active: ['ACTIVE', 'FIRE_MONITOR'],
  pending: ['PENDING'],
  closed: ['CLOSED', 'REJECTED']
}

const PermitService: IPermitProvider = new PermitProvider()

export interface IUseMyPermits {
  items: Ref<IPermitListItem[]>
  loading: Ref<boolean>
  filter: Ref<TPermitListFilter>
  search: Ref<string>
  pagination: IUsePagination['pagination']
  isEmpty: ComputedRef<boolean>
  setFilter (value: TPermitListFilter): void
  fetchPermits (): Promise<void>
}

export function useMyPermits (): IUseMyPermits {
  const { t } = useI18n()
  const { search, pagination } = usePagination({ inheritQuery: false })

  const items = ref<IPermitListItem[]>([]) as Ref<IPermitListItem[]>
  const loading = ref(false)
  const filter = ref<TPermitListFilter>('all')

  const isEmpty: ComputedRef<boolean> = computed((): boolean => !loading.value && items.value.length === 0)

  async function useFetchPermits (): Promise<void> {
    const wanted = FILTER_STATUS_MAP[filter.value]
    const response = await PermitService.list({
      page: pagination.value.page,
      limit: pagination.value.limit,
      search: search.value.trim() || undefined,
      status: wanted
    })
    items.value = response.data
    pagination.value.count = response.count
    pagination.value.totalPage = response.totalPage
  }

  async function fetchPermits (): Promise<void> {
    await handleLoading(useFetchPermits, { loadingUnit: loading }, (): void => {
      toast.error(t('permit.list.error.loadFailed'))
    })
  }

  function setFilter (value: TPermitListFilter): void {
    if (filter.value === value) return
    filter.value = value
    pagination.value.page = 1
    void fetchPermits()
  }

  const debouncedFetch = useDebounce((): void => {
    pagination.value.page = 1
    void fetchPermits()
  }, 400)

  watch(search, (): void => {
    debouncedFetch()
  })

  return {
    items,
    loading,
    filter,
    search,
    pagination,
    isEmpty,
    setFilter,
    fetchPermits
  }
}

export default useMyPermits
