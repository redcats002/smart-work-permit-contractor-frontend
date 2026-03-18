import type { WarehouseFormValues } from '@/pages/setting/pages/other/pages/warehouse/pages/create/schema/warehouse.schema'
import type { IBasePaginationRequest } from '../Request.model'

export interface IActionWarehousePayload extends ICreateWarehousePayload, IUpdateWarehousePayload {}
export interface ICreateWarehousePayload extends WarehouseFormValues {}
export interface IUpdateWarehousePayload extends ICreateWarehousePayload {}

export interface IGetWarehouseList extends IBasePaginationRequest {}
