import type {
  IGetContractList,
  IGetGuarantorContractList,
  IGetInstallmentList,
  IGetInstallmentSummary,
  IUpdateContractPayload,
  IUpdateInstallmentFeePayload
} from '@/models/request/contract/ContractReq.model'
import type {
  TActionContract,
  TActionContractInstallmentFeeResponse,
  TGetAssetContractListResponse,
  TGetContractByIdResponse,
  TGetContractListResponse,
  TGetGuarantorContractListResponse,
  TGetInstallmentListResponse,
  TGetInstallmentSummaryResponse
} from '@/models/response/contract/ContractRes.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import HttpRequest from '@/resources/HttpRequest'

export interface IContractProvider {
  getContractPaginate(query: IGetContractList): Promise<TGetContractListResponse>
  updateContract(id: TBaseParamsId, payload: IUpdateContractPayload): Promise<TActionContract>
  cancelledContract(id: number): Promise<TActionContract>
  getContractFindOne(id: TBaseParamsId): Promise<TGetContractByIdResponse>
  requestAssessmentPrice(id: TBaseParamsId): Promise<TActionContract>
  getInstallmentList(id: TBaseParamsId, query?: IGetInstallmentList): Promise<TGetInstallmentListResponse>
  getInstallmentSummary(id: TBaseParamsId, query?: IGetInstallmentSummary): Promise<TGetInstallmentSummaryResponse>
  getGuarantorList(id: TBaseParamsId, query?: IGetGuarantorContractList): Promise<TGetGuarantorContractListResponse>
  updateLegalFee(contractInstallmentId: TBaseParamsId, payload: IUpdateInstallmentFeePayload): Promise<TActionContractInstallmentFeeResponse>
  updateCollectionFee(contractInstallmentId: TBaseParamsId, payload: IUpdateInstallmentFeePayload): Promise<TActionContractInstallmentFeeResponse>
  getContractAssets(id: TBaseParamsId): Promise<TGetAssetContractListResponse>
  saveAssetDetail(contractId: TBaseParamsId, assetId: TBaseParamsId, formData: FormData): Promise<TActionContract>
  testDueDate (id: TBaseParamsId): Promise<TActionContract>
}

class ContractProvider extends HttpRequest implements IContractProvider {
  private urlPrefix: string = '/api/v1/management/contract'

  public async getContractPaginate (query: IGetContractList): Promise<TGetContractListResponse> {
    this.setLogHeaders({ menu: 'CONTRACT', subMenu: 'สัญญา' })
    const response = await this.get(`${this.urlPrefix}`, query)
    return response
  }

  public async updateContract (id: TBaseParamsId, payload: IUpdateContractPayload): Promise<TActionContract> {
    this.setLogHeaders({ menu: 'CONTRACT', subMenu: 'สัญญา' })
    const response = await this.patch(`${this.urlPrefix}/${id}`, payload)
    return response
  }

  public async cancelledContract (id: number): Promise<TActionContract> {
    this.setLogHeaders({ menu: 'CONTRACT', subMenu: 'สัญญา > ยกเลิก' })
    const response = await this.patch(`${this.urlPrefix}/cancelled/${id}`)
    return response
  }

  public async getContractFindOne (id: TBaseParamsId): Promise<TGetContractByIdResponse> {
    this.setLogHeaders({ menu: 'CONTRACT', subMenu: 'สัญญา' })
    const response = await this.get(`${this.urlPrefix}/${id}`)
    return response
  }

  public async requestAssessmentPrice (id: TBaseParamsId): Promise<TActionContract> {
    this.setLogHeaders({ menu: 'CONTRACT', subMenu: 'สัญญา' })
    const response = await this.post(`${this.urlPrefix}/${id}/request-assessment`, {})
    return response
  }

  public async getInstallmentList (id: TBaseParamsId, query?: IGetInstallmentList): Promise<TGetInstallmentListResponse> {
    this.setLogHeaders({ menu: 'CONTRACT', subMenu: 'สัญญา > ตารางการชำระ' })
    const response = await this.get(`${this.urlPrefix}/${id}/installments`, query)
    return response
  }

  public async getInstallmentSummary (id: TBaseParamsId, query?: IGetInstallmentSummary): Promise<TGetInstallmentSummaryResponse> {
    this.setLogHeaders({ menu: 'CONTRACT', subMenu: 'สัญญา > ตารางการชำระ' })
    const response = await this.get(`${this.urlPrefix}/${id}/installment/summary`, query)
    return response
  }

  public async getGuarantorList (id: TBaseParamsId, query?: IGetGuarantorContractList): Promise<TGetGuarantorContractListResponse> {
    this.setLogHeaders({ menu: 'CONTRACT', subMenu: 'สัญญา' })
    const response = await this.get(`${this.urlPrefix}/${id}/guarantor`, query)
    return response
  }

  public async updateLegalFee (
    contractInstallmentId: TBaseParamsId,
    payload: IUpdateInstallmentFeePayload
  ): Promise<TActionContractInstallmentFeeResponse> {
    this.setLogHeaders({ menu: 'CONTRACT', subMenu: 'สัญญา > เพิ่มค่าทนาย' })
    const response = await this.patch(`${this.urlPrefix}/legal-fee/${contractInstallmentId}`, payload)
    return response
  }

  public async updateCollectionFee (
    contractInstallmentId: TBaseParamsId,
    payload: IUpdateInstallmentFeePayload
  ): Promise<TActionContractInstallmentFeeResponse> {
    this.setLogHeaders({ menu: 'CONTRACT', subMenu: 'สัญญา > แก้ไขค่าติดตาม' })
    const response = await this.patch(`${this.urlPrefix}/collection-fee/${contractInstallmentId}`, payload)
    return response
  }

  public async getContractAssets (id: TBaseParamsId): Promise<TGetAssetContractListResponse> {
    this.setLogHeaders({ menu: 'CONTRACT', subMenu: 'สัญญา > หลักทรัพย์' })
    const response = await this.get(`${this.urlPrefix}/${id}/assets`)
    return response
  }

  public async saveAssetDetail (contractId: TBaseParamsId, assetId: TBaseParamsId, formData: FormData): Promise<TActionContract> {
    this.setLogHeaders({ menu: 'CONTRACT', subMenu: 'สัญญา > หลักทรัพย์' })
    const response = await this.put(`${this.urlPrefix}/${contractId}/asset/${assetId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response
  }

  public async testDueDate (id: TBaseParamsId): Promise<TActionContract> {
    this.setLogHeaders({ menu: 'CONTRACT', subMenu: 'สัญญา' })
    const response = await this.put(`${this.urlPrefix}/test-due-date/${id}`, {})
    return response
  }
}

export default ContractProvider

export * from '../contract-expense/ContractExpense.provider'
export * from '../contract-income/ContractIncome.provider'
export * from '../contract-history/ContractHistory.provider'
export * from '../contract-document/ContractDocument.provider'
