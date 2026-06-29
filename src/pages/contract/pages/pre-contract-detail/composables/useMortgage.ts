import { computed, nextTick, ref, type Ref } from 'vue'
import { useRoute } from 'vue-router'
import { toast } from '@/plugins/toast'
import { useDayjs } from '@/utils/Dayjs'
import { handleLoading } from '@/utils/HandleLoading'
import { scrollToTop } from '@/utils/ScrollToTop'
import type { IConfirmMortgagePayload } from '@/models/request/pre-contract/PreContractReq.model'
import PreContractProvider, { type IPreContractProvider } from '@/resources/provider/pre-contract/PreContract.provider'
import useDev from '@/composables/useDev'
import { useFormInitialValues } from '../schema/mortgage.schema'

interface IUseMortgage {
  formMortgage: Ref<IConfirmMortgagePayload>
  isMortgageFormVisible: Ref<boolean>
  onSubmitMortgage(): void
  onConfirmMortgage (): void
}

export function useMortgage (useFetch: () => void): IUseMortgage {
  const PreContractService: IPreContractProvider = new PreContractProvider()

  const route = useRoute()

  const isMortgageFormVisible = ref<boolean>(false)
  const formMortgage = ref<IConfirmMortgagePayload>(useFormInitialValues())
  const { isStaging, isProd } = useDev()


  const contractId = computed((): string | string[] => route.params.id)

  async function useConfirmMortgage (): Promise<void> {
    const dayjs = useDayjs()
    const now = dayjs()
    const contractedAt = dayjs(formMortgage.value.contractedAt).toDate()
    contractedAt.setHours(now.hour(), now.minute(), now.second(), now.millisecond())
    await PreContractService.confirmMortgage(contractId.value, {
      ...formMortgage.value,
      contractedAt: isStaging || isProd ? contractedAt : formMortgage.value?.contractedAt
    })
    toast.success('ยืนยันการจำนองสำเร็จ')
    useFetch()
  }

  function onSubmitMortgage (): void {
    isMortgageFormVisible.value = true
    nextTick((): void => {
      scrollToTop()
    })
  }

  function onConfirmMortgage (): void {
    handleLoading(useConfirmMortgage)
  }


  return {
    formMortgage,
    isMortgageFormVisible,
    onSubmitMortgage,
    onConfirmMortgage
  }
}
