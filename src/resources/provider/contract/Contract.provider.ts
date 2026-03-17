import type {
  ICreateContractPayload,
  ICreateDocument,
  ICreateExpense,
  ICreateIncome,
  IGetContactHistoryList,
  IGetContractHistoryList,
  IGetContractList,
  IGetDocumentList,
  IGetExpenseList,
  IGetGuarantorContractList,
  IGetIncomeList,
  IGetInstallmentList,
  IGetInstallmentSummary,
  IUpdateContractPayload,
  IUpdateDocument,
  IUpdateExpense,
  IUpdateIncome
} from '@/models/request/contract/ContractReq.model'
import type {
  TActionContract,
  TActionContractDocumentResponse,
  TActionContractExpenseResponse,
  TActionContractIncomeResponse,
  TGetContractByIdResponse,
  TGetContractExpenseByIdResponse,
  TGetContractExpenseListResponse,
  TGetContractHistoryListResponse,
  TGetContractIncomeListResponse,
  TGetContractListResponse,
  TGetDocumentListResponse,
  TGetGuarantorContractListResponse,
  TGetInstallmentListResponse,
  TGetInstallmentSummaryResponse
} from '@/models/response/contract/ContractRes.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import HttpRequest from '@/resources/HttpRequest'

export interface IContractProvider {
  getContractPaginate(query: IGetContractList): Promise<TGetContractListResponse>
  createContract(payload: ICreateContractPayload): Promise<TActionContract>
  updateContract(id: TBaseParamsId, payload: IUpdateContractPayload): Promise<TActionContract>
  deleteContract(id: number): Promise<TActionContract>
  getContractFindOne(id: TBaseParamsId): Promise<TGetContractByIdResponse>
  saveAssetDetail(contractId: TBaseParamsId, assetId: TBaseParamsId, formData: FormData): Promise<TActionContract>
  requestAssessmentPrice(id: TBaseParamsId): Promise<TActionContract>
  getInstallmentList(id: TBaseParamsId, query?: IGetInstallmentList): Promise<TGetInstallmentListResponse>
  getInstallmentSummary(id: TBaseParamsId, query?: IGetInstallmentSummary): Promise<TGetInstallmentSummaryResponse>
  getExpenseList(id: TBaseParamsId, query?: IGetExpenseList): Promise<TGetContractExpenseListResponse>
  getExpenseById (id: TBaseParamsId): Promise<TGetContractExpenseByIdResponse>
  createExpense(id: TBaseParamsId, payload: ICreateExpense): Promise<TActionContractExpenseResponse>
  updateExpense(id: TBaseParamsId, payload: IUpdateExpense): Promise<TActionContractExpenseResponse>
  deleteExpense(id: TBaseParamsId): Promise<TActionContractExpenseResponse>
  getIncomeList(id: TBaseParamsId, query?: IGetIncomeList): Promise<TGetContractIncomeListResponse>
  createIncome(id: TBaseParamsId, payload: ICreateIncome): Promise<TActionContractIncomeResponse>
  updateIncome(id: TBaseParamsId, incomeId: TBaseParamsId, payload: IUpdateIncome): Promise<TActionContractIncomeResponse>
  deleteIncome(id: TBaseParamsId, incomeId: TBaseParamsId): Promise<TActionContractIncomeResponse>
  getGuarantorList(id: TBaseParamsId, query?: IGetGuarantorContractList): Promise<TGetGuarantorContractListResponse>
  getContractHistoryList(id: TBaseParamsId, query?: IGetContactHistoryList): Promise<TGetContractHistoryListResponse>
  getDocumentList(id: TBaseParamsId, query?: IGetDocumentList): Promise<TGetDocumentListResponse>
  createDocument(id: TBaseParamsId, payload: ICreateDocument): Promise<TActionContractDocumentResponse>
  updateDocument(id: TBaseParamsId, documentId: TBaseParamsId, payload: IUpdateDocument): Promise<TActionContractDocumentResponse>
  deleteDocument(id: TBaseParamsId, documentId: TBaseParamsId): Promise<TActionContractDocumentResponse>
}

class ContractProvider extends HttpRequest implements IContractProvider {
  private urlPrefix: string = '/api/v1/contract'

  public async getContractPaginate (query: IGetContractList): Promise<TGetContractListResponse> {
    const response = await this.get(`${this.urlPrefix}`, query)
    return response
  }

  public async createContract (payload: ICreateContractPayload): Promise<TActionContract> {
    const response = await this.post(`${this.urlPrefix}`, payload)
    return response
  }

  public async updateContract (id: TBaseParamsId, payload: IUpdateContractPayload): Promise<TActionContract> {
    const response = await this.put(`${this.urlPrefix}/${id}`, payload)
    return response
  }

  public async deleteContract (id: number): Promise<TActionContract> {
    const response = await this.delete(`${this.urlPrefix}/${id}`)
    return response
  }

  public async getContractFindOne (id: TBaseParamsId): Promise<TGetContractByIdResponse> {
    const response = await this.get(`${this.urlPrefix}/${id}`)
    return response
  }

  public async saveAssetDetail (contractId: TBaseParamsId, assetId: TBaseParamsId, formData: FormData): Promise<TActionContract> {
    const response = await this.put(`${this.urlPrefix}/${contractId}/asset/${assetId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response
  }

  public async requestAssessmentPrice (id: TBaseParamsId): Promise<TActionContract> {
    const response = await this.post(`${this.urlPrefix}/${id}/request-assessment`, {})
    return response
  }

  public async getInstallmentList (id: TBaseParamsId, query?: IGetInstallmentList): Promise<TGetInstallmentListResponse> {
    const response = await this.get(`${this.urlPrefix}/${id}/installment`, query)
    return response
  }

  public async getInstallmentSummary (id: TBaseParamsId, query?: IGetInstallmentSummary): Promise<TGetInstallmentSummaryResponse> {
    const response = await this.get(`${this.urlPrefix}/${id}/installment/summary`, query)
    return response
  }

  public async getExpenseList (id: TBaseParamsId, query?: IGetExpenseList): Promise<TGetContractExpenseListResponse> {
    const response = await this.get(`${this.urlPrefix}-expense/paginate/${id}`, query)
    return response
  }

  public async getExpenseById (id: TBaseParamsId): Promise<TGetContractExpenseByIdResponse> {
    const response = await this.get(`${this.urlPrefix}-expense/${id}`)
    return response
  }

  public async createExpense (id: TBaseParamsId, payload: ICreateExpense): Promise<TActionContractExpenseResponse> {
    const response = await this.post(`${this.urlPrefix}-expense/${id}`, payload)
    return response
  }

  public async updateExpense (id: TBaseParamsId, payload: IUpdateExpense): Promise<TActionContractExpenseResponse> {
    const response = await this.put(`${this.urlPrefix}-expense/${id}`, payload)
    return response
  }

  public async deleteExpense (id: TBaseParamsId): Promise<TActionContractExpenseResponse> {
    const response = await this.delete(`${this.urlPrefix}-expense/${id}`)
    return response
  }

  public async getIncomeList (id: TBaseParamsId, query?: IGetIncomeList): Promise<TGetContractIncomeListResponse> {
    const response = await this.get(`${this.urlPrefix}/${id}/income`, query)
    return response
  }

  public async createIncome (id: TBaseParamsId, payload: ICreateIncome): Promise<TActionContractIncomeResponse> {
    const response = await this.post(`${this.urlPrefix}/${id}/income`, payload)
    return response
  }

  public async updateIncome (id: TBaseParamsId, incomeId: TBaseParamsId, payload: IUpdateIncome): Promise<TActionContractIncomeResponse> {
    const response = await this.put(`${this.urlPrefix}/${id}/income/${incomeId}`, payload)
    return response
  }

  public async deleteIncome (id: TBaseParamsId, incomeId: TBaseParamsId): Promise<TActionContractIncomeResponse> {
    const response = await this.delete(`${this.urlPrefix}/${id}/income/${incomeId}`)
    return response
  }

  public async getGuarantorList (id: TBaseParamsId, query?: IGetGuarantorContractList): Promise<TGetGuarantorContractListResponse> {
    const response = await this.get(`${this.urlPrefix}/${id}/guarantor`, query)
    return response
  }

  public async getContractHistoryList (id: TBaseParamsId, query?: IGetContractHistoryList): Promise<TGetContractHistoryListResponse> {
    const response = await this.get(`${this.urlPrefix}/${id}/history`, query)
    return response
  }

  public async getDocumentList (id: TBaseParamsId, query?: IGetDocumentList): Promise<TGetDocumentListResponse> {
    const response = await this.get(`${this.urlPrefix}/${id}/document`, query)
    return response
  }

  public async createDocument (id: TBaseParamsId, payload: ICreateDocument): Promise<TActionContractDocumentResponse> {
    const response = await this.post(`${this.urlPrefix}/${id}/document`, payload)
    return response
  }

  public async updateDocument (id: TBaseParamsId, documentId: TBaseParamsId, payload: IUpdateDocument): Promise<TActionContractDocumentResponse> {
    const response = await this.put(`${this.urlPrefix}/${id}/document/${documentId}`, payload)
    return response
  }

  public async deleteDocument (id: TBaseParamsId, documentId: TBaseParamsId): Promise<TActionContractDocumentResponse> {
    const response = await this.delete(`${this.urlPrefix}/${id}/document/${documentId}`)
    return response
  }
}
export default ContractProvider
