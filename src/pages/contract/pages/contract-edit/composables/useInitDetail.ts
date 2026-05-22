import { computed, type ComputedRef, ref, type Ref } from 'vue'
import { useRoute } from 'vue-router'
import { handleLoading } from '@/utils/HandleLoading'
import type { IPreAssetList } from '@/models/modules/pre-contract/PreAsset.model'
import type { IContractById } from '@/models/response/contract/ContractRes.model'
import { isLandAsset, isVehicleAsset } from '@/enums/modules/asset/AssetType.enum'
import ContractProvider, { type IContractProvider } from '@/resources/provider/contract/Contract.provider'
import type { TAssetCategory } from '../../create/schema/pre-contract.schema'
import { useInitDetail as useInitContractDetail } from '../../detail/composables/useInitDetail'
import type { InstallmentFormValues, PreAssetWarehouseFormValues } from '../../pre-contract-detail/schema/make-contract.schema'

export interface IUseInitDetail {
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
}

export function useInitDetail (): IUseInitDetail {
  const route = useRoute()
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

  const assetCategory = computed((): TAssetCategory => {
    if (!assets.value.length) return null
    for (const e of assets.value) {
      if (isVehicleAsset(e.type)) return 'VEHICLE'
      if (isLandAsset(e.type)) return 'LAND'
    }
    return null
  })

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
    onActiveAsset
  }
}
