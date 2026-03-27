import { computed, ref, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from '@/plugins/toast'
import { formatter } from '@/utils/Formatter'
import { handleLoading } from '@/utils/HandleLoading'
import type { IMakeAContractPayload } from '@/models/request/pre-contract/PreContractReq.model'
import PreContractProvider, { type IPreContractProvider } from '@/resources/provider/pre-contract/PreContract.provider'
import useUpload from '@/composables/useUpload'
import { type MakeContractFormValues, type PreAssetWarehouseFormValues, useFormInitialValues } from '../schema/make-contract.schema'

interface IUseMakeContract {
  formMakeContract: Ref<MakeContractFormValues>
  formKey: Ref<number>
  mount: () => void
  onConfirmMakeContract (): void
}

export function useMakeContract (useFetch: () => Promise<void>): IUseMakeContract {
  const PreContractService: IPreContractProvider = new PreContractProvider()

  const route = useRoute()
  const router = useRouter()

  const { getUploadImages } = useUpload()

  const formMakeContract = ref<MakeContractFormValues>(useFormInitialValues())
  const formKey = ref<number>(0)

  const contractId = computed((): string | string[] => route.params.id)

  async function usePayload (): Promise<IMakeAContractPayload> {
    const promises = formMakeContract.value?.preAssets.map(async (e: PreAssetWarehouseFormValues) => {
      const files = await getUploadImages(e.files)
      return {
        id: e.id,
        files: files || [],
        locationId: e.locationId
      }
    })
    const preAssets = await Promise.all(promises || [])
    const payload = {
      annualInterestRate: formatter.numberParseFloat(formMakeContract.value?.annualInterestRate || 0),
      installmentCount: formatter.numberParseFloat(formMakeContract.value?.installmentCount || 0),
      interestType: formMakeContract.value?.interestType,
      preAssets
    }
    return payload
  }

  async function useConfirmMakeContract (): Promise<void> {
    const payload = await usePayload()
    await PreContractService.makeAContract(contractId.value, payload)
    toast.success('ทำสัญญาเรียบร้อยแล้ว')
    await useFetch()
    router.push({ name: 'ContractListPage' })
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
    mount,
    onConfirmMakeContract
  }
}
