import type { ComputedRef } from 'vue'
import { computed, ref, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from '@/plugins/toast'
import { formatter } from '@/utils/Formatter'
import { handleLoading } from '@/utils/HandleLoading'
import type { IRefinanceMakeAContractPayload } from '@/models/request/refinance/RefinanceReq.model'
import type { IRefinanceProvider } from '@/resources/provider/refinance/Refinance.provider'
import RefinanceProvider from '@/resources/provider/refinance/Refinance.provider'
import { type MakeContractFormValues, useFormInitialValues } from '../schema/make-contract.schema'

interface IUseMakeContract {
  formMakeContract: Ref<MakeContractFormValues>
  formKey: Ref<number>
  invalid: ComputedRef<boolean>
  mount: () => void
  onConfirmMakeContract (): void
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function useMakeContract (_useFetch: () => Promise<void>): IUseMakeContract {
  const RefinanceService: IRefinanceProvider = new RefinanceProvider()

  const route = useRoute()
  const router = useRouter()

  const formMakeContract = ref<MakeContractFormValues>(useFormInitialValues())
  const formKey = ref<number>(0)

  const contractId = computed((): string | string[] => route.params.id)
  const invalid = computed((): boolean => {
    return formMakeContract.value.annualInterestRate <= 0 || formMakeContract.value.installmentCount <= 0
  })

  async function usePayload (): Promise<IRefinanceMakeAContractPayload> {
    const payload: IRefinanceMakeAContractPayload = {
      annualInterestRate: formatter.numberParseFloat(formMakeContract.value?.annualInterestRate || 0),
      installmentCount: formatter.numberParseFloat(formMakeContract.value?.installmentCount || 0),
      interestType: formMakeContract.value?.interestType
    }
    return payload
  }

  async function useConfirmMakeContract (): Promise<void> {
    const payload = await usePayload()
    await RefinanceService.makeAContract(contractId.value, payload)
    toast.success('ทำสัญญาใหม่เรียบร้อยแล้ว')
    // await _useFetch()
    router.push({ name: 'ContractDetailPage', params: { id: contractId.value } })
  }

  function mount (): void {
    formKey.value += 1
  }

  function onConfirmMakeContract (): void {
    handleLoading(useConfirmMakeContract)
  }

  return {
    formMakeContract,
    formKey,
    invalid,
    mount,
    onConfirmMakeContract
  }
}
