import { computed, ref, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from '@/plugins/toast'
import { formatter } from '@/utils/Formatter'
import { handleLoading } from '@/utils/HandleLoading'
import type { IMakeAContractPayload } from '@/models/request/pre-contract/PreContractReq.model'
import PreContractProvider, { type IPreContractProvider } from '@/resources/provider/pre-contract/PreContract.provider'
import { type InstallmentFormValues, type PreAssetMakeAContractFormValues, useFormInitialValues } from '../schema/installment.schema'

interface IUseMakeContract {
  formMakeContract: Ref<InstallmentFormValues>
  onConfirmMakeContract (): void
}

export function useMakeContract (useFetch: () => Promise<void>): IUseMakeContract {
  const PreContractService: IPreContractProvider = new PreContractProvider()

  const route = useRoute()
  const router = useRouter()

  const formMakeContract = ref<InstallmentFormValues>(useFormInitialValues())

  const contractId = computed((): string | string[] => route.params.id)

  function usePayload (): IMakeAContractPayload {
    return {
      annualInterestRate: formatter.numberParseFloat(formMakeContract.value.annualInterestRate),
      installmentCount: formatter.numberParseFloat(formMakeContract.value.installmentCount),
      interestType: formMakeContract.value.interestType,
      preAssets: formMakeContract.value.preAssets.map((e: PreAssetMakeAContractFormValues) => ({
        id: e.id,
        files: e?.files || [],
        locationId: e.locationId
      }))
    }
  }

  async function useConfirmMakeContract (): Promise<void> {
    await PreContractService.makeAContract(contractId.value, usePayload())
    toast.success('ทำสัญญาเรียบร้อยแล้ว')
    await useFetch()
    router.push({ name: 'ContractDetailPage', params: { id: contractId.value } })
  }


  function onConfirmMakeContract (): void {
    handleLoading(useConfirmMakeContract)
  }

  return {
    formMakeContract,
    onConfirmMakeContract
  }
}
