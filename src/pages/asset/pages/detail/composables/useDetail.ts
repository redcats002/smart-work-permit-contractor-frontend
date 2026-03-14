import { ref, type Ref } from 'vue'
import { getAssetDetailMock } from '@/pages/asset/mock/assetMock'
import type {
  IAssetDetailInfo,
  IAssetDocument,
  IAssetHistoryItem,
  IAssetMedia,
  IContractDetailInfo
} from '@/models/asset/AssetDetail.model'

export interface IAssetDetailState {
  assetInfo: Ref<IAssetDetailInfo>
  contractInfo: Ref<IContractDetailInfo>
  images: Ref<IAssetMedia[]>
  documents: Ref<IAssetDocument[]>
  history: Ref<IAssetHistoryItem[]>
}

export function useDetail (assetId?: number): IAssetDetailState {
  const mock = getAssetDetailMock(assetId)
  const assetInfo = ref<IAssetDetailInfo>(mock.assetInfo)
  const contractInfo = ref<IContractDetailInfo>(mock.contractInfo)
  const images = ref<IAssetMedia[]>(mock.images)
  const documents = ref<IAssetDocument[]>(mock.documents)
  const history = ref<IAssetHistoryItem[]>(mock.history)

  return {
    assetInfo,
    contractInfo,
    images,
    documents,
    history
  }
}
