import type { ICreateEmployeePayload } from '@/models/request/employee/EmployeeReq.model'
import type { EmployeeFormValues } from '../schema/employee.schema'

export function usePayload (form: EmployeeFormValues): ICreateEmployeePayload {
  return {
    ...form
  }
}
