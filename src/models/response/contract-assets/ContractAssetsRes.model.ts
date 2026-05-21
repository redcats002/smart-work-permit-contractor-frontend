import type { IPreAssetList } from '@/models/modules/pre-contract/PreAsset.model'
import type { IBasePaginationResponse } from '../Response.model'

export interface IContractAssetList extends IPreAssetList {}

export type TGetAssetContractListResponse = IBasePaginationResponse<IContractAssetList>
