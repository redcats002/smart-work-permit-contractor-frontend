import type { IGetAnnualFinanceReceiptList } from '@/models/request/report/annual-finance-receipt/AnnualFinanceReceiptReq.model'
import type { TAnnualFinanceReceiptType } from '@/enums/modules/report/annual-finance-receipt/AnnualFinanceReceipt.enum'

export interface IAnnualFinanceReceiptFilter extends IGetAnnualFinanceReceiptList {
  type?: TAnnualFinanceReceiptType
}
