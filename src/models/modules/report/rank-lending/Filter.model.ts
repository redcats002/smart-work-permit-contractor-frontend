import type { IGetRankLendingList } from '@/models/request/report/rank-lending/RankLendingReq.model'
import type { TRankingLoanType } from '@/enums/modules/report/RankingLoan.enum'

export interface IRankLendingFilter extends IGetRankLendingList {
  type: TRankingLoanType
}
