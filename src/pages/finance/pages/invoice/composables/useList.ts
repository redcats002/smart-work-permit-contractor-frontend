import { computed, ref, type Ref } from 'vue'
import { handleLoading } from '@/utils/HandleLoading'
import type { IGetInvoiceList } from '@/models/request/invoice/InvoiceReq.model'
import type { IInvoiceList } from '@/models/response/invoice/InvoiceRes.model'
import InvoiceProvider, { type IInvoiceProvider } from '@/resources/provider/invoice/Invoice.provider'
import usePagination, { type IUsePagination } from '@/composables/usePagination'

interface IUseList extends IUsePagination {
  items: Ref<IInvoiceList[]>
  fetch(): void
  onSearch(): void
}

export default function useList (): IUseList {
  const invoiceService: IInvoiceProvider = new InvoiceProvider()

  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery, reset, resetPagination } = usePagination()

  const items = ref<IInvoiceList[]>([])

  const paginateQuery = computed((): IGetInvoiceList => ({
    search: search.value,
    page: pagination.value.page,
    limit: pagination.value.limit,
    sortBy: sortBy.value || undefined,
    sortOrder: sortOrder.value
  }))

  async function useFetch (): Promise<void> {
    const response = await invoiceService.getInvoicePaginate(paginateQuery.value)
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
    fetch,
    onSearch,
    resetPagination,
    extractPagination,
    syncQuery,
    reset
  }
}
