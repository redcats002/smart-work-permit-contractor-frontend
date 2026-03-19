import type { IGetRankLoanList } from '@/models/request/report/rank-loan/RankLoanReq.model'
import type { TRankingLoanType } from '@/enums/modules/report/RankingLoan.enum'

export interface IRankLoanFilter extends IGetRankLoanList {
  type: TRankingLoanType
}
