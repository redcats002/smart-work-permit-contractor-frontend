import { computed, type ComputedRef, ref, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { handleLoading } from '@/utils/HandleLoading'
import type { IEvaluateGroupList } from '@/models/modules/pre-contract/Evaluator.model'
import type { IPreAssetList } from '@/models/modules/pre-contract/PreAsset.model'
import type { IPreContractById } from '@/models/response/pre-contract/PreContractRes.model'
import { isLandAsset, isVehicleAsset } from '@/enums/modules/asset/AssetType.enum'
import type { TEvaluatorLevel } from '@/enums/modules/contract/EvaluatorLevel.enum'
import PreContractProvider, { type IPreContractProvider } from '@/resources/provider/pre-contract/PreContract.provider'
import type { TAssetCategory } from '../../create/schema/pre-contract.schema'
import { readyForAppraisal as readyForLandAppraisal } from '../schema/land.schema'
import type { MakeContractFormValues, PreAssetWarehouseFormValues } from '../schema/make-contract.schema'
import { readyForAppraisal as readyForVehicleAppraisal } from '../schema/vehicle.schema'

export interface IUseInitDetail {
  contractId: ComputedRef<string | string[]>
  contract: Ref<IPreContractById | null>
  activeAsset: ComputedRef<IPreAssetList | null>
  activeIndex: Ref<number>
  modalVisible: Ref<boolean>
  modalAsset: Ref<IPreAssetList | null>
  assetCategory: ComputedRef<TAssetCategory>
  filledAllRequired: ComputedRef<boolean>
  existedGroup: ComputedRef<TEvaluatorLevel[]>
  onEdit(): void
  onCancel(): void
  onActiveAsset(index: number): void
  openModal(asset: IPreAssetList): void
  useFetch(): Promise<void>
  fetch(formMakeContract: Ref<MakeContractFormValues>, mount: () => void): void
}

export function useInitDetail (): IUseInitDetail {
  const route = useRoute()
  const router = useRouter()

  const PreContractService: IPreContractProvider = new PreContractProvider()

  const contractId = computed((): string | string[] => route.params.id)
  const contract = ref<IPreContractById | null>(null)

  const activeIndex = ref<number>(0)
  const activeAsset = computed((): IPreAssetList | null => contract.value?.preAssets[activeIndex.value] || null)

  const modalVisible = ref<boolean>(false)
  const modalAsset = ref<IPreAssetList | null>(null)

  const assetCategory = computed((): TAssetCategory => {
    if (!contract.value?.preAssets.length) return null
    for (const e of contract.value.preAssets) {
      if (isVehicleAsset(e.type)) return 'VEHICLE'
      if (isLandAsset(e.type)) return 'LAND'
    }
    return null
  })

  const existedGroup = computed((): TEvaluatorLevel[] => {
    if (!contract.value) return []
    const group: TEvaluatorLevel[] = contract.value.evaluateGroups.map((e: IEvaluateGroupList): TEvaluatorLevel => e.evaluatorLevel)
    return group
  })


  const filledAllRequired = computed((): boolean => {
    if (!contract.value) return false
    return contract.value?.preAssets.every((preAsset: IPreAssetList): boolean => {
      if (readyForVehicleAppraisal(preAsset) && assetCategory.value !== 'LAND') return true
      if (readyForLandAppraisal(preAsset) && assetCategory.value === 'LAND') return true
      return false
    }) ?? false
  })

  async function useFetch (): Promise<void> {
    const res = await PreContractService.getContractFindOne(contractId.value)
    contract.value = res.data
  }

  function onEdit (): void {
    router.push({ name: 'PreContractEditPage', params: { id: contractId.value } })
  }

  function onCancel (): void {
    router.push({ name: 'ContractListPage' })
  }

  function onActiveAsset (index: number): void {
    activeIndex.value = index
  }

  function openModal (asset: IPreAssetList): void {
    modalAsset.value = asset
    modalVisible.value = true
  }

  function onInitFormMakeContract (formMakeContract: Ref<MakeContractFormValues>): void {
    formMakeContract.value.preAssets = (contract.value?.preAssets || []).map((e: IPreAssetList): PreAssetWarehouseFormValues => ({
      id: e.id,
      locationId: e.location?.id,
      files: e?.files
    }))
  }

  function fetch (formMakeContract: Ref<MakeContractFormValues>, mount: () => void): void {
    handleLoading(async () => {
      await useFetch()
      onInitFormMakeContract(formMakeContract)
      mount()
    })
  }

  return {
    activeIndex,
    activeAsset,
    assetCategory,
    contract,
    contractId,
    filledAllRequired,
    modalAsset,
    modalVisible,
    existedGroup,
    useFetch,
    fetch,
    onActiveAsset,
    onCancel,
    onEdit,
    openModal
  }
}
