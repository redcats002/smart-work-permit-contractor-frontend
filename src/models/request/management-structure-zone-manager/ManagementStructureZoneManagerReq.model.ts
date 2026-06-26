import type { ManagementStructureZoneManagerFormValues } from '@/pages/setting/pages/other/pages/management-structure/schema/management-structure-zone-manager.schema'
import type { IBasePaginationRequest } from '../Request.model'

export interface IActionManagementStructureZoneManagerPayload
  extends ICreateManagementStructureZoneManagerPayload, IUpdateManagementStructureZoneManagerPayload {}
export interface ICreateManagementStructureZoneManagerPayload extends ManagementStructureZoneManagerFormValues {}
export interface IUpdateManagementStructureZoneManagerPayload extends ICreateManagementStructureZoneManagerPayload {}

export interface IGetManagementStructureZoneManagerList extends IBasePaginationRequest {}
