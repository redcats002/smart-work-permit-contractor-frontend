import { computed, ref, type Ref } from 'vue'
import { dayjs } from '@/plugins/dayjs.plugin'
import { handleLoading } from '@/utils/HandleLoading'
import type { IRankLendingFilter } from '@/models/modules/report/rank-lending/Filter.model'
import type { IRankLendingItem } from '@/models/response/report/rank-lending/RankLendingRes.model'
import RankingLendingProvider, { type IRankingLendingProvider } from '@/resources/provider/report/RankingLending.provider'

interface IUseList {
  filters: Ref<IRankLendingFilter>
  items: Ref<IRankLendingItem[]>
  fetch(): void
  onSearch(): void
  onClearFilters(): void
}

export default function useList (): IUseList {
  const RankingLendingService: IRankingLendingProvider = new RankingLendingProvider()

  const filters = ref<IRankLendingFilter>({
    startDate: dayjs().startOf('month').format('YYYY-MM-DD'),
    endDate: dayjs().endOf('month').format('YYYY-MM-DD')
  })

  const items = ref<IRankLendingItem[]>([])

  const query = computed((): IRankLendingFilter => ({
    startDate: filters.value.startDate,
    endDate: filters.value.endDate
  }))

  async function useFetch (): Promise<void> {
    const response = await RankingLendingService.getRankingLendingList(query.value)
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
      endDate: dayjs().endOf('month').format('YYYY-MM-DD')
    }
    fetch()
  }

  return {
    filters,
    items,
    fetch,
    onSearch,
    onClearFilters
  }
}
