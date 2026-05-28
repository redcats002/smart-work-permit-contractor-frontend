import { ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import { handleLoading } from '@/utils/HandleLoading'
import type { IDailySummaryFind } from '@/models/response/report/daily-summary/DailySummaryRes'
import DailySummaryProvider, { type IDailySummaryProvider } from '@/resources/provider/report/DailySummary.provider'

interface IUseCreate {
  findData: Ref<IDailySummaryFind | undefined>
  reason: Ref<string>
  fetch(): void
  onConfirm(): void
}

export default function useCreate (): IUseCreate {
  const DailySummaryService: IDailySummaryProvider = new DailySummaryProvider()
  const router = useRouter()

  const findData = ref<IDailySummaryFind | undefined>(undefined)
  const reason = ref<string>('')

  async function useFetch (): Promise<void> {
    const response = await DailySummaryService.getDailySummaryFind()
    findData.value = response?.data
  }

  async function useSubmit (): Promise<void> {
    await DailySummaryService.createDailySummary({ reason: reason.value || undefined })
    await router.push({ name: 'DailySummaryListPage' })
  }

  function fetch (): void {
    handleLoading(useFetch)
  }

  function onConfirm (): void {
    handleLoading(useSubmit)
  }

  return {
    findData,
    reason,
    fetch,
    onConfirm
  }
}
