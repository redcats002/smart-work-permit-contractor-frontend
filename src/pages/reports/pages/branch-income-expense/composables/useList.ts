import { computed, ref, type Ref } from 'vue'
import { handleLoading } from '@/utils/HandleLoading'
import { ReportTypeEnum, REPORT_TYPE_COL1_TYPES, REPORT_TYPE_COL2_TYPES } from '@/enums/modules/report/branch-income-expense/ReportType.enum'
import type { IBranchIncomeExpenseFilter } from '@/models/modules/report/branch-income-expense/Filter.model'
import type { IGetBranchIncomeExpenseList } from '@/models/request/report/branch-income-expense/BranchIncomeExpenseReq.model'
import type { IBranchIncomeExpenseCodeSummary, IBranchIncomeExpenseItem } from '@/models/response/report/branch-income-expense/BranchIncomeExpenseRes.model'
import BranchIncomeExpenseProvider from '@/resources/provider/report/BranchIncomeExpense.provider'
import usePagination, { type IUsePagination } from '@/composables/usePagination'

interface IUseList extends IUsePagination {
  filters: Ref<IBranchIncomeExpenseFilter>
  items: Ref<IBranchIncomeExpenseItem[]>
  filteredItems: Ref<IBranchIncomeExpenseItem[]>
  summary: Ref<IBranchIncomeExpenseCodeSummary>
  fetch(): void
  onSearch(): void
  onClearFilters(): void
}

export default function useList (): IUseList {
  const BranchIncomeExpenseService = new BranchIncomeExpenseProvider()

  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery, reset, resetPagination } = usePagination()

  const filters = ref<IBranchIncomeExpenseFilter>({
    filter: ReportTypeEnum.RECEIVE_REFUND,
    financeCategory: 'OVERALL'
  })

  const items = ref<IBranchIncomeExpenseItem[]>([])
  const summary = ref<IBranchIncomeExpenseCodeSummary>({
    code101: 0,
    code102: 0,
    code103: 0,
    code104: 0,
    code105: 0,
    code106: 0,
    total: 0
  })

  const filteredItems = computed((): IBranchIncomeExpenseItem[] => {
    const cat = filters.value.financeCategory
    const rt = filters.value.filter || ReportTypeEnum.RECEIVE_REFUND
    if (!cat || cat === 'OVERALL') return items.value
    const types = cat === 'COL1' ? REPORT_TYPE_COL1_TYPES[rt] : REPORT_TYPE_COL2_TYPES[rt]
    return items.value.filter((i: IBranchIncomeExpenseItem): boolean => types.includes(i.type))
  })

  const paginateQuery = computed((): IGetBranchIncomeExpenseList => ({
    sortBy: sortBy.value || undefined,
    sortOrder: sortOrder.value,
    filter: filters.value.filter
  }))

  async function useFetch (): Promise<void> {
    const response = await BranchIncomeExpenseService.getBranchIncomeExpensePaginate(paginateQuery.value)
    items.value = response?.data || []
    pagination.value = extractPagination(response)
    summary.value = response?.summary || {
      code101: 0,
      code102: 0,
      code103: 0,
      code104: 0,
      code105: 0,
      code106: 0,
      total: 0
    }
    syncQuery({ filter: filters.value.filter })
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
    filters.value = {
      filter: ReportTypeEnum.RECEIVE_REFUND,
      financeCategory: 'OVERALL'
    }
  }

  return {
    filters,
    items,
    filteredItems,
    pagination,
    sortBy,
    sortOrder,
    search,
    summary,
    fetch,
    onSearch,
    resetPagination,
    onClearFilters,
    extractPagination,
    syncQuery,
    reset
  }
}
