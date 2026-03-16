import type { IUpdateEmployeePayload } from '@/models/request/employee/EmployeeReq.model'
import type { EmployeeFormValues } from '../../create/schema/employee.schema'

export function usePayload (form: EmployeeFormValues): IUpdateEmployeePayload {
  return {
    ...form,
    password: undefined
  }
}
