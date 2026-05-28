import { ref, type Ref } from 'vue'
import { useRoute } from 'vue-router'
import { handleLoading } from '@/utils/HandleLoading'
import type { IDailySummaryById } from '@/models/response/report/daily-summary/DailySummaryRes'
import DailySummaryProvider, { type IDailySummaryProvider } from '@/resources/provider/report/DailySummary.provider'

interface IUseDetail {
  itemData: Ref<IDailySummaryById | undefined>
  fetch(): void
}

export default function useList (): IUseDetail {
  const DailySummaryService: IDailySummaryProvider = new DailySummaryProvider()
  const route = useRoute()

  const itemData = ref<IDailySummaryById | undefined>(undefined)

  async function useFetch (): Promise<void> {
    const id = Number(route.params.id)
    const response = await DailySummaryService.getDailySummaryById(id)
    itemData.value = response?.data
  }

  function fetch (): void {
    handleLoading(useFetch)
  }

  return {
    itemData,
    fetch
  }
}
