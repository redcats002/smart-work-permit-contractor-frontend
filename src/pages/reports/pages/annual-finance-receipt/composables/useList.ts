import { computed, ref, type Ref } from 'vue'
import { useDayjs } from '@/utils/Dayjs'
import { handleLoading } from '@/utils/HandleLoading'
import type { IAnnualFinanceReceiptFilter } from '@/models/modules/report/annual-finance-receipt/Filter.model'
import type { IGetAnnualFinanceReceiptList } from '@/models/request/report/annual-finance-receipt/AnnualFinanceReceiptReq.model'
import type { IAnnualFinanceReceiptList, IAnnualFinanceReceiptSummary, IMonthData } from '@/models/response/report/annual-finance-receipt/AnnualFinanceReceiptRes.model'
import AnnualFinanceReceiptProvider, { type IAnnualFinanceReceiptProvider } from '@/resources/provider/report/AnnualFinanceReceipt.provider'
import usePagination, { type IUsePagination } from '@/composables/usePagination'

interface IUseList extends IUsePagination {
  filters: Ref<IAnnualFinanceReceiptFilter>
  items: Ref<IAnnualFinanceReceiptList[]>
  summary: Ref<IAnnualFinanceReceiptSummary>
  fetch(): void
  onClearFilters(): void
}

export default function useList (): IUseList {
  const AnnualFinanceReceiptService: IAnnualFinanceReceiptProvider = new AnnualFinanceReceiptProvider()

  const dayjs = useDayjs()

  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery, reset } = usePagination()

  const filters = ref<IAnnualFinanceReceiptFilter>({})
  const items = ref<IAnnualFinanceReceiptList[]>([])
  const summary = ref<IAnnualFinanceReceiptSummary>(initSummary())

  const paginateQuery = computed((): IGetAnnualFinanceReceiptList => {
    const normalizedFilters = normalizeFilters(filters.value)
    return {
      page: pagination.value.page,
      limit: pagination.value.limit,
      sortBy: sortBy.value || undefined,
      sortOrder: sortOrder.value,
      ...normalizedFilters
    }
  })

  async function useFetch (): Promise<void> {
    const response = await AnnualFinanceReceiptService.getAnnualFinanceReceiptPaginate(paginateQuery.value)
    items.value = response?.data || []
    pagination.value = extractPagination(response)
    summary.value = initSummary(response.summary)
    syncQuery({ ...normalizeFilters(filters.value) })
  }

  function normalizeFilters (value: IAnnualFinanceReceiptFilter): Partial<IGetAnnualFinanceReceiptList> {
    return {
      branchId: value.branchId,
      year: value?.year ? dayjs(value.year).format('YYYY') : undefined
    }
  }

  function initMonthData (data?: IMonthData): IMonthData {
    return {
      principalAndInterest: data?.principalAndInterest || 0,
      percent: data?.percent || 0
    }
  }

  function initSummary (data?: IAnnualFinanceReceiptSummary): IAnnualFinanceReceiptSummary {
    return {
      month1: initMonthData(data?.month1),
      month2: initMonthData(data?.month2),
      month3: initMonthData(data?.month3),
      month4: initMonthData(data?.month4),
      month5: initMonthData(data?.month5),
      month6: initMonthData(data?.month6),
      month7: initMonthData(data?.month7),
      month8: initMonthData(data?.month8),
      month9: initMonthData(data?.month9),
      month10: initMonthData(data?.month10),
      month11: initMonthData(data?.month11),
      month12: initMonthData(data?.month12),
      sumMonth: initMonthData(data?.sumMonth)
    }
  }

  function fetch (): void {
    handleLoading(useFetch)
  }

  function onClearFilters (): void {
    filters.value = {}
    reset()
  }

  return {
    filters,
    items,
    pagination,
    sortBy,
    sortOrder,
    search,
    summary,
    fetch,
    onClearFilters,
    extractPagination,
    syncQuery,
    reset
  }
}
