import { computed, ref, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import type { IRequestReappraisalPayload } from '@/models/request/pre-contract/PreContractReq.model'
import PreContractProvider, { type IPreContractProvider } from '@/resources/provider/pre-contract/PreContract.provider'
import { useFormInitialValues } from '../schema/asset-valuation.schema'

interface IUseRequestReappraisal {
  form: Ref<IRequestReappraisalPayload>
  onRequestPreContract(): void
}

export function useRequestReappraisal (useFetch: () => Promise<void>): IUseRequestReappraisal {
  const PreContractService: IPreContractProvider = new PreContractProvider()

  const route = useRoute()
  const router = useRouter()

  const form = ref<IRequestReappraisalPayload>(useFormInitialValues())

  const contractId = computed((): string | string[] => route.params.id)

  async function useRequestPreContract (): Promise<void> {
    await PreContractService.requestReappraisal(contractId.value, form.value)
    toast.success('ส่งคำขอราคาประเมินสำเร็จ')
    router.push({ name: 'ContractListPage' })
    await useFetch()
  }

  function onRequestPreContract (): void {
    handleLoading(useRequestPreContract)
  }
  return {
    form,
    onRequestPreContract
  }
}
