import type { ICreateWarehousePayload, IGetLocationList, IGetWarehouseList, IUpdateWarehousePayload } from '@/models/request/warehouse/WarehouseReq.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import type {
  TActionWarehouse,
  TGetLocationListResponse,
  TGetWarehouseByIdResponse,
  TGetWarehouseListResponse
} from '@/models/response/warehouse/WarehouseRes.model'
import HttpRequest from '@/resources/HttpRequest'

export interface IWarehouseProvider {
  getWarehousePaginate(query: IGetWarehouseList): Promise<TGetWarehouseListResponse>
  createWarehouse(payload: ICreateWarehousePayload): Promise<TActionWarehouse>
  updateWarehouse(id: TBaseParamsId, payload: IUpdateWarehousePayload): Promise<TActionWarehouse>
  deleteWarehouse(id: number): Promise<TActionWarehouse>
  getWarehouseFindOne(id: TBaseParamsId): Promise<TGetWarehouseByIdResponse>
  getLocationPaginate (query: IGetLocationList): Promise<TGetLocationListResponse>
}

class WarehouseProvider extends HttpRequest implements IWarehouseProvider {
  private urlPrefix: string = '/api/v1/management/warehouse'

  public async getWarehousePaginate (query: IGetWarehouseList): Promise<TGetWarehouseListResponse> {
    this.setLogHeaders({ menu: 'SETTING', subMenu: 'คลังสินค้า' })
    const response = await this.get(`${this.urlPrefix}`, query)
    return response
  }

  public async createWarehouse (payload: ICreateWarehousePayload): Promise<TActionWarehouse> {
    this.setLogHeaders({ menu: 'SETTING', subMenu: 'คลังสินค้า' })
    const response = await this.post(`${this.urlPrefix}`, payload)
    return response
  }

  public async updateWarehouse (id: TBaseParamsId, payload: IUpdateWarehousePayload): Promise<TActionWarehouse> {
    this.setLogHeaders({ menu: 'SETTING', subMenu: 'คลังสินค้า' })
    const response = await this.put(`${this.urlPrefix}/${id}`, payload)
    return response
  }

  public async deleteWarehouse (id: number): Promise<TActionWarehouse> {
    this.setLogHeaders({ menu: 'SETTING', subMenu: 'คลังสินค้า' })
    const response = await this.delete(`${this.urlPrefix}/${id}`)
    return response
  }

  public async getWarehouseFindOne (id: TBaseParamsId): Promise<TGetWarehouseByIdResponse> {
    this.setLogHeaders({ menu: 'SETTING', subMenu: 'คลังสินค้า' })
    const response = await this.get(`${this.urlPrefix}/${id}`)
    return response
  }


  public async getLocationPaginate (query: IGetLocationList): Promise<TGetLocationListResponse> {
    this.setLogHeaders({ menu: 'SETTING', subMenu: 'คลังสินค้า' })
    const response = await this.get(`${this.urlPrefix}/location/pagination`, query)
    return response
  }
}

export default WarehouseProvider
