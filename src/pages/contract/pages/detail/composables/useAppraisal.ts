import { computed, ref, type Ref } from 'vue'
import { useRoute } from 'vue-router'
import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import type { IAppraisalPricePayload, IRequestReappraisalPayload } from '@/models/request/pre-contract/PreContractReq.model'
import PreContractProvider, { type IPreContractProvider } from '@/resources/provider/pre-contract/PreContract.provider'
import { useFormInitialValues as useFormAppraisalPrice } from '../schema/appraisal-price.schema'
import { useFormInitialValues as useFormRequestReappraisal } from '../schema/asset-valuation.schema'

interface IUseAppraisal {
  formRequestReappraisal: Ref<IRequestReappraisalPayload>
  formAppraisalPrice: Ref<IAppraisalPricePayload>
  onAppraisalPrice(): void
  onRequestReappraisal(): void
  onConfirmAppraisal(): void
}

export function useAppraisal (useFetch: () => Promise<void>): IUseAppraisal {
  const PreContractService: IPreContractProvider = new PreContractProvider()

  const route = useRoute()

  const formRequestReappraisal = ref<IRequestReappraisalPayload>(useFormRequestReappraisal())
  const formAppraisalPrice = ref<IAppraisalPricePayload>(useFormAppraisalPrice())

  const contractId = computed((): string | string[] => route.params.id)

  async function useRequestReappraisal (): Promise<void> {
    await PreContractService.requestReappraisal(contractId.value, formRequestReappraisal.value)
    toast.success('ส่งคำขอราคาประเมินสำเร็จ')
    await useFetch()
  }

  async function useConfirmAppraisal (): Promise<void> {
    await PreContractService.confirmAppraisal(contractId.value)
    toast.success('ยืนยันราคาประเมินสำเร็จ')
    await useFetch()
  }

  async function useAppraisalPrice (): Promise<void> {
    await PreContractService.appraisalPrice(contractId.value, formAppraisalPrice.value)
    toast.success('ยืนยันราคาประเมินสำเร็จ')
    await useFetch()
  }

  function onRequestReappraisal (): void {
    handleLoading(useRequestReappraisal)
  }

  function onAppraisalPrice (): void {
    handleLoading(useAppraisalPrice)
  }

  function onConfirmAppraisal (): void {
    handleLoading(useConfirmAppraisal)
  }

  return {
    formAppraisalPrice,
    formRequestReappraisal,
    onRequestReappraisal,
    onAppraisalPrice,
    onConfirmAppraisal
  }
}
