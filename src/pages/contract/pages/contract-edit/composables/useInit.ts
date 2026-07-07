import { computed, type ComputedRef, ref, type Ref, useTemplateRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from '@/plugins/toast'
import { formatter } from '@/utils/Formatter'
import { handleLoading } from '@/utils/HandleLoading'
import type { IPreAssetList } from '@/models/modules/pre-contract/PreAsset.model'
import type { IUpdateContractPayload } from '@/models/request/contract/ContractReq.model'
import type { IContractById } from '@/models/response/contract/ContractRes.model'
import ContractProvider, { type IContractProvider } from '@/resources/provider/contract/Contract.provider'
import { getAssetCategory, type TAssetCategory } from '../../create/schema/pre-contract.schema'
import { useInitDetail as useInitContractDetail } from '../../detail/composables/useInitDetail'
import type InstallmentSection from '../../pre-contract-detail/components/InstallmentSection.vue'
import type { InstallmentFormValues, PreAssetWarehouseFormValues } from '../../pre-contract-detail/schema/make-contract.schema'

export interface IUseInit {
  contractId: ComputedRef<number>
  contract: Ref<IContractById>
  assets: Ref<IPreAssetList[]>
  formAssets: Ref<PreAssetWarehouseFormValues[]>
  formInstallment: Ref<InstallmentFormValues>
  activeAsset: ComputedRef<IPreAssetList | null>
  activeIndex: Ref<number | undefined>
  assetCategory: ComputedRef<TAssetCategory>
  useFetch(): Promise<void>
  fetch(): void
  onActiveAsset(index?: number): void
  onSave(): void
  onCancel(): void
}

export function useInit (): IUseInit {
  const route = useRoute()
  const router = useRouter()
  const ContractService: IContractProvider = new ContractProvider()

  const contractId = computed((): number => Number(route.params.id as string ?? ''))
  const contract = useInitContractDetail()
  const assets = ref<IPreAssetList[]>([])
  const formAssets = ref<PreAssetWarehouseFormValues[]>([])
  const formInstallment = ref<InstallmentFormValues>({
    loanAmount: 0,
    lateFee: 0,
    installmentCount: 0,
    annualInterestRate: 0,
    interestType: 'FLAT_RATE'
  })
  const activeIndex = ref<number | undefined>(0)

  const activeAsset = computed((): IPreAssetList | null =>
    activeIndex.value !== undefined ? assets.value[activeIndex.value] ?? null : null
  )

  const assetCategory = computed((): TAssetCategory => getAssetCategory(assets.value))

  async function useFetch (): Promise<void> {
    const [contractRes, assetsRes] = await Promise.all([
      ContractService.getContractFindOne(contractId.value),
      ContractService.getContractAssets(contractId.value)
    ])
    contract.value = useInitContractDetail(contractRes.data).value
    assets.value = assetsRes.data
    formAssets.value = assetsRes.data.map((a: IPreAssetList): PreAssetWarehouseFormValues => ({
      id: a.id,
      locationId: a.location?.id,
      files: a.files || []
    }))
  }

  function fetch (): void {
    handleLoading(useFetch)
  }

  function onActiveAsset (index?: number): void {
    activeIndex.value = index
  }

  const installmentSectionRef = useTemplateRef<InstanceType<typeof InstallmentSection>>('installmentSectionRef')

  async function useSave (): Promise<void> {
    const valid = await installmentSectionRef.value?.submit()
    if (!valid) return
    const payload: IUpdateContractPayload = {
      installmentCount: formatter.numberParseFloat(formInstallment.value.installmentCount),
      interestType: formInstallment.value.interestType!,
      annualInterestRate: formatter.numberParseFloat(formInstallment.value.annualInterestRate)
    }
    await ContractService.updateContract(contractId.value, payload)
    toast.success('บันทึกสัญญาเรียบร้อยแล้ว')
    router.push({ name: 'ContractDetailPage', params: { id: contractId.value } })
  }

  function onSave (): void {
    handleLoading(useSave)
  }

  function onCancel (): void {
    router.push({ name: 'ContractDetailPage', params: { id: contractId.value } })
  }

  return {
    contractId,
    contract,
    assets,
    formAssets,
    formInstallment,
    activeAsset,
    activeIndex,
    assetCategory,
    useFetch,
    fetch,
    onActiveAsset,
    onCancel,
    onSave
  }
}
