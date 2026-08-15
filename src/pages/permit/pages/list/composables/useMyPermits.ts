import type { ComputedRef, Ref } from 'vue'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
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
  pagination: IUsePagination['pagination']
  isEmpty: ComputedRef<boolean>
  setFilter (value: TPermitListFilter): void
  fetchPermits (): Promise<void>
}

export function useMyPermits (): IUseMyPermits {
  const { t } = useI18n()
  const { pagination } = usePagination({ inheritQuery: false })
  // The design shows the full filtered set with no visible pager on this screen
  // (SmartWorkPermit-v3.dc.html lines 109-143) — a generous page size stands in
  // for paginator UI the design doesn't have, while still driving the API query.
  pagination.value.limit = 50

  const items = ref<IPermitListItem[]>([]) as Ref<IPermitListItem[]>
  const loading = ref(false)
  const filter = ref<TPermitListFilter>('all')

  const isEmpty: ComputedRef<boolean> = computed((): boolean => !loading.value && items.value.length === 0)

  async function useFetchPermits (): Promise<void> {
    const response = await PermitService.list({
      page: pagination.value.page,
      limit: pagination.value.limit,
      status: FILTER_STATUS_MAP[filter.value]
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

  return {
    items,
    loading,
    filter,
    pagination,
    isEmpty,
    setFilter,
    fetchPermits
  }
}

export default useMyPermits
