import { ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import { handleLoading } from '@/utils/HandleLoading'
import type { IAllStockFilter } from '@/models/modules/report/all-stock/Filter.model'
import type { ISummaryStockList } from '@/models/response/report/summary-stock/SummaryStockRes.model'
import type { ISummaryStockProvider } from '@/resources/provider/report/SummaryStock.provider'
import SummaryStockProvider from '@/resources/provider/report/SummaryStock.provider'
import { type IUsePagination, useLocalPagination } from '@/composables/usePagination'

interface IUseList extends IUsePagination {
  filters: Ref<IAllStockFilter>
  items: Ref<ISummaryStockList[]>
  fetch(): void
  onSearch(): void
  onClearFilters(): void
  onPrint(): void
}

export default function useList (): IUseList {
  const router = useRouter()

  const SummaryStockService: ISummaryStockProvider = new SummaryStockProvider()
  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery, reset, resetPagination, displayItems, updateItems }
    = useLocalPagination<ISummaryStockList>()

  const filters = ref<IAllStockFilter>({})

  async function useFetch (): Promise<void> {
    const res = await SummaryStockService.getSummaryStock()
    updateItems(res.data ?? [])
    syncQuery()
  }

  function onSearch (): void {
    resetPagination()
    fetch()
  }

  function fetch (): void {
    handleLoading(useFetch)
  }

  function onClearFilters (): void {
    filters.value = {}
    reset()
  }

  function onPrint (): void {
    router.push({ name: 'AllStockPrintPage' })
  }

  return {
    filters,
    items: displayItems,
    pagination,
    sortBy,
    sortOrder,
    search,
    fetch,
    onSearch,
    onClearFilters,
    extractPagination,
    syncQuery,
    reset,
    resetPagination,
    onPrint
  }
}
