import type { IEntity } from '@/models/Global.model'
import type { TDocumentType } from '@/enums/modules/contract/DocumentType.enum'
import type { IMedia } from '@/resources/provider/Upload.provider'
import type { IWarehouseList } from '../warehouse/WarehouseRes.model'
import type { IBasePaginationResponse, IBaseSuccessResponse } from '../Response.model'

export interface IContractDocumentList extends IEntity {
  date: string
  documentType: TDocumentType
  note: string
  location: IWarehouseList
  files?: IMedia[]
}

export type TGetDocumentListResponse = IBasePaginationResponse<IContractDocumentList>
export type TActionContractDocumentResponse = IBaseSuccessResponse<boolean>
