import type { IGetCompleteWorkAssetAppraisalList, IGetDebtCollectionList, IGetNewWorkAssetAppraisalList } from '@/models/request/work/WorkReq.model'
import type {
  TDeferDebtCollectionResponse,
  TGetCompleteWorkAppraisalListResponse,
  TGetDebtCollectionListResponse,
  TGetNewWorkAppraisalListResponse
} from '@/models/response/work/WorkRes.model'
import HttpRequest from '@/resources/HttpRequest'

export interface IWorkProvider {
  getWorkAppraisalNewPaginate (query: IGetNewWorkAssetAppraisalList): Promise<TGetNewWorkAppraisalListResponse>
  getWorkAppraisalCompletePaginate (query: IGetCompleteWorkAssetAppraisalList): Promise<TGetCompleteWorkAppraisalListResponse>
  getDebtCollectionList (query?: IGetDebtCollectionList): Promise<TGetDebtCollectionListResponse>
  deferDebtCollection (debtCollectionId: number): Promise<TDeferDebtCollectionResponse>
}

class WorkProvider extends HttpRequest implements IWorkProvider {
  private urlPrefix: string = '/api/v1/management/work'

  public async getWorkAppraisalNewPaginate (query: IGetNewWorkAssetAppraisalList): Promise<TGetNewWorkAppraisalListResponse> {
    this.setLogHeaders({ menu: 'WORK', subMenu: 'ประเมินหลักทรัพย์ > งานใหม่' })
    const response = await this.get(`${this.urlPrefix}/assets-appraisal/new`, query)
    return response
  }

  public async getWorkAppraisalCompletePaginate (query: IGetCompleteWorkAssetAppraisalList): Promise<TGetCompleteWorkAppraisalListResponse> {
    this.setLogHeaders({ menu: 'WORK', subMenu: 'ประเมินหลักทรัพย์ > งานที่เสร็จแล้ว' })
    const response = await this.get(`${this.urlPrefix}/assets-appraisal/complete`, query)
    return response
  }

  public async getDebtCollectionList (query?: IGetDebtCollectionList): Promise<TGetDebtCollectionListResponse> {
    this.setLogHeaders({ menu: 'WORK', subMenu: 'ติดตามทวงถาม' })
    const response = await this.get(`${this.urlPrefix}/debt-collection`, query)
    return response
  }

  public async deferDebtCollection (debtCollectionId: number): Promise<TDeferDebtCollectionResponse> {
    this.setLogHeaders({ menu: 'WORK', subMenu: 'ติดตามทวงถาม' })
    const response = await this.patch(`${this.urlPrefix}/debt-collection/defer/${debtCollectionId}`)
    return response
  }
}

export default WorkProvider
