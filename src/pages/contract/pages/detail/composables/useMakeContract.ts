import { computed, ref, type Ref } from 'vue'
import { useRoute } from 'vue-router'
import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import type { IMakeAContractPayload } from '@/models/request/pre-contract/PreContractReq.model'
import PreContractProvider, { type IPreContractProvider } from '@/resources/provider/pre-contract/PreContract.provider'
import { useFormInitialValues } from '../schema/installment.schema'

interface IUseMakeContract {
  formMakeContract: Ref<IMakeAContractPayload>
  onConfirmMakeContract (): void
}

export function useMakeContract (useFetch: () => Promise<void>): IUseMakeContract {
  const PreContractService: IPreContractProvider = new PreContractProvider()

  const route = useRoute()

  const formMakeContract = ref<IMakeAContractPayload>(useFormInitialValues())

  const contractId = computed((): string | string[] => route.params.id)

  async function useConfirmMakeContract (): Promise<void> {
    await PreContractService.makeAContract(contractId.value, formMakeContract.value)
    toast.success('ทำสัญญาเรียบร้อยแล้ว')
    await useFetch()
  }


  function onConfirmMakeContract (): void {
    handleLoading(useConfirmMakeContract)
  }

  return {
    formMakeContract,
    onConfirmMakeContract
  }
}
