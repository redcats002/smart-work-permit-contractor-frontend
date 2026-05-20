import { computed, ref, type Ref } from 'vue'
import { handleLoading } from '@/utils/HandleLoading'
import type { IPercentInstallmentFilter } from '@/models/modules/report/percent-installment/Filter.model'
import type { IGetPercentInstallmentList } from '@/models/request/report/percent-installment/PercentInstallmentReq.model'
import type {
  IPercentInstallmentList,
  IPercentInstallmentSummary
} from '@/models/response/report/percent-installment/PercentInstallmentRes.model'
import PercentInstallmentPaymentProvider, {
  type IPercentInstallmentPaymentProvider
} from '@/resources/provider/report/PercentInstallmentPayment.provider'
import usePagination, { type IUsePagination } from '@/composables/usePagination'

interface IUseList extends IUsePagination {
  filters: Ref<IPercentInstallmentFilter>
  items: Ref<IPercentInstallmentList[]>
  summary: Ref<IPercentInstallmentSummary>
  fetch(): void
  onSearch(): void
  onClearFilters(): void
}
export default function useList (): IUseList {
  const PercentInstallmentPaymentService: IPercentInstallmentPaymentProvider = new PercentInstallmentPaymentProvider()

  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery, reset, resetPagination } = usePagination()

  const filters = ref<IPercentInstallmentFilter>({})
  const items = ref<IPercentInstallmentList[]>([])
  const summary = ref<IPercentInstallmentSummary>({
    monthlyInstallment: 0,
    amountPaid: 0,
    salePrice: 0,
    totalPenaltyFee: 0,
    totalCollectionFee: 0,
    summary: 0,
    percent: 0
  })

  const paginateQuery = computed((): IGetPercentInstallmentList => {
    const normalizedFilters = normalizeFilters(filters.value)
    return {
      search: search.value || undefined,
      page: pagination.value.page,
      limit: pagination.value.limit,
      sortBy: sortBy.value || undefined,
      sortOrder: sortOrder.value,
      ...normalizedFilters
    }
  })

  async function useFetch (): Promise<void> {
    const response = await PercentInstallmentPaymentService.getPercentInstallmentPaymentPaginate(paginateQuery.value)
    items.value = response?.data || []
    pagination.value = extractPagination(response)
    summary.value = {
      monthlyInstallment: response?.summary?.monthlyInstallment || 0,
      amountPaid: response?.summary?.amountPaid || 0,
      salePrice: response?.summary?.salePrice || 0,
      totalPenaltyFee: response?.summary?.totalPenaltyFee || 0,
      totalCollectionFee: response?.summary?.totalCollectionFee || 0,
      summary: response?.summary?.summary || 0,
      percent: response?.summary?.percent || 0
    }
    syncQuery({ ...normalizeFilters(filters.value) })
  }

  function normalizeFilters (
    value: IPercentInstallmentFilter
  ): Partial<IPercentInstallmentFilter> {
    return {
      ...value
    }
  }

  function onSearch (): void {
    resetPagination()
    fetch()
  }

  function fetch (): void {
    handleLoading(useFetch)
  }

  function onClearFilters (): void {
    reset()
    filters.value = {}
  }

  return {
    filters,
    items,
    summary,
    pagination,
    sortBy,
    sortOrder,
    search,
    fetch,
    onSearch,
    resetPagination,
    onClearFilters,
    extractPagination,
    syncQuery,
    reset
  }
}
