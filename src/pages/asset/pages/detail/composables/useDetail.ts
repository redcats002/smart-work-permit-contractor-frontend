import { ref, type Ref } from 'vue'
import { handleLoading } from '@/utils/HandleLoading'
import type { IContractAssetDetail } from '@/models/response/contract-asset/ContractAssetRes.model'
import type { TAssetStatus } from '@/enums/modules/asset/AssetStatus.enum'
import ContractAssetProvider from '@/resources/provider/contract-asset/ContractAsset.provider'

interface IUseDetail {
  detail: Ref<IContractAssetDetail | null>
  fetch(): void
  onSell(salePrice: number): void
  onUpdateStatus(status: TAssetStatus): void
}

export function useDetail (assetId: number): IUseDetail {
  const ContractAssetService = new ContractAssetProvider()
  const detail = ref<IContractAssetDetail | null>(null)

  async function useFetch (): Promise<void> {
    const res = await ContractAssetService.getContractAssetDetail(assetId)
    detail.value = res.data
  }

  function fetch (): void {
    handleLoading(useFetch)
  }

  async function useSell (salePrice: number): Promise<void> {
    await ContractAssetService.sellContractAsset(assetId, { salePrice })
    await useFetch()
  }

  async function useUpdateStatus (status: TAssetStatus): Promise<void> {
    await ContractAssetService.updateContractAssetStatus(assetId, { status })
    await useFetch()
  }

  function onSell (salePrice: number): void {
    handleLoading(() => useSell(salePrice))
  }

  function onUpdateStatus (status: TAssetStatus): void {
    handleLoading(() => useUpdateStatus(status))
  }

  return {
    detail,
    fetch,
    onSell,
    onUpdateStatus
  }
}
