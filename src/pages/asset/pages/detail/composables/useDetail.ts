import { ref, type Ref } from 'vue'
import type { IContractAssetDetail } from '@/models/response/contract-asset/ContractAssetRes.model'
import type { TAssetStatus } from '@/enums/modules/asset/AssetStatus.enum'
import ContractAssetProvider from '@/resources/provider/contract-asset/ContractAsset.provider'

interface IUseDetail {
  detail: Ref<IContractAssetDetail | null>
  loading: Ref<boolean>
  fetch(): Promise<void>
  sell(salePrice: number): Promise<void>
  updateStatus(status: TAssetStatus): Promise<void>
}

export function useDetail (assetId: number): IUseDetail {
  const provider = new ContractAssetProvider()
  const detail = ref<IContractAssetDetail | null>(null)
  const loading = ref<boolean>(false)

  async function fetch (): Promise<void> {
    loading.value = true
    try {
      const res = await provider.getContractAssetDetail(assetId)
      detail.value = res.data
    } finally {
      loading.value = false
    }
  }

  async function sell (salePrice: number): Promise<void> {
    await provider.sellContractAsset(assetId, { salePrice })
    await fetch()
  }

  async function updateStatus (status: TAssetStatus): Promise<void> {
    await provider.updateContractAssetStatus(assetId, { status })
    await fetch()
  }

  return {
    detail,
    loading,
    fetch,
    sell,
    updateStatus
  }
}
