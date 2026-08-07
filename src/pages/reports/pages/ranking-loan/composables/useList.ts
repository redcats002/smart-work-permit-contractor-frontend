import { computed, ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import { dayjs } from '@/plugins/dayjs.plugin'
import { handleLoading } from '@/utils/HandleLoading'
import type { IRankLoanFilter } from '@/models/modules/report/rank-loan/Filter.model'
import type { IRankLoanItem } from '@/models/response/report/rank-loan/RankLoanRes.model'
import RankingLoanProvider, { type IRankingLoanProvider } from '@/resources/provider/report/RankingLoan.provider'

interface IUseList {
  filters: Ref<IRankLoanFilter>
  items: Ref<IRankLoanItem[]>
  fetch(): void
  onSearch(): void
  onClearFilters(): void
  onPrint(): void
}

export default function useList (): IUseList {
  const router = useRouter()

  const RankingLoanService: IRankingLoanProvider = new RankingLoanProvider()

  const filters = ref<IRankLoanFilter>({
    startDate: dayjs().startOf('month').format('YYYY-MM-DD'),
    endDate: dayjs().endOf('month').format('YYYY-MM-DD'),
    type: 'RECEIPT_AMOUNT'
  })

  const items = ref<IRankLoanItem[]>([])

  const query = computed((): Pick<IRankLoanFilter, 'startDate' | 'endDate'> => ({
    startDate: filters.value.startDate,
    endDate: filters.value.endDate
  }))

  async function useFetch (): Promise<void> {
    const response = await RankingLoanService.getRankingLoanList(query.value)
    items.value = response?.data || []
  }

  function onSearch (): void {
    fetch()
  }

  function fetch (): void {
    handleLoading(useFetch)
  }

  function onClearFilters (): void {
    filters.value = {
      startDate: dayjs().startOf('month').format('YYYY-MM-DD'),
      endDate: dayjs().endOf('month').format('YYYY-MM-DD'),
      type: 'RECEIPT_AMOUNT'
    }
    fetch()
  }

  function onPrint (): void {
    router.push({
      name: 'RankingLoanPrintPage',
      query: {
        startDate: filters.value.startDate || undefined,
        endDate: filters.value.endDate || undefined,
        type: filters.value.type || undefined
      }
    })
  }

  return {
    filters,
    items,
    fetch,
    onSearch,
    onClearFilters,
    onPrint
  }
}
