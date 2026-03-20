import type { IEntity } from '@/models/Global.model'
import type { IWarehouseLocation } from '@/models/modules/warehouse/WarehouseLocation.model'
import type { IWarehouseOption } from '@/models/modules/warehouse/WarehouseOption.model'
import type { TWarehouseStatus } from '@/enums/modules/warehouse/WarehouseStatus.enum'
import type { IBasePaginationResponse, IBaseSuccessResponse } from '../Response.model'

export interface ILocationList extends IEntity {
  name: string
}
export interface ILocationWarehouseList extends ILocationList {
  warehouse: Omit<IWarehouseList, 'locations'>
}
export interface IWarehouseList extends IEntity {
  name: string
  status: TWarehouseStatus
}
export interface IWarehouseById extends IEntity {
  name: string
  status: TWarehouseStatus
  prefix: string
  options: IWarehouseOption[]
  locations: IWarehouseLocation[]
}

export type TGetWarehouseListResponse = IBasePaginationResponse<IWarehouseList>
export type TGetWarehouseByIdResponse = IBaseSuccessResponse<IWarehouseById>
export type TActionWarehouse = IBaseSuccessResponse<boolean>
export type TGetLocationListResponse = IBasePaginationResponse<ILocationList>
