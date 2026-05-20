import { computed, ref, type Ref } from 'vue'
import { handleLoading } from '@/utils/HandleLoading'
import type { IGetReceiptList } from '@/models/request/receipt/ReceiptReq.model'
import type { IReceiptList } from '@/models/response/receipt/ReceiptRes.model'
import ReceiptProvider, { type IReceiptProvider } from '@/resources/provider/receipt/Receipt.provider'
import usePagination, { type IUsePagination } from '@/composables/usePagination'

interface IUseList extends IUsePagination {
  filters: Ref<IGetReceiptList>
  items: Ref<IReceiptList[]>
  fetch(): void
  onSearch(): void
  onClearFilters(): void
}

export default function useList (): IUseList {
  const receiptService: IReceiptProvider = new ReceiptProvider()

  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery, reset, resetPagination } = usePagination()

  const items = ref<IReceiptList[]>([])
  const filters = ref<IGetReceiptList>({})

  const paginateQuery = computed((): IGetReceiptList => ({
    search: search.value,
    page: pagination.value.page,
    limit: pagination.value.limit,
    sortBy: sortBy.value || undefined,
    sortOrder: sortOrder.value
  }))

  function onClearFilters (): void {
    reset()
  }

  async function useFetch (): Promise<void> {
    const response = await receiptService.getReceiptPaginate(paginateQuery.value)
    items.value = response?.data || []
    pagination.value = extractPagination(response)
    syncQuery({})
  }

  function onSearch (): void {
    resetPagination()
    fetch()
  }

  function fetch (): void {
    handleLoading(useFetch)
  }

  return {
    items,
    pagination,
    sortBy,
    sortOrder,
    search,
    filters,
    fetch,
    onSearch,
    resetPagination,
    onClearFilters,
    extractPagination,
    syncQuery,
    reset
  }
}
