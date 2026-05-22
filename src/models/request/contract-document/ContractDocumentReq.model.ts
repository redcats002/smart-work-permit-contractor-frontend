import type { TDocumentType } from '@/enums/modules/contract/DocumentType.enum'
import type { IMedia } from '@/resources/provider/Upload.provider'
import type { IBasePaginationRequest } from '../Request.model'

export interface IGetDocumentList extends IBasePaginationRequest {}
export interface ICreateDocument {
  documentType: TDocumentType
  locationId: number
  files: IMedia[]
  note: string
}
export interface IUpdateDocument extends Partial<ICreateDocument> {}
