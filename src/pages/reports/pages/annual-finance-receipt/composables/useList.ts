import { computed, ref, type Ref } from 'vue'
import { useRoute } from 'vue-router'
import { useDayjs } from '@/utils/Dayjs'
import { handleLoading } from '@/utils/HandleLoading'
import type { IAnnualFinanceReceiptFilter } from '@/models/modules/report/annual-finance-receipt/Filter.model'
import type { IGetAnnualFinanceReceiptList } from '@/models/request/report/annual-finance-receipt/AnnualFinanceReceiptReq.model'
import type { IAnnualFinanceReceiptList, IAnnualFinanceReceiptSummary } from '@/models/response/report/annual-finance-receipt/AnnualFinanceReceiptRes.model'
import type { TAnnualFinanceReceiptType } from '@/enums/modules/report/annual-finance-receipt/AnnualFinanceReceipt.enum'
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
  type TMonth = 'january' | 'february' | 'march' | 'april' | 'may' | 'june' | 'july' | 'august' | 'september' | 'october' | 'november' | 'december'

  const dayjs = useDayjs()
  const route = useRoute()

  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery, reset } = usePagination()

  const filters = ref<IAnnualFinanceReceiptFilter>({
    type: route?.query.type as TAnnualFinanceReceiptType || 'ALL',
    year: route?.query.year ? String(route.query.year) : undefined
  })
  const items = ref<IAnnualFinanceReceiptList[]>([])
  const summary = ref<IAnnualFinanceReceiptSummary>(initSummary())
  // mock
  const mockResponse: IAnnualFinanceReceiptList[] = [
    {
      id: 1,
      idNo: 'AFR-000001',
      branch: {
        id: 101,
        idNo: 'BR-001',
        name: 'สาขาเมืองขอนแก่น',
        status: 'ACTIVE'
      },
      january: { amount: 125000, percent: 8.5 },
      february: { amount: 118000, percent: 8.1 },
      march: { amount: 142000, percent: 9.7 },
      april: { amount: 135000, percent: 9.2 },
      may: { amount: 155000, percent: 10.6 },
      june: { amount: 148000, percent: 10.1 },
      july: { amount: 162000, percent: 11.0 },
      august: { amount: 159000, percent: 10.9 },
      september: { amount: 151000, percent: 10.3 },
      october: { amount: 145000, percent: 9.9 },
      november: { amount: 138000, percent: 9.4 },
      december: { amount: 165000, percent: 11.2 },
      total: { amount: 1663000, percent: 100 }
    },
    {
      id: 2,
      idNo: 'AFR-000002',
      branch: {
        id: 102,
        idNo: 'BR-002',
        name: 'สาขามหาสารคาม',
        status: 'ACTIVE'
      },
      january: { amount: 95000, percent: 8.2 },
      february: { amount: 88000, percent: 7.6 },
      march: { amount: 108000, percent: 9.3 },
      april: { amount: 102000, percent: 8.8 },
      may: { amount: 118000, percent: 10.2 },
      june: { amount: 112000, percent: 9.7 },
      july: { amount: 125000, percent: 10.8 },
      august: { amount: 121000, percent: 10.4 },
      september: { amount: 115000, percent: 9.9 },
      october: { amount: 109000, percent: 9.4 },
      november: { amount: 102000, percent: 8.8 },
      december: { amount: 128000, percent: 11.0 },
      total: { amount: 1323000, percent: 100 }
    },
    {
      id: 3,
      idNo: 'AFR-000003',
      branch: {
        id: 103,
        idNo: 'BR-003',
        name: 'สาขาร้อยเอ็ด',
        status: 'ACTIVE'
      },
      january: { amount: 75000, percent: 8.0 },
      february: { amount: 68000, percent: 7.3 },
      march: { amount: 85000, percent: 9.1 },
      april: { amount: 78000, percent: 8.4 },
      may: { amount: 92000, percent: 9.9 },
      june: { amount: 86000, percent: 9.2 },
      july: { amount: 98000, percent: 10.5 },
      august: { amount: 94000, percent: 10.1 },
      september: { amount: 88000, percent: 9.4 },
      october: { amount: 82000, percent: 8.8 },
      november: { amount: 76000, percent: 8.1 },
      december: { amount: 100000, percent: 10.7 },
      total: { amount: 932000, percent: 100 }
    }
  ]

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
    if (mockResponse.length) {
      items.value = mockResponse
      const months: TMonth[] = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']
      const monthTotals = Object.fromEntries(
        months.map((month: TMonth) => [
          month,
          {
            amount: mockResponse.reduce((sum: number, item: IAnnualFinanceReceiptList): number => sum + (item[month]?.amount || 0), 0),
            percent: mockResponse.reduce((sum: number, item: IAnnualFinanceReceiptList): number => sum + (item[month]?.percent || 0), 0)
          }
        ])
      )
      const totalAmount = months.reduce((sum: number, month: TMonth): number => sum + (monthTotals[month] as any)?.amount || 0, 0)
      summary.value = {
        numberOfBranches: mockResponse.length,
        ...(monthTotals as Partial<IAnnualFinanceReceiptSummary>),
        total: { amount: totalAmount, percent: 100 }
      } as IAnnualFinanceReceiptSummary
      pagination.value.count = mockResponse.length
      pagination.value.totalPage = 1
      syncQuery({ ...normalizeFilters(filters.value) })
      return
    }
    const response = await AnnualFinanceReceiptService.getAnnualFinanceReceiptPaginate(paginateQuery.value)
    items.value = response?.data || []
    pagination.value = extractPagination(response)
    summary.value = initSummary()
    syncQuery({ ...normalizeFilters(filters.value) })
  }

  function normalizeFilters (value: IAnnualFinanceReceiptFilter): Partial<IAnnualFinanceReceiptFilter> {
    return {
      ...value,
      year: value?.year ? dayjs(value.year).format('YYYY') : undefined
    }
  }

  function fetch (): void {
    handleLoading(useFetch)
  }

  function onClearFilters (): void {
    reset()
    filters.value = {}
  }

  function initSummary (data?: IAnnualFinanceReceiptSummary): IAnnualFinanceReceiptSummary {
    return {
      numberOfBranches: data?.numberOfBranches || 0,
      january: {
        amount: data?.january?.amount || 0,
        percent: data?.january?.percent || 0
      },
      february: {
        amount: data?.february?.amount || 0,
        percent: data?.february?.percent || 0
      },
      march: {
        amount: data?.march?.amount || 0,
        percent: data?.march?.percent || 0
      },
      april: {
        amount: data?.april?.amount || 0,
        percent: data?.april?.percent || 0
      },
      may: {
        amount: data?.may?.amount || 0,
        percent: data?.may?.percent || 0
      },
      june: {
        amount: data?.june?.amount || 0,
        percent: data?.june?.percent || 0
      },
      july: {
        amount: data?.july?.amount || 0,
        percent: data?.july?.percent || 0
      },
      august: {
        amount: data?.august?.amount || 0,
        percent: data?.august?.percent || 0
      },
      september: {
        amount: data?.september?.amount || 0,
        percent: data?.september?.percent || 0
      },
      october: {
        amount: data?.october?.amount || 0,
        percent: data?.october?.percent || 0
      },
      november: {
        amount: data?.november?.amount || 0,
        percent: data?.november?.percent || 0
      },
      december: {
        amount: data?.december?.amount || 0,
        percent: data?.december?.percent || 0
      },
      total: {
        amount: data?.total?.amount || 0,
        percent: data?.total?.percent || 0
      }
    }
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
