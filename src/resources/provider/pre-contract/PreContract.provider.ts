import type {
  IAppraisalPricePayload,
  IConfirmAppraisalPayload,
  IConfirmMortgagePayload,
  ICreatePreContractPayload,
  IGetPreContractList,
  IMakeAContractPayload,
  IRequestAppraisalPayload,
  IRequestReappraisalPayload,
  IUpdatePreAssetPayload,
  IUpdatePreContractPayload
} from '@/models/request/pre-contract/PreContractReq.model'
import type {
  TActionPreContract,
  TAppraisalPricePreContract,
  TConfirmAppraisalPreContract,
  TConfirmMortgagePreContract,
  TGetPreContractByIdResponse,
  TGetPreContractListResponse,
  TMakeAContractPreContract,
  TRequestAppraisalPreContract,
  TRequestReappraisalPreContract,
  TUpdatePreAssetPreContract
} from '@/models/response/pre-contract/PreContractRes.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import HttpRequest from '@/resources/HttpRequest'

export interface IPreContractProvider {
  getContractPaginate (query: IGetPreContractList): Promise<TGetPreContractListResponse>
  createContract (payload: ICreatePreContractPayload): Promise<TActionPreContract>
  updateContract (id: TBaseParamsId, payload: IUpdatePreContractPayload): Promise<TActionPreContract>
  getContractFindOne (id: TBaseParamsId): Promise<TGetPreContractByIdResponse>
  requestAppraisal (id: TBaseParamsId, payload: IRequestAppraisalPayload): Promise<TRequestAppraisalPreContract>
  requestReappraisal (id: TBaseParamsId, payload: IRequestReappraisalPayload): Promise<TRequestReappraisalPreContract>
  appraisalPrice (id: TBaseParamsId, payload: IAppraisalPricePayload): Promise<TAppraisalPricePreContract>
  confirmAppraisal (id: TBaseParamsId, payload: IConfirmAppraisalPayload): Promise<TConfirmAppraisalPreContract>
  confirmMortgage (id: TBaseParamsId, payload: IConfirmMortgagePayload): Promise<TConfirmMortgagePreContract>
  makeAContract (id: TBaseParamsId, payload: IMakeAContractPayload): Promise<TMakeAContractPreContract>
  updatePreAsset (id: TBaseParamsId, payload: IUpdatePreAssetPayload): Promise<TUpdatePreAssetPreContract>
}

class PreContractProvider extends HttpRequest implements IPreContractProvider {
  private urlPrefix: string = '/api/v1/management/pre-contract'

  public async getContractPaginate (query: IGetPreContractList): Promise<TGetPreContractListResponse> {
    this.setLogHeaders({ menu: 'CONTRACT', subMenu: 'ประเมินหลักทรัพย์' })
    const response = await this.get(`${this.urlPrefix}`, query)
    return response
  }

  public async createContract (payload: ICreatePreContractPayload): Promise<TActionPreContract> {
    this.setLogHeaders({ menu: 'CONTRACT', subMenu: 'ประเมินหลักทรัพย์' })
    const response = await this.post(`${this.urlPrefix}`, payload)
    return response
  }

  public async updateContract (id: TBaseParamsId, payload: IUpdatePreContractPayload): Promise<TActionPreContract> {
    this.setLogHeaders({ menu: 'CONTRACT', subMenu: 'ประเมินหลักทรัพย์' })
    const response = await this.put(`${this.urlPrefix}/${id}`, payload)
    return response
  }

  public async getContractFindOne (id: TBaseParamsId): Promise<TGetPreContractByIdResponse> {
    this.setLogHeaders({ menu: 'CONTRACT', subMenu: 'ประเมินหลักทรัพย์' })
    const response = await this.get(`${this.urlPrefix}/${id}`)
    return response
  }

  public async requestAppraisal (id: TBaseParamsId, payload: IRequestAppraisalPayload): Promise<TRequestAppraisalPreContract> {
    this.setLogHeaders({ menu: 'CONTRACT', subMenu: 'ประเมินหลักทรัพย์ > ขอราคาประเมิน' })
    const response = await this.patch(`${this.urlPrefix}/request-appraisal/${id}`, payload)
    return response
  }

  public async requestReappraisal (id: TBaseParamsId, payload: IRequestReappraisalPayload): Promise<TRequestReappraisalPreContract> {
    this.setLogHeaders({ menu: 'CONTRACT', subMenu: 'ประเมินหลักทรัพย์ > ขอราคาประเมินใหม่' })
    const response = await this.patch(`${this.urlPrefix}/request-reappraisal/${id}`, payload)
    return response
  }

  public async confirmAppraisal (id: TBaseParamsId, payload: IConfirmAppraisalPayload): Promise<TConfirmAppraisalPreContract> {
    this.setLogHeaders({ menu: 'CONTRACT', subMenu: 'ประเมินหลักทรัพย์ > ยืนยันราคาประเมิน' })
    const response = await this.patch(`${this.urlPrefix}/confirm-appraisal/${id}`, payload)
    return response
  }

  public async appraisalPrice (id: TBaseParamsId, payload: IAppraisalPricePayload): Promise<TAppraisalPricePreContract> {
    this.setLogHeaders({ menu: 'CONTRACT', subMenu: 'ประเมินหลักทรัพย์ > ประเมินราคาหลักทรัพย์' })
    const response = await this.patch(`${this.urlPrefix}/appraisal-price/${id}`, payload)
    return response
  }

  public async confirmMortgage (id: TBaseParamsId, payload: IConfirmMortgagePayload): Promise<TConfirmMortgagePreContract> {
    this.setLogHeaders({ menu: 'CONTRACT', subMenu: 'ประเมินหลักทรัพย์ > ยื่นจำนอง' })
    const response = await this.put(`${this.urlPrefix}/confirm-mortgage/${id}`, payload)
    return response
  }

  public async makeAContract (id: TBaseParamsId, payload: IMakeAContractPayload): Promise<TMakeAContractPreContract> {
    this.setLogHeaders({ menu: 'CONTRACT', subMenu: 'ประเมินหลักทรัพย์ > ทำสัญญา' })
    const response = await this.post(`${this.urlPrefix}/make-contract/${id}`, payload)
    return response
  }

  public async updatePreAsset (id: TBaseParamsId, payload: IUpdatePreAssetPayload): Promise<TUpdatePreAssetPreContract> {
    this.setLogHeaders({ menu: 'CONTRACT', subMenu: 'ประเมินหลักทรัพย์ > แก้ไขรายละเอียดสินทรัพย์' })
    const response = await this.patch(`${this.urlPrefix}/pre-asset/${id}`, payload)
    return response
  }
}
export default PreContractProvider
