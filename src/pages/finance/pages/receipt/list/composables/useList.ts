import { computed, ref, type Ref } from 'vue'
import { handleLoading } from '@/utils/HandleLoading'
import type { IGetReceiptList } from '@/models/request/receipt/ReceiptReq.model'
import type { IReceiptList } from '@/models/response/receipt/ReceiptRes.model'
import ReceiptProvider, { type IReceiptProvider } from '@/resources/provider/receipt/receipt.provider'
import usePagination, { type IUsePagination } from '@/composables/usePagination'

interface IUseList extends IUsePagination {
  filters: Ref<IGetReceiptList>
  items: Ref<IReceiptList[]>
  fetch(): void
  onClearFilters(): void
}

export default function useList (): IUseList {
  const receiptService: IReceiptProvider = new ReceiptProvider()

  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery, reset } = usePagination()

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
    const isNoApi = true
    if (isNoApi) {
      items.value = [
        {
          id: 0,
          contractId: 0,
          contractIdNo: 'RCPT-00001',
          receiptDate: '2022-04-23T18:25:43.511Z',
          customer: {
            id: 0,
            idCard: '',
            titleName: 'MR',
            firstName: 'จันทร์',
            lastName: 'พงษ์พัฒนโยธิน'
          },
          totalValue: 1200
        },
        {
          id: 1,
          contractId: 1,
          contractIdNo: 'RCPT-00002',
          receiptDate: '2022-04-23T18:25:43.511Z',
          customer: {
            id: 1,
            idCard: '',
            titleName: 'MRS',
            firstName: 'พันธนา',
            lastName: 'จิรวราภงษ์'
          },
          totalValue: 1200
        },
        {
          id: 2,
          contractId: 2,
          contractIdNo: 'RCPT-00003',
          receiptDate: '2022-04-23T18:25:43.511Z',
          customer: {
            id: 0,
            idCard: '',
            titleName: 'MS',
            firstName: 'โชติกา',
            lastName: 'ประชายศิริกุล'
          },
          totalValue: 1200
        }
      ]
    } else {
      const response = await receiptService.getReceiptPaginate(paginateQuery.value)
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
    filters,
    fetch,
    onClearFilters,
    extractPagination,
    syncQuery,
    reset
  }
}
