import type { IEmployeeList } from '@/models/response/employee/EmployeeRes.model'
import type { TEvaluatorLevel } from '@/enums/modules/contract/EvaluatorLevel.enum'

export interface IEvaluateGroupList {
  id: number
  evaluatorLevel: TEvaluatorLevel
  detail: string
  evaluators: IEvaluatorList[]
}

export interface IEvaluatorList {
  id: number
  loanAmount: number
  evaluator: IEmployeeList
}
