import type { ManagementStructureLineHeadFormValues } from '@/pages/setting/pages/other/pages/management-structure/schema/management-structure-line-head.schema'
import type { IBasePaginationRequest } from '../Request.model'

export interface IActionManagementStructureLineHeadPayload
  extends ICreateManagementStructureLineHeadPayload, IUpdateManagementStructureLineHeadPayload {}
export interface ICreateManagementStructureLineHeadPayload extends ManagementStructureLineHeadFormValues {}
export interface IUpdateManagementStructureLineHeadPayload extends ICreateManagementStructureLineHeadPayload {}

export interface IGetManagementStructureLineHeadList extends IBasePaginationRequest {
  zoneManagerId?: number
}
