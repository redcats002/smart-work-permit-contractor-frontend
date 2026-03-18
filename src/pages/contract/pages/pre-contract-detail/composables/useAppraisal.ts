import { computed, ref, type Ref } from 'vue'
import { useRoute } from 'vue-router'
import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import type {
  IAppraisalPricePayload,
  IConfirmAppraisalPayload,
  IRequestAppraisalPayload,
  IRequestReappraisalPayload
} from '@/models/request/pre-contract/PreContractReq.model'
import PreContractProvider, { type IPreContractProvider } from '@/resources/provider/pre-contract/PreContract.provider'
import { useFormInitialValues as useFormAppraisalPrice } from '../schema/appraisal-price.schema'
import { useFormInitialValues as useFormRequestReappraisal } from '../schema/asset-valuation.schema'
import { useFormInitialValues as useFormConfirmAppraisal } from '../schema/confirm-appraisal.schema'

interface IUseAppraisal {
  formRequestReappraisal: Ref<IRequestReappraisalPayload>
  formRequestAppraisal: Ref<IRequestAppraisalPayload>
  formAppraisalPrice: Ref<IAppraisalPricePayload>
  formConfirmAppraisal: Ref<IConfirmAppraisalPayload>
  onAppraisalPrice(): void
  onRequestReappraisal(): void
  onRequestAppraisal(): void
  onConfirmAppraisal(): void
}

export function useAppraisal (useFetch: () => Promise<void>): IUseAppraisal {
  const PreContractService: IPreContractProvider = new PreContractProvider()

  const route = useRoute()

  const formConfirmAppraisal = ref<IConfirmAppraisalPayload>(useFormConfirmAppraisal())
  const formRequestReappraisal = ref<IRequestReappraisalPayload>(useFormRequestReappraisal())
  const formRequestAppraisal = ref<IRequestAppraisalPayload>(useFormRequestReappraisal())
  const formAppraisalPrice = ref<IAppraisalPricePayload>(useFormAppraisalPrice())

  const contractId = computed((): string | string[] => route.params.id)

  async function useRequestReappraisal (): Promise<void> {
    await PreContractService.requestReappraisal(contractId.value, formRequestReappraisal.value)
    toast.success('ส่งคำขอราคาประเมินสำเร็จ')
    await useFetch()
  }

  async function useRequestAppraisal (): Promise<void> {
    await PreContractService.requestAppraisal(contractId.value, formRequestAppraisal.value)
    toast.success('ส่งคำขอราคาประเมินสำเร็จ')
    await useFetch()
  }

  async function useConfirmAppraisal (): Promise<void> {
    await PreContractService.confirmAppraisal(contractId.value, formConfirmAppraisal.value)
    toast.success('ยืนยันราคาประเมินสำเร็จ')
    await useFetch()
  }

  async function useAppraisalPrice (): Promise<void> {
    await PreContractService.appraisalPrice(contractId.value, formAppraisalPrice.value)
    toast.success('ยืนยันราคาประเมินสำเร็จ')
    await useFetch()
  }

  function onRequestAppraisal (): void {
    handleLoading(useRequestAppraisal)
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
    formRequestAppraisal,
    formConfirmAppraisal,
    onRequestReappraisal,
    onRequestAppraisal,
    onAppraisalPrice,
    onConfirmAppraisal
  }
}
