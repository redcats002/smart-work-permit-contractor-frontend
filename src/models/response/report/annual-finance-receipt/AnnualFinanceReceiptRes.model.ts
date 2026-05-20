import type { IBasePaginationResponse } from '../../Response.model'

export interface IMonthData {
  principalAndInterest: number
  percent: number
}

export interface IAnnualFinanceReceiptList {
  id: string
  branchName: string
  month1: IMonthData
  month2: IMonthData
  month3: IMonthData
  month4: IMonthData
  month5: IMonthData
  month6: IMonthData
  month7: IMonthData
  month8: IMonthData
  month9: IMonthData
  month10: IMonthData
  month11: IMonthData
  month12: IMonthData
  sumMonth: IMonthData
}

export interface IAnnualFinanceReceiptSummary {
  month1: IMonthData
  month2: IMonthData
  month3: IMonthData
  month4: IMonthData
  month5: IMonthData
  month6: IMonthData
  month7: IMonthData
  month8: IMonthData
  month9: IMonthData
  month10: IMonthData
  month11: IMonthData
  month12: IMonthData
  sumMonth: IMonthData
}

export interface TGetAnnualFinanceReceiptListResponse extends IBasePaginationResponse<IAnnualFinanceReceiptList> {
  summary: IAnnualFinanceReceiptSummary
}
