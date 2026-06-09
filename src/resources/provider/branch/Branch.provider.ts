import type { ICreateBranchPayload, IGetBranchList, IUpdateBranchPayload } from '@/models/request/branch/BranchReq.model'
import type { TActionBranch, TGetBranchByIdResponse, TGetBranchListResponse } from '@/models/response/branch/BranchRes.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import HttpRequest from '@/resources/HttpRequest'

export interface IBranchProvider {
  getBranchPaginate(query: IGetBranchList): Promise<TGetBranchListResponse>
  createBranch(payload: ICreateBranchPayload): Promise<TActionBranch>
  updateBranch(id: TBaseParamsId, payload: IUpdateBranchPayload): Promise<TActionBranch>
  deleteBranch(id: TBaseParamsId): Promise<TActionBranch>
  getBranchFindOne(id: TBaseParamsId): Promise<TGetBranchByIdResponse>
}

class BranchProvider extends HttpRequest implements IBranchProvider {
  private urlPrefix: string = '/api/v1/management/branch'

  public async getBranchPaginate (query: IGetBranchList): Promise<TGetBranchListResponse> {
    this.setLogHeaders({ menu: 'SETTING', subMenu: 'สาขา' })
    const response = await this.get(`${this.urlPrefix}`, query)
    return response
  }

  public async createBranch (payload: ICreateBranchPayload): Promise<TActionBranch> {
    this.setLogHeaders({ menu: 'SETTING', subMenu: 'สาขา' })
    const response = await this.post(`${this.urlPrefix}`, payload)
    return response
  }

  public async updateBranch (id: TBaseParamsId, payload: IUpdateBranchPayload): Promise<TActionBranch> {
    this.setLogHeaders({ menu: 'SETTING', subMenu: 'สาขา' })
    const response = await this.put(`${this.urlPrefix}/${id}`, payload)
    return response
  }

  public async deleteBranch (id: TBaseParamsId): Promise<TActionBranch> {
    this.setLogHeaders({ menu: 'SETTING', subMenu: 'สาขา' })
    const response = await this.delete(`${this.urlPrefix}/${id}`)
    return response
  }

  public async getBranchFindOne (id: TBaseParamsId): Promise<TGetBranchByIdResponse> {
    this.setLogHeaders({ menu: 'SETTING', subMenu: 'สาขา' })
    const response = await this.get(`${this.urlPrefix}/${id}`)
    return response
  }
}

export default BranchProvider
