import type { TRankingLoanType } from '@/enums/modules/report/RankingLoan.enum'
import type { IGetRankLoanList } from '@/models/request/report/rank-loan/RankLoanReq.model'

export interface IRankLoanFilter extends IGetRankLoanList {
  type?: TRankingLoanType
}
