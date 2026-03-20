import { computed, ref, type Ref } from 'vue'
import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import usePagination, { type IUsePagination } from '@/composables/usePagination'
import type { IDailySummaryList } from '@/models/response/report/daily-summary/DailySummaryRes'
import type { IGetDailySummaryList } from '@/models/request/report/daily-summary/DailySummary.model'

interface IDailyInstallment extends IUsePagination {
  filters: Ref<IGetDailySummaryList>
  items: Ref<IDailySummaryList[]>
  fetch(): void
  onClearFilters(): void
  onDelete(id: number): void
}
export default function useList (): IDailyInstallment {
  // const DeilyInstallmentService: any = new Provider()

  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery } = usePagination()

  const filters = ref<IGetDailySummaryList>({})
  const items = ref<IDailySummaryList[]>([])

  const paginateQuery = computed((): any => {
    const normalizedFilters = normalizeFilters(filters.value)
    return {
      search: search.value,
      page: pagination.value.page,
      limit: pagination.value.limit,
      sortBy: sortBy.value || undefined,
      sortOrder: sortOrder.value,
      ...normalizedFilters
    }
  })

  async function useFetch (): Promise<void> {
    console.log('paginateQuery', paginateQuery)
    // const response = await DeilyInstallmentService.getDeilyInstallmentPaginate(paginateQuery.value)
    // items.value = response?.data || []
    // pagination.value = extractPagination(response)
    // syncQuery({ ...normalizeFilters(filters.value) })
  }

  async function useDelete (id: number): Promise<void> {
    console.log(id)
    // await DeilyInstallmentService.deleteDeilyInstallment(id)
    fetch()
    toast.success('ลบลูกค้าสําเร็จ')
  }

  function normalizeFilters (value: any): Partial<any> {
    return {
      ...value
    }
  }

  function fetch (): void {
    handleLoading(useFetch)
  }

  function onClearFilters (): void {}

  function onDelete (id: number): void {
    handleLoading((): Promise<void> => useDelete(id))
  }

  return {
    filters,
    items,
    pagination,
    sortBy,
    sortOrder,
    search,
    fetch,
    onClearFilters,
    onDelete,
    extractPagination,
    syncQuery
  }
}
