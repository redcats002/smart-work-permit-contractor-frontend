import { computed, ref, type Ref } from 'vue'
import { useRoute } from 'vue-router'
import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import type { IConfirmMortgagePayload } from '@/models/request/pre-contract/PreContractReq.model'
import PreContractProvider, { type IPreContractProvider } from '@/resources/provider/pre-contract/PreContract.provider'
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

  const contractId = computed((): string | string[] => route.params.id)


  async function useConfirmMortgage (): Promise<void> {
    await PreContractService.confirmMortgage(contractId.value, formMortgage.value)
    toast.success('ยืนยันการจำนองสำเร็จ')
    useFetch()
  }

  function onSubmitMortgage (): void {
    isMortgageFormVisible.value = true
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
