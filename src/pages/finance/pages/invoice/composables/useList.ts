import { computed, ref, type Ref } from 'vue'
import { handleLoading } from '@/utils/HandleLoading'
import type { IGetInvoiceList } from '@/models/request/invoice/InvoiceReq.model'
import type { IInvoiceList } from '@/models/response/invoice/InvoiceRes.model'
import InvoiceProvider, { type IInvoiceProvider } from '@/resources/provider/invoice/Invoice.provider'
import usePagination, { type IUsePagination } from '@/composables/usePagination'

interface IUseList extends IUsePagination {
  items: Ref<IInvoiceList[]>
  fetch(): void
}

export default function useList (): IUseList {
  const invoiceService: IInvoiceProvider = new InvoiceProvider()

  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery } = usePagination()

  const items = ref<IInvoiceList[]>([])

  const paginateQuery = computed((): IGetInvoiceList => ({
    search: search.value,
    page: pagination.value.page,
    limit: pagination.value.limit,
    sortBy: sortBy.value || undefined,
    sortOrder: sortOrder.value
  }))

  async function useFetch (): Promise<void> {
    const isNoApi = true
    if (isNoApi) {
      items.value = [
        {
          id: 1,
          contractId: 1,
          invoiceNo: 'INV-00001',
          contractNo: 'LC-00001',
          invoiceDate: '2012-04-23T18:25:43.511Z',
          customer: null,
          totalValue: 6300
        },
        {
          id: 2,
          contractId: 3,
          invoiceNo: 'INV-00002',
          contractNo: 'LC-00002',
          invoiceDate: '2012-04-23T18:25:43.511Z',
          customer: null,
          totalValue: 11300
        },
        {
          id: 3,
          contractId: 3,
          invoiceNo: 'INV-00003',
          contractNo: 'LC-00003',
          invoiceDate: '2012-04-23T18:25:43.511Z',
          customer: null,
          totalValue: 3000
        }
      ]
    } else {
      const response = await invoiceService.getInvoicePaginate(paginateQuery.value)
      items.value = response?.data || []
      pagination.value = extractPagination(response)
      syncQuery({})
    }
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
    extractPagination,
    syncQuery
  }
}
